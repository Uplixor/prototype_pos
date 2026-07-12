import { InventoryPage } from "~/features/inventory/components/inventory-page";

export function meta() {
  return [
    { title: "Inventory · Commerce OS" },
    {
      name: "description",
      content: "Append-only stock balances and movements",
    },
  ];
}

export default function InventoryRoute() {
  return <InventoryPage />;
}
