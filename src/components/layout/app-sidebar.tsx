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
  Sparkles,
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
          className={`
            group relative rounded-xl transition-all duration-200
            ${isActive
              ? "bg-sidebar-primary/15 text-sidebar-primary font-semibold shadow-sm shadow-sidebar-primary/10"
              : "hover:bg-sidebar-accent/60 text-sidebar-foreground/80 hover:text-sidebar-foreground"
            }
          `}
        >
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-sidebar-primary" />
          )}
          <item.icon className={`size-4 transition-colors ${isActive ? "text-sidebar-primary" : "text-sidebar-foreground/60 group-hover:text-sidebar-foreground/90"}`} />
          <span className="text-[13px]">{item.label}</span>
        </SidebarMenuButton>
        {badge !== null && badge > 0 && (
          <SidebarMenuBadge className="bg-destructive/90 text-white text-[10px] font-bold px-1.5 h-5 rounded-full border-0 shadow-sm">
            {badge}
          </SidebarMenuBadge>
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
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl hover:bg-sidebar-accent/60 transition-all"
                >
                  <div className="gradient-primary flex aspect-square size-9 items-center justify-center rounded-xl shadow-md shadow-primary/25">
                    <Sparkles className="size-4 text-primary-foreground" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-bold text-[15px] tracking-tight">RICASH</span>
                    <span className="text-sidebar-foreground/50 truncate text-[11px]">Back-Office Admin</span>
                  </div>
                  <ChevronDown className="ml-auto size-3.5 text-sidebar-foreground/40" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-lg border-border/50 p-2"
                side="bottom"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem className="rounded-lg text-xs">
                  <div className="size-2 rounded-full bg-emerald-500 mr-2" />
                  <span>Production</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-lg text-xs">
                  <div className="size-2 rounded-full bg-amber-500 mr-2" />
                  <span>Staging</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold px-3">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
              {mainNav.map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-sidebar-border/50" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-sidebar-foreground/40 font-semibold px-3">
            Système
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1 px-2">
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
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl hover:bg-sidebar-accent/60 transition-all"
                >
                  <Avatar className="size-9 rounded-xl">
                    <AvatarFallback className="rounded-xl bg-sidebar-primary/15 text-sidebar-primary text-xs font-bold ring-1 ring-sidebar-primary/25">
                      SA
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-[13px]">Super Admin</span>
                    <span className="text-sidebar-foreground/50 truncate text-[11px]">superadmin@ricash.com</span>
                  </div>
                  <ChevronDown className="ml-auto size-3.5 text-sidebar-foreground/40" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl shadow-lg border-border/50 p-2"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => setCurrentPage("settings")} className="rounded-lg text-xs">
                  <User className="mr-2 size-3.5" />
                  <span>Mon Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentPage("settings")} className="rounded-lg text-xs">
                  <Settings className="mr-2 size-3.5" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg text-xs text-destructive focus:text-destructive">
                  <LogOut className="mr-2 size-3.5" />
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
