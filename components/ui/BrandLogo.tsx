import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  readonly href?: string;
  readonly label?: string;
  readonly iconSize?: number;
  readonly containerSize?: number;
  readonly className?: string;
}

export function BrandLogo({
  href = "/",
  label = "Transparent Partners",
  iconSize = 16,
  containerSize = 24,
  className,
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-medium", className)}
    >
      <div
        className="bg-primary text-primary-foreground flex items-center justify-center rounded-md"
        style={{ width: containerSize, height: containerSize }}
      >
        <GalleryVerticalEnd style={{ width: iconSize, height: iconSize }} />
      </div>
      {label}
    </Link>
  );
}
