/**
 * Capability identifiers for the Commerce Operating Platform.
 * Core UI never changes — capabilities extend navigation and modules.
 */

export const CAPABILITIES = [
  "core",
  "retail",
  "restaurant",
  "cafe",
  "bakery",
  "pharmacy",
  "manufacturing",
  "delivery",
  "reservations",
  "kitchen",
  "qr_ordering",
  "plugins",
] as const;

export type CapabilityId = (typeof CAPABILITIES)[number];

export type CapabilityDefinition = {
  id: CapabilityId;
  label: string;
  description: string;
};

export const CAPABILITY_CATALOG: Record<CapabilityId, CapabilityDefinition> = {
  core: {
    id: "core",
    label: "Core Platform",
    description: "Organization, branches, users, and shared operations",
  },
  retail: {
    id: "retail",
    label: "Retail",
    description: "Retail catalog, POS, and merchandising",
  },
  restaurant: {
    id: "restaurant",
    label: "Restaurant",
    description: "Table service, menus, and kitchen workflows",
  },
  cafe: {
    id: "cafe",
    label: "Cafe",
    description: "Quick-service cafe operations",
  },
  bakery: {
    id: "bakery",
    label: "Bakery",
    description: "Production batches and perishable inventory",
  },
  pharmacy: {
    id: "pharmacy",
    label: "Pharmacy",
    description: "Controlled substances and prescription workflows",
  },
  manufacturing: {
    id: "manufacturing",
    label: "Manufacturing",
    description: "Bill of materials and production runs",
  },
  delivery: {
    id: "delivery",
    label: "Delivery",
    description: "Dispatch and last-mile fulfillment",
  },
  reservations: {
    id: "reservations",
    label: "Reservations",
    description: "Booking and table management",
  },
  kitchen: {
    id: "kitchen",
    label: "Kitchen",
    description: "Kitchen display and prep stations",
  },
  qr_ordering: {
    id: "qr_ordering",
    label: "QR Ordering",
    description: "Guest self-ordering via QR",
  },
  plugins: {
    id: "plugins",
    label: "Plugins",
    description: "Third-party extensions",
  },
};
