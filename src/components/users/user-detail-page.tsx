'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft, Pencil, Trash2, Mail, Phone, MapPin, ShieldCheck, ShieldOff,
  Calendar, Wallet, FileText, Clock, Download, Eye, CheckCircle2, XCircle,
  AlertTriangle, User, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, QrCode,
  Lock, Settings, Activity, Ban, ChevronLeft, ChevronRight,
} from "lucide-react"
import { useState, useMemo } from "react"
import {
  users, transactions, kycDocuments, userActivities, kycRequests,
  type User as UserType, type UserStatus, type KYCLevel,
  type KYCDocStatus, type TransactionType, type TransactionStatus,
} from "@/lib/mock-data"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatXOF(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " XOF"
}

function formatDateFR(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
  }).format(date)
}

function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit", month: "long", year: "numeric",
  }).format(date)
}

function getInitials(nom: string, prenom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

// ─── Badge configs ────────────────────────────────────────────────────────────
const statusLabelMap: Record<UserStatus, string> = {
  ACTIVE: "Actif", INACTIVE: "Inactif", SUSPENDED: "Suspendu",
}
const statusBadgeClass: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  INACTIVE: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
}
const statusDotClass: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-500", INACTIVE: "bg-gray-400", SUSPENDED: "bg-red-500",
}
const kycBadgeClass: Record<KYCLevel, string> = {
  "Tier 0": "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  "Tier 1": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  "Tier 2": "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
  "Tier 3": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
}

const docStatusLabel: Record<KYCDocStatus, string> = {
  VERIFIED: "Vérifié", PENDING: "En attente", REJECTED: "Rejeté", EXPIRED: "Expiré",
}
const docStatusClass: Record<KYCDocStatus, string> = {
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  REJECTED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  EXPIRED: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
}

const txStatusLabel: Record<TransactionStatus, string> = {
  COMPLETED: "Complété", PENDING: "En attente", FAILED: "Échoué", CANCELLED: "Annulé",
}
const txStatusClass: Record<TransactionStatus, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
}

const txTypeIcon: Record<TransactionType, React.ElementType> = {
  DEPOT: ArrowDownLeft, RETRAIT: ArrowUpRight, TRANSFERT: ArrowLeftRight, PAIEMENT: QrCode,
}
const txTypeLabel: Record<TransactionType, string> = {
  DEPOT: "Dépôt", RETRAIT: "Retrait", TRANSFERT: "Transfert", PAIEMENT: "Paiement",
}
const txTypeColor: Record<TransactionType, string> = {
  DEPOT: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  RETRAIT: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950",
  TRANSFERT: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  PAIEMENT: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
}

const activityCatIcon: Record<string, React.ElementType> = {
  AUTH: User, TRANSACTION: Wallet, KYC: FileText, SECURITY: Lock, PROFILE: Settings, SYSTEM: Activity,
}
const activityCatColor: Record<string, string> = {
  AUTH: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950",
  TRANSACTION: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  KYC: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950",
  SECURITY: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950",
  PROFILE: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
  SYSTEM: "text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-800",
}

// ─── Component ────────────────────────────────────────────────────────────────

const TX_PER_PAGE = 5
const HISTORY_PER_PAGE = 5

// ─── Pagination Sub-component ─────────────────────────────────────────────────
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
      <p className="text-sm text-muted-foreground">
        {startIndex + 1}–{endIndex} sur {totalItems} {itemLabel}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon" className="size-8" disabled={currentPage <= 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="size-4" /><span className="sr-only">Précédent</span>
        </Button>
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
          ) : (
            <Button key={page} variant={page === currentPage ? "default" : "outline"} size="icon" className={`size-8 ${page === currentPage ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`} onClick={() => onPageChange(page)}>
              {page}
            </Button>
          )
        )}
        <Button variant="outline" size="icon" className="size-8" disabled={currentPage >= totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="size-4" /><span className="sr-only">Suivant</span>
        </Button>
      </div>
    </div>
  )
}

