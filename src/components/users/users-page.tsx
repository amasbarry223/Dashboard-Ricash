'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Users, UserCheck, UserX, ShieldOff, Search, ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react"
import { useState, useMemo } from "react"
import { users, type User, type UserStatus, type KYCLevel } from "@/lib/mock-data"

// ─── Constants ────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 8

const statusLabelMap: Record<UserStatus, string> = {
  ACTIVE: "Actif",
  INACTIVE: "Inactif",
  SUSPENDED: "Suspendu",
}

const statusBadgeClass: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  INACTIVE: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  SUSPENDED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
}

const statusDotClass: Record<UserStatus, string> = {
  ACTIVE: "bg-emerald-500",
  INACTIVE: "bg-gray-400",
  SUSPENDED: "bg-red-500",
}

const kycBadgeClass: Record<KYCLevel, string> = {
  "Tier 0": "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  "Tier 1": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  "Tier 2": "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
  "Tier 3": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
}

const kycIconMap: Record<KYCLevel, boolean> = {
  "Tier 0": false,
  "Tier 1": false,
  "Tier 2": false,
  "Tier 3": true,
}

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
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date)
}

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
  return (
    <Badge variant="outline" className={`gap-1 font-medium ${kycBadgeClass[level]}`}>
      {kycIconMap[level] && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-3.5">
          <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
        </svg>
      )}
      {level}
    </Badge>
  )
}

function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  title: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
}) {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center gap-4">
          <div className={`flex size-10 md:size-12 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
            <Icon className={`size-5 md:size-6 ${iconColor}`} />
          </div>
          <div className="min-w-0">
            <p className="text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-xl md:text-2xl font-bold tracking-tight">{value.toLocaleString("fr-FR")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [kycFilter, setKycFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // ── Filtering & Pagination ────────────────────────────────────────────────
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const query = searchQuery.toLowerCase().trim()
      if (query) {
        const searchable = [
          user.id,
          user.nom,
          user.prenom,
          `${user.prenom} ${user.nom}`,
          `${user.nom} ${user.prenom}`,
          user.telephone,
          user.email,
        ]
          .join(" ")
          .toLowerCase()
        if (!searchable.includes(query)) return false
      }

      // Status filter
      if (statusFilter !== "all" && user.statut !== statusFilter) return false

      // KYC filter
      if (kycFilter !== "all" && user.kycLevel !== kycFilter) return false

      return true
    })
  }, [searchQuery, statusFilter, kycFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedUsers = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredUsers, safeCurrentPage])

  // Reset page when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleKycChange = (value: string) => {
    setKycFilter(value)
    setCurrentPage(1)
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.statut === "ACTIVE").length
  const inactiveUsers = users.filter((u) => u.statut === "INACTIVE").length
  const suspendedUsers = users.filter((u) => u.statut === "SUSPENDED").length

  // ── Pagination helpers ────────────────────────────────────────────────────
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
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

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Consultez et gérez les comptes utilisateurs de la plateforme RICASH</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shrink-0 self-start sm:self-auto">
          <Plus className="size-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* ── Stats Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Utilisateurs"
          value={totalUsers}
          icon={Users}
          iconBg="bg-emerald-100 dark:bg-emerald-950"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Actifs"
          value={activeUsers}
          icon={UserCheck}
          iconBg="bg-emerald-100 dark:bg-emerald-950"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Inactifs"
          value={inactiveUsers}
          icon={UserX}
          iconBg="bg-gray-100 dark:bg-gray-800"
          iconColor="text-gray-500 dark:text-gray-400"
        />
        <StatsCard
          title="Suspendus"
          value={suspendedUsers}
          icon={ShieldOff}
          iconBg="bg-red-100 dark:bg-red-950"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      {/* ── Filter Bar ─────────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, ID, téléphone, email..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="ACTIVE">Actif</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
                <SelectItem value="SUSPENDED">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={kycFilter} onValueChange={handleKycChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Niveau KYC" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                <SelectItem value="Tier 0">Tier 0</SelectItem>
                <SelectItem value="Tier 1">Tier 1</SelectItem>
                <SelectItem value="Tier 2">Tier 2</SelectItem>
                <SelectItem value="Tier 3">Tier 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* ── Data Table ─────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Liste des Utilisateurs</CardTitle>
          <CardDescription>
            {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""} trouvé{filteredUsers.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Nom Complet</TableHead>
                  <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="hidden sm:table-cell">Niveau KYC</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Solde</TableHead>
                  <TableHead className="hidden lg:table-cell">Dernière Activité</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                      Aucun utilisateur trouvé pour ces critères.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="cursor-pointer hover:bg-muted/40 transition-colors"
                      onClick={() => setSelectedUser(user)}
                    >
                      <TableCell className="font-mono text-xs">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="size-8 border">
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-950 dark:text-emerald-300">
                              {getInitials(user.nom, user.prenom)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{user.prenom} {user.nom}</p>
                            <p className="text-xs text-muted-foreground truncate md:hidden">{user.telephone}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{user.telephone}</TableCell>
                      <TableCell>
                        <StatusBadge status={user.statut} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <KYCBadge level={user.kycLevel} />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right font-medium tabular-nums">
                        {formatXOF(user.solde)}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                        {formatDateFR(user.derniereActivite)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* ── Pagination ──────────────────────────────────────────────────── */}
          {filteredUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-4 py-3">
              <p className="text-sm text-muted-foreground">
                {startIndex}–{endIndex} sur {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                  <span className="sr-only">Précédent</span>
                </Button>
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground text-sm">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={page}
                      variant={page === safeCurrentPage ? "default" : "outline"}
                      size="icon"
                      className={`size-8 ${page === safeCurrentPage ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="size-4" />
                  <span className="sr-only">Suivant</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Detail Dialog ──────────────────────────────────────────────────── */}
      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle className="sr-only">Détails de {selectedUser.prenom} {selectedUser.nom}</DialogTitle>
              </DialogHeader>

              {/* User profile header */}
              <div className="flex items-center gap-4">
                <Avatar className="size-14 border-2 border-emerald-200 dark:border-emerald-800">
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg font-bold dark:bg-emerald-950 dark:text-emerald-300">
                    {getInitials(selectedUser.nom, selectedUser.prenom)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="text-xl font-bold truncate">
                    {selectedUser.prenom} {selectedUser.nom}
                  </h2>
                  <p className="text-sm text-muted-foreground font-mono">{selectedUser.id}</p>
                </div>
              </div>

              <Separator />

              {/* Contact info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Informations de contact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <p className="text-sm font-medium">{selectedUser.telephone}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Pays</p>
                    <p className="text-sm font-medium">{selectedUser.pays}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account info */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Informations du compte</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Statut</p>
                    <StatusBadge status={selectedUser.statut} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Niveau KYC</p>
                    <KYCBadge level={selectedUser.kycLevel} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Solde</p>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {formatXOF(selectedUser.solde)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Date d&apos;inscription</p>
                    <p className="text-sm font-medium">{formatDateFull(selectedUser.dateInscription)}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Eye className="size-4" />
                  Voir Transactions
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                  </svg>
                  Historique KYC
                </Button>
                {selectedUser.statut === "SUSPENDED" ? (
                  <Button className="flex-1 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    <UserCheck className="size-4" />
                    Réactiver
                  </Button>
                ) : (
                  <Button variant="destructive" className="flex-1 gap-2">
                    <ShieldOff className="size-4" />
                    Suspendre
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
