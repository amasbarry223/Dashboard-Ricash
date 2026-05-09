'use client'

import { useState, useMemo } from "react"
import {
  Bell,
  Search,
  CheckCircle,
  Send,
  XCircle,
  Smartphone,
  Mail,
  BellRing,
  Shield,
  KeyRound,
  FileCheck,
  Settings,
  ArrowRight,
  Info,
  Eye,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  notifications,
  type Notification,
  type NotificationChannel,
  type NotificationType,
} from "@/lib/mock-data"

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function truncateMessage(message: string, maxLength: number = 50): string {
  if (message.length <= maxLength) return message
  return message.slice(0, maxLength) + "..."
}

/* ─── Channel Config ───────────────────────────────────────────────────────── */

const channelConfig: Record<NotificationChannel, { label: string; icon: React.ElementType; bgClass: string; iconClass: string }> = {
  SMS: {
    label: "SMS",
    icon: Smartphone,
    bgClass: "bg-teal-100 dark:bg-teal-900/30",
    iconClass: "text-teal-600 dark:text-teal-400",
  },
  EMAIL: {
    label: "Email",
    icon: Mail,
    bgClass: "bg-amber-100 dark:bg-amber-900/30",
    iconClass: "text-amber-600 dark:text-amber-400",
  },
  PUSH: {
    label: "Push",
    icon: BellRing,
    bgClass: "bg-purple-100 dark:bg-purple-900/30",
    iconClass: "text-purple-600 dark:text-purple-400",
  },
}

function ChannelIcon({ channel }: { channel: NotificationChannel }) {
  const config = channelConfig[channel]
  const Icon = config.icon
  return (
    <div className={`inline-flex size-7 items-center justify-center rounded-md ${config.bgClass}`}>
      <Icon className={`size-3.5 ${config.iconClass}`} />
    </div>
  )
}

function ChannelBadge({ channel }: { channel: NotificationChannel }) {
  const config = channelConfig[channel]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
      <ChannelIcon channel={channel} />
      {config.label}
    </span>
  )
}

/* ─── Type Config ──────────────────────────────────────────────────────────── */

const typeConfig: Record<NotificationType, { label: string; className: string; icon: React.ElementType }> = {
  OTP: {
    label: "OTP",
    className: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
    icon: KeyRound,
  },
  TRANSACTION: {
    label: "Transaction",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: Send,
  },
  SECURITY: {
    label: "Sécurité",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
    icon: Shield,
  },
  KYC: {
    label: "KYC",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
    icon: FileCheck,
  },
  SYSTEM: {
    label: "Système",
    className: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700",
    icon: Settings,
  },
}