export function UserDetailPage({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [txPage, setTxPage] = useState(1)
  const [historyPage, setHistoryPage] = useState(1)

  const user = users.find((u) => u.id === userId)

  // User-specific data
  const userTransactions = useMemo(() => {
    if (!user) return []
    const fullName = `${user.prenom} ${user.nom}`
    // Deduplicate by id since some transactions reference the same user from both sides
    const seen = new Set<string>()
    return transactions.filter((t) => {
      if (seen.has(t.id)) return false
      const match = t.expediteur.includes(fullName) || t.destinataire.includes(fullName) || t.expediteur === user.id || t.destinataire === user.id
      if (match) { seen.add(t.id); return true }
      return false
    })
  }, [user])

  const userDocs = useMemo(() => {
    return kycDocuments.filter((d) => d.userId === userId)
  }, [userId])

  const userHistory = useMemo(() => {
    return userActivities.filter((a) => a.userId === userId)
  }, [userId])

  const userKycRequests = useMemo(() => {
    return kycRequests.filter((k) => k.userId === userId)
  }, [userId])

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
        <User className="size-12 opacity-40" />
        <p className="text-lg font-medium">Utilisateur introuvable</p>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  // Stats
  const totalSent = userTransactions.filter((t) => t.expediteur.includes(`${user.prenom} ${user.nom}`) && t.statut === "COMPLETED").reduce((s, t) => s + t.montant, 0)
  const totalReceived = userTransactions.filter((t) => t.destinataire.includes(`${user.prenom} ${user.nom}`) && t.statut === "COMPLETED").reduce((s, t) => s + t.montant, 0)

  return (
    <div className="space-y-6">
      {/* ── Back button + Header ────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="shrink-0" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 border-2 border-emerald-200 dark:border-emerald-800">
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-base font-bold dark:bg-emerald-950 dark:text-emerald-300">
                {getInitials(user.nom, user.prenom)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight truncate">
                {user.prenom} {user.nom}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-muted-foreground font-mono">{user.id}</span>
                <Badge variant="outline" className={`gap-1 font-medium text-xs ${statusBadgeClass[user.statut]}`}>
                  <span className={`size-1.5 rounded-full ${statusDotClass[user.statut]}`} />
                  {statusLabelMap[user.statut]}
                </Badge>
                <Badge variant="outline" className={`gap-1 font-medium text-xs ${kycBadgeClass[user.kycLevel]}`}>
                  {user.kycLevel}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="size-3.5" />
                Modifier
              </Button>
            </TooltipTrigger>
            <TooltipContent>Modifier les informations</TooltipContent>
          </Tooltip>
          {user.statut === "SUSPENDED" ? (
            <Button size="sm" className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setSuspendDialogOpen(true)}>
              <ShieldCheck className="size-3.5" />
              Réactiver
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="gap-2 text-amber-600 border-amber-200 hover:bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:hover:bg-amber-950" onClick={() => setSuspendDialogOpen(true)}>
              <Ban className="size-3.5" />
              Suspendre
            </Button>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="size-3.5" />
                Supprimer
              </Button>
            </TooltipTrigger>
            <TooltipContent>Supprimer définitivement</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* ── Quick Stats Row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 shrink-0">
              <Wallet className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Solde actuel</p>
              <p className="text-base font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{formatXOF(user.solde)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950 shrink-0">
              <ArrowDownLeft className="size-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total reçu</p>
              <p className="text-base font-bold tabular-nums">{formatXOF(totalReceived)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950 shrink-0">
              <ArrowUpRight className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total envoyé</p>
              <p className="text-base font-bold tabular-nums">{formatXOF(totalSent)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 shrink-0">
              <FileText className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Documents KYC</p>
              <p className="text-base font-bold">{userDocs.length} document{userDocs.length !== 1 ? "s" : ""}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="informations" className="space-y-4">
        <TabsList className="w-full sm:w-auto grid grid-cols-4 sm:inline-flex">
          <TabsTrigger value="informations" className="gap-1.5 text-xs sm:text-sm">
            <User className="size-3.5 hidden sm:block" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-1.5 text-xs sm:text-sm">
            <ArrowLeftRight className="size-3.5 hidden sm:block" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-1.5 text-xs sm:text-sm">
            <FileText className="size-3.5 hidden sm:block" />
            Documents KYC
          </TabsTrigger>
          <TabsTrigger value="historiques" className="gap-1.5 text-xs sm:text-sm">
            <Clock className="size-3.5 hidden sm:block" />
            Historiques
          </TabsTrigger>
        </TabsList>

        {/* ── Tab: Informations ──────────────────────────────────────────────── */}
        <TabsContent value="informations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Phone className="size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium">{user.telephone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <MapPin className="size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Pays</p>
                    <p className="text-sm font-medium">{user.pays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Informations du compte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-muted-foreground" />
                    <span className="text-sm">Statut</span>
                  </div>
                  <Badge variant="outline" className={`gap-1.5 font-medium ${statusBadgeClass[user.statut]}`}>
                    <span className={`size-1.5 rounded-full ${statusDotClass[user.statut]}`} />
                    {statusLabelMap[user.statut]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-4 text-muted-foreground" />
                    <span className="text-sm">Niveau KYC</span>
                  </div>
                  <Badge variant="outline" className={`gap-1 font-medium ${kycBadgeClass[user.kycLevel]}`}>{user.kycLevel}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Wallet className="size-4 text-muted-foreground" />
                    <span className="text-sm">Solde</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatXOF(user.solde)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <span className="text-sm">Inscription</span>
                  </div>
                  <span className="text-sm font-medium">{formatDateFull(user.dateInscription)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" />
                    <span className="text-sm">Dernière activité</span>
                  </div>
                  <span className="text-sm font-medium">{formatDateFull(user.derniereActivite)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KYC Requests for this user */}
          {userKycRequests.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Demandes KYC</CardTitle>
                <CardDescription>Historique des demandes de vérification</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>ID</TableHead>
                      <TableHead>Niveau demandé</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Score de risque</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userKycRequests.map((req) => {
                      const reqStatusClass: Record<string, string> = {
                        PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
                        IN_REVIEW: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
                        APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
                        REJECTED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
                      }
                      const reqStatusLabel: Record<string, string> = {
                        PENDING: "En attente", IN_REVIEW: "En cours", APPROVED: "Approuvé", REJECTED: "Rejeté",
                      }
                      return (
                        <TableRow key={req.id}>
                          <TableCell className="font-mono text-xs">{req.id}</TableCell>
                          <TableCell>{req.currentLevel} → {req.requestedLevel}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={reqStatusClass[req.status]}>{reqStatusLabel[req.status]}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{formatDateFR(req.submittedAt)}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${req.riskScore > 50 ? "text-red-600 dark:text-red-400" : req.riskScore > 25 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                              {req.riskScore}/100
                            </span>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab: Transactions ──────────────────────────────────────────────── */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Transactions de {user.prenom} {user.nom}</CardTitle>
                  <CardDescription>{userTransactions.length} transaction{userTransactions.length !== 1 ? "s" : ""}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-3.5" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {userTransactions.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-muted-foreground">
                  <Wallet className="size-8 opacity-40 mb-2" />
                  <p className="text-sm">Aucune transaction trouvée</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead>Référence</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Montant</TableHead>
                          <TableHead className="hidden sm:table-cell">Frais</TableHead>
                          <TableHead className="hidden md:table-cell">Expéditeur</TableHead>
                          <TableHead className="hidden md:table-cell">Destinataire</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="hidden lg:table-cell">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userTransactions.slice((txPage - 1) * TX_PER_PAGE, txPage * TX_PER_PAGE).map((tx) => {
                          const TypeIcon = txTypeIcon[tx.type]
                          return (
                            <TableRow key={tx.id}>
                              <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <div className={`flex size-7 items-center justify-center rounded-lg ${txTypeColor[tx.type]}`}>
                                    <TypeIcon className="size-3.5" />
                                  </div>
                                  <span className="text-sm font-medium">{txTypeLabel[tx.type]}</span>
                                </div>
                              </TableCell>
                              <TableCell className="font-medium tabular-nums text-sm">{formatXOF(tx.montant)}</TableCell>
                              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">{formatXOF(tx.frais)}</TableCell>
                              <TableCell className="hidden md:table-cell text-sm truncate max-w-[140px]">{tx.expediteur}</TableCell>
                              <TableCell className="hidden md:table-cell text-sm truncate max-w-[140px]">{tx.destinataire}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`text-xs ${txStatusClass[tx.statut]}`}>{txStatusLabel[tx.statut]}</Badge>
                              </TableCell>
                              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{tx.date}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                  {userTransactions.length > TX_PER_PAGE && (
                    <PaginationControls
                      currentPage={txPage}
                      totalPages={Math.ceil(userTransactions.length / TX_PER_PAGE)}
                      onPageChange={setTxPage}
                      totalItems={userTransactions.length}
                      startIndex={(txPage - 1) * TX_PER_PAGE}
                      endIndex={Math.min(txPage * TX_PER_PAGE, userTransactions.length)}
                      itemLabel="transactions"
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Documents KYC ─────────────────────────────────────────────── */}
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Documents KYC</CardTitle>
                  <CardDescription>{userDocs.length} document{userDocs.length !== 1 ? "s" : ""} soumis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {userDocs.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-muted-foreground">
                  <FileText className="size-8 opacity-40 mb-2" />
                  <p className="text-sm">Aucun document KYC soumis</p>
                </div>
              ) : (
                <div className="divide-y">
                  {userDocs.map((doc) => {
                    const DocStatusIcon = doc.statut === "VERIFIED" ? CheckCircle2 : doc.statut === "REJECTED" ? XCircle : doc.statut === "EXPIRED" ? AlertTriangle : Clock
                    return (
                      <div key={doc.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                        <div className={`flex size-10 items-center justify-center rounded-xl shrink-0 ${docStatusClass[doc.statut]}`}>
                          <DocStatusIcon className="size-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{doc.type}</p>
                            <Badge variant="outline" className={`text-xs ${docStatusClass[doc.statut]}`}>
                              {docStatusLabel[doc.statut]}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                            <span>N° {doc.numero}</span>
                            <span>Soumis le {formatDateFR(doc.dateSoumission)}</span>
                            {doc.dateExpiration && <span>Expire le {formatDateFR(doc.dateExpiration)}</span>}
                            {doc.verifiedBy && <span>Vérifié par {doc.verifiedBy}</span>}
                          </div>
                          {doc.commentaire && (
                            <p className="text-xs text-muted-foreground mt-1 italic">{doc.commentaire}</p>
                          )}
                        </div>
                        <div className="shrink-0">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Voir le document</TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab: Historiques ───────────────────────────────────────────────── */}
        <TabsContent value="historiques" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Historique d&apos;activité</CardTitle>
                  <CardDescription>{userHistory.length} événement{userHistory.length !== 1 ? "s" : ""} enregistré{userHistory.length !== 1 ? "s" : ""}</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="size-3.5" />
                  Exporter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {userHistory.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-muted-foreground">
                  <Clock className="size-8 opacity-40 mb-2" />
                  <p className="text-sm">Aucune activité enregistrée</p>
                </div>
              ) : (
                <>
                  <div className="divide-y">
                    {userHistory.slice((historyPage - 1) * HISTORY_PER_PAGE, historyPage * HISTORY_PER_PAGE).map((act) => {
                      const CatIcon = activityCatIcon[act.categorie] || Activity
                      return (
                        <div key={act.id} className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors">
                          <div className={`flex size-9 items-center justify-center rounded-lg shrink-0 mt-0.5 ${activityCatColor[act.categorie]}`}>
                            <CatIcon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium text-sm">{act.action}</p>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">{act.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">{act.details}</p>
                            <p className="text-xs text-muted-foreground mt-1">IP: {act.ip}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {userHistory.length > HISTORY_PER_PAGE && (
                    <PaginationControls
                      currentPage={historyPage}
                      totalPages={Math.ceil(userHistory.length / HISTORY_PER_PAGE)}
                      onPageChange={setHistoryPage}
                      totalItems={userHistory.length}
                      startIndex={(historyPage - 1) * HISTORY_PER_PAGE}
                      endIndex={Math.min(historyPage * HISTORY_PER_PAGE, userHistory.length)}
                      itemLabel="événements"
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ── Delete Confirmation ─────────────────────────────────────────────── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer <strong>{user.prenom} {user.nom}</strong> ({user.id}) ?
              Cette action est irréversible et toutes les données associées seront définitivement supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2" onClick={() => setDeleteDialogOpen(false)}>
              <Trash2 className="size-4" />
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Suspend/Reactivate Confirmation ─────────────────────────────────── */}
      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.statut === "SUSPENDED" ? "Réactiver le compte" : "Suspendre le compte"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.statut === "SUSPENDED" ? (
                <>Êtes-vous sûr de vouloir réactiver le compte de <strong>{user.prenom} {user.nom}</strong> ? L&apos;utilisateur pourra à nouveau accéder à la plateforme.</>
              ) : (
                <>Êtes-vous sûr de vouloir suspendre le compte de <strong>{user.prenom} {user.nom}</strong> ? L&apos;utilisateur ne pourra plus accéder à la plateforme jusqu&apos;à réactivation.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className={user.statut === "SUSPENDED"
                ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                : "bg-amber-600 hover:bg-amber-700 text-white gap-2"
              }
              onClick={() => setSuspendDialogOpen(false)}
            >
              {user.statut === "SUSPENDED" ? (
                <><ShieldCheck className="size-4" /> Réactiver</>
              ) : (
                <><ShieldOff className="size-4" /> Suspendre</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
