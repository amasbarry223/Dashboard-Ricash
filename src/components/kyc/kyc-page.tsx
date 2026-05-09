'use client'

import { useState, useMemo } from 'react'
import {
  ShieldCheck,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  ArrowUpDown,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
  Filter,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

import {
  kycRequests,
  kycLevels,
  type KYCStatus,
  type KYCDocumentStatus,
} from '@/lib/mock-data'
import { KYCDetailPage } from '@/components/kyc/kyc-detail-page'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatXOF(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' XOF'
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Badge Components ─────────────────────────────────────────────────────────

function KYCStatusBadge({ status }: { status: KYCStatus }) {
  const config: Record<KYCStatus, { label: string; className: string; dotClass: string }> = {
    PENDING: {
      label: 'En attente',
      className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
      dotClass: 'bg-amber-500',
    },
    IN_REVIEW: {
      label: 'En revue',
      className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800',
      dotClass: 'bg-sky-500',
    },
    APPROVED: {
      label: 'Approuvé',
      className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
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
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${className}`}>
      <span className={`size-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  )
}

function DocStatusBadge({ status }: { status: KYCDocumentStatus }) {
  const config: Record<KYCDocumentStatus, { label: string; className: string; icon: React.ElementType }> = {
    VERIFIED: { label: 'Vérifié', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800', icon: CheckCircle2 },
    PENDING: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', icon: Clock },
    REJECTED: { label: 'Rejeté', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', icon: XCircle },
  }
  const { label, className, icon: Icon } = config[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="size-3" />
      {label}
    </span>
  )
}

function RiskScoreBadge({ score }: { score: number }) {
  let label: string
  let className: string
  let progressColor: string

  if (score < 30) {
    label = 'Faible'
    className = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
    progressColor = '[&>div]:bg-emerald-500'
  } else if (score <= 60) {
    label = 'Moyen'
    className = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
    progressColor = '[&>div]:bg-amber-500'
  } else {
    label = 'Élevé'
    className = 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
    progressColor = '[&>div]:bg-red-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${progressColor.replace('[&>div]:', '')} transition-all`} style={{ width: `${score}%` }} />
      </div>
      <Badge variant="outline" className={`text-[10px] font-medium ${className}`}>
        {score} — {label}
      </Badge>
    </div>
  )
}

// ─── Stats Card ───────────────────────────────────────────────────────────────

function KycStatCard({
  icon: Icon,
  label,
  value,
  color,
  iconBg,
  iconColor,
}: {
  icon: React.ElementType
  label: string
  value: number
  color?: string
  iconBg: string
  iconColor: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={`size-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`size-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Tier Level Card ──────────────────────────────────────────────────────────

function TierCard({
  tier,
  index,
}: {
  tier: (typeof kycLevels)[0]
  index: number
}) {
  const tierColors = [
    { header: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300', accent: 'bg-gray-500', icon: 'text-gray-500' },
    { header: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', accent: 'bg-amber-500', icon: 'text-amber-500' },
    { header: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400', accent: 'bg-teal-500', icon: 'text-teal-500' },
    { header: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', accent: 'bg-emerald-500', icon: 'text-emerald-500' },
  ]

  const color = tierColors[index]

  return (
    <Card className="relative overflow-hidden">
      <div className={`h-2 ${color.accent}`} />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BadgeCheck className={`size-5 ${color.icon}`} />
          <CardTitle className="text-base font-bold">{tier.level}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Documents requis</p>
          <p className="text-sm">{tier.documents}</p>
        </div>
        <Separator />
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Plafonds</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <ArrowDownToLine className="size-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0"><p className="text-[11px] text-muted-foreground">Dépôt</p><p className="text-sm font-medium">{tier.depotMax}</p></div>
            </div>
            <div className="flex items-center gap-2.5">
              <ArrowUpFromLine className="size-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0"><p className="text-[11px] text-muted-foreground">Retrait</p><p className="text-sm font-medium">{tier.retraitMax}</p></div>
            </div>
            <div className="flex items-center gap-2.5">
              <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0"><p className="text-[11px] text-muted-foreground">Transfert</p><p className="text-sm font-medium">{tier.transfertMax}</p></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
// ─── Main Component ───────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 8

export function KycPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('requests')

  // Compute stats
  const stats = useMemo(() => {
    const total = kycRequests.length
    const enAttente = kycRequests.filter((k) => k.status === 'PENDING').length
    const enRevue = kycRequests.filter((k) => k.status === 'IN_REVIEW').length
    const approuves = kycRequests.filter((k) => k.status === 'APPROVED').length
    const rejetes = kycRequests.filter((k) => k.status === 'REJECTED').length
    return { total, enAttente, enRevue, approuves, rejetes }
  }, [])

  // Filter & search
  const filteredRequests = useMemo(() => {
    return kycRequests.filter((req) => {
      const matchesSearch =
        searchQuery === '' ||
        req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.userId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || req.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE))
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredRequests, currentPage])

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  // If a request is selected, show detail page
  if (selectedRequestId) {
    return <KYCDetailPage requestId={selectedRequestId} onBack={() => setSelectedRequestId(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3.5">
        <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="size-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KYC & Conformité</h1>
          <p className="text-sm text-muted-foreground">Gérez les vérifications d&apos;identité et les niveaux de conformité</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KycStatCard icon={FileText} label="Total Demandes" value={stats.total} iconBg="bg-primary/10" iconColor="text-primary" />
        <KycStatCard icon={Clock} label="En Attente" value={stats.enAttente} iconBg="bg-amber-100 dark:bg-amber-900/30" iconColor="text-amber-600 dark:text-amber-400" />
        <KycStatCard icon={Eye} label="En Revue" value={stats.enRevue} iconBg="bg-sky-100 dark:bg-sky-900/30" iconColor="text-sky-600 dark:text-sky-400" />
        <KycStatCard icon={CheckCircle2} label="Approuvées" value={stats.approuves} iconBg="bg-emerald-100 dark:bg-emerald-900/30" iconColor="text-emerald-600 dark:text-emerald-400" />
        <KycStatCard icon={XCircle} label="Rejetées" value={stats.rejetes} iconBg="bg-red-100 dark:bg-red-900/30" iconColor="text-red-600 dark:text-red-400" />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="requests" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="size-3.5" />
            Demandes KYC
          </TabsTrigger>
          <TabsTrigger value="levels" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldCheck className="size-3.5" />
            Niveaux & Plafonds
          </TabsTrigger>
        </TabsList>

        {/* ─── Tab 1: KYC Requests ──────────────────────────────────────────── */}
        <TabsContent value="requests" className="space-y-4">
          {/* Filter Bar */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, ID demande ou ID utilisateur..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-[200px] h-10">
                    <Filter className="size-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="IN_REVIEW">En revue</SelectItem>
                    <SelectItem value="APPROVED">Approuvé</SelectItem>
                    <SelectItem value="REJECTED">Rejeté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* KYC Requests Table */}
          <Card className="hidden lg:block">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Utilisateur</TableHead>
                      <TableHead className="font-semibold">Niveau Actuel</TableHead>
                      <TableHead className="font-semibold">Niveau Demandé</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="font-semibold">Score Risque</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                          Aucune demande trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedRequests.map((req) => (
                        <TableRow
                          key={req.id}
                          className="cursor-pointer hover:bg-muted/50 transition-colors group"
                          onClick={() => setSelectedRequestId(req.id)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">{req.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-8 border shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                                  {req.userName.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{req.userName}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{req.userId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[11px]">{req.currentLevel}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[11px] font-semibold">{req.requestedLevel}</Badge>
                          </TableCell>
                          <TableCell>
                            <KYCStatusBadge status={req.status} />
                          </TableCell>
                          <TableCell>
                            <RiskScoreBadge score={req.riskScore} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{formatDate(req.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs gap-1"
                              onClick={(e) => { e.stopPropagation(); setSelectedRequestId(req.id) }}
                            >
                              <Eye className="size-3.5" />
                              Voir
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t">
                  <p className="text-sm text-muted-foreground">
                    {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        className="size-8 p-0"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile Card Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
            {paginatedRequests.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="p-8 text-center text-muted-foreground">
                  <FileText className="size-12 mx-auto mb-3 opacity-50" />
                  Aucune demande trouvée
                </CardContent>
              </Card>
            ) : (
              paginatedRequests.map((req) => (
                <Card
                  key={req.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRequestId(req.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="size-10 border shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                          {req.userName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="font-semibold text-sm">{req.userName}</p>
                            <p className="text-xs text-muted-foreground font-mono">{req.id} — {req.userId}</p>
                          </div>
                          <KYCStatusBadge status={req.status} />
                        </div>
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-[10px]">{req.currentLevel}</Badge>
                          <span className="text-xs text-muted-foreground">→</span>
                          <Badge variant="outline" className="text-[10px] font-semibold">{req.requestedLevel}</Badge>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
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
        </TabsContent>

        {/* ─── Tab 2: KYC Levels & Limits ───────────────────────────────────── */}
        <TabsContent value="levels" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kycLevels.map((tier, index) => (
              <TierCard key={index} tier={tier} index={index} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
