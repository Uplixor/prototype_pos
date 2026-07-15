import type { Category } from "~/features/catalog/types";

export type CategoryOption = {
  id: string;
  name: string;
  label: string;
  depth: number;
  parentId: string | null;
  status: Category["status"];
  sortOrder: number;
};

export type CategoryTreeNode = Category & {
  children: CategoryTreeNode[];
};

function sortCategories(a: Category, b: Category): number {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return a.name.localeCompare(b.name);
}

/** Build nested tree from flat categories (roots first). */
export function buildCategoryTree(categories: Category[]): CategoryTreeNode[] {
  const byParent = new Map<string | null, Category[]>();
  for (const category of categories) {
    const key = category.parentId;
    const list = byParent.get(key) ?? [];
    list.push(category);
    byParent.set(key, list);
  }

  function childrenOf(parentId: string | null): CategoryTreeNode[] {
    const list = (byParent.get(parentId) ?? []).slice().sort(sortCategories);
    return list.map((category) => ({
      ...category,
      children: childrenOf(category.id),
    }));
  }

  return childrenOf(null);
}

/** Flat options with indented labels for selects. */
export function flattenCategoryOptions(
  categories: Category[],
  options?: { includeArchived?: boolean },
): CategoryOption[] {
  const includeArchived = options?.includeArchived ?? false;
  const tree = buildCategoryTree(categories);
  const result: CategoryOption[] = [];

  function walk(nodes: CategoryTreeNode[], depth: number) {
    for (const node of nodes) {
      if (!includeArchived && node.status === "archived") continue;
      const indent = depth > 0 ? `${"— ".repeat(depth)}` : "";
      result.push({
        id: node.id,
        name: node.name,
        label: `${indent}${node.name}`,
        depth,
        parentId: node.parentId,
        status: node.status,
        sortOrder: node.sortOrder,
      });
      walk(node.children, depth + 1);
    }
  }

  walk(tree, 0);
  return result;
}

/** Breadcrumb path e.g. "Electronics > Wearables". */
export function categoryPath(
  categories: Category[],
  categoryId: string,
): string {
  const byId = new Map(categories.map((c) => [c.id, c]));
  const parts: string[] = [];
  let current = byId.get(categoryId);
  const seen = new Set<string>();

  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    parts.unshift(current.name);
    current = current.parentId ? byId.get(current.parentId) : undefined;
  }

  return parts.join(" > ") || "Uncategorized";
}

/** Direct leaf name or shortest path segment for compact filters. */
export function categoryLeafName(
  categories: Category[],
  categoryId: string,
): string {
  return categories.find((c) => c.id === categoryId)?.name ?? "Uncategorized";
}

/** Self + all descendant ids — for catalog filters that include children. */
export function categorySubtreeIds(
  categories: Category[],
  rootId: string,
): Set<string> {
  const ids = new Set<string>([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      if (
        category.parentId &&
        ids.has(category.parentId) &&
        !ids.has(category.id)
      ) {
        ids.add(category.id);
        changed = true;
      }
    }
  }
  return ids;
}
