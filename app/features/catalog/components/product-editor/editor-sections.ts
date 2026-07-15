import type { FieldErrors, FieldPath } from "react-hook-form";
import type { ProductFormValues } from "~/features/catalog/schema";

export type EditorSectionId =
  | "general"
  | "media"
  | "pricing"
  | "inventory"
  | "variants"
  | "modifiers"
  | "availability";

export const EDITOR_SECTIONS: Array<{
  id: EditorSectionId;
  label: string;
}> = [
  { id: "general", label: "General" },
  { id: "media", label: "Media" },
  { id: "pricing", label: "Pricing" },
  { id: "inventory", label: "Inventory" },
  { id: "variants", label: "Variants" },
  { id: "modifiers", label: "Modifiers" },
  { id: "availability", label: "Availability" },
];

const SECTION_FIELD_PREFIXES: Record<EditorSectionId, string[]> = {
  general: ["name", "sku", "barcode", "brand", "description", "productType"],
  media: ["imageUrl", "mediaUrls"],
  pricing: ["price", "compareAtPrice", "cost", "taxProfile"],
  inventory: ["baseUnit", "trackInventory"],
  variants: ["optionAxes", "variants"],
  modifiers: ["modifiers"],
  availability: ["branchIds"],
};

export type ValidationIssue = {
  sectionId: EditorSectionId;
  sectionLabel: string;
  path: string;
  message: string;
};

function flattenErrors(
  errors: FieldErrors<ProductFormValues>,
  prefix = "",
): Array<{ path: string; message: string }> {
  const result: Array<{ path: string; message: string }> = [];

  for (const [key, value] of Object.entries(errors)) {
    if (!value) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (
      typeof value === "object" &&
      "message" in value &&
      typeof value.message === "string" &&
      value.message
    ) {
      result.push({ path, message: value.message });
    }
    if (typeof value === "object" && value !== null) {
      const keys = Object.keys(value).filter(
        (k) => !["message", "type", "ref", "types"].includes(k),
      );
      if (keys.length > 0) {
        const child: Record<string, unknown> = {};
        for (const k of keys) {
          child[k] = (value as Record<string, unknown>)[k];
        }
        result.push(
          ...flattenErrors(child as FieldErrors<ProductFormValues>, path),
        );
      }
    }
  }

  return result;
}

function sectionForPath(path: string): EditorSectionId {
  const root = path.split(".")[0] ?? path;
  for (const [sectionId, prefixes] of Object.entries(SECTION_FIELD_PREFIXES)) {
    if (prefixes.includes(root)) {
      return sectionId as EditorSectionId;
    }
  }
  return "general";
}

export function collectValidationIssues(
  errors: FieldErrors<ProductFormValues>,
): ValidationIssue[] {
  return flattenErrors(errors).map(({ path, message }) => {
    const sectionId = sectionForPath(path);
    const sectionLabel =
      EDITOR_SECTIONS.find((s) => s.id === sectionId)?.label ?? "General";
    return { sectionId, sectionLabel, path, message };
  });
}

export function firstFieldForSection(
  sectionId: EditorSectionId,
): FieldPath<ProductFormValues> {
  const prefixes = SECTION_FIELD_PREFIXES[sectionId];
  return (prefixes[0] ?? "name") as FieldPath<ProductFormValues>;
}

export function scrollToSection(sectionId: EditorSectionId) {
  const el = document.getElementById(`product-section-${sectionId}`);
  // Prefer nearest so jumping near the page end doesn't invent empty scroll space
  el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
}
