"use client";

import {
  Icon,
  IconAdjustmentsHorizontal,
  IconBriefcase,
  IconFileUpload,
  IconFolder,
  IconLayoutDashboard,
  IconMessages,
  IconSettings,
  IconUsers,
  IconUserStar,
} from "@tabler/icons-react";
import * as React from "react";

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
import { getNameFromEmail } from "@/lib/helper";
import { useSession } from "next-auth/react";
import { BrandLogo } from "./ui/BrandLogo";

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

    access.canAccessUsers && {
      title: "Users",
      url: "/dashboard/users",
      icon: IconUsers,
    },
    access.canAccessClients && {
      title: "Clients",
      url: "/dashboard/clients",
      icon: IconBriefcase,
    },
    // access.canAccessStakeholders && {
    //   title: "Client Stakeholders",
    //   url: "/dashboard/client-stakeholders",
    //   icon: IconUserStar,
    // },
    // access.canAccessProjects && {
    //   title: "Projects",
    //   url: "/dashboard/projects",
    //   icon: IconFolder,
    // },
    // access.canAccessInterviews && {
    //   title: "Discovery Interview",
    //   url: "/dashboard/discovery-interviews",
    //   icon: IconMessages,
    // },

    // New menu items
    access.canAccessConfig && {
      title: "Configs",
      url: "/dashboard/configs",
      icon: IconAdjustmentsHorizontal,
    },
    access.canAccessConfig && {
      title: "Bulk Upload",
      url: "/dashboard/bulk-upload",
      icon: IconFileUpload,
    },
    access.canAccessAdminSettings && {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
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
                label="Transparent Partner"
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
      <SidebarFooter>{session && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
