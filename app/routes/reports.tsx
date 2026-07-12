import { Navigate } from "react-router";
export function meta() {
  return [{ title: "Reports · Commerce OS" }];
}
export default function ReportsRoute() {
  return <Navigate to="/reports/sales" replace />;
}
