export const inventoryKeys = {
  all: ["inventory"] as const,
  balances: () => [...inventoryKeys.all, "balances"] as const,
  balance: (id: string) => [...inventoryKeys.balances(), id] as const,
  movements: (filters?: { productId?: string; branchId?: string }) =>
    [...inventoryKeys.all, "movements", filters ?? {}] as const,
  adjustable: (branchId: string) =>
    [...inventoryKeys.all, "adjustable", branchId] as const,
};
