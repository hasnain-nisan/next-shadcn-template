import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

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
  iconSize = 25,
  containerSize = 25,
  className,
}: BrandLogoProps) {
  const logoPath = "/tp-logo.png";
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2 font-medium", className)}
    >
      <div
        className="text-primary-foreground flex items-center justify-center rounded-md"
        style={{ width: containerSize, height: containerSize }}
      >
        {/* <GalleryVerticalEnd style={{ width: iconSize, height: iconSize }} /> */}
        <Image
          src={logoPath}
          alt="Transparent Partners Logo"
          width={iconSize}
          height={iconSize}
          className="rounded-sm" // Optional: Add a class if your logo should be smaller than the container
        />
      </div>
      {label}
    </Link>
  );
}
