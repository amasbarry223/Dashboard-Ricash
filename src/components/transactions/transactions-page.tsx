"use client"

import { useState, useMemo } from "react"
import {
  ArrowLeftRight,
  Search,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  ChevronLeft,
  ChevronRight,
  Eye,
  Wallet,
  Hash,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
  transactions,
  type Transaction,
  type TransactionType,
  type TransactionStatus,
} from "@/lib/mock-data"

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatXOF(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " XOF"
}

function formatDate(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ")
  const [year, month, day] = datePart.split("-")
  const months = [
    "janv.", "févr.", "mars", "avr.", "mai", "juin",
    "juil.", "août", "sept.", "oct.", "nov.", "déc.",
  ]
  const monthName = months[parseInt(month, 10) - 1]
  return `${parseInt(day, 10)} ${monthName} ${year} à ${timePart}`
}

/* ─── Badge Configs ────────────────────────────────────────────────────────── */

const typeConfig: Record<TransactionType, { label: string; className: string }> = {
  DEPOT: {
    label: "Dépôt",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  RETRAIT: {
    label: "Retrait",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
  },
  TRANSFERT: {
    label: "Transfert",
    className: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
  },
  PAIEMENT: {
    label: "Paiement",
    className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
  },
}

const statusConfig: Record<TransactionStatus, { label: string; className: string; icon: React.ElementType }> = {
  COMPLETED: {
    label: "Réussi",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle,
  },
  PENDING: {
    label: "En attente",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800",
    icon: Clock,
  },
  FAILED: {
    label: "Échoué",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Annulé",
    className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700",
    icon: Ban,
  },
}

function TypeBadge({ type }: { type: TransactionType }) {
  const config = typeConfig[type]
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

/* ─── Transaction Detail Dialog ────────────────────────────────────────────── */

function TransactionDetailDialog({
  transaction,
  open,
  onOpenChange,
}: {
  transaction: Transaction | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!transaction) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="size-5 text-primary" />
            Détails de la Transaction
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Reference & Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Référence</p>
              <p className="text-sm font-mono font-semibold">{transaction.reference}</p>
            </div>
            <StatusBadge status={transaction.statut} />
          </div>

          <Separator />

          {/* Type & Method */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <TypeBadge type={transaction.type} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Méthode</p>
              <p className="text-sm font-medium">{transaction.methode}</p>
            </div>
          </div>

          <Separator />

          {/* Amount & Fees */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Montant</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {formatXOF(transaction.montant)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Frais</p>
              <p className="text-lg font-semibold text-muted-foreground">
                {transaction.frais === 0 ? "Gratuit" : formatXOF(transaction.frais)}
              </p>
            </div>
          </div>

          <Separator />

          {/* Sender & Receiver */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Expéditeur</p>
              <p className="text-sm font-medium">{transaction.expediteur}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Destinataire</p>
              <p className="text-sm font-medium">{transaction.destinataire}</p>
            </div>
          </div>

          <Separator />

          {/* Date & ID */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm">{formatDate(transaction.date)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ID Interne</p>
              <p className="text-sm font-mono">{transaction.id}</p>
            </div>
          </div>

          {/* Total */}
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-800">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Total (Montant + Frais)</span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {formatXOF(transaction.montant + transaction.frais)}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

const ITEMS_PER_PAGE = 8

export function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Filter transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (searchQuery && !tx.reference.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      if (typeFilter !== "all" && tx.type !== typeFilter) {
        return false
      }
      if (statusFilter !== "all" && tx.statut !== statusFilter) {
        return false
      }
      if (dateFilter !== "all") {
        const txDate = new Date(tx.date.replace(" ", "T"))
        const now = new Date()
        if (dateFilter === "today") {
          if (txDate.toDateString() !== now.toDateString()) return false
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          if (txDate < weekAgo) return false
        } else if (dateFilter === "month") {
          if (txDate.getMonth() !== now.getMonth() || txDate.getFullYear() !== now.getFullYear()) return false
        }
      }
      return true
    })
  }, [searchQuery, typeFilter, statusFilter, dateFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  )

  // Summary stats
  const totalCount = filtered.length
  const totalVolume = filtered.reduce((sum, tx) => sum + tx.montant, 0)
  const successCount = filtered.filter((tx) => tx.statut === "COMPLETED").length
  const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : "0.0"

  // Summary row totals for current page
  const totalMontant = paginated.reduce((sum, tx) => sum + tx.montant, 0)
  const totalFrais = paginated.reduce((sum, tx) => sum + tx.frais, 0)

  // Open detail dialog
  const openDetail = (tx: Transaction) => {
    setSelectedTransaction(tx)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <ArrowLeftRight className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gestion des Transactions</h1>
            <p className="text-sm text-muted-foreground">Suivi et gestion de toutes les transactions</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{new Intl.NumberFormat("fr-FR").format(totalCount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Wallet className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Volume Total</p>
                <p className="text-2xl font-bold">{formatXOF(totalVolume)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                <CheckCircle className="size-5 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Taux de Succès</p>
                <p className="text-2xl font-bold">{successRate}%</p>
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
                placeholder="Rechercher par référence..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-9"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(v) => {
                setTypeFilter(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="DEPOT">Dépôt</SelectItem>
                <SelectItem value="RETRAIT">Retrait</SelectItem>
                <SelectItem value="TRANSFERT">Transfert</SelectItem>
                <SelectItem value="PAIEMENT">Paiement</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(v) => {
                setStatusFilter(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="COMPLETED">Réussi</SelectItem>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="FAILED">Échoué</SelectItem>
                <SelectItem value="CANCELLED">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={dateFilter}
              onValueChange={(v) => {
                setDateFilter(v)
                setCurrentPage(1)
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les dates</SelectItem>
                <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Référence</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold text-right">Montant</TableHead>
                  <TableHead className="font-semibold text-right">Frais</TableHead>
                  <TableHead className="font-semibold">Expéditeur</TableHead>
                  <TableHead className="font-semibold">Destinataire</TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="font-semibold">Date</TableHead>
                  <TableHead className="font-semibold">Méthode</TableHead>
                  <TableHead className="font-semibold w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center text-muted-foreground">
                      Aucune transaction trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {paginated.map((tx) => (
                      <TableRow
                        key={tx.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => openDetail(tx)}
                      >
                        <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                        <TableCell>
                          <TypeBadge type={tx.type} />
                        </TableCell>
                        <TableCell className="text-right font-semibold">{formatXOF(tx.montant)}</TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {tx.frais === 0 ? "—" : formatXOF(tx.frais)}
                        </TableCell>
                        <TableCell className="max-w-[120px] truncate">{tx.expediteur}</TableCell>
                        <TableCell className="max-w-[120px] truncate">{tx.destinataire}</TableCell>
                        <TableCell>
                          <StatusBadge status={tx.statut} />
                        </TableCell>
                        <TableCell className="text-xs whitespace-nowrap">{tx.date}</TableCell>
                        <TableCell className="text-xs">{tx.methode}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                              e.stopPropagation()
                              openDetail(tx)
                            }}
                          >
                            <Eye className="size-3.5 text-muted-foreground" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow className="bg-muted/40 font-semibold border-t-2">
                      <TableCell className="text-xs">Total (page)</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="text-right">{formatXOF(totalMontant)}</TableCell>
                      <TableCell className="text-right">{formatXOF(totalFrais)}</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <p className="text-xs text-muted-foreground">
                Affichage {(safeCurrentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)} sur{" "}
                {filtered.length} transactions
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === safeCurrentPage ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <TransactionDetailDialog
        transaction={selectedTransaction}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
