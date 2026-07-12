import { AppProviders } from "~/shared/providers/app-providers";
import { AppShell } from "~/shared/layouts/app-shell";

/**
 * Authenticated application layout — one shell for all capability screens.
 */
export default function AppLayout() {
  return (
    <AppProviders>
      <AppShell />
    </AppProviders>
  );
}
