'use client'

import { useState, useMemo } from "react"
import {
  Bell, Send, CheckCircle, XCircle, Clock, AlertTriangle,
  Smartphone, Mail, BellRing, Shield, FileCheck, Settings,
  Users, UserCheck, UserX, Eye, ChevronLeft, ChevronRight,
  Download, FilterX, Megaphone, FileText, Sparkles, AlertOctagon,
  Info, Copy, Zap, Wrench, ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
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
const typeConfig: Record<NotificationType, { label: string; className: string; icon: React.ElementType }> = {
  OTP: { label: "OTP", className: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800", icon: Clock },
  TRANSACTION: { label: "Transaction", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800", icon: Send },
  SECURITY: { label: "Sécurité", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800", icon: Shield },
  KYC: { label: "KYC", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800", icon: FileCheck },
  SYSTEM: { label: "Système", className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", icon: Settings },
  PROMOTION: { label: "Promotion", className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800", icon: Sparkles },
  MAINTENANCE: { label: "Maintenance", className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800", icon: Wrench },
}

const channelConfig: Record<NotificationChannel, { label: string; icon: React.ElementType; bgClass: string; iconClass: string }> = {
  SMS: { label: "SMS", icon: Smartphone, bgClass: "bg-teal-100 dark:bg-teal-950", iconClass: "text-teal-600 dark:text-teal-400" },
  EMAIL: { label: "Email", icon: Mail, bgClass: "bg-amber-100 dark:bg-amber-950", iconClass: "text-amber-600 dark:text-amber-400" },
  PUSH: { label: "Push", icon: BellRing, bgClass: "bg-purple-100 dark:bg-purple-950", iconClass: "text-purple-600 dark:text-purple-400" },
}

const audienceConfig: Record<NotificationAudience, { label: string; icon: React.ElementType; desc: string }> = {
  ALL_USERS: { label: "Tous les utilisateurs", icon: Users, desc: "Envoi à tous les comptes utilisateurs actifs" },
  ALL_AGENTS: { label: "Tous les agents", icon: UserCheck, desc: "Envoi à tous les agents opérationnels" },
  ALL: { label: "Tout le monde", icon: Megaphone, desc: "Utilisateurs + Agents" },
  SPECIFIC_USERS: { label: "Utilisateurs spécifiques", icon: Users, desc: "Sélectionner des utilisateurs individuels" },
  SPECIFIC_AGENTS: { label: "Agents spécifiques", icon: UserCheck, desc: "Sélectionner des agents individuels" },
}

const priorityConfig: Record<NotificationPriority, { label: string; className: string; icon: React.ElementType }> = {
  NORMAL: { label: "Normale", className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700", icon: Info },
  HIGH: { label: "Haute", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800", icon: AlertTriangle },
  URGENT: { label: "Urgente", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800", icon: AlertOctagon },
}

const sentStatusConfig: Record<SentNotification["statut"], { label: string; className: string; icon: React.ElementType }> = {
  DELIVERED: { label: "Délivré", className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800", icon: CheckCircle },
  SENT: { label: "Envoyé", className: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800", icon: Send },
  PARTIAL: { label: "Partiel", className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800", icon: AlertTriangle },
  FAILED: { label: "Échoué", className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800", icon: XCircle },
}

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

// ─── Pagination Sub-component ─────────────────────────────────────────────────
const PER_PAGE = 6

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function NotificationsPage() {
  // Creation form state
  const [formType, setFormType] = useState<NotificationType>("SYSTEM")
  const [formAudience, setFormAudience] = useState<NotificationAudience>("ALL_USERS")
  const [formChannels, setFormChannels] = useState<NotificationChannel[]>(["SMS"])
  const [formPriority, setFormPriority] = useState<NotificationPriority>("NORMAL")
  const [formTitle, setFormTitle] = useState("")
  const [formMessage, setFormMessage] = useState("")
  const [formScheduleNow, setFormScheduleNow] = useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")

  // History pagination & filters
  const [histPage, setHistPage] = useState(1)
  const [histTypeFilter, setHistTypeFilter] = useState<string>("all")
  const [histAudienceFilter, setHistAudienceFilter] = useState<string>("all")

  // Preview dialog
  const [previewNotif, setPreviewNotif] = useState<SentNotification | null>(null)

  // Toggle channel checkbox
  const toggleChannel = (ch: NotificationChannel) => {
    setFormChannels((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch])
  }

  // Apply template
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

  // Filtered history
  const filteredHistory = useMemo(() => {
    return sentNotifications.filter((sn) => {
      if (histTypeFilter !== "all" && sn.type !== histTypeFilter) return false
      if (histAudienceFilter !== "all" && sn.audience !== histAudienceFilter) return false
      return true
    })
  }, [histTypeFilter, histAudienceFilter])

  const histTotalPages = Math.max(1, Math.ceil(filteredHistory.length / PER_PAGE))
  const safeHistPage = Math.min(histPage, histTotalPages)
  const paginatedHistory = filteredHistory.slice((safeHistPage - 1) * PER_PAGE, safeHistPage * PER_PAGE)

  // Stats
  const totalSent = sentNotifications.length
  const totalRecipients = sentNotifications.reduce((s, n) => s + n.nbDestinataires, 0)
  const totalDelivered = sentNotifications.reduce((s, n) => s + n.nbDelivres, 0)
  const deliveryRate = totalRecipients > 0 ? ((totalDelivered / totalRecipients) * 100).toFixed(1) : "0.0"

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Centre de Notifications</h1>
          <p className="text-muted-foreground mt-1">Créez et envoyez des notifications aux utilisateurs et agents de la plateforme RICASH</p>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 shrink-0">
              <Send className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Campagnes envoyées</p>
              <p className="text-xl font-bold">{totalSent}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
              <Users className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total destinataires</p>
              <p className="text-xl font-bold">{formatNumber(totalRecipients)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950 shrink-0">
              <CheckCircle className="size-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Taux de délivrance</p>
              <p className="text-xl font-bold">{deliveryRate}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-950 shrink-0">
              <FileText className="size-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Modèles disponibles</p>
              <p className="text-xl font-bold">{notificationTemplates.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="create" className="gap-1.5 text-xs sm:text-sm">
            <Send className="size-3.5 hidden sm:block" />
            Créer
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1.5 text-xs sm:text-sm">
            <Clock className="size-3.5 hidden sm:block" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="templates" className="gap-1.5 text-xs sm:text-sm">
            <FileText className="size-3.5 hidden sm:block" />
            Modèles
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Créer ────────────────────────────────────────────────────── */}
        <TabsContent value="create" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Quick Template Selection */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="size-4 text-amber-500" />
                    Démarrer depuis un modèle
                  </CardTitle>
                  <CardDescription>Choisissez un modèle pré-configuré pour accélérer la création</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedTemplate} onValueChange={applyTemplate}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner un modèle..." /></SelectTrigger>
                    <SelectContent>
                      {notificationTemplates.map((tpl) => (
                        <SelectItem key={tpl.id} value={tpl.id}>
                          {tpl.nom} — {typeConfig[tpl.categorie]?.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Main Form */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Composer la notification</CardTitle>
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
                      <p className="text-xs text-muted-foreground">{audienceConfig[formAudience]?.desc}</p>
                    </div>
                  </div>

                  {/* Row 2: Channels */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Canaux de diffusion</Label>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(channelConfig).map(([key, cfg]) => {
                        const isChecked = formChannels.includes(key as NotificationChannel)
                        return (
                          <label key={key} className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 cursor-pointer transition-all ${
                            isChecked
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 dark:border-emerald-700"
                              : "border-muted bg-background hover:border-muted-foreground/30"
                          }`}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleChannel(key as NotificationChannel)}
                              className="sr-only"
                            />
                            <div className={`flex size-7 items-center justify-center rounded-md ${cfg.bgClass}`}>
                              <cfg.icon className={`size-3.5 ${cfg.iconClass}`} />
                            </div>
                            <span className="text-sm font-medium">{cfg.label}</span>
                            {isChecked && <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />}
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Row 3: Priority */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Priorité</Label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(priorityConfig).map(([key, cfg]) => {
                        const isActive = formPriority === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setFormPriority(key as NotificationPriority)}
                            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
                              isActive ? cfg.className + " ring-2 ring-offset-1 ring-current" : "bg-background border-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <cfg.icon className="size-3" />
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
                      placeholder="Ex: Maintenance planifiée — 15 Juin"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>

                  {/* Row 5: Message */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Message</Label>
                    <Textarea
                      placeholder="Rédigez le contenu de votre notification..."
                      className="min-h-[120px] resize-y"
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formMessage.length} caractère{formMessage.length !== 1 ? "s" : ""}
                      {formChannels.includes("SMS") && formMessage.length > 160 && (
                        <span className="text-amber-600 dark:text-amber-400 ml-2">⚠️ SMS limité à 160 caractères</span>
                      )}
                    </p>
                  </div>

                  {/* Row 6: Schedule */}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-muted-foreground" />
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

            {/* Preview Panel */}
            <div className="space-y-4">
              <Card className="sticky top-4">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="size-4" />
                    Aperçu
                  </CardTitle>
                  <CardDescription>Visualisation avant envoi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview Type + Priority */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <TypeBadge type={formType} />
                    <PriorityBadge priority={formPriority} />
                  </div>

                  {/* Preview Title */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Objet</p>
                    <p className="text-sm font-semibold">{formTitle || "—"}</p>
                  </div>

                  {/* Preview Channels */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Canaux</p>
                    <div className="flex gap-2">
                      {formChannels.length === 0 ? (
                        <span className="text-xs text-muted-foreground italic">Aucun canal sélectionné</span>
                      ) : (
                        formChannels.map((ch) => {
                          const cfg = channelConfig[ch]
                          return (
                            <div key={ch} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${cfg.bgClass} ${cfg.iconClass}`}>
                              <cfg.icon className="size-3" />
                              {cfg.label}
                            </div>
                          )
                        })
                      )}
                    </div>
                  </div>

                  {/* Preview Audience */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Audience</p>
                    <div className="flex items-center gap-2">
                      {(() => {
                        const acfg = audienceConfig[formAudience]
                        const AIcon = acfg.icon
                        return (
                          <>
                            <div className="flex size-7 items-center justify-center rounded-md bg-primary/10">
                              <AIcon className="size-3.5 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{acfg.label}</span>
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  <Separator />

                  {/* Preview Message */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Message</p>
                    <div className="rounded-lg bg-muted/50 border p-3">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{formMessage || "Aucun message saisi"}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Send button */}
                  <Button
                    className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
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
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab: Historique ───────────────────────────────────────────────── */}
        <TabsContent value="history" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex-1">
                  <Select value={histTypeFilter} onValueChange={(v) => { setHistTypeFilter(v); setHistPage(1) }}>
                    <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.entries(typeConfig).map(([key, cfg]) => (
                        <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Select value={histAudienceFilter} onValueChange={(v) => { setHistAudienceFilter(v); setHistPage(1) }}>
                  <SelectTrigger className="w-full sm:w-[200px]"><SelectValue placeholder="Audience" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les audiences</SelectItem>
                    {Object.entries(audienceConfig).map(([key, cfg]) => (
                      <SelectItem key={key} value={key}>{cfg.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {(histTypeFilter !== "all" || histAudienceFilter !== "all") && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => { setHistTypeFilter("all"); setHistAudienceFilter("all"); setHistPage(1) }}>
                        <FilterX className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Réinitialiser</TooltipContent>
                  </Tooltip>
                )}
              </div>
            </CardContent>
          </Card>

          {/* History Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Notifications envoyées</CardTitle>
              <CardDescription>{filteredHistory.length} campagne{filteredHistory.length !== 1 ? "s" : ""} envoyée{filteredHistory.length !== 1 ? "s" : ""}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>Titre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden md:table-cell">Canaux</TableHead>
                      <TableHead className="hidden sm:table-cell">Audience</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead className="hidden lg:table-cell">Destinataires</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Bell className="size-8 opacity-40" />
                            <p className="text-sm">Aucune campagne trouvée</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedHistory.map((sn) => (
                        <TableRow key={sn.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => setPreviewNotif(sn)}>
                          <TableCell>
                            <div className="min-w-0">
                              <p className="font-medium text-sm truncate max-w-[200px]">{sn.titre}</p>
                              <p className="text-xs text-muted-foreground">par {sn.envoyePar}</p>
                            </div>
                          </TableCell>
                          <TableCell><TypeBadge type={sn.type} /></TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex gap-1">
                              {sn.canaux.map((ch) => {
                                const cfg = channelConfig[ch]
                                return (
                                  <div key={ch} className={`flex size-6 items-center justify-center rounded ${cfg.bgClass}`}>
                                    <cfg.icon className={`size-3 ${cfg.iconClass}`} />
                                  </div>
                                )
                              })}
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="text-xs font-medium">{audienceConfig[sn.audience]?.label}</span>
                          </TableCell>
                          <TableCell><PriorityBadge priority={sn.priorite} /></TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="text-sm">
                              <span className="font-medium tabular-nums">{formatNumber(sn.nbDestinataires)}</span>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({((sn.nbDelivres / sn.nbDestinataires) * 100).toFixed(0)}% délivrés)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell><SentStatusBadge statut={sn.statut} /></TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{sn.dateEnvoi}</TableCell>
                        </TableRow>
                      ))
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

          {/* Preview panel for selected history item */}
          {previewNotif && (
            <Card className="border-emerald-200 bg-emerald-50/30 dark:border-emerald-800 dark:bg-emerald-950/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Eye className="size-4 text-emerald-600" />
                    {previewNotif.titre}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setPreviewNotif(null)}>Fermer</Button>
                </div>
                <CardDescription>Envoyé le {previewNotif.dateEnvoi} par {previewNotif.envoyePar}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">Destinataires</p>
                    <p className="text-lg font-bold tabular-nums">{formatNumber(previewNotif.nbDestinataires)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">Délivrés</p>
                    <p className="text-lg font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{formatNumber(previewNotif.nbDelivres)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">Échoués</p>
                    <p className="text-lg font-bold tabular-nums text-red-700 dark:text-red-400">{formatNumber(previewNotif.nbEchoues)}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">Taux délivrance</p>
                    <p className="text-lg font-bold tabular-nums">{((previewNotif.nbDelivres / previewNotif.nbDestinataires) * 100).toFixed(1)}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <TypeBadge type={previewNotif.type} />
                  <PriorityBadge priority={previewNotif.priorite} />
                  <SentStatusBadge statut={previewNotif.statut} />
                  {previewNotif.canaux.map((ch) => {
                    const cfg = channelConfig[ch]
                    return (
                      <span key={ch} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${cfg.bgClass} ${cfg.iconClass}`}>
                        <cfg.icon className="size-3" />{cfg.label}
                      </span>
                    )
                  })}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Audience</p>
                  <p className="text-sm font-medium">{previewNotif.audienceDetail}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <div className="rounded-lg bg-background border p-3">
                    <p className="text-sm leading-relaxed">{previewNotif.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab: Modèles ──────────────────────────────────────────────────── */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notificationTemplates.map((tpl) => {
              const tcfg = typeConfig[tpl.categorie]
              const TIcon = tcfg.icon
              return (
                <Card key={tpl.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`flex size-8 items-center justify-center rounded-lg ${tcfg.className}`}>
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
                      {tpl.canauxSuggere.map((ch) => {
                        const cfg = channelConfig[ch]
                        return (
                          <span key={ch} className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${cfg.bgClass} ${cfg.iconClass}`}>
                            <cfg.icon className="size-2.5" />{cfg.label}
                          </span>
                        )
                      })}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Variables</p>
                      <div className="flex flex-wrap gap-1">
                        {tpl.variableSlots.map((slot) => (
                          <Badge key={slot} variant="outline" className="text-xs font-mono">
                            {`{{${slot}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-2 mt-2"
                      onClick={() => applyTemplate(tpl.id)}
                    >
                      <ArrowRight className="size-3.5" />
                      Utiliser ce modèle
                    </Button>
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
