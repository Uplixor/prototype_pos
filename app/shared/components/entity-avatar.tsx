import { Avatar, AvatarFallback, AvatarImage } from "~/shared/components/ui/avatar";
import { cn } from "~/shared/utils/cn";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export type EntityAvatarProps = {
  name: string;
  imageUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClass = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
} as const;

function EntityAvatar({
  name,
  imageUrl,
  className,
  size = "md",
}: EntityAvatarProps) {
  return (
    <Avatar className={cn(sizeClass[size], className)}>
      {imageUrl ? <AvatarImage src={imageUrl} alt={name} /> : null}
      <AvatarFallback>{getInitials(name)}</AvatarFallback>
    </Avatar>
  );
}

export { EntityAvatar };
