'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Users, UserCheck, UserX, ShieldOff, Search, ChevronLeft, ChevronRight,
  Eye, Plus, Pencil, Trash2, MoreHorizontal, ShieldCheck, Ban, ArrowUpDown,
  Download, FilterX, Mail, UserPlus, ChevronUp, ChevronDown,
} from "lucide-react"
import { useState, useMemo, useCallback } from "react"
import { users, type User, type UserStatus, type KYCLevel } from "@/lib/mock-data"
import { UserDetailPage } from "./user-detail-page"

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8

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

// ─── Sort types ───────────────────────────────────────────────────────────────
type SortField = "id" | "nom" | "statut" | "kycLevel" | "solde" | "derniereActivite"
type SortDirection = "asc" | "desc"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(nom: string, prenom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${statusBadgeClass[status]}`}>
      <span className={`size-1.5 rounded-full ${statusDotClass[status]}`} />
      {statusLabelMap[status]}
    </Badge>
  )
}

function KYCBadge({ level }: { level: KYCLevel }) {
  const showStar = level === "Tier 3"
  return (
    <Badge variant="outline" className={`gap-1 font-medium ${kycBadgeClass[level]}`}>
      {showStar && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
        </svg>
      )}
      {level}
    </Badge>
  )
}

function StatsCard({
  title, value, icon: Icon, iconBg, iconColor, trend,
}: {
  title: string; value: number; icon: React.ElementType; iconBg: string; iconColor: string; trend?: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value.toLocaleString("fr-FR")}</p>
            {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
          </div>
          <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
            <Icon className={`size-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [kycFilter, setKycFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("id")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [deleteDialogUser, setDeleteDialogUser] = useState<User | null>(null)
  const [suspendDialogUser, setSuspendDialogUser] = useState<User | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // ── Sort handler ─────────────────────────────────────────────────────────
  const handleSort = useCallback((field: SortField) => {
    setSortDirection((prev) => sortField === field && prev === "asc" ? "desc" : "asc")
    setSortField(field)
  }, [sortField])

  // ── Filtering, Sorting & Pagination ──────────────────────────────────────
  const filteredUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const query = searchQuery.toLowerCase().trim()
      if (query) {
        const searchable = [
          user.id, user.nom, user.prenom,
          `${user.prenom} ${user.nom}`, `${user.nom} ${user.prenom}`,
          user.telephone, user.email,
        ].join(" ").toLowerCase()
        if (!searchable.includes(query)) return false
      }
      if (statusFilter !== "all" && user.statut !== statusFilter) return false
      if (kycFilter !== "all" && user.kycLevel !== kycFilter) return false
      return true
    })

    filtered.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case "id": cmp = a.id.localeCompare(b.id); break
        case "nom": cmp = `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`); break
        case "statut": cmp = a.statut.localeCompare(b.statut); break
        case "kycLevel": cmp = a.kycLevel.localeCompare(b.kycLevel); break
        case "solde": cmp = a.solde - b.solde; break
        case "derniereActivite": cmp = new Date(a.derniereActivite).getTime() - new Date(b.derniereActivite).getTime(); break
      }
      return sortDirection === "asc" ? cmp : -cmp
    })

    return filtered
  }, [searchQuery, statusFilter, kycFilter, sortField, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, safeCurrentPage])

  const handleSearchChange = (value: string) => { setSearchQuery(value); setCurrentPage(1) }
  const handleStatusChange = (value: string) => { setStatusFilter(value); setCurrentPage(1) }
  const handleKycChange = (value: string) => { setKycFilter(value); setCurrentPage(1) }

  // If a user is selected, show detail page (after all hooks)
  if (selectedUserId) {
    return <UserDetailPage userId={selectedUserId} onBack={() => setSelectedUserId(null)} />
  }

  // ── Row Selection ────────────────────────────────────────────────────────
  const toggleRow = (id: string) => {
    setSelectedRows((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next })
  }
  const toggleAll = () => {
    if (selectedRows.size === paginatedUsers.length) setSelectedRows(new Set())
    else setSelectedRows(new Set(paginatedUsers.map((u) => u.id)))
  }
  const isAllSelected = paginatedUsers.length > 0 && selectedRows.size === paginatedUsers.length
  const clearSelection = () => setSelectedRows(new Set())

  // ── Stats ────────────────────────────────────────────────────────────────
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.statut === "ACTIVE").length
  const inactiveUsers = users.filter((u) => u.statut === "INACTIVE").length
  const suspendedUsers = users.filter((u) => u.statut === "SUSPENDED").length

  // ── Pagination helpers ──────────────────────────────────────────────────
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
  const endIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredUsers.length)
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all" || kycFilter !== "all"

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Consultez et gérez les comptes utilisateurs de la plateforme RICASH</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exporter
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2">
            <UserPlus className="size-4" />
            Nouvel Utilisateur
          </Button>
        </div>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total" value={totalUsers} icon={Users} iconBg="bg-emerald-100 dark:bg-emerald-950" iconColor="text-emerald-600 dark:text-emerald-400" trend="Tous les comptes" />
        <StatsCard title="Actifs" value={activeUsers} icon={UserCheck} iconBg="bg-emerald-100 dark:bg-emerald-950" iconColor="text-emerald-600 dark:text-emerald-400" trend={`${((activeUsers / totalUsers) * 100).toFixed(0)}% du total`} />
        <StatsCard title="Inactifs" value={inactiveUsers} icon={UserX} iconBg="bg-gray-100 dark:bg-gray-800" iconColor="text-gray-500 dark:text-gray-400" trend="Aucune activité récente" />
        <StatsCard title="Suspendus" value={suspendedUsers} icon={ShieldOff} iconBg="bg-red-100 dark:bg-red-950" iconColor="text-red-600 dark:text-red-400" trend="Nécessitent une action" />
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Rechercher par nom, ID, téléphone, email..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} className="pl-9" />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="ACTIVE">Actif</SelectItem>
                  <SelectItem value="INACTIVE">Inactif</SelectItem>
                  <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                </SelectContent>
              </Select>
              <Select value={kycFilter} onValueChange={handleKycChange}>
                <SelectTrigger className="w-full sm:w-[160px]"><SelectValue placeholder="Niveau KYC" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les niveaux</SelectItem>
                  <SelectItem value="Tier 0">Tier 0</SelectItem>
                  <SelectItem value="Tier 1">Tier 1</SelectItem>
                  <SelectItem value="Tier 2">Tier 2</SelectItem>
                  <SelectItem value="Tier 3">Tier 3</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setKycFilter("all"); setCurrentPage(1) }}>
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

      {/* ── Bulk Actions Bar ───────────────────────────────────────────────── */}
      {selectedRows.size > 0 && (
        <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30">
          <CardContent className="p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{selectedRows.size} sélectionné{selectedRows.size > 1 ? "s" : ""}</span>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5" onClick={clearSelection}>Désélectionner</Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5"><ShieldCheck className="size-3.5" />Valider KYC</Button>
                <Button variant="outline" size="sm" className="h-8 gap-1.5"><Mail className="size-3.5" />Envoyer notification</Button>
                <Button variant="destructive" size="sm" className="h-8 gap-1.5"><Ban className="size-3.5" />Suspendre</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Data Table ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Liste des Utilisateurs</CardTitle>
              <CardDescription className="mt-1">
                {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""} trouvé{filteredUsers.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[40px] pl-4">
                    <Checkbox checked={isAllSelected} onCheckedChange={toggleAll} aria-label="Sélectionner tout" />
                  </TableHead>
                  <TableHead className="w-[90px]">
                    <SortableHeader label="ID" field="id" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead>
                    <SortableHeader label="Nom Complet" field="nom" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <SortableHeader label="Statut" field="statut" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <SortableHeader label="KYC" field="kycLevel" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <SortableHeader label="Solde" field="solde" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="justify-end" />
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <SortableHeader label="Activité" field="derniereActivite" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                  </TableHead>
                  <TableHead className="w-[100px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Users className="size-8 opacity-40" />
                        <p className="text-sm">Aucun utilisateur trouvé pour ces critères.</p>
                        {hasActiveFilters && (
                          <Button variant="link" size="sm" onClick={() => { setSearchQuery(""); setStatusFilter("all"); setKycFilter("all"); setCurrentPage(1) }}>
                            Réinitialiser les filtres
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      data-state={selectedRows.has(user.id) ? "selected" : undefined}
                      className="group"
                    >
                      <TableCell className="pl-4">
                        <Checkbox checked={selectedRows.has(user.id)} onCheckedChange={() => toggleRow(user.id)} aria-label={`Sélectionner ${user.prenom} ${user.nom}`} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-950 dark:text-emerald-300">
                              {getInitials(user.nom, user.prenom)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate text-sm">{user.prenom} {user.nom}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell"><StatusBadge status={user.statut} /></TableCell>
                      <TableCell className="hidden sm:table-cell"><KYCBadge level={user.kycLevel} /></TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        <span className="font-medium tabular-nums text-sm">{new Intl.NumberFormat("fr-FR", { style: "decimal", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(user.solde)} XOF</span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(user.derniereActivite))}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          {/* View — navigates to detail page */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground" onClick={() => setSelectedUserId(user.id)}>
                                <Eye className="size-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Voir les détails</TooltipContent>
                          </Tooltip>
                          {/* Edit */}
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                                <Pencil className="size-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Modifier</TooltipContent>
                          </Tooltip>
                          {/* More Actions Dropdown */}
                          <DropdownMenu>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-foreground">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Plus d&apos;actions</TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="end" className="w-52">
                              <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Actions — {user.prenom} {user.nom}
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2" onClick={() => setSelectedUserId(user.id)}>
                                <Eye className="size-4" /> Voir le profil
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Pencil className="size-4" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => setSelectedUserId(user.id)}>
                                <Users className="size-4" /> Voir transactions
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => setSelectedUserId(user.id)}>
                                <ShieldCheck className="size-4" /> Historique KYC
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Mail className="size-4" /> Envoyer un message
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.statut === "SUSPENDED" ? (
                                <DropdownMenuItem className="gap-2 text-emerald-600 dark:text-emerald-400" onClick={() => setSuspendDialogUser(user)}>
                                  <ShieldCheck className="size-4" /> Réactiver le compte
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="gap-2 text-amber-600 dark:text-amber-400" onClick={() => setSuspendDialogUser(user)}>
                                  <Ban className="size-4" /> Suspendre le compte
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" className="gap-2" onClick={() => setDeleteDialogUser(user)}>
                                <Trash2 className="size-4" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── Pagination ────────────────────────────────────────────────── */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {startIndex}–{endIndex} sur {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""}
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

      {/* ── Delete Confirmation ─────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteDialogUser} onOpenChange={(open) => !open && setDeleteDialogUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer l&apos;utilisateur</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialogUser && (
                <>Êtes-vous sûr de vouloir supprimer <strong>{deleteDialogUser.prenom} {deleteDialogUser.nom}</strong> ({deleteDialogUser.id}) ? Cette action est irréversible.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2" onClick={() => setDeleteDialogUser(null)}>
              <Trash2 className="size-4" /> Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Suspend/Reactivate Confirmation ─────────────────────────────────── */}
      <AlertDialog open={!!suspendDialogUser} onOpenChange={(open) => !open && setSuspendDialogUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{suspendDialogUser?.statut === "SUSPENDED" ? "Réactiver le compte" : "Suspendre le compte"}</AlertDialogTitle>
            <AlertDialogDescription>
              {suspendDialogUser?.statut === "SUSPENDED" ? (
                <>Êtes-vous sûr de vouloir réactiver le compte de <strong>{suspendDialogUser?.prenom} {suspendDialogUser?.nom}</strong> ?</>
              ) : (
                <>Êtes-vous sûr de vouloir suspendre le compte de <strong>{suspendDialogUser?.prenom} {suspendDialogUser?.nom}</strong> ?</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className={suspendDialogUser?.statut === "SUSPENDED" ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-2" : "bg-amber-600 hover:bg-amber-700 text-white gap-2"}
              onClick={() => setSuspendDialogUser(null)}
            >
              {suspendDialogUser?.statut === "SUSPENDED" ? (
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
