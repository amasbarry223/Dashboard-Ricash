"use client"

import { Bell, Search, Moon, Sun, Command } from "lucide-react"
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

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Tableau de Bord", subtitle: "Vue d'ensemble" },
  users: { title: "Utilisateurs", subtitle: "Gestion des comptes" },
  kyc: { title: "KYC & Conformité", subtitle: "Vérifications" },
  transactions: { title: "Transactions", subtitle: "Opérations financières" },
  agents: { title: "Agents", subtitle: "Réseau terrain" },
  partners: { title: "Partenaires", subtitle: "Intégrations" },
  notifications: { title: "Notifications", subtitle: "Système d'alertes" },
  configuration: { title: "Configuration", subtitle: "Paramètres plateforme" },
  settings: { title: "Paramètres", subtitle: "Votre compte" },
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
  const pageInfo = pageTitles[currentPage] || { title: "RICASH", subtitle: "" }

  return (
    <header className="glass-header sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-border/50 px-4 animate-fade-in">
      <SidebarTrigger className="-ml-1 hover:bg-muted/60 rounded-lg transition-colors" />
      <Separator orientation="vertical" className="mr-2 h-5 bg-border/50" />

      {/* Page Title */}
      <div className="hidden md:flex items-center gap-2 mr-4">
        <h1 className="font-semibold text-sm">{pageInfo.title}</h1>
        {pageInfo.subtitle && (
          <>
            <span className="text-muted-foreground/40 text-xs">/</span>
            <span className="text-muted-foreground text-xs">{pageInfo.subtitle}</span>
          </>
        )}
      </div>

      <div className="flex-1" />

      {/* Command-style Search */}
      <div className="hidden md:flex items-center">
        <div className="relative group">
          <Search className="text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 size-3.5 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Rechercher..."
            className="h-8 pl-8 pr-16 text-sm bg-muted/40 border-0 focus-visible:ring-1 focus-visible:ring-primary/30 rounded-lg transition-all w-64 focus-within:w-80"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            <Command className="size-2.5" />K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-2">
        {/* Theme Toggle */}
        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg hover:bg-muted/60 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            <span className="sr-only">Changer le thème</span>
          </Button>
        )}

        {/* Notifications Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 rounded-lg relative hover:bg-muted/60 transition-colors">
              <Bell className="size-4" />
              {criticalAlerts.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center">
                  <span className="absolute inline-flex size-full rounded-full bg-destructive opacity-75 animate-pulse-ring" />
                  <span className="relative inline-flex size-3.5 rounded-full bg-destructive text-white text-[8px] font-bold items-center justify-center">
                    {criticalAlerts.length}
                  </span>
                </span>
              )}
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 rounded-xl shadow-lg border-border/50 p-2">
            <DropdownMenuLabel className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold">Alertes</span>
              <Badge variant="secondary" className="text-[10px] h-5">
                {adminAlerts.length} total
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {adminAlerts.slice(0, 5).map((alert) => (
              <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1.5 p-3 rounded-lg mb-1 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <span
                    className={`size-2 rounded-full shrink-0 ${
                      alert.severity === "critical"
                        ? "bg-red-500 dark:bg-red-400"
                        : alert.severity === "warning"
                        ? "bg-amber-500 dark:bg-amber-400"
                        : "bg-sky-500 dark:bg-sky-400"
                    }`}
                  />
                  <span className="font-medium text-xs">{alert.type}</span>
                  <span className="text-muted-foreground text-[10px] ml-auto">{alert.time}</span>
                </div>
                <span className="text-muted-foreground text-xs pl-4 leading-relaxed">{alert.message}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-primary text-xs justify-center font-medium rounded-lg p-2 cursor-pointer">
              Voir toutes les alertes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-5 mx-0.5 bg-border/50" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="size-8 p-0 rounded-lg hover:bg-muted/60 transition-colors">
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-xs font-bold ring-1 ring-primary/20">
                  SA
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 rounded-xl shadow-lg border-border/50 p-2">
            <DropdownMenuLabel className="px-2 py-1.5">
              <p className="text-sm font-semibold">Super Admin</p>
              <p className="text-[10px] text-muted-foreground">superadmin@ricash.com</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg text-xs">Mon Profil</DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg text-xs">Paramètres</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg text-xs text-destructive focus:text-destructive">Déconnexion</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
