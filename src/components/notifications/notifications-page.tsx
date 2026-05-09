'use client'

import { useState, useMemo } from "react"
import {
  Bell, Send, CheckCircle, XCircle, Clock, AlertTriangle,
  Smartphone, Mail, BellRing, Shield, FileCheck, Settings,
  Users, UserCheck, Eye, ChevronLeft, ChevronRight,
  FilterX, Megaphone, FileText, Sparkles, AlertOctagon,
  Info, Zap, Wrench, ArrowRight, Plus, Search,
  Radio, CalendarDays, MessageSquare, TrendingUp, BarChart3,
  RefreshCw, Copy, Trash2, MoreHorizontal, ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  sentNotifications, notificationTemplates,
  type NotificationType, type NotificationChannel, type NotificationAudience, type NotificationPriority,
  type SentNotification, type NotificationTemplate,
} from "@/lib/mock-data"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n)
}

// ─── Config maps ──────────────────────────────────────────────────────────────
const typeConfig: Record<NotificationType, { label: string; className: string; icon: React.ElementType; bgClass: string }> = {
  OTP: { label: "OTP", className: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800", icon: Clock, bgClass: "bg-teal-100 dark:bg-teal-950" },
  TRANSACTION: { label: "Transaction", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800", icon: Send, bgClass: "bg-emerald-100 dark:bg-emerald-950" },
  SECURITY: { label: "Sécurité", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800", icon: Shield, bgClass: "bg-red-100 dark:bg-red-950" },
  KYC: { label: "KYC", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800", icon: FileCheck, bgClass: "bg-amber-100 dark:bg-amber-950" },
  SYSTEM: { label: "Système", className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", icon: Settings, bgClass: "bg-gray-100 dark:bg-gray-800" },
  PROMOTION: { label: "Promotion", className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800", icon: Sparkles, bgClass: "bg-purple-100 dark:bg-purple-950" },
  MAINTENANCE: { label: "Maintenance", className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800", icon: Wrench, bgClass: "bg-orange-100 dark:bg-orange-950" },
}

const channelConfig: Record<NotificationChannel, { label: string; icon: React.ElementType; bgClass: string; iconClass: string; color: string }> = {
  SMS: { label: "SMS", icon: Smartphone, bgClass: "bg-teal-100 dark:bg-teal-950", iconClass: "text-teal-600 dark:text-teal-400", color: "teal" },
  EMAIL: { label: "Email", icon: Mail, bgClass: "bg-amber-100 dark:bg-amber-950", iconClass: "text-amber-600 dark:text-amber-400", color: "amber" },
  PUSH: { label: "Push", icon: BellRing, bgClass: "bg-purple-100 dark:bg-purple-950", iconClass: "text-purple-600 dark:text-purple-400", color: "purple" },
}

const audienceConfig: Record<NotificationAudience, { label: string; shortLabel: string; icon: React.ElementType; desc: string; count: string }> = {
  ALL_USERS: { label: "Tous les utilisateurs", shortLabel: "Utilisateurs", icon: Users, desc: "23 847 comptes utilisateurs actifs", count: "23 847" },
  ALL_AGENTS: { label: "Tous les agents", shortLabel: "Agents", icon: UserCheck, desc: "1 245 agents opérationnels", count: "1 245" },
  ALL: { label: "Tout le monde", shortLabel: "Tous", icon: Megaphone, desc: "Utilisateurs + Agents (25 092)", count: "25 092" },
  SPECIFIC_USERS: { label: "Utilisateurs spécifiques", shortLabel: "Sélection", icon: Users, desc: "Sélectionner des utilisateurs individuels", count: "—" },
  SPECIFIC_AGENTS: { label: "Agents spécifiques", shortLabel: "Sélection", icon: UserCheck, desc: "Sélectionner des agents individuels", count: "—" },
}

const priorityConfig: Record<NotificationPriority, { label: string; className: string; icon: React.ElementType; dotClass: string }> = {
  NORMAL: { label: "Normale", className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", icon: Info, dotClass: "bg-gray-400" },
  HIGH: { label: "Haute", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800", icon: AlertTriangle, dotClass: "bg-amber-500" },
  URGENT: { label: "Urgente", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800", icon: AlertOctagon, dotClass: "bg-red-500" },
}

const sentStatusConfig: Record<SentNotification["statut"], { label: string; className: string; icon: React.ElementType; progressClass: string }> = {
  DELIVERED: { label: "Délivré", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800", icon: CheckCircle, progressClass: "bg-emerald-500" },
  SENT: { label: "Envoyé", className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800", icon: Send, progressClass: "bg-sky-500" },
  PARTIAL: { label: "Partiel", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800", icon: AlertTriangle, progressClass: "bg-amber-500" },
  FAILED: { label: "Échoué", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800", icon: XCircle, progressClass: "bg-red-500" },
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: NotificationType }) {
  const c = typeConfig[type]
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${c.className}`}>
      <Icon className="size-3" />{c.label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: NotificationPriority }) {
  const c = priorityConfig[priority]
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${c.className}`}>
      <Icon className="size-3" />{c.label}
    </span>
  )
}

function SentStatusBadge({ statut }: { statut: SentNotification["statut"] }) {
  const c = sentStatusConfig[statut]
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${c.className}`}>
      <Icon className="size-3" />{c.label}
    </span>
  )
}

function ChannelIcon({ channel, size = "sm" }: { channel: NotificationChannel; size?: "sm" | "md" }) {
  const cfg = channelConfig[channel]
  const Icon = cfg.icon
  const sizeClass = size === "sm" ? "size-6" : "size-8"
  const iconSize = size === "sm" ? "size-3" : "size-4"
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex ${sizeClass} items-center justify-center rounded-md ${cfg.bgClass}`}>
          <Icon className={`${iconSize} ${cfg.iconClass}`} />
        </div>
      </TooltipTrigger>
      <TooltipContent>{cfg.label}</TooltipContent>
    </Tooltip>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────
const PER_PAGE = 8

function PaginationControls({ currentPage, totalPages, onPageChange, totalItems, startIndex, endIndex, itemLabel }: {
  currentPage: number; totalPages: number; onPageChange: (p: number) => void; totalItems: number; startIndex: number; endIndex: number; itemLabel: string
}) {
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
    else {
      pages.push(1)
      if (currentPage > 3) pages.push("...")
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (currentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t px-4 py-3">
      <p className="text-sm text-muted-foreground">{startIndex + 1}–{endIndex} sur {totalItems} {itemLabel}</p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="size-8" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="size-4" />
        </Button>
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`e-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
          ) : (
            <Button key={page} variant={page === currentPage ? "default" : "outline"} size="icon" className={`size-8 ${page === currentPage ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`} onClick={() => onPageChange(page)}>
              {page}
            </Button>
          )
        )}
        <Button variant="outline" size="icon" className="size-8" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, iconClass, bgClass, label, value, subValue, subClass }: {
  icon: React.ElementType; iconClass: string; bgClass: string; label: string; value: string; subValue?: string; subClass?: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex size-10 items-center justify-center rounded-xl shrink-0 ${bgClass}`}>
            <Icon className={`size-5 ${iconClass}`} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
            <p className="text-xl font-bold tracking-tight">{value}</p>
            {subValue && (
              <p className={`text-xs font-medium mt-0.5 ${subClass || "text-muted-foreground"}`}>{subValue}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NotificationsPage() {
  // ── Creation form state ──
  const [formType, setFormType] = useState<NotificationType>("SYSTEM")
  const [formAudience, setFormAudience] = useState<NotificationAudience>("ALL_USERS")
  const [formChannels, setFormChannels] = useState<NotificationChannel[]>(["SMS"])
  const [formPriority, setFormPriority] = useState<NotificationPriority>("NORMAL")
  const [formTitle, setFormTitle] = useState("")
  const [formMessage, setFormMessage] = useState("")
  const [formScheduleNow, setFormScheduleNow] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  // ── History state ──
  const [histPage, setHistPage] = useState(1)
  const [histTypeFilter, setHistTypeFilter] = useState<string>("all")
  const [histAudienceFilter, setHistAudienceFilter] = useState<string>("all")
  const [histStatusFilter, setHistStatusFilter] = useState<string>("all")
  const [searchFilter, setSearchFilter] = useState("")

  // ── Detail view ──
  const [selectedNotif, setSelectedNotif] = useState<SentNotification | null>(null)

  // ── Form actions ──
  const toggleChannel = (ch: NotificationChannel) => {
    setFormChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch])
  }

  const applyTemplate = (tplId: string) => {
    const tpl = notificationTemplates.find((t) => t.id === tplId)
    if (tpl) {
      setFormType(tpl.categorie)
      setFormAudience(tpl.audienceSuggere)
      setFormChannels([...tpl.canauxSuggere])
      setFormTitle(tpl.objet)
      setFormMessage(tpl.contenu)
      setSelectedTemplate(tplId)
    }
  }

  const resetForm = () => {
    setFormType("SYSTEM")
    setFormAudience("ALL_USERS")
    setFormChannels(["SMS"])
    setFormPriority("NORMAL")
    setFormTitle("")
    setFormMessage("")
    setFormScheduleNow(true)
    setSelectedTemplate("")
  }

  // ── Filtered history ──
  const filteredHistory = useMemo(() => {
    return sentNotifications.filter((sn) => {
      if (histTypeFilter !== "all" && sn.type !== histTypeFilter) return false
      if (histAudienceFilter !== "all" && sn.audience !== histAudienceFilter) return false
      if (histStatusFilter !== "all" && sn.statut !== histStatusFilter) return false
      if (searchFilter) {
        const q = searchFilter.toLowerCase()
        return sn.titre.toLowerCase().includes(q) || sn.message.toLowerCase().includes(q) || sn.envoyePar.toLowerCase().includes(q)
      }
      return true
    })
  }, [histTypeFilter, histAudienceFilter, histStatusFilter, searchFilter])

  const histTotalPages = Math.max(1, Math.ceil(filteredHistory.length / PER_PAGE))
  const safeHistPage = Math.min(histPage, histTotalPages)
  const paginatedHistory = filteredHistory.slice((safeHistPage - 1) * PER_PAGE, safeHistPage * PER_PAGE)

  // ── Stats ──
  const totalSent = sentNotifications.length
  const totalRecipients = sentNotifications.reduce((s, n) => s + n.nbDestinataires, 0)
  const totalDelivered = sentNotifications.reduce((s, n) => s + n.nbDelivres, 0)
  const totalFailed = sentNotifications.reduce((s, n) => s + n.nbEchoues, 0)
  const deliveryRate = totalRecipients > 0 ? ((totalDelivered / totalRecipients) * 100).toFixed(1) : "0.0"
  const urgentCount = sentNotifications.filter(n => n.priorite === "URGENT").length
  const failedCount = sentNotifications.filter(n => n.statut === "FAILED").length

  const hasActiveFilters = histTypeFilter !== "all" || histAudienceFilter !== "all" || histStatusFilter !== "all" || searchFilter !== ""

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950">
              <Bell className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Centre de Notifications</h1>
              <p className="text-muted-foreground text-sm">Créez et diffusez des notifications aux utilisateurs et agents RICASH</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-xs">
            <BarChart3 className="size-3.5" />
            Statistiques
          </Button>
          <Button size="sm" className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="size-3.5" />
            Nouvelle campagne
          </Button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard
          icon={Send}
          iconClass="text-emerald-600 dark:text-emerald-400"
          bgClass="bg-emerald-100 dark:bg-emerald-950"
          label="Campagnes envoyées"
          value={totalSent.toString()}
          subValue="Ce mois"
        />
        <StatCard
          icon={Users}
          iconClass="text-primary"
          bgClass="bg-primary/10"
          label="Total destinataires"
          value={formatNumber(totalRecipients)}
          subValue={`${formatNumber(totalDelivered)} délivrés`}
          subClass="text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={CheckCircle}
          iconClass="text-teal-600 dark:text-teal-400"
          bgClass="bg-teal-100 dark:bg-teal-950"
          label="Taux de délivrance"
          value={`${deliveryRate}%`}
          subValue={`${formatNumber(totalFailed)} échoués`}
          subClass="text-red-600 dark:text-red-400"
        />
        <StatCard
          icon={AlertOctagon}
          iconClass="text-red-600 dark:text-red-400"
          bgClass="bg-red-100 dark:bg-red-950"
          label="Campagnes urgentes"
          value={urgentCount.toString()}
          subValue={`${failedCount} échouées`}
          subClass="text-red-600 dark:text-red-400"
        />
        <StatCard
          icon={FileText}
          iconClass="text-purple-600 dark:text-purple-400"
          bgClass="bg-purple-100 dark:bg-purple-950"
          label="Modèles disponibles"
          value={notificationTemplates.length.toString()}
          subValue="Prêts à l'emploi"
        />
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex h-10">
          <TabsTrigger value="create" className="gap-1.5 text-xs sm:text-sm">
            <Send className="size-3.5 hidden sm:block" />
            Créer une notification
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs sm:text-sm">
            <Clock className="size-3.5 hidden sm:block" />
            Historique
            <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">{totalSent}</Badge>
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5 text-xs sm:text-sm">
            <FileText className="size-3.5 hidden sm:block" />
            Modèles
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: CRÉER UNE NOTIFICATION
        ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
            {/* ── Form (3 cols) ── */}
            <div className="xl:col-span-3 space-y-4">
              {/* Quick Template Selection */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="size-4 text-amber-500" />
                    <Label className="text-sm font-semibold">Démarrer depuis un modèle</Label>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {notificationTemplates.slice(0, 4).map((tpl) => {
                      const tcfg = typeConfig[tpl.categorie]
                      const TIcon = tcfg.icon
                      const isActive = selectedTemplate === tpl.id
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => applyTemplate(tpl.id)}
                          className={`flex items-center gap-2 p-2.5 rounded-lg border-2 text-left transition-all text-xs ${
                            isActive
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-700"
                              : "border-muted bg-background hover:border-muted-foreground/30"
                          }`}
                        >
                          <div className={`flex size-7 items-center justify-center rounded-md shrink-0 ${tcfg.bgClass}`}>
                            <TIcon className={`size-3.5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                          </div>
                          <span className="font-medium truncate">{tpl.nom}</span>
                        </button>
                      )
                    })}
                  </div>
                  <div className="mt-2">
                    <Select value={selectedTemplate} onValueChange={applyTemplate}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Plus de modèles..." /></SelectTrigger>
                      <SelectContent>
                        {notificationTemplates.map((tpl) => (
                          <SelectItem key={tpl.id} value={tpl.id}>
                            {tpl.nom} — {typeConfig[tpl.categorie]?.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Main Form */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="size-4 text-emerald-600" />
                    Composer la notification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Row 1: Type + Audience */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Type de notification</Label>
                      <Select value={formType} onValueChange={(v) => setFormType(v as NotificationType)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(typeConfig).map(([key, cfg]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2">
                                <cfg.icon className="size-3.5" />
                                {cfg.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Audience cible</Label>
                      <Select value={formAudience} onValueChange={(v) => setFormAudience(v as NotificationAudience)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {Object.entries(audienceConfig).map(([key, cfg]) => (
                            <SelectItem key={key} value={key}>
                              <span className="flex items-center gap-2">
                                <cfg.icon className="size-3.5" />
                                {cfg.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="size-3" />
                        {audienceConfig[formAudience]?.desc}
                      </p>
                    </div>
                  </div>

                  {/* Row 2: Channels */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Canaux de diffusion</Label>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(channelConfig).map(([key, cfg]) => {
                        const isChecked = formChannels.includes(key as NotificationChannel)
                        return (
                          <label key={key} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${
                            isChecked
                              ? "border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700"
                              : "border-muted bg-background hover:border-muted-foreground/30"
                          }`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleChannel(key as NotificationChannel)}
                              className="sr-only"
                            />
                            <div className={`flex size-8 items-center justify-center rounded-lg ${cfg.bgClass}`}>
                              <cfg.icon className={`size-4 ${cfg.iconClass}`} />
                            </div>
                            <div>
                              <span className="text-sm font-medium block">{cfg.label}</span>
                              <span className="text-[10px] text-muted-foreground">
                                {key === "SMS" ? "160 car. max" : key === "EMAIL" ? "HTML supporté" : "Temps réel"}
                              </span>
                            </div>
                            {isChecked && <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400 ml-auto" />}
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Row 3: Priority */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Niveau de priorité</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(priorityConfig).map(([key, cfg]) => {
                        const isActive = formPriority === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormPriority(key as NotificationPriority)}
                            className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-all ${
                              isActive ? cfg.className + " ring-2 ring-offset-1 ring-current" : "bg-background border-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className={`size-2 rounded-full ${cfg.dotClass}`} />
                            {cfg.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Separator />

                  {/* Row 4: Title */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Objet / Titre</Label>
                    <Input
                      placeholder="Ex: Maintenance planifiée — 15 Juin 2025"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="h-10"
                    />
                  </div>

                  {/* Row 5: Message */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Message</Label>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formMessage.length} car.
                      </span>
                    </div>
                    <Textarea
                      placeholder="Rédigez le contenu de votre notification..."
                      className="min-h-[140px] resize-y"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                    {formChannels.includes("SMS") && formMessage.length > 160 && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertTriangle className="size-3" />
                        SMS limité à 160 caractères — {Math.ceil(formMessage.length / 160)} SMS nécessaires
                      </p>
                    )}
                  </div>

                  {/* Row 6: Schedule */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Envoyer maintenant</p>
                        <p className="text-xs text-muted-foreground">Désactivez pour planifier l&apos;envoi</p>
                      </div>
                    </div>
                    <Switch checked={formScheduleNow} onCheckedChange={setFormScheduleNow} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── Preview Panel (2 cols) ── */}
            <div className="xl:col-span-2 space-y-4">
              {/* Live Preview */}
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="size-4" />
                    Aperçu en direct
                  </CardTitle>
                  <CardDescription>Visualisation avant envoi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Phone mockup for SMS */}
                  {formChannels.includes("SMS") && (
                    <div className="mx-auto max-w-[280px] rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3 shadow-lg">
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span className="text-[10px] text-muted-foreground">09:41</span>
                        <div className="flex gap-1">
                          <Smartphone className="size-3 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="rounded-xl bg-white dark:bg-gray-800 p-3 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex size-6 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                            <div className="size-2 rounded-full bg-emerald-500" />
                          </div>
                          <span className="text-xs font-semibold">RICASH</span>
                        </div>
                        <p className="text-xs font-medium mb-1">{formTitle || "Objet de la notification"}</p>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{formMessage || "Votre message apparaîtra ici..."}</p>
                      </div>
                    </div>
                  )}

                  {/* Email mockup */}
                  {formChannels.includes("EMAIL") && (
                    <div className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
                      <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 border-b flex items-center gap-2">
                        <Mail className="size-3.5 text-muted-foreground" />
                        <div>
                          <p className="text-[10px] text-muted-foreground">De : notifications@ricash.com</p>
                          <p className="text-xs font-medium">{formTitle || "Objet de l'email"}</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs leading-relaxed text-muted-foreground">{formMessage || "Contenu de l'email..."}</p>
                      </div>
                    </div>
                  )}

                  {/* Push mockup */}
                  {formChannels.includes("PUSH") && (
                    <div className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden shadow-sm max-w-[320px] mx-auto">
                      <div className="flex items-start gap-2 p-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950 shrink-0">
                          <Bell className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold">RICASH</p>
                          <p className="text-[11px] font-medium truncate">{formTitle || "Titre push"}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-2">{formMessage || "Message push..."}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Metadata */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <TypeBadge type={formType} />
                      <PriorityBadge priority={formPriority} />
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground w-16 shrink-0">Canaux</p>
                      <div className="flex gap-1.5">
                        {formChannels.length === 0 ? (
                          <span className="text-xs text-muted-foreground italic">Aucun</span>
                        ) : (
                          formChannels.map((ch) => <ChannelIcon key={ch} channel={ch} size="md" />)
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground w-16 shrink-0">Audience</p>
                      <div className="flex items-center gap-1.5">
                        {(() => {
                          const acfg = audienceConfig[formAudience]
                          const AIcon = acfg.icon
                          return (
                            <>
                              <div className="flex size-6 items-center justify-center rounded-md bg-primary/10">
                                <AIcon className="size-3 text-primary" />
                              </div>
                              <span className="text-xs font-medium">{acfg.label}</span>
                              {acfg.count !== "—" && (
                                <Badge variant="secondary" className="text-[10px] px-1.5">{acfg.count}</Badge>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground w-16 shrink-0">Envoi</p>
                      <span className="text-xs font-medium flex items-center gap-1">
                        {formScheduleNow ? (
                          <><Radio className="size-3 text-emerald-600" /> Immédiat</>
                        ) : (
                          <><CalendarDays className="size-3 text-amber-600" /> Planifié</>
                        )}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <Button
                      className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white h-10"
                      disabled={!formTitle || !formMessage || formChannels.length === 0}
                    >
                      <Send className="size-4" />
                      {formScheduleNow ? "Envoyer maintenant" : "Planifier l'envoi"}
                    </Button>
                    {(!formTitle || !formMessage || formChannels.length === 0) && (
                      <p className="text-xs text-center text-muted-foreground">
                        Complétez l&apos;objet, le message et sélectionnez au moins un canal
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 gap-1.5 text-xs h-8" onClick={resetForm}>
                        <RefreshCw className="size-3" />
                        Réinitialiser
                      </Button>
                      <Button variant="outline" className="flex-1 gap-1.5 text-xs h-8">
                        <Copy className="size-3" />
                        Brouillon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: HISTORIQUE
        ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="history" className="space-y-4">
          {/* Detail panel - when a notification is selected */}
          {selectedNotif && (
            <Card className="border-emerald-200 dark:border-emerald-800 overflow-hidden">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const tcfg = typeConfig[selectedNotif.type]
                      const TIcon = tcfg.icon
                      return (
                        <div className={`flex size-8 items-center justify-center rounded-lg ${tcfg.bgClass}`}>
                          <TIcon className="size-4" />
                        </div>
                      )
                    })()}
                    <div>
                      <h3 className="font-semibold text-sm">{selectedNotif.titre}</h3>
                      <p className="text-xs text-muted-foreground">Envoyé le {selectedNotif.dateEnvoi} par {selectedNotif.envoyePar}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedNotif(null)} className="text-xs">Fermer</Button>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-0.5">Destinataires</p>
                    <p className="text-lg font-bold tabular-nums">{formatNumber(selectedNotif.nbDestinataires)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-0.5">Délivrés</p>
                    <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{formatNumber(selectedNotif.nbDelivres)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-0.5">Échoués</p>
                    <p className="text-lg font-bold tabular-nums text-red-700 dark:text-red-400">{formatNumber(selectedNotif.nbEchoues)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/50 border">
                    <p className="text-xs text-muted-foreground mb-0.5">Taux délivrance</p>
                    <p className="text-lg font-bold tabular-nums">{((selectedNotif.nbDelivres / selectedNotif.nbDestinataires) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                {/* Progress bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>Délivrance</span>
                    <span>{((selectedNotif.nbDelivres / selectedNotif.nbDestinataires) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(selectedNotif.nbDelivres / selectedNotif.nbDestinataires) * 100} className="h-2" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={selectedNotif.type} />
                  <PriorityBadge priority={selectedNotif.priorite} />
                  <SentStatusBadge statut={selectedNotif.statut} />
                  {selectedNotif.canaux.map((ch) => <ChannelIcon key={ch} channel={ch} size="md" />)}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Audience</p>
                  <p className="text-sm font-medium">{selectedNotif.audienceDetail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <div className="rounded-xl bg-muted/50 border p-3">
                    <p className="text-sm leading-relaxed">{selectedNotif.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1 w-full sm:max-w-[200px]">
                  <Search className="text-muted-foreground absolute left-2.5 top-2.5 size-3.5" />
                  <Input
                    placeholder="Rechercher..."
                    className="h-8 pl-8 text-xs"
                    value={searchFilter}
                    onChange={(e) => { setSearchFilter(e.target.value); setHistPage(1) }}
                  />
                </div>
                <Select value={histTypeFilter} onValueChange={(v) => { setHistTypeFilter(v); setHistPage(1) }}>
                  <SelectTrigger className="h-8 text-xs w-full sm:w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    {Object.entries(typeConfig).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={histAudienceFilter} onValueChange={(v) => { setHistAudienceFilter(v); setHistPage(1) }}>
                  <SelectTrigger className="h-8 text-xs w-full sm:w-[170px]"><SelectValue placeholder="Audience" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes audiences</SelectItem>
                    {Object.entries(audienceConfig).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.shortLabel}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={histStatusFilter} onValueChange={(v) => { setHistStatusFilter(v); setHistPage(1) }}>
                  <SelectTrigger className="h-8 text-xs w-full sm:w-[140px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    {Object.entries(sentStatusConfig).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 text-muted-foreground shrink-0" onClick={() => { setHistTypeFilter("all"); setHistAudienceFilter("all"); setHistStatusFilter("all"); setSearchFilter(""); setHistPage(1) }}>
                        <FilterX className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Réinitialiser les filtres</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Notifications envoyées</CardTitle>
                  <CardDescription>{filteredHistory.length} campagne{filteredHistory.length !== 1 ? "s" : ""}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[250px]">Campagne</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Canaux</TableHead>
                      <TableHead className="hidden sm:table-cell">Audience</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead className="hidden lg:table-cell">Délivrance</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden xl:table-cell">Date</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Bell className="size-8 opacity-40" />
                            <p className="text-sm">Aucune campagne trouvée</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedHistory.map((sn) => {
                        const deliveryPct = (sn.nbDelivres / sn.nbDestinataires) * 100
                        return (
                          <TableRow
                            key={sn.id}
                            className={`cursor-pointer transition-colors ${selectedNotif?.id === sn.id ? "bg-emerald-50/50 dark:bg-emerald-950/20" : "hover:bg-muted/30"}`}
                            onClick={() => setSelectedNotif(selectedNotif?.id === sn.id ? null : sn)}
                          >
                            <TableCell>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate max-w-[220px]">{sn.titre}</p>
                                <p className="text-xs text-muted-foreground">par {sn.envoyePar}</p>
                              </div>
                            </TableCell>
                            <TableCell><TypeBadge type={sn.type} /></TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex gap-1">
                                {sn.canaux.map((ch) => <ChannelIcon key={ch} channel={ch} />)}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <span className="text-xs font-medium">{audienceConfig[sn.audience]?.shortLabel}</span>
                            </TableCell>
                            <TableCell><PriorityBadge priority={sn.priorite} /></TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="space-y-1 min-w-[100px]">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="tabular-nums font-medium">{deliveryPct.toFixed(0)}%</span>
                                  <span className="text-muted-foreground">{formatNumber(sn.nbDelivres)}/{formatNumber(sn.nbDestinataires)}</span>
                                </div>
                                <Progress value={deliveryPct} className="h-1.5" />
                              </div>
                            </TableCell>
                            <TableCell><SentStatusBadge statut={sn.statut} /></TableCell>
                            <TableCell className="hidden xl:table-cell text-xs text-muted-foreground">{sn.dateEnvoi}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="icon" className="size-7">
                                    <MoreHorizontal className="size-3.5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedNotif(sn) }}>
                                    <Eye className="mr-2 size-3.5" /> Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                    <Copy className="mr-2 size-3.5" /> Dupliquer
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                                    <Trash2 className="mr-2 size-3.5" /> Supprimer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
              {filteredHistory.length > PER_PAGE && (
                <PaginationControls
                  currentPage={safeHistPage}
                  totalPages={histTotalPages}
                  onPageChange={setHistPage}
                  totalItems={filteredHistory.length}
                  startIndex={(safeHistPage - 1) * PER_PAGE}
                  endIndex={Math.min(safeHistPage * PER_PAGE, filteredHistory.length)}
                  itemLabel="campagnes"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════════════════════
            TAB: MODÈLES
        ═══════════════════════════════════════════════════════════════════ */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {notificationTemplates.map((tpl) => {
              const tcfg = typeConfig[tpl.categorie]
              const TIcon = tcfg.icon
              return (
                <Card key={tpl.id} className="hover:shadow-md transition-shadow group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`flex size-9 items-center justify-center rounded-xl ${tcfg.bgClass}`}>
                          <TIcon className="size-4" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{tpl.nom}</CardTitle>
                          <CardDescription className="text-xs">{tcfg.label}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Objet</p>
                      <p className="text-sm font-medium">{tpl.objet}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Contenu</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">{tpl.contenu}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-muted-foreground">Canaux :</p>
                      {tpl.canauxSuggere.map((ch) => <ChannelIcon key={ch} channel={ch} />)}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-muted-foreground">Audience :</p>
                      <span className="text-xs font-medium">{audienceConfig[tpl.audienceSuggere]?.shortLabel}</span>
                    </div>
                    {tpl.variableSlots.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs text-muted-foreground">Variables :</p>
                        {tpl.variableSlots.map((v) => (
                          <Badge key={v} variant="outline" className="text-[10px] px-1.5 py-0 font-mono">
                            {`{{${v}}}`}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <Separator />
                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => applyTemplate(tpl.id)}
                      >
                        <Send className="size-3" />
                        Utiliser
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Eye className="size-3" />
                        Aperçu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
