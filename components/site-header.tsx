"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  IconBriefcase,
  IconFolder,
  IconLayoutDashboard,
  IconMessages,
  IconUsers,
  IconUserStar,
} from "@tabler/icons-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();

  const navMain = [
    { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
    { title: "Users", url: "/dashboard/users", icon: IconUsers },
    { title: "Clients", url: "/dashboard/clients", icon: IconBriefcase },
    {
      title: "Client Stakeholders",
      url: "/dashboard/client-stakeholders",
      icon: IconUserStar,
    },
    { title: "Projects", url: "/dashboard/projects", icon: IconFolder },
    {
      title: "Discovery Interview",
      url: "/dashboard/discovery-interview",
      icon: IconMessages,
    },
  ];

  const currentNav = [...navMain]
    .sort((a, b) => b.url.length - a.url.length) // prioritize longer URLs
    .find((item) => pathname?.startsWith(item.url));

  return (
    <header className="sticky top-0 bg-white z-50 flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="flex items-center gap-2 text-base font-medium">
          {currentNav?.icon && <currentNav.icon className="size-4" />}
          {currentNav?.title ?? "Documents"}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {/* <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
              rel="noopener noreferrer"
              target="_blank"
              className="dark:text-foreground"
            >
              GitHub
            </a>
          </Button> */}
          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <a
              href="https://www.ontiktechnology.com/"
              rel="noopener noreferrer"
              target="_blank"
              className="flex items-center gap-2"
            >
              <Image
                src="/ontik.svg"
                alt="Ontik Technology"
                width={24}
                height={24}
                className="rounded-sm"
              />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
