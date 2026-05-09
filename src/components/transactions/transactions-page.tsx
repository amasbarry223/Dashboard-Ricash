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
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Download,
  FilterX,
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  transactions,
  type Transaction,
  type TransactionType,
  type TransactionStatus,
} from "@/lib/mock-data"
import { TransactionDetailPage } from "./transaction-detail-page"

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatXOF(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " XOF"
}

/* ─── Badge Configs ────────────────────────────────────────────────────────── */

const typeConfig: Record<TransactionType, { label: string; className: string }> = {
  DEPOT: {
    label: "Dépôt",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  },
  RETRAIT: {
    label: "Retrait",
    className: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
  },
  TRANSFERT: {
    label: "Transfert",
    className: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
  },
  PAIEMENT: {
    label: "Paiement",
    className: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  },
}

const statusConfig: Record<TransactionStatus, { label: string; className: string; icon: React.ElementType }> = {
  COMPLETED: {
    label: "Réussi",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle,
  },
  PENDING: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    icon: Clock,
  },
  FAILED: {
    label: "Échoué",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
  },
  CANCELLED: {
    label: "Annulé",
    className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
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

/* ─── Sort types ─────────────────────────────────────────────────────────────── */
type SortField = "reference" | "type" | "montant" | "frais" | "statut" | "date"
type SortDirection = "asc" | "desc"

function SortableHeader({
  label, field, sortField, sortDirection, onSort, className,
}: {
  label: string; field: SortField; sortField: SortField; sortDirection: SortDirection; onSort: (field: SortField) => void; className?: string
}) {
  const isActive = sortField === field
  return (
    <Button variant="ghost" size="sm" className={`-ml-3 h-8 gap-1 ${className || ""}`} onClick={() => onSort(field)}>
      {label}
      {isActive ? (
        sortDirection === "asc" ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />
      ) : (
        <ArrowUpDown className="size-3.5 opacity-40" />
      )}
    </Button>
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
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null)

  // Sort handler
  const handleSort = (field: SortField) => {
    setSortDirection((prev) => sortField === field && prev === "asc" ? "desc" : "asc")
    setSortField(field)
  }

  // Filter & sort transactions (must be before conditional return — hooks order)
  const filtered = useMemo(() => {
    // Deduplicate by ID first — same transaction may appear in multiple user sections
    const seen = new Set<string>()
    const deduped = transactions.filter((tx) => {
      if (seen.has(tx.id)) return false
      seen.add(tx.id)
      return true
    })
    const result = deduped.filter((tx) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase().trim()
        const searchable = [
          tx.reference, tx.expediteur, tx.destinataire, tx.id,
        ].join(" ").toLowerCase()
        if (!searchable.includes(query)) return false
      }
      if (typeFilter !== "all" && tx.type !== typeFilter) return false
      if (statusFilter !== "all" && tx.statut !== statusFilter) return false
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

    result.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case "reference": cmp = a.reference.localeCompare(b.reference); break
        case "type": cmp = a.type.localeCompare(b.type); break
        case "montant": cmp = a.montant - b.montant; break
        case "frais": cmp = a.frais - b.frais; break
        case "statut": cmp = a.statut.localeCompare(b.statut); break
        case "date": cmp = new Date(a.date.replace(" ", "T")).getTime() - new Date(b.date.replace(" ", "T")).getTime(); break
      }
      return sortDirection === "asc" ? cmp : -cmp
    })

    return result
  }, [searchQuery, typeFilter, statusFilter, dateFilter, sortField, sortDirection])

  // If a transaction is selected, show detail page (after all hooks)
  if (selectedTransactionId) {
    return <TransactionDetailPage transactionId={selectedTransactionId} onBack={() => setSelectedTransactionId(null)} />
  }

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

  // Pagination helpers
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) { for (let i = 1; i <= totalPages; i++) pages.push(i) }
    else {
      pages.push(1)
      if (safeCurrentPage > 3) pages.push("...")
      const start = Math.max(2, safeCurrentPage - 1)
      const end = Math.min(totalPages - 1, safeCurrentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (safeCurrentPage < totalPages - 2) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, filtered.length)
  const hasActiveFilters = searchQuery !== "" || typeFilter !== "all" || statusFilter !== "all" || dateFilter !== "all"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestion des Transactions</h1>
          <p className="text-muted-foreground mt-1">Suivi et gestion de toutes les transactions de la plateforme RICASH</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Transactions</p>
              <p className="text-2xl font-bold">{new Intl.NumberFormat("fr-FR").format(totalCount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0">
              <Wallet className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Volume Total</p>
              <p className="text-2xl font-bold">{formatXOF(totalVolume)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="size-10 rounded-xl bg-teal-100 dark:bg-teal-950 flex items-center justify-center shrink-0">
              <CheckCircle className="size-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Taux de Succès</p>
              <p className="text-2xl font-bold">{successRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par référence, expéditeur, destinataire..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto flex-wrap">
              <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="DEPOT">Dépôt</SelectItem>
                  <SelectItem value="RETRAIT">Retrait</SelectItem>
                  <SelectItem value="TRANSFERT">Transfert</SelectItem>
                  <SelectItem value="PAIEMENT">Paiement</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="COMPLETED">Réussi</SelectItem>
                  <SelectItem value="PENDING">En attente</SelectItem>
                  <SelectItem value="FAILED">Échoué</SelectItem>
                  <SelectItem value="CANCELLED">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={(v) => { setDateFilter(v); setCurrentPage(1) }}>
                <SelectTrigger className="w-full sm:w-[150px]"><SelectValue placeholder="Période" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les dates</SelectItem>
                  <SelectItem value="today">Aujourd&apos;hui</SelectItem>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">Ce mois</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={() => { setSearchQuery(""); setTypeFilter("all"); setStatusFilter("all"); setDateFilter("all"); setCurrentPage(1) }}>
                      <FilterX className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Réinitialiser les filtres</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Liste des Transactions</CardTitle>
              <CardDescription className="mt-1">
                {filtered.length} transaction{filtered.length !== 1 ? "s" : ""} trouvé{filtered.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[130px]">
                    <SortableHeader label="Référence" field="reference" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader label="Type" field="type" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortableHeader label="Montant" field="montant" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="justify-end" />
                  </TableHead>
                  <TableHead className="hidden sm:table-cell text-right">
                    <SortableHeader label="Frais" field="frais" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="justify-end" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Expéditeur</TableHead>
                  <TableHead className="hidden md:table-cell">Destinataire</TableHead>
                  <TableHead>
                    <SortableHeader label="Statut" field="statut" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <SortableHeader label="Date" field="date" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Méthode</TableHead>
                  <TableHead className="w-[60px] text-center">Détail</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Wallet className="size-8 opacity-40" />
                        <p className="text-sm">Aucune transaction trouvée pour ces critères.</p>
                        {hasActiveFilters && (
                          <Button variant="link" size="sm" onClick={() => { setSearchQuery(""); setTypeFilter("all"); setStatusFilter("all"); setDateFilter("all"); setCurrentPage(1) }}>
                            Réinitialiser les filtres
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  <>
                    {paginated.map((tx) => (
                      <TableRow
                        key={tx.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setSelectedTransactionId(tx.id)}
                      >
                        <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                        <TableCell>
                          <TypeBadge type={tx.type} />
                        </TableCell>
                        <TableCell className="text-right font-semibold tabular-nums text-sm">{formatXOF(tx.montant)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-right text-muted-foreground text-sm">
                          {tx.frais === 0 ? "—" : formatXOF(tx.frais)}
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-[120px] truncate text-sm">{tx.expediteur}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[120px] truncate text-sm">{tx.destinataire}</TableCell>
                        <TableCell>
                          <StatusBadge status={tx.statut} />
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs whitespace-nowrap text-muted-foreground">{tx.date}</TableCell>
                        <TableCell className="hidden lg:table-cell text-xs">{tx.methode}</TableCell>
                        <TableCell className="text-center">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-muted-foreground hover:text-foreground"
                                onClick={(e) => { e.stopPropagation(); setSelectedTransactionId(tx.id) }}
                              >
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Voir les détails</TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                    {/* Summary Row */}
                    <TableRow className="bg-muted/40 font-semibold border-t-2">
                      <TableCell className="text-xs">Total (page)</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="text-right tabular-nums">{formatXOF(totalMontant)}</TableCell>
                      <TableCell className="hidden sm:table-cell text-right tabular-nums">{formatXOF(totalFrais)}</TableCell>
                      <TableCell className="hidden md:table-cell">—</TableCell>
                      <TableCell className="hidden md:table-cell">—</TableCell>
                      <TableCell>—</TableCell>
                      <TableCell className="hidden lg:table-cell">—</TableCell>
                      <TableCell className="hidden lg:table-cell">—</TableCell>
                      <TableCell>—</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {filtered.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {startIndex}–{endIndex} sur {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="size-8" disabled={safeCurrentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                  <ChevronLeft className="size-4" /><span className="sr-only">Précédent</span>
                </Button>
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
                  ) : (
                    <Button key={page} variant={page === safeCurrentPage ? "default" : "outline"} size="icon" className={`size-8 ${page === safeCurrentPage ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`} onClick={() => setCurrentPage(page)}>
                      {page}
                    </Button>
                  )
                )}
                <Button variant="outline" size="icon" className="size-8" disabled={safeCurrentPage >= totalPages} onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                  <ChevronRight className="size-4" /><span className="sr-only">Suivant</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
