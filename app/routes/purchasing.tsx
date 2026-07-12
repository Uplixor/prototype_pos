import { PurchasingPage } from "~/features/purchasing/components/purchasing-page";

export function meta() {
  return [{ title: "Purchases · Commerce OS" }];
}

export default function PurchasingRoute() {
  return <PurchasingPage />;
}
