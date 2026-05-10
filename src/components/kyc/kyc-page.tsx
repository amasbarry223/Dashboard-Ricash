'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  ShieldCheck,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
  Download,
  FilterX,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import {
  kycRequests,
  kycLevels,
  type KYCStatus,
  type KYCLevel,
} from '@/lib/mock-data'
import { KYCDetailPage } from '@/components/kyc/kyc-detail-page'
import { cn } from '@/lib/utils'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

type StatusFilterValue = 'all' | 'ACTION_QUEUE' | KYCStatus

const kycBadgeClass: Record<KYCLevel, string> = {
  'Tier 0':
    'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
  'Tier 1':
    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  'Tier 2':
    'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800',
  'Tier 3':
    'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
}

function TierLevelBadge({ level }: { level: KYCLevel }) {
  return (
    <Badge variant="outline" className={cn('text-[11px] font-medium', kycBadgeClass[level])}>
      {level}
    </Badge>
  )
}

// ─── Badges ─────────────────────────────────────────────────────────────────────

function KYCStatusBadge({ status }: { status: KYCStatus }) {
  const config: Record<KYCStatus, { label: string; className: string; dotClass: string }> = {
    PENDING: {
      label: 'En attente',
      className:
        'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
      dotClass: 'bg-amber-500',
    },
    IN_REVIEW: {
      label: 'En revue',
      className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
      dotClass: 'bg-sky-500',
    },
    APPROVED: {
      label: 'Approuvé',
      className:
        'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
      dotClass: 'bg-emerald-500',
    },
    REJECTED: {
      label: 'Rejeté',
      className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
      dotClass: 'bg-red-500',
    },
  }
  const { label, className, dotClass } = config[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', className)}>
      <span className={cn('size-1.5 rounded-full', dotClass)} />
      {label}
    </span>
  )
}

function RiskScoreBadge({ score }: { score: number }) {
  let label: string
  let className: string
  let barClass: string

  if (score < 30) {
    label = 'Faible'
    className =
      'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
    barClass = 'bg-emerald-500'
  } else if (score <= 60) {
    label = 'Moyen'
    className =
      'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300'
    barClass = 'bg-amber-500'
  } else {
    label = 'Élevé'
    className = 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300'
    barClass = 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div className={cn('h-full rounded-full transition-all', barClass)} style={{ width: `${Math.min(score, 100)}%` }} />
      </div>
      <Badge variant="outline" className={cn('text-[10px] font-semibold tabular-nums', className)}>
        {score} — {label}
      </Badge>
    </div>
  )
}

// ─── Pipeline (répartition — même ton que les cartes récap Transactions) ───────

function CompliancePipelineBar({
  pending,
  review,
  approved,
  rejected,
  total,
}: {
  pending: number
  review: number
  approved: number
  rejected: number
  total: number
}) {
  if (total === 0) return null
  const pct = (n: number) => `${(n / total) * 100}%`
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">Répartition par statut</span>
        <span className="tabular-nums text-muted-foreground">{total} dossiers</span>
      </div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
        {pending > 0 && <div className="bg-amber-500 dark:bg-amber-500/90" style={{ width: pct(pending) }} />}
        {review > 0 && <div className="bg-sky-500 dark:bg-sky-500/90" style={{ width: pct(review) }} />}
        {approved > 0 && <div className="bg-emerald-500 dark:bg-emerald-500/90" style={{ width: pct(approved) }} />}
        {rejected > 0 && <div className="bg-red-500 dark:bg-red-500/90" style={{ width: pct(rejected) }} />}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500" /> Attente
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-sky-500" /> Revue
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500" /> Approuvé
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-red-500" /> Rejeté
        </span>
      </div>
    </div>
  )
}

// ─── Stats — aligné Utilisateurs / Agents ─────────────────────────────────────

function StatsCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: {
  title: string
  value: number
  icon: React.ElementType
  iconBg: string
  iconColor: string
  trend?: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value.toLocaleString('fr-FR')}</p>
            {trend ? <p className="text-xs text-muted-foreground">{trend}</p> : null}
          </div>
          <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl', iconBg)}>
            <Icon className={cn('size-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Niveaux KYC — cartes proches du gabarit liste Agents ──────────────────────

const tierAccent = [
  'bg-gray-500',
  'bg-amber-500',
  'bg-teal-500',
  'bg-emerald-500',
]

function TierCard({ tier, index }: { tier: (typeof kycLevels)[0]; index: number }) {
  const accent = tierAccent[index] ?? 'bg-gray-500'
  return (
    <Card className="relative overflow-hidden">
      <div className={cn('h-1.5', accent)} />
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BadgeCheck className="size-5 text-muted-foreground" />
          <CardTitle className="text-base font-bold">{tier.level}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Documents requis</p>
          <p className="mt-1 text-sm">{tier.documents}</p>
        </div>
        <Separator />
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Plafonds</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <ArrowDownToLine className="size-3.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[11px] text-muted-foreground">Dépôt</p>
                <p className="font-medium">{tier.depotMax}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpFromLine className="size-3.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[11px] text-muted-foreground">Retrait</p>
                <p className="font-medium">{tier.retraitMax}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpDown className="size-3.5 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-[11px] text-muted-foreground">Transfert</p>
                <p className="font-medium">{tier.transfertMax}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Tri — même pattern que Transactions ──────────────────────────────────────

type SortField = 'id' | 'userName' | 'status' | 'riskScore' | 'submittedAt'
type SortDirection = 'asc' | 'desc'

function SortableHeader({
  label,
  field,
  sortField,
  sortDirection,
  onSort,
  className,
}: {
  label: string
  field: SortField
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  className?: string
}) {
  const isActive = sortField === field
  return (
    <Button variant="ghost" size="sm" className={cn('-ml-3 h-8 gap-1', className)} onClick={() => onSort(field)}>
      {label}
      {isActive ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="size-3.5" />
        ) : (
          <ChevronDown className="size-3.5" />
        )
      ) : (
        <ArrowUpDown className="size-3.5 opacity-40" />
      )}
    </Button>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8

export function KycPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('requests')
  const [sortField, setSortField] = useState<SortField>('submittedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = useCallback(
    (field: SortField) => {
      setSortDirection((prev) => (sortField === field && prev === 'asc' ? 'desc' : 'asc'))
      setSortField(field)
    },
    [sortField],
  )

  const stats = useMemo(() => {
    const total = kycRequests.length
    const enAttente = kycRequests.filter((k) => k.status === 'PENDING').length
    const enRevue = kycRequests.filter((k) => k.status === 'IN_REVIEW').length
    const approuves = kycRequests.filter((k) => k.status === 'APPROVED').length
    const rejetes = kycRequests.filter((k) => k.status === 'REJECTED').length
    return { total, enAttente, enRevue, approuves, rejetes }
  }, [])

  const actionQueueCount = stats.enAttente + stats.enRevue

  const filteredRequests = useMemo(() => {
    const list = kycRequests.filter((req) => {
      const matchesSearch =
        searchQuery === '' ||
        req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.userId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'ACTION_QUEUE'
            ? req.status === 'PENDING' || req.status === 'IN_REVIEW'
            : req.status === statusFilter

      return matchesSearch && matchesStatus
    })

    list.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'id':
          cmp = a.id.localeCompare(b.id)
          break
        case 'userName':
          cmp = a.userName.localeCompare(b.userName)
          break
        case 'status':
          cmp = a.status.localeCompare(b.status)
          break
        case 'riskScore':
          cmp = a.riskScore - b.riskScore
          break
        case 'submittedAt':
          cmp = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()
          break
      }
      return sortDirection === 'asc' ? cmp : -cmp
    })

    return list
  }, [searchQuery, statusFilter, sortField, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedRequests = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredRequests, safeCurrentPage])

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as StatusFilterValue)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all'

  const getPageNumbers = (): (number | '...')[] => {
    const pages: (number | '...')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (safeCurrentPage > 3) pages.push('...')
      const start = Math.max(2, safeCurrentPage - 1)
      const end = Math.min(totalPages - 1, safeCurrentPage + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (safeCurrentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  const startIndex = filteredRequests.length === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1
  const endIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredRequests.length)

  if (selectedRequestId) {
    return <KYCDetailPage requestId={selectedRequestId} onBack={() => setSelectedRequestId(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Header — même structure que Agents */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <ShieldCheck className="size-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">KYC & Conformité</h1>
            <p className="mt-1 text-sm text-muted-foreground md:text-base">
              Vérifications d&apos;identité et niveaux de conformité — plateforme RICASH
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats — grille comme Utilisateurs */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatsCard
          title="Total dossiers"
          value={stats.total}
          icon={FileText}
          iconBg="bg-primary/10"
          iconColor="text-primary"
          trend="Toutes les demandes"
        />
        <StatsCard
          title="En attente"
          value={stats.enAttente}
          icon={Clock}
          iconBg="bg-amber-100 dark:bg-amber-950"
          iconColor="text-amber-600 dark:text-amber-400"
        />
        <StatsCard
          title="En revue"
          value={stats.enRevue}
          icon={Eye}
          iconBg="bg-sky-100 dark:bg-sky-950"
          iconColor="text-sky-600 dark:text-sky-400"
        />
        <StatsCard
          title="Approuvés"
          value={stats.approuves}
          icon={CheckCircle2}
          iconBg="bg-emerald-100 dark:bg-emerald-950"
          iconColor="text-emerald-600 dark:text-emerald-400"
        />
        <StatsCard
          title="Rejetés"
          value={stats.rejetes}
          icon={XCircle}
          iconBg="bg-red-100 dark:bg-red-950"
          iconColor="text-red-600 dark:text-red-400"
        />
      </div>

      {/* Répartition — carte isolée comme les filtres / récaps ailleurs */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Vue d&apos;ensemble du pipeline</CardTitle>
          <CardDescription>Répartition des dossiers par étape de traitement</CardDescription>
        </CardHeader>
        <CardContent>
          <CompliancePipelineBar
            pending={stats.enAttente}
            review={stats.enRevue}
            approved={stats.approuves}
            rejected={stats.rejetes}
            total={stats.total}
          />
        </CardContent>
      </Card>

      {/* Onglets — style Agents */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="requests" className="gap-1.5 data-[state=active]:bg-background">
            <FileText className="size-3.5" />
            Demandes KYC
          </TabsTrigger>
          <TabsTrigger value="levels" className="gap-1.5 data-[state=active]:bg-background relative">
            <ShieldCheck className="size-3.5" />
            Niveaux & plafonds
          </TabsTrigger>
          <TabsTrigger value="queue" className="gap-1.5 data-[state=active]:bg-background relative">
            <Clock className="size-3.5" />
            À traiter
            {actionQueueCount > 0 ? (
              <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {actionQueueCount}
              </span>
            ) : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, ID demande ou ID utilisateur..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="h-10 pl-9"
                  />
                </div>
                <div className="flex w-full gap-2 sm:w-auto">
                  <Select value={statusFilter} onValueChange={handleStatusChange}>
                    <SelectTrigger className="h-10 w-full sm:w-[220px]">
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="ACTION_QUEUE">À traiter (attente + revue)</SelectItem>
                      <SelectItem value="PENDING">En attente</SelectItem>
                      <SelectItem value="IN_REVIEW">En revue</SelectItem>
                      <SelectItem value="APPROVED">Approuvé</SelectItem>
                      <SelectItem value="REJECTED">Rejeté</SelectItem>
                    </SelectContent>
                  </Select>
                  {hasActiveFilters ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 text-muted-foreground hover:text-foreground"
                          onClick={() => {
                            handleSearchChange('')
                            handleStatusChange('all')
                          }}
                        >
                          <FilterX className="size-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Réinitialiser les filtres</TooltipContent>
                    </Tooltip>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Liste des demandes KYC</CardTitle>
              <CardDescription className="mt-1">
                {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''} trouvée
                {filteredRequests.length !== 1 ? 's' : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="hidden overflow-x-auto lg:block">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="w-[100px]">
                        <SortableHeader label="ID" field="id" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Utilisateur" field="userName" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead>Niveau actuel</TableHead>
                      <TableHead>Niveau demandé</TableHead>
                      <TableHead>
                        <SortableHeader label="Statut" field="status" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Risque" field="riskScore" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader
                          label="Soumis"
                          field="submittedAt"
                          sortField={sortField}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                        />
                      </TableHead>
                      <TableHead className="w-[72px] text-center">Détail</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <FileText className="size-8 opacity-40" />
                            <p className="text-sm">Aucune demande trouvée pour ces critères.</p>
                            {hasActiveFilters ? (
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => {
                                  handleSearchChange('')
                                  handleStatusChange('all')
                                }}
                              >
                                Réinitialiser les filtres
                              </Button>
                            ) : null}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRequests.map((req) => (
                        <TableRow
                          key={req.id}
                          className="group cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedRequestId(req.id)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">{req.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="size-9 border">
                                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                  {req.userName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-medium group-hover:text-primary">{req.userName}</p>
                                <p className="truncate font-mono text-xs text-muted-foreground">{req.userId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <TierLevelBadge level={req.currentLevel} />
                          </TableCell>
                          <TableCell>
                            <TierLevelBadge level={req.requestedLevel} />
                          </TableCell>
                          <TableCell>
                            <KYCStatusBadge status={req.status} />
                          </TableCell>
                          <TableCell>
                            <RiskScoreBadge score={req.riskScore} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(req.submittedAt)}</TableCell>
                          <TableCell className="text-center">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="size-8 text-muted-foreground hover:text-foreground"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedRequestId(req.id)
                                  }}
                                >
                                  <Eye className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Voir les détails</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile / tablette */}
              <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:hidden">
                {paginatedRequests.length === 0 ? (
                  <Card className="col-span-full border-dashed">
                    <CardContent className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
                      <FileText className="size-8 opacity-40" />
                      <p className="text-sm">Aucune demande trouvée pour ces critères.</p>
                    </CardContent>
                  </Card>
                ) : (
                  paginatedRequests.map((req) => (
                    <Card
                      key={req.id}
                      className="cursor-pointer transition-shadow hover:shadow-md"
                      onClick={() => setSelectedRequestId(req.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-10 border">
                            <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                              {req.userName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="font-semibold text-sm">{req.userName}</p>
                                <p className="font-mono text-[11px] text-muted-foreground">
                                  {req.id} — {req.userId}
                                </p>
                              </div>
                              <KYCStatusBadge status={req.status} />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                              <TierLevelBadge level={req.currentLevel} />
                              <ChevronRight className="size-3.5 text-muted-foreground" />
                              <TierLevelBadge level={req.requestedLevel} />
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <RiskScoreBadge score={req.riskScore} />
                              <span className="text-xs text-muted-foreground">{formatDate(req.submittedAt)}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {filteredRequests.length > 0 ? (
                <div className="flex flex-col items-center justify-between gap-4 border-t px-4 py-3 sm:flex-row">
                  <p className="text-sm text-muted-foreground">
                    {startIndex}–{endIndex} sur {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''}
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
                      page === '...' ? (
                        <span key={`e-${idx}`} className="px-2 text-sm text-muted-foreground">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={page}
                          variant={page === safeCurrentPage ? 'default' : 'outline'}
                          size="icon"
                          className={cn(
                            'size-8',
                            page === safeCurrentPage && 'bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white',
                          )}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ),
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
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Référence des niveaux KYC</CardTitle>
              <CardDescription>Documents requis et plafonds par palier — alignés sur la fiche utilisateur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {kycLevels.map((tier, index) => (
                  <TierCard key={tier.level} tier={tier} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">File prioritaire</CardTitle>
              <CardDescription>Dossiers en attente ou en cours de revue — même données que le filtre « À traiter »</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {kycRequests.filter((r) => r.status === 'PENDING' || r.status === 'IN_REVIEW').length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun dossier à traiter pour le moment.</p>
              ) : (
                <ul className="divide-y rounded-lg border">
                  {kycRequests
                    .filter((r) => r.status === 'PENDING' || r.status === 'IN_REVIEW')
                    .map((req) => (
                      <li key={req.id}>
                        <button
                          type="button"
                          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                          onClick={() => setSelectedRequestId(req.id)}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <Avatar className="size-9 border">
                              <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                {req.userName
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="truncate font-medium">{req.userName}</p>
                              <p className="truncate font-mono text-xs text-muted-foreground">{req.id}</p>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <TierLevelBadge level={req.requestedLevel} />
                            <KYCStatusBadge status={req.status} />
                            <ChevronRight className="size-4 text-muted-foreground" />
                          </div>
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
