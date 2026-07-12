import { SalesPage } from "~/features/sales/components/sales-page";

export function meta() {
  return [
    { title: "Sales · Commerce OS" },
    {
      name: "description",
      content: "Manage sales, payments, and commercial snapshots",
    },
  ];
}

export default function SalesRoute() {
  return <SalesPage />;
}
