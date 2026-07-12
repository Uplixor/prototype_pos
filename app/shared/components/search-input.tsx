import { Search } from "lucide-react";
import { cn } from "~/shared/utils/cn";
import { Input } from "~/shared/components/ui/input";

export type SearchInputProps = Omit<React.ComponentProps<"input">, "type"> & {
  containerClassName?: string;
};

function SearchInput({
  className,
  containerClassName,
  ...props
}: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        type="search"
        className={cn("pl-8", className)}
        {...props}
      />
    </div>
  );
}

export { SearchInput };
