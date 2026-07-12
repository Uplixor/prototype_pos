import { ReceiptsPage } from "~/features/purchasing/components/purchasing-page";

export function meta() {
  return [{ title: "Goods Receipts · Commerce OS" }];
}

export default function ReceiptsRoute() {
  return <ReceiptsPage />;
}
