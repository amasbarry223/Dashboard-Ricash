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
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Flag,
  Upload,
  Download,
  CheckCircle,
  Ban,
  MoreHorizontal,
  TrendingUp,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  kycRequests,
  kycLevels,
  users,
  type KYCRequest,
  type KYCStatus,
  type KYCDocumentStatus,
} from '@/lib/mock-data'

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

// ─── KYC Detail Page ──────────────────────────────────────────────────────────

function KYCDetailPage({ requestId, onBack }: { requestId: string; onBack: () => void }) {
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')

  const request = useMemo(() => kycRequests.find((r) => r.id === requestId), [requestId])
  const user = useMemo(() => {
    if (!request) return null
    return users.find((u) => u.id === request.userId)
  }, [request])

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <XCircle className="size-16 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">Demande introuvable</h2>
        <p className="text-muted-foreground">La demande KYC n&apos;existe pas ou a été supprimée.</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  const initials = request.userName.split(' ').map((n) => n[0]).join('')
  const isActionable = request.status === 'PENDING' || request.status === 'IN_REVIEW'
  const isRejected = request.status === 'REJECTED'
  const isApproved = request.status === 'APPROVED'

  // Risk score config
  const riskConfig = request.riskScore < 30
    ? { label: 'Faible', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', progressClass: '[&>div]:bg-emerald-500' }
    : request.riskScore <= 60
      ? { label: 'Moyen', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', progressClass: '[&>div]:bg-amber-500' }
      : { label: 'Élevé', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', progressClass: '[&>div]:bg-red-500' }

  // Document stats
  const verifiedDocs = request.detailedDocuments.filter((d) => d.statut === 'VERIFIED').length
  const pendingDocs = request.detailedDocuments.filter((d) => d.statut === 'PENDING').length
  const rejectedDocs = request.detailedDocuments.filter((d) => d.statut === 'REJECTED').length
  const totalDocs = request.detailedDocuments.length

  return (
    <div className="space-y-6">
      {/* ─── Back Button ──────────────────────────────────────────────────────── */}
      <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Retour aux demandes
      </Button>

      {/* ─── Header Card ──────────────────────────────────────────────────────── */}
      <Card className="overflow-hidden">
        <div className={`${
          isApproved
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800'
            : isRejected
              ? 'bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-800 dark:to-rose-800'
              : 'bg-gradient-to-r from-sky-600 to-blue-600 dark:from-sky-800 dark:to-blue-800'
        } p-6`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-center gap-4">
              <Avatar className="size-16 border-4 border-white/20 shadow-lg">
                <AvatarFallback className="bg-white/20 text-white font-bold text-xl backdrop-blur-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-white">Demande {request.id}</h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-white" />
                    {request.status === 'PENDING' ? 'En attente' : request.status === 'IN_REVIEW' ? 'En revue' : request.status === 'APPROVED' ? 'Approuvé' : 'Rejeté'}
                  </span>
                </div>
                <p className="text-white/80 text-sm">
                  {request.userName} — <span className="font-mono">{request.userId}</span>
                </p>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <Calendar className="size-3" />
                  <span>Soumis le {formatDate(request.submittedAt)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {isActionable && (
                <>
                  <Button
                    className="bg-white text-emerald-700 hover:bg-white/90 border border-white/30 h-9"
                    onClick={() => setApproveOpen(true)}
                  >
                    <CheckCircle2 className="size-4 mr-1.5" />
                    Approuver
                  </Button>
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-9"
                    onClick={() => setRejectOpen(true)}
                  >
                    <XCircle className="size-4 mr-1.5" />
                    Rejeter
                  </Button>
                </>
              )}
              {isApproved && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                  <CheckCircle2 className="size-4" />
                  Demande approuvée
                </span>
              )}
              {isRejected && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 border border-white/30 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                  <XCircle className="size-4" />
                  Demande rejetée
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Level transition bar */}
        <div className="p-5 bg-muted/30">
          <div className="flex items-center gap-4 justify-center">
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Niveau Actuel</p>
              <Badge variant="outline" className="mt-1 text-sm font-semibold px-3 py-1">{request.currentLevel}</Badge>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Separator className="w-8" />
              <ArrowLeft className="size-4 rotate-180" />
              <Separator className="w-8" />
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Niveau Demandé</p>
              <Badge variant="outline" className="mt-1 text-sm font-bold px-3 py-1 border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400">{request.requestedLevel}</Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* ─── Stat Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Score de Risque</p>
                <p className={`text-2xl font-bold ${riskConfig.color}`}>{request.riskScore}/100</p>
                <p className={`text-xs font-medium ${riskConfig.color}`}>{riskConfig.label}</p>
              </div>
              <div className={`size-10 rounded-xl ${riskConfig.bg} flex items-center justify-center shrink-0`}>
                <AlertTriangle className={`size-5 ${riskConfig.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Documents</p>
                <p className="text-2xl font-bold">{totalDocs}</p>
                <p className="text-xs text-muted-foreground">{verifiedDocs} vérifié{verifiedDocs !== 1 ? 's' : ''}</p>
              </div>
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Réviseur</p>
                <p className="text-lg font-bold">{request.reviewer || '—'}</p>
                <p className="text-xs text-muted-foreground">{request.reviewDate ? `Le ${formatDate(request.reviewDate)}` : 'Non assigné'}</p>
              </div>
              <div className="size-10 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                <Eye className="size-5 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date Décision</p>
                <p className="text-lg font-bold">{request.decisionDate ? formatDate(request.decisionDate) : '—'}</p>
                <p className="text-xs text-muted-foreground">{isActionable ? 'En cours' : isApproved ? 'Approuvé' : isRejected ? 'Rejeté' : ''}</p>
              </div>
              <div className={`size-10 rounded-xl ${
                isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                isRejected ? 'bg-red-100 dark:bg-red-900/30' :
                'bg-amber-100 dark:bg-amber-900/30'
              } flex items-center justify-center shrink-0`}>
                {isApproved ? <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" /> :
                 isRejected ? <XCircle className="size-5 text-red-600 dark:text-red-400" /> :
                 <Clock className="size-5 text-amber-600 dark:text-amber-400" />}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── Tabs ────────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="documents" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <FileText className="size-3.5" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="user" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <User className="size-3.5" />
            Utilisateur
          </TabsTrigger>
          <TabsTrigger value="review" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Eye className="size-3.5" />
            Revue & Notes
          </TabsTrigger>
          <TabsTrigger value="limits" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldCheck className="size-3.5" />
            Plafonds
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: Documents ────────────────────────────────────────────────── */}
        <TabsContent value="documents" className="space-y-4">
          {/* Document summary */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{verifiedDocs}</p>
                <p className="text-xs text-muted-foreground">Vérifiés</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{pendingDocs}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">{rejectedDocs}</p>
                <p className="text-xs text-muted-foreground">Rejetés</p>
              </CardContent>
            </Card>
          </div>

          {/* Document list */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="size-3.5 text-primary" />
                </div>
                Documents Soumis ({totalDocs})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Document</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="font-semibold hidden sm:table-cell">Taille</TableHead>
                      <TableHead className="font-semibold hidden md:table-cell">Date Upload</TableHead>
                      <TableHead className="font-semibold">Commentaire</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {request.detailedDocuments.map((doc, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <FileText className="size-4 text-muted-foreground shrink-0" />
                            <span className="font-medium text-sm">{doc.nom}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px]">{doc.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <DocStatusBadge status={doc.statut} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden sm:table-cell">{doc.taille}</TableCell>
                        <TableCell className="text-sm text-muted-foreground hidden md:table-cell">{formatDate(doc.dateUpload)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{doc.commentaire || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 2: User Info ────────────────────────────────────────────────── */}
        <TabsContent value="user" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User profile */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <User className="size-3.5 text-primary" />
                  </div>
                  Profil Utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={User} label="Nom complet" value={request.userName} />
                <InfoRow icon={BadgeCheck} label="Identifiant" value={request.userId} />
                {user && (
                  <>
                    <InfoRow icon={Phone} label="Téléphone" value={user.telephone} />
                    <InfoRow icon={Mail} label="Email" value={user.email} />
                    <InfoRow icon={Wallet} label="Solde" value={formatXOF(user.solde)} />
                    <InfoRow icon={Calendar} label="Inscription" value={formatDate(user.dateInscription)} />
                    <InfoRow icon={Clock} label="Dernière activité" value={formatDate(user.derniereActivite)} />
                  </>
                )}
              </CardContent>
            </Card>

            {/* Risk Assessment */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className={`size-7 rounded-lg ${riskConfig.bg} flex items-center justify-center`}>
                    <AlertTriangle className={`size-3.5 ${riskConfig.color}`} />
                  </div>
                  Évaluation du Risque
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Score de risque</span>
                    <span className={`text-lg font-bold ${riskConfig.color}`}>{request.riskScore}/100</span>
                  </div>
                  <Progress
                    value={request.riskScore}
                    className={`h-3 ${riskConfig.progressClass}`}
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0</span>
                    <span className="text-emerald-500">Faible</span>
                    <span className="text-amber-500">Moyen</span>
                    <span className="text-red-500">Élevé</span>
                    <span>100</span>
                  </div>
                </div>

                {request.riskScore > 60 && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400">
                    <AlertTriangle className="size-4 shrink-0" />
                    <span className="text-sm font-medium">Risque élevé — vérification manuelle requise</span>
                  </div>
                )}

                {/* Compliance Flags */}
                {request.complianceFlags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alertes Conformité</p>
                    <div className="space-y-1.5">
                      {request.complianceFlags.map((flag, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30">
                          <Flag className="size-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span className="text-sm text-amber-700 dark:text-amber-300">{flag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejection reason */}
                {isRejected && request.rejectionReason && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Raison du Rejet</p>
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30">
                      <p className="text-sm text-red-700 dark:text-red-300">{request.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB 3: Review & Notes ──────────────────────────────────────────── */}
        <TabsContent value="review" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Review Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
                    <Eye className="size-3.5 text-sky-600 dark:text-sky-400" />
                  </div>
                  Chronologie de la Revue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  {/* Submission */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="size-4 text-primary" />
                      </div>
                      <div className="w-px h-full bg-border mt-1" />
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-semibold">Demande soumise</p>
                      <p className="text-xs text-muted-foreground">{formatDate(request.submittedAt)}</p>
                      <p className="text-sm text-muted-foreground mt-1">{request.userName} a soumis une demande de passage de {request.currentLevel} à {request.requestedLevel}</p>
                    </div>
                  </div>

                  {/* Review assignment */}
                  {request.reviewer && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="size-8 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0">
                          <Eye className="size-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div className="w-px h-full bg-border mt-1" />
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-semibold">Revue assignée</p>
                        <p className="text-xs text-muted-foreground">{formatDate(request.reviewDate)}</p>
                        <p className="text-sm text-muted-foreground mt-1">Assignée à {request.reviewer}</p>
                      </div>
                    </div>
                  )}

                  {/* Decision */}
                  {request.decisionDate && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                          isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {isApproved ? <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="size-4 text-red-600 dark:text-red-400" />}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {isApproved ? 'Demande approuvée' : 'Demande rejetée'}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(request.decisionDate)}</p>
                        {isRejected && request.rejectionReason && (
                          <p className="text-sm text-muted-foreground mt-1">{request.rejectionReason}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Still in progress */}
                  {isActionable && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="size-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 animate-pulse">
                          <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">En cours de traitement</p>
                        <p className="text-xs text-muted-foreground">En attente de décision</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Review Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <MessageSquare className="size-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  Notes de Revue
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {request.reviewNotes ? (
                  <div className="rounded-xl bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                          {request.reviewer ? request.reviewer.split(' ').map((n) => n[0]).join('') : 'A'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{request.reviewer || 'Admin'}</span>
                      {request.reviewDate && <span className="text-xs text-muted-foreground">— {formatDate(request.reviewDate)}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{request.reviewNotes}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="size-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune note de revue</p>
                  </div>
                )}

                {isActionable && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Ajouter une note</p>
                      <Textarea
                        placeholder="Notes de revue..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                        className="resize-none"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={!reviewNotes.trim()}
                        onClick={() => setReviewNotes('')}
                      >
                        <MessageSquare className="size-4 mr-2" />
                        Enregistrer la note
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB 4: Limits ──────────────────────────────────────────────────── */}
        <TabsContent value="limits" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Level */}
            <Card className="border-2 border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-muted/50 flex items-center justify-center">
                    <ShieldCheck className="size-3.5 text-muted-foreground" />
                  </div>
                  Niveau Actuel : {request.currentLevel}
                </CardTitle>
                <CardDescription>Plafonds actuellement en vigueur</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {kycLevels.filter((l) => l.level.startsWith(request.currentLevel)).map((tier, i) => (
                  <div key={i} className="space-y-3">
                    <LimitRow icon={ArrowDownToLine} label="Dépôt" value={tier.depotMax} />
                    <LimitRow icon={ArrowUpFromLine} label="Retrait" value={tier.retraitMax} />
                    <LimitRow icon={ArrowUpDown} label="Transfert" value={tier.transfertMax} />
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Documents requis</p>
                      <p className="text-sm">{tier.documents}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Requested Level */}
            <Card className="border-2 border-emerald-200 dark:border-emerald-800 relative overflow-hidden">
              <div className="h-2 bg-emerald-500" />
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Niveau Demandé : {request.requestedLevel}
                </CardTitle>
                <CardDescription>Plafonds après approbation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {kycLevels.filter((l) => l.level.startsWith(request.requestedLevel)).map((tier, i) => (
                  <div key={i} className="space-y-3">
                    <LimitRow icon={ArrowDownToLine} label="Dépôt" value={tier.depotMax} highlight />
                    <LimitRow icon={ArrowUpFromLine} label="Retrait" value={tier.retraitMax} highlight />
                    <LimitRow icon={ArrowUpDown} label="Transfert" value={tier.transfertMax} highlight />
                    <Separator />
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Documents requis</p>
                      <p className="text-sm">{tier.documents}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── MODALS ──────────────────────────────────────────────────────────── */}

      {/* Approve Modal */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              Approuver la Demande KYC
            </DialogTitle>
            <DialogDescription>
              Vous allez approuver le passage de <strong>{request.userName}</strong> du niveau {request.currentLevel} au niveau {request.requestedLevel}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 flex items-center gap-3">
              <Avatar className="size-10 border-2 border-emerald-200 dark:border-emerald-800">
                <AvatarFallback className="bg-emerald-600 text-white font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{request.userName}</p>
                <p className="text-xs text-muted-foreground">{request.currentLevel} → {request.requestedLevel}</p>
              </div>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-3 flex items-center gap-2">
              <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Score de risque : {request.riskScore}/100 — {riskConfig.label}
                {request.riskScore > 60 && '. Attention : risque élevé !'}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Annuler</Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setApproveOpen(false)}
            >
              <CheckCircle2 className="size-4 mr-2" />
              Confirmer l&apos;approbation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Modal */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="size-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="size-5 text-red-600 dark:text-red-400" />
              </div>
              Rejeter la Demande KYC
            </DialogTitle>
            <DialogDescription>
              Vous allez rejeter la demande de <strong>{request.userName}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 p-4 flex items-center gap-3">
              <Avatar className="size-10 border-2 border-red-200 dark:border-red-800">
                <AvatarFallback className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{request.userName}</p>
                <p className="text-xs text-muted-foreground">{request.currentLevel} → {request.requestedLevel}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Raison du rejet (obligatoire)</label>
              <Textarea
                placeholder="Expliquez pourquoi cette demande est rejetée..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setRejectOpen(false); setRejectReason('') }}>Annuler</Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim()}
              onClick={() => { setRejectOpen(false); setRejectReason('') }}
            >
              <XCircle className="size-4 mr-2" />
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

/* ─── Helper Components ─────────────────────────────────────────────────────── */

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="size-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

function LimitRow({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className={`size-3.5 shrink-0 ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={`text-sm font-medium ${highlight ? 'text-emerald-700 dark:text-emerald-400 font-bold' : ''}`}>{value}</p>
      </div>
    </div>
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
