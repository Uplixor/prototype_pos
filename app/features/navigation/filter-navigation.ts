import type { CapabilityId, NavItem, NavSection } from "~/shared/types";

function hasCapabilities(
  required: CapabilityId[] | undefined,
  enabled: CapabilityId[],
): boolean {
  if (!required || required.length === 0) {
    return true;
  }
  return required.some((cap) => enabled.includes(cap));
}

function hasPermissions(
  required: string[] | undefined,
  granted: readonly string[],
): boolean {
  if (!required || required.length === 0) {
    return true;
  }
  return required.every((permission) => granted.includes(permission));
}

function filterNavItem(
  item: NavItem,
  enabledCapabilities: CapabilityId[],
  permissions: readonly string[],
): NavItem | null {
  if (
    !hasCapabilities(item.capabilities, enabledCapabilities) ||
    !hasPermissions(item.permissions, permissions)
  ) {
    return null;
  }

  if (!item.children?.length) {
    return item;
  }

  const children = item.children
    .map((child) => filterNavItem(child, enabledCapabilities, permissions))
    .filter((child): child is NavItem => child !== null);

  return { ...item, children };
}

/**
 * Filter navigation by enabled capabilities and granted permissions.
 * Core UI shell stays constant — only capability extensions change.
 */
export function filterNavigation(
  sections: NavSection[],
  enabledCapabilities: CapabilityId[],
  permissions: readonly string[],
): NavSection[] {
  return sections
    .map((section) => {
      if (!hasCapabilities(section.capabilities, enabledCapabilities)) {
        return null;
      }

      const items = section.items
        .map((item) => filterNavItem(item, enabledCapabilities, permissions))
        .filter((item): item is NavItem => item !== null);

      if (items.length === 0) {
        return null;
      }

      return { ...section, items };
    })
    .filter((section): section is NavSection => section !== null);
}

/** Filter a flat nav item list (sidebar primary / module tabs). */
export function filterNavItems(
  items: NavItem[],
  enabledCapabilities: CapabilityId[],
  permissions: readonly string[],
): NavItem[] {
  return items
    .map((item) => filterNavItem(item, enabledCapabilities, permissions))
    .filter((item): item is NavItem => item !== null);
}
