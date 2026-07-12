import type { LucideIcon } from "lucide-react";
import type { CapabilityId } from "./capability";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  /** Required capabilities — visible if any are enabled (or empty = always) */
  capabilities?: CapabilityId[];
  /** Required permissions — all must be present */
  permissions?: string[];
  badge?: string | number;
  children?: NavItem[];
};

export type NavSection = {
  id: string;
  label: string;
  items: NavItem[];
  capabilities?: CapabilityId[];
};

export type CommandAction = {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  shortcut?: string;
  group: string;
  href?: string;
  action?: () => void;
  capabilities?: CapabilityId[];
  permissions?: string[];
};
