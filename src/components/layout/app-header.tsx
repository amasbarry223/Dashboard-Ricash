"use client"

import { Bell, Search, Moon, Sun } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { adminAlerts } from "@/lib/mock-data"
import { useAppStore } from "@/lib/store"
import { useTheme } from "next-themes"
import { useSyncExternalStore } from "react"

const pageTitles: Record<string, string> = {
  dashboard: "Tableau de Bord",
  users: "Gestion des Utilisateurs",
  kyc: "KYC & Conformité",
  transactions: "Gestion des Transactions",
  agents: "Gestion des Agents",
  partners: "Gestion des Partenaires",
  notifications: "Centre de Notifications",
  configuration: "Configuration de la Plateforme",
}

export function AppHeader() {
  const { currentPage, searchQuery, setSearchQuery } = useAppStore()
  const { theme, setTheme } = useTheme()
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  const criticalAlerts = adminAlerts.filter((a) => a.severity === "critical")
  const warningAlerts = adminAlerts.filter((a) => a.severity === "warning")

  return (
    <header className="bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b backdrop-blur-md px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <h1 className="hidden font-semibold text-sm md:inline-block">
        {pageTitles[currentPage] || "RICASH"}
      </h1>

      <div className="flex-1" />

      <div className="hidden md:flex items-center gap-2 w-72">
        <div className="relative w-full">
          <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-3.5" />
          <Input
            placeholder="Rechercher..."
            className="h-8 pl-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="sr-only">Changer le thème</span>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 relative">
              <Bell className="size-4" />
              {criticalAlerts.length > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 size-4 p-0 text-[10px] flex items-center justify-center bg-destructive text-white">
                  {criticalAlerts.length}
                </Badge>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Alertes</span>
              <Badge variant="secondary" className="text-[10px]">
                {adminAlerts.length} total
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {adminAlerts.slice(0, 5).map((alert) => (
              <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3">
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      alert.severity === "critical"
                        ? "bg-destructive"
                        : alert.severity === "warning"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  />
                  <span className="font-medium text-xs">{alert.type}</span>
                  <span className="text-muted-foreground text-[10px] ml-auto">{alert.time}</span>
                </div>
                <span className="text-muted-foreground text-xs pl-4">{alert.message}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary text-xs justify-center font-medium">
              Voir toutes les alertes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-4 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0 rounded-full">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  SA
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Super Admin</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Mon Profil</DropdownMenuItem>
            <DropdownMenuItem>Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
