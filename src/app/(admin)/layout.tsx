'use client'
import ProtectedRoute from "@/app/protect"
import { AppSidebar } from "@/components/layouts/sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useSelector } from "react-redux"
import { selectAuth } from "@/features/auth-slice"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const auth = useSelector(selectAuth)
  return (
    <ProtectedRoute>
      <SidebarProvider>
          {auth?.role?.name !== "Student" && <AppSidebar />}
          <SidebarInset>
              {children}
          </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