function TypeBadge({ type }: { type: NotificationType }) {
  const config = typeConfig[type]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

/* ─── Status Config ────────────────────────────────────────────────────────── */

const notifStatusConfig: Record<Notification["statut"], { label: string; className: string; icon: React.ElementType }> = {
  SENT: {
    label: "Envoyé",
    className: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
    icon: Send,
  },
  DELIVERED: {
    label: "Délivré",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle,
  },
  FAILED: {
    label: "Échoué",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
  },
}

function NotificationStatusBadge({ statut }: { statut: Notification["statut"] }) {
  const config = notifStatusConfig[statut]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

/* ─── Notification Detail Dialog ───────────────────────────────────────────── */

function NotificationDetailDialog({
  notification,
  open,
  onOpenChange,
}: {
  notification: Notification | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!notification) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="size-5 text-primary" />
            Détails de la Notification
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* ID & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Identifiant</p>
              <p className="text-sm font-mono font-semibold">{notification.id}</p>
            </div>
            <NotificationStatusBadge statut={notification.statut} />
          </div>

          <Separator />

          {/* Type & Channel */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Type</p>
              <TypeBadge type={notification.type} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Canal</p>
              <ChannelBadge channel={notification.canal} />
            </div>
          </div>

          <Separator />

          {/* Recipient */}
          <div>
            <p className="text-xs text-muted-foreground">Destinataire</p>
            <p className="text-sm font-medium">{notification.destinataire}</p>
          </div>

          <Separator />

          {/* Full Message */}
          <div>
            <p className="text-xs text-muted-foreground">Message complet</p>
            <div className="mt-1 rounded-lg bg-muted/50 p-3 border">
              <p className="text-sm leading-relaxed">{notification.message}</p>
            </div>
          </div>

          <Separator />

          {/* Date */}
          <div>
            <p className="text-xs text-muted-foreground">Date d&apos;envoi</p>
            <p className="text-sm">{notification.date}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Canaux et Règles Card ────────────────────────────────────────────────── */

function ChannelsRulesCard() {
  const rules = [
    { canal: "SMS", icon: Smartphone, color: "teal", routes: "OTP, Alertes de transaction, Alertes de sécurité", latency: "< 5 sec", provider: "Orange SMS API / MTN SMS API" },
    { canal: "Email", icon: Mail, color: "amber", routes: "Reçus de transaction, Résumés hebdomadaires, Alertes KYC", latency: "< 30 sec", provider: "SMTP / SendGrid" },
    { canal: "Push", icon: BellRing, color: "purple", routes: "Alertes système, Notifications KYC, Rappels", latency: "< 3 sec", provider: "Firebase Cloud Messaging" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Info className="size-5 text-primary" />
          <div>
            <CardTitle className="text-base">Canaux et Règles de Routage</CardTitle>
            <CardDescription className="text-xs mt-0.5">Configuration du système de notification par canal</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-4">
          {rules.map((rule, idx) => {
            const Icon = rule.icon
            return (
              <div key={rule.canal}>
                <div className="flex items-start gap-3">
                  <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${
                    rule.color === "teal"
                      ? "bg-teal-100 dark:bg-teal-900/30"
                      : rule.color === "amber"
                        ? "bg-amber-100 dark:bg-amber-900/30"
                        : "bg-purple-100 dark:bg-purple-900/30"
                  }`}>
                    <Icon className={`size-4 ${
                      rule.color === "teal"
                        ? "text-teal-600 dark:text-teal-400"
                        : rule.color === "amber"
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-purple-600 dark:text-purple-400"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold">{rule.canal}</h4>
                    <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-1.5">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Types routés</p>
                        <p className="text-xs">{rule.routes}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Latence cible</p>
                        <p className="text-xs font-medium">{rule.latency}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Fournisseur</p>
                        <p className="text-xs">{rule.provider}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {idx < rules.length - 1 && <Separator className="mt-4" />}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export function NotificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [channelFilter, setChannelFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Stats
  const totalSent = notifications.length
  const deliveredCount = notifications.filter((n) => n.statut === "DELIVERED").length
  const failedCount = notifications.filter((n) => n.statut === "FAILED").length

  // Filter notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          notif.id.toLowerCase().includes(q) ||
          notif.destinataire.toLowerCase().includes(q) ||
          notif.message.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (typeFilter !== "all" && notif.type !== typeFilter) return false
      if (channelFilter !== "all" && notif.canal !== channelFilter) return false
      if (statusFilter !== "all" && notif.statut !== statusFilter) return false
      return true
    })
  }, [searchQuery, typeFilter, channelFilter, statusFilter])

  // Open detail
  const openDetail = (notif: Notification) => {
    setSelectedNotification(notif)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bell className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Système de Notifications</h1>
            <p className="text-sm text-muted-foreground">Suivi et gestion des notifications envoyées</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Envoyées</p>
                <p className="text-xl font-bold">{totalSent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Délivrées</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{deliveredCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Échouées</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-400">{failedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par ID, destinataire, message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="OTP">OTP</SelectItem>
                <SelectItem value="TRANSACTION">Transaction</SelectItem>
                <SelectItem value="SECURITY">Sécurité</SelectItem>
                <SelectItem value="KYC">KYC</SelectItem>
                <SelectItem value="SYSTEM">Système</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous canaux</SelectItem>
                <SelectItem value="SMS">SMS</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="PUSH">Push</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="SENT">Envoyé</SelectItem>
                <SelectItem value="DELIVERED">Délivré</SelectItem>
                <SelectItem value="FAILED">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">ID</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Canal</TableHead>
                  <TableHead className="font-semibold">Destinataire</TableHead>
                  <TableHead className="font-semibold">Message</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredNotifications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      <Bell className="size-8 mx-auto mb-2 opacity-30" />
                      Aucune notification trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredNotifications.map((notif) => (
                    <TableRow
                      key={notif.id}
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                      onClick={() => openDetail(notif)}
                    >
                      <TableCell className="font-mono text-xs">{notif.id}</TableCell>
                      <TableCell>
                        <TypeBadge type={notif.type} />
                      </TableCell>
                      <TableCell>
                        <ChannelIcon channel={notif.canal} />
                      </TableCell>
                      <TableCell className="text-sm max-w-[140px] truncate">{notif.destinataire}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                        {truncateMessage(notif.message)}
                      </TableCell>
                      <TableCell>
                        <NotificationStatusBadge statut={notif.statut} />
                      </TableCell>
                      <TableCell className="text-xs whitespace-nowrap">{notif.date}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            openDetail(notif)
                          }}
                        >
                          <Eye className="size-3.5 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Canaux et Règles Reference Card */}
      <ChannelsRulesCard />

      {/* Notification Detail Dialog */}
      <NotificationDetailDialog
        notification={selectedNotification}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
