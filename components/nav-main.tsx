"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: Readonly<{
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}>) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (pathname.startsWith(item.url + "/") &&
                item.url !== "/dashboard");

            return (
              <SidebarMenuItem key={item.title}>
                <Link href={item.url} className="w-full">
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    className={`flex items-center gap-2 rounded-md transition-all duration-200
                      ${
                        isActive
                          ? "bg-gray-900 text-white hover:bg-gray-900 hover:text-white font-semibold shadow-sm cursor-pointer" // No hover classes here
                          : "hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <item.icon
                          className={`w-5 h-5 transition-colors duration-200 ${
                            isActive ? "text-white" : ""
                          }`}
                        />
                      )}
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
