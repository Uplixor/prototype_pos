import { TransfersPage } from "~/features/transfers/components/transfers-page";

export function meta() {
  return [{ title: "Transfers · Commerce OS" }];
}

export default function TransfersRoute() {
  return <TransfersPage />;
}
