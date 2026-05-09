"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { useAppStore } from "@/lib/store"
import { DashboardPage } from "@/components/dashboard/dashboard-page"
import { UsersPage } from "@/components/users/users-page"
import { KycPage } from "@/components/kyc/kyc-page"
import { TransactionsPage } from "@/components/transactions/transactions-page"
import { AgentsPage } from "@/components/agents/agents-page"
import { PartnersPage } from "@/components/partners/partners-page"
import { NotificationsPage } from "@/components/notifications/notifications-page"
import { ConfigurationPage } from "@/components/configuration/configuration-page"
import { SettingsPage } from "@/components/settings/settings-page"

const pageComponents: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  users: UsersPage,
  kyc: KycPage,
  transactions: TransactionsPage,
  agents: AgentsPage,
  partners: PartnersPage,
  notifications: NotificationsPage,
  configuration: ConfigurationPage,
  settings: SettingsPage,
}

export default function Home() {
  const { currentPage } = useAppStore()
  const PageComponent = pageComponents[currentPage] || DashboardPage

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="gradient-mesh bg-dots">
        <AppHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div key={currentPage} className="animate-fade-in">
            <PageComponent />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
