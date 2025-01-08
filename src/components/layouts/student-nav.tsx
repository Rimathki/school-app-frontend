"use client";

import { ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { selectAuth } from "@/features/auth-slice";

export function StudentNav() {
  const auth = useSelector(selectAuth);

  if (!auth?.teachers || !Array.isArray(auth.teachers)) {
    return null;
  }

  return (
    <SidebarGroup>
      {auth.teachers.map((teacher) => (
        <div key={teacher.id}>
          <SidebarGroupLabel className="uppercase">
            {`${teacher.lastname.substring(0, 1)}. ${teacher.firstname}`}
          </SidebarGroupLabel>
          <SidebarMenu>
            {teacher.lessons?.map((lesson) => (
              <Collapsible key={lesson.id} asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={lesson.title}>
                      <span>{lesson.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {lesson.topics?.map((topic) => (
                        <SidebarMenuSubItem key={topic.id}>
                          <SidebarMenuSubButton asChild>
                            <a href={`/quiz/${lesson.title}/${topic.title}/${topic.id}`}>
                              <span>{topic.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </div>
      ))}
    </SidebarGroup>
  );
}
