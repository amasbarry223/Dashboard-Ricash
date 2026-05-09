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
  Wallet,
  ArrowDownToLine,
  ArrowUpFromLine,
  BadgeCheck,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { kycRequests, kycLevels, type KYCRequest, type KYCStatus } from '@/lib/mock-data'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatXOF(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' XOF'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Badge Components ─────────────────────────────────────────────────────────

function KYCStatusBadge({ status }: { status: KYCStatus }) {
  const config: Record<KYCStatus, { label: string; className: string }> = {
    PENDING: {
      label: 'En attente',
      className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800',
    },
    IN_REVIEW: {
      label: 'En revue',
      className: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800',
    },
    APPROVED: {
      label: 'Approuvé',
      className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800',
    },
    REJECTED: {
      label: 'Rejeté',
      className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
    },
  }
  const { label, className } = config[status]
  return (
    <Badge variant="outline" className={`text-[11px] font-medium ${className}`}>
      {status === 'PENDING' && <Clock className="size-3 mr-1" />}
      {status === 'IN_REVIEW' && <Eye className="size-3 mr-1" />}
      {status === 'APPROVED' && <CheckCircle2 className="size-3 mr-1" />}
      {status === 'REJECTED' && <XCircle className="size-3 mr-1" />}
      {label}
    </Badge>
  )
}

function RiskScoreBadge({ score }: { score: number }) {
  let label: string
  let className: string
  let progressColor: string

  if (score < 30) {
    label = 'Faible'
    className = 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800'
    progressColor = 'bg-emerald-500'
  } else if (score <= 60) {
    label = 'Moyen'
    className = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800'
    progressColor = 'bg-amber-500'
  } else {
    label = 'Élevé'
    className = 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    progressColor = 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
        <div className={`h-full rounded-full ${progressColor} transition-all`} style={{ width: `${score}%` }} />
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
}: {
  icon: React.ElementType
  label: string
  value: number
  color: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`size-10 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="size-5" />
          </div>
          <div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
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
    {
      header: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300',
      accent: 'bg-gray-500',
      icon: 'text-gray-500',
    },
    {
      header: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      accent: 'bg-amber-500',
      icon: 'text-amber-500',
    },
    {
      header: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
      accent: 'bg-teal-500',
      icon: 'text-teal-500',
    },
    {
      header: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      accent: 'bg-emerald-500',
      icon: 'text-emerald-500',
    },
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
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
            Documents requis
          </p>
          <p className="text-sm">{tier.documents}</p>
        </div>
        <Separator />
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Plafonds
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <ArrowDownToLine className="size-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">Dépôt</p>
                <p className="text-sm font-medium">{tier.depotMax}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ArrowUpFromLine className="size-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">Retrait</p>
                <p className="text-sm font-medium">{tier.retraitMax}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground">Transfert</p>
                <p className="text-sm font-medium">{tier.transfertMax}</p>
              </div>
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
  const [selectedRequest, setSelectedRequest] = useState<KYCRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
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

  const openRequestDetail = (req: KYCRequest) => {
    setSelectedRequest(req)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">KYC & Conformité</h2>
        <p className="text-sm text-muted-foreground">
          Gérez les vérifications d'identité et les niveaux de conformité
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KycStatCard
          icon={FileText}
          label="Total Demandes"
          value={stats.total}
          color="bg-primary/10 text-primary"
        />
        <KycStatCard
          icon={Clock}
          label="En Attente"
          value={stats.enAttente}
          color="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
        />
        <KycStatCard
          icon={Eye}
          label="En Revue"
          value={stats.enRevue}
          color="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400"
        />
        <KycStatCard
          icon={CheckCircle2}
          label="Approuvées"
          value={stats.approuves}
          color="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
        />
        <KycStatCard
          icon={XCircle}
          label="Rejetées"
          value={stats.rejetes}
          color="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="requests" className="gap-1.5">
            <FileText className="size-3.5" />
            Demandes KYC
          </TabsTrigger>
          <TabsTrigger value="levels" className="gap-1.5">
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
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, ID demande ou ID utilisateur..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-full sm:w-[200px] h-9">
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
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-[90px]">ID</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead className="hidden sm:table-cell">Niveau Actuel</TableHead>
                      <TableHead className="hidden sm:table-cell">Niveau Demandé</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="hidden md:table-cell">Score Risque</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
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
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => openRequestDetail(req)}
                        >
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {req.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar className="size-7 shrink-0">
                                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">
                                  {req.userName.split(' ').map((n) => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{req.userName}</p>
                                <p className="text-[11px] text-muted-foreground truncate">{req.userId}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="text-[11px]">
                              {req.currentLevel}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className="text-[11px] font-semibold">
                              {req.requestedLevel}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <KYCStatusBadge status={req.status} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <RiskScoreBadge score={req.riskScore} />
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {formatDate(req.submittedAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              {(req.status === 'PENDING' || req.status === 'IN_REVIEW') && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  className="h-7 text-[11px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  }}
                                >
                                  <CheckCircle2 className="size-3" />
                                  Valider
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[11px] gap-1"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openRequestDetail(req)
                                }}
                              >
                                <Eye className="size-3" />
                                Détails
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <p className="text-sm text-muted-foreground">
                  {filteredRequests.length} demande{filteredRequests.length !== 1 ? 's' : ''} trouvée{filteredRequests.length !== 1 ? 's' : ''}
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
                    Précédent
                  </Button>
                  <div className="flex items-center gap-1">
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
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Suivant
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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

      {/* KYC Request Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          {selectedRequest && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="size-5 text-primary" />
                  </div>
                  <div>
                    <div>Demande {selectedRequest.id}</div>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedRequest.userName} — {selectedRequest.userId}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status & Level */}
                <div className="flex items-center gap-2 flex-wrap">
                  <KYCStatusBadge status={selectedRequest.status} />
                  <Badge variant="outline" className="text-[11px]">
                    {selectedRequest.currentLevel} → {selectedRequest.requestedLevel}
                  </Badge>
                </div>

                <Separator />

                {/* Risk Score */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Score de Risque
                  </h4>
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold">{selectedRequest.riskScore}/100</span>
                      <RiskScoreBadge score={selectedRequest.riskScore} />
                    </div>
                    <Progress
                      value={selectedRequest.riskScore}
                      className={`h-2 ${
                        selectedRequest.riskScore < 30
                          ? '[&>div]:bg-emerald-500'
                          : selectedRequest.riskScore <= 60
                          ? '[&>div]:bg-amber-500'
                          : '[&>div]:bg-red-500'
                      }`}
                    />
                    {selectedRequest.riskScore > 60 && (
                      <div className="flex items-center gap-1.5 mt-2 text-red-600 dark:text-red-400">
                        <AlertTriangle className="size-3.5" />
                        <span className="text-xs font-medium">Risque élevé — vérification manuelle requise</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Documents */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                    Documents Soumis
                  </h4>
                  <div className="space-y-1.5">
                    {selectedRequest.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2"
                      >
                        <FileText className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm">{doc}</span>
                        <CheckCircle2 className="size-3.5 text-emerald-500 ml-auto shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Submission Date */}
                <div className="flex items-center gap-2">
                  <Clock className="size-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Soumis le {formatDate(selectedRequest.submittedAt)}
                  </span>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  {(selectedRequest.status === 'PENDING' || selectedRequest.status === 'IN_REVIEW') && (
                    <>
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckCircle2 className="size-3.5" />
                        Approuver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <XCircle className="size-3.5" />
                        Rejeter
                      </Button>
                    </>
                  )}
                  {selectedRequest.status === 'APPROVED' && (
                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                      <CheckCircle2 className="size-3.5 mr-1" />
                      Demande approuvée
                    </Badge>
                  )}
                  {selectedRequest.status === 'REJECTED' && (
                    <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                      <XCircle className="size-3.5 mr-1" />
                      Demande rejetée
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
