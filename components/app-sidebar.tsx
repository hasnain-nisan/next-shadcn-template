"use client";

import * as React from "react";
import {
  Icon,
  IconBriefcase,
  IconFolder,
  IconLayoutDashboard,
  IconMessages,
  IconUsers,
  IconUserStar,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { BrandLogo } from "./ui/BrandLogo";
import { useSession } from "next-auth/react";
import { getNameFromEmail } from "@/lib/helper";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = {
    name: getNameFromEmail(session?.user?.email),
    email: session?.user?.email,
    avatar: session?.user?.image,
  };

  const access = session?.user?.accessScopes || {};

  const navMain = [
    { title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
    access.canManageUsers && {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    access.canManageClients && {
      title: "Clients",
      url: "/dashboard/clients",
      icon: IconBriefcase,
    },
    access.canManageStakeholders && {
      title: "Client Stakeholders",
      url: "/dashboard/client-stakeholders",
      icon: IconUserStar,
    },
    access.canManageProjects && {
      title: "Projects",
      url: "/dashboard/projects",
      icon: IconFolder,
    },
    access.canManageInterviews && {
      title: "Discovery Interview",
      url: "/dashboard/discovery-interviews",
      icon: IconMessages,
    },
  ].filter(Boolean);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-transparent"
            >
              <BrandLogo
                label="Acme Inc."
                iconSize={20}
                containerSize={32}
                className="text-foreground flex justify-center mb-5"
              />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={
            navMain as unknown as {
              title: string;
              url: string;
              icon: Icon | undefined;
            }[]
          }
        />
      </SidebarContent>
      <SidebarFooter>
        {
          session && <NavUser user={user} />
        }
      </SidebarFooter>
    </Sidebar>
  );
}
