/**
 * Shared UI barrel — prefer importing from specific modules in features.
 * This index documents the design-system surface area.
 */

export { Button, buttonVariants } from "./ui/button";
export { Input } from "./ui/input";
export { Textarea } from "./ui/textarea";
export { Label } from "./ui/label";
export { Badge, badgeVariants } from "./ui/badge";
export { Separator } from "./ui/separator";
export { Skeleton } from "./ui/skeleton";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
export { Checkbox } from "./ui/checkbox";
export { Switch } from "./ui/switch";
export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
export { DataTable } from "./data-table/data-table";
export { exportToCsv } from "./data-table/export-csv";
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form/form";
export { useAppForm, clearFormDraft } from "./form/use-app-form";
export {
  EmptyState,
  ErrorState,
  FilterBar,
  LoadingState,
  MetricCard,
  PageHeader,
  StatCard,
  Toolbar,
} from "./page-primitives";
export { SearchInput } from "./search-input";
export { StatusBadge } from "./status-badge";
export { EntityAvatar } from "./entity-avatar";
export { PermissionGuard } from "./permission-guard";
export { ConfirmDialog } from "./confirm-dialog";
export { ActivityFeed, Timeline } from "./timeline";
export { DetailsPanel, SplitView } from "./split-view";
export { CommandPalette } from "./command-palette/command-palette";
export { DrawerHost } from "./drawer/drawer-host";
