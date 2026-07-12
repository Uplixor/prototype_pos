import { PosPage } from "~/features/pos/components/pos-page";

export function meta() {
  return [{ title: "POS · Commerce OS" }];
}

export default function PosRoute() {
  return <PosPage />;
}
