"use client"

import * as React from "react"
import {
  User,
  LayoutGrid,
  SquareTerminal,
  Layers,
  RefreshCcwDot
} from "lucide-react"
import { ROLE } from "@/utils/params"
import { NavMain } from "@/components/layouts/navbar"
import { NavUser } from "@/components/layouts/user-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { selectAuth } from "@/features/auth-slice"
import { useSelector } from "react-redux"
import { usePathname } from "next/navigation"
import { StudentNav } from "./student-nav"

const data = {
  system: [
    {
      title: "Generator",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "PDF generate",
          url: "/system/generate",
          role: [ROLE.admin, ROLE.teacher],
        },
        {
          title: "Quiz list",
          url: "/system/quiz",
          role: [ROLE.admin]
        }
      ],
    },  
  ],
  core: [
    {
      name: "Users",
      url: "/system/user",
      icon: User,
      role: [ROLE.admin, ROLE.teacher]
    },
    {
      name: "Lesson",
      url: "/system/lesson",
      icon: Layers,
      role: [ROLE.admin]
    },
    {
      name: "Allocate",
      url: "/system/allocate",
      icon: RefreshCcwDot,
      role: [ROLE.admin]
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const auth = useSelector(selectAuth)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
      <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LayoutGrid />
              </div>
              <div className="grid flex-1 text-left text-lg leading-tight uppercase">
                <h1 className="truncate font-semibold">
                  School app
                </h1>
              </div>
            </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
          {auth?.role?.name === ROLE.admin || auth?.role?.name === ROLE.teacher ? (    
            <SidebarGroup className="group-data-[collapsible=icon]">
              <SidebarGroupLabel>        
                {auth?.role?.name === ROLE.admin || auth?.role?.name === ROLE.teacher
                  ? "Core"
                  : ""}
              </SidebarGroupLabel>
              <SidebarMenu>
                {data.core.map((item) => (
                  <SidebarMenuItem key={item.name} className={`${item.role.includes(auth?.role?.name || '') ? 'flex' : 'hidden' } ${item.url === pathname ? 'text-blue-500' : ''}`}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          ) : (
            ''
          )}
          {auth?.role?.name === ROLE.admin || auth?.role?.name === ROLE.teacher ? (
            <NavMain items={data.system} />
          ) : (
            <StudentNav/>
          )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
