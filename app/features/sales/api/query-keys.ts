export const salesKeys = {
  all: ["sales"] as const,
  list: () => [...salesKeys.all, "list"] as const,
  detail: (id: string) => [...salesKeys.all, "detail", id] as const,
  sellable: (branchId: string) =>
    [...salesKeys.all, "sellable", branchId] as const,
};
