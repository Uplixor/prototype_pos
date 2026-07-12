export const catalogKeys = {
  all: ["catalog"] as const,
  products: () => [...catalogKeys.all, "products"] as const,
  product: (id: string) => [...catalogKeys.products(), id] as const,
  categories: () => [...catalogKeys.all, "categories"] as const,
};
