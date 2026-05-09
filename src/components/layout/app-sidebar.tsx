"use client"

import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  ArrowLeftRight,
  UserCog,
  Handshake,
  Bell,
  Settings,
  ChevronDown,
  LogOut,
  Gem,
  User,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAppStore, type PageKey } from "@/lib/store"
import { adminAlerts, kycRequests } from "@/lib/mock-data"

const mainNav: { key: PageKey; label: string; icon: React.ElementType }[] = [
  { key: "dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
  { key: "users", label: "Utilisateurs", icon: Users },
  { key: "kyc", label: "KYC & Conformité", icon: ShieldCheck },
  { key: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { key: "agents", label: "Agents", icon: UserCog },
]

const secondaryNav: { key: PageKey; label: string; icon: React.ElementType }[] = [
  { key: "partners", label: "Partenaires", icon: Handshake },
  { key: "notifications", label: "Notifications", icon: Bell },
  { key: "configuration", label: "Configuration", icon: Settings },
  { key: "settings", label: "Paramètres", icon: User },
]

export function AppSidebar() {
  const { currentPage, setCurrentPage } = useAppStore()

  const criticalAlerts = adminAlerts.filter((a) => a.severity === "critical").length
  const pendingKyc = kycRequests.filter((k) => k.status === "PENDING" || k.status === "IN_REVIEW").length

  const renderNavItem = (item: { key: PageKey; label: string; icon: React.ElementType }) => {
    const isActive = currentPage === item.key
    let badge: number | null = null

    if (item.key === "kyc" && pendingKyc > 0) badge = pendingKyc
    if (item.key === "notifications" && criticalAlerts > 0) badge = criticalAlerts

    return (
      <SidebarMenuItem key={item.key}>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => setCurrentPage(item.key)}
          tooltip={item.label}
        >
          <item.icon className="size-4" />
          <span>{item.label}</span>
        </SidebarMenuButton>
        {badge !== null && badge > 0 && (
          <SidebarMenuBadge>{badge}</SidebarMenuBadge>
        )}
      </SidebarMenuItem>
    )
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Gem className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold">RICASH</span>
                    <span className="text-sidebar-foreground/60 truncate text-xs">Back-Office Admin</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>Production</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Staging</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Système</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary/20 text-primary text-xs font-bold">
                      SA
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Super Admin</span>
                    <span className="text-sidebar-foreground/60 truncate text-xs">superadmin@ricash.com</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => setCurrentPage("settings")}>
                  <User className="mr-2 size-4" />
                  <span>Mon Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentPage("settings")}>
                  <Settings className="mr-2 size-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 size-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
