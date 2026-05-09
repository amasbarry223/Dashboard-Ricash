'use client'

import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Eye,
  FileText,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Wallet,
  Calendar,
  BadgeCheck,
  MessageSquare,
  Flag,
  TrendingUp,
  ArrowUpDown,
  ArrowDownToLine,
  ArrowUpFromLine,
  ScanFace,
  Fingerprint,
  UserCheck,
  Scale,
  RotateCcw,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  kycRequests,
  kycLevels,
  users,
  transactions,
  type KYCStatus,
  type KYCDocumentStatus,
} from '@/lib/mock-data'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

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

function formatDateFull(dateStr: string): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/* ─── Status Badge Configs ─────────────────────────────────────────────────── */

const kycStatusConfig: Record<KYCStatus, { label: string; className: string; dotClass: string; icon: React.ElementType }> = {
  PENDING: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', dotClass: 'bg-amber-500', icon: Clock },
  IN_REVIEW: { label: 'En revue', className: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800', dotClass: 'bg-sky-500', icon: Eye },
  APPROVED: { label: 'Approuvé', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800', dotClass: 'bg-emerald-500', icon: CheckCircle2 },
  REJECTED: { label: 'Rejeté', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', dotClass: 'bg-red-500', icon: XCircle },
}

const docStatusConfig: Record<KYCDocumentStatus, { label: string; className: string; icon: React.ElementType }> = {
  VERIFIED: { label: 'Vérifié', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800', icon: CheckCircle2 },
  PENDING: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', icon: Clock },
  REJECTED: { label: 'Rejeté', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', icon: XCircle },
}

/* ─── Small Badge Components ───────────────────────────────────────────────── */

function KYCStatusBadge({ status }: { status: KYCStatus }) {
  const config = kycStatusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}>
      <span className={`size-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  )
}

function DocStatusBadge({ status }: { status: KYCDocumentStatus }) {
  const config = docStatusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

/* ─── Stat Card ────────────────────────────────────────────────────────────── */

function DetailStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBg,
  iconColor,
  trend,
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  trend?: { value: number; label: string }
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="size-3 text-emerald-600" />
                <span className="text-emerald-600 font-semibold">+{trend.value}%</span>
                <span className="text-muted-foreground">{trend.label}</span>
              </div>
            )}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          <div className={`size-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
            <Icon className={`size-5 ${iconColor}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Info Row Helper ──────────────────────────────────────────────────────── */

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

/* ─── Limit Row Helper ─────────────────────────────────────────────────────── */

function LimitRow({ icon: Icon, label, value, highlight }: { icon: React.ElementType; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${highlight ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-muted/50'}`}>
        <Icon className={`size-3.5 ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className={`text-sm font-semibold ${highlight ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>{value}</p>
    </div>
  )
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

interface KYCDetailPageProps {
  requestId: string
  onBack: () => void
}

export function KYCDetailPage({ requestId, onBack }: KYCDetailPageProps) {
  // State for modals
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [reviewNotes, setReviewNotes] = useState('')

  // Find request and user
  const request = useMemo(() => kycRequests.find((r) => r.id === requestId), [requestId])
  const user = useMemo(() => {
    if (!request) return null
    return users.find((u) => u.id === request.userId)
  }, [request])

  // User transactions
  const userTransactions = useMemo(() => {
    if (!user) return []
    const fullName = `${user.prenom} ${user.nom}`
    const seen = new Set<string>()
    return transactions
      .filter((t) => {
        if (seen.has(t.id)) return false
        if (t.expediteur === user.id || t.destinataire === user.id || t.expediteur === fullName || t.destinataire === fullName) {
          seen.add(t.id)
          return true
        }
        return false
      })
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5)
  }, [user])

  // Not found
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

  // Computed values
  const initials = request.userName.split(' ').map((n) => n[0]).join('')
  const isActionable = request.status === 'PENDING' || request.status === 'IN_REVIEW'
  const isRejected = request.status === 'REJECTED'
  const isApproved = request.status === 'APPROVED'

  // Risk config
  const riskConfig = request.riskScore < 30
    ? { label: 'Faible', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30', progressClass: '[&>div]:bg-emerald-500', borderColor: 'border-emerald-200 dark:border-emerald-800' }
    : request.riskScore <= 60
      ? { label: 'Moyen', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/30', progressClass: '[&>div]:bg-amber-500', borderColor: 'border-amber-200 dark:border-amber-800' }
      : { label: 'Élevé', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30', progressClass: '[&>div]:bg-red-500', borderColor: 'border-red-200 dark:border-red-800' }

  // Document stats
  const verifiedDocs = request.detailedDocuments.filter((d) => d.statut === 'VERIFIED').length
  const pendingDocs = request.detailedDocuments.filter((d) => d.statut === 'PENDING').length
  const rejectedDocs = request.detailedDocuments.filter((d) => d.statut === 'REJECTED').length
  const totalDocs = request.detailedDocuments.length
  const docProgress = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0

  // Header gradient based on status
  const headerGradient = isApproved
    ? 'from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800'
    : isRejected
      ? 'from-red-600 to-rose-600 dark:from-red-800 dark:to-rose-800'
      : 'from-sky-600 to-cyan-600 dark:from-sky-800 dark:to-cyan-800'

  return (
    <div className="space-y-6">
      {/* ─── HEADER SECTION ─────────────────────────────────────────────────── */}
      <div className="space-y-5">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Retour aux demandes KYC
        </Button>

        {/* Hero Card */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${headerGradient} p-6`}>
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
                      <span className={`size-1.5 rounded-full ${isApproved ? 'bg-emerald-300' : isRejected ? 'bg-red-300' : 'bg-white'}`} />
                      {kycStatusConfig[request.status].label}
                    </span>
                  </div>
                  <p className="text-white/80 text-sm">
                    {request.userName} — <span className="font-mono text-white/60">{request.userId}</span>
                  </p>
                  <div className="flex items-center gap-3 text-white/60 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-3" />
                      <span>Soumis le {formatDate(request.submittedAt)}</span>
                    </div>
                    {request.reviewer && (
                      <>
                        <Separator orientation="vertical" className="h-3 bg-white/30" />
                        <div className="flex items-center gap-1.5">
                          <UserCheck className="size-3" />
                          <span>Réviseur : {request.reviewer}</span>
                        </div>
                      </>
                    )}
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
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-9"
                    onClick={() => setRejectOpen(true)}
                  >
                    <RotateCcw className="size-4 mr-1.5" />
                    Renouveler
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Level transition bar */}
          <div className="p-5 bg-muted/30">
            <div className="flex items-center gap-4 justify-center">
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Niveau Actuel</p>
                <Badge variant="outline" className="text-sm font-semibold px-4 py-1.5">{request.currentLevel}</Badge>
              </div>
              <div className="flex items-center gap-2 text-emerald-500">
                <Separator className="w-6" />
                <ArrowRight className="size-5" />
                <Separator className="w-6" />
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Niveau Demandé</p>
                <Badge className="text-sm font-bold px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white border-0">{request.requestedLevel}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailStatCard
            title="Score de Risque"
            value={`${request.riskScore}/100`}
            subtitle={riskConfig.label}
            icon={AlertTriangle}
            iconBg={riskConfig.bg}
            iconColor={riskConfig.color}
          />
          <DetailStatCard
            title="Documents"
            value={`${verifiedDocs}/${totalDocs}`}
            subtitle={`${docProgress}% vérifiés`}
            icon={FileText}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <DetailStatCard
            title="Réviseur"
            value={request.reviewer || 'Non assigné'}
            subtitle={request.reviewDate ? `Assigné le ${formatDate(request.reviewDate)}` : 'En attente d\'assignation'}
            icon={Eye}
            iconBg="bg-sky-100 dark:bg-sky-900/30"
            iconColor="text-sky-600 dark:text-sky-400"
          />
          <DetailStatCard
            title="Décision"
            value={request.decisionDate ? formatDate(request.decisionDate) : '—'}
            subtitle={isActionable ? 'En cours de traitement' : isApproved ? 'Approuvé' : isRejected ? 'Rejeté' : ''}
            icon={isApproved ? CheckCircle2 : isRejected ? XCircle : Clock}
            iconBg={isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30' : isRejected ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}
            iconColor={isApproved ? 'text-emerald-600 dark:text-emerald-400' : isRejected ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}
          />
        </div>
      </div>

      {/* ─── TABS ──────────────────────────────────────────────────────────── */}
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
            Revue & Conformité
          </TabsTrigger>
          <TabsTrigger value="limits" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ShieldCheck className="size-3.5" />
            Plafonds
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: Documents ────────────────────────────────────────────────── */}
        <TabsContent value="documents" className="space-y-4">
          {/* Document summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-4 text-center">
                <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{verifiedDocs}</p>
                <p className="text-xs text-muted-foreground">Vérifiés</p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 dark:border-amber-800">
              <CardContent className="p-4 text-center">
                <div className="size-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-2">
                  <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{pendingDocs}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </CardContent>
            </Card>
            <Card className="border-red-200 dark:border-red-800">
              <CardContent className="p-4 text-center">
                <div className="size-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-2">
                  <XCircle className="size-4 text-red-600 dark:text-red-400" />
                </div>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedDocs}</p>
                <p className="text-xs text-muted-foreground">Rejetés</p>
              </CardContent>
            </Card>
          </div>

          {/* Document verification progress */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold">Progression de vérification</p>
                  <p className="text-xs text-muted-foreground">{verifiedDocs} sur {totalDocs} documents vérifiés</p>
                </div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{docProgress}%</span>
              </div>
              <Progress value={docProgress} className="h-2.5 [&>div]:bg-emerald-500" />
            </CardContent>
          </Card>

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
                      <TableRow key={i} className="group">
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${
                              doc.statut === 'VERIFIED' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                              doc.statut === 'REJECTED' ? 'bg-red-100 dark:bg-red-900/30' :
                              'bg-amber-100 dark:bg-amber-900/30'
                            }`}>
                              {doc.type === 'SELFIE' ? <ScanFace className={`size-4 ${
                                doc.statut === 'VERIFIED' ? 'text-emerald-600 dark:text-emerald-400' :
                                doc.statut === 'REJECTED' ? 'text-red-600 dark:text-red-400' :
                                'text-amber-600 dark:text-amber-400'
                              }`} /> : <FileText className={`size-4 ${
                                doc.statut === 'VERIFIED' ? 'text-emerald-600 dark:text-emerald-400' :
                                doc.statut === 'REJECTED' ? 'text-red-600 dark:text-red-400' :
                                'text-amber-600 dark:text-amber-400'
                              }`} />}
                            </div>
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
                    <InfoRow icon={ShieldCheck} label="Niveau KYC" value={user.kycLevel} />
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
                {/* Risk score visual */}
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

                {/* Risk level indicator */}
                <div className={`p-4 rounded-xl ${riskConfig.bg} border ${riskConfig.borderColor}`}>
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded-full ${riskConfig.bg} flex items-center justify-center border ${riskConfig.borderColor}`}>
                      {request.riskScore < 30 ? <ShieldCheck className={`size-5 ${riskConfig.color}`} /> :
                       request.riskScore <= 60 ? <AlertTriangle className={`size-5 ${riskConfig.color}`} /> :
                       <AlertTriangle className={`size-5 ${riskConfig.color}`} />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${riskConfig.color}`}>Niveau de risque : {riskConfig.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {request.riskScore < 30 ? 'Aucune action supplémentaire requise' :
                         request.riskScore <= 60 ? 'Vérification renforcée recommandée' :
                         'Vérification manuelle obligatoire — comité conformité'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Compliance Flags */}
                {request.complianceFlags.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Alertes Conformité</p>
                    <div className="space-y-1.5">
                      {request.complianceFlags.map((flag, i) => (
                        <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
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
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                      <p className="text-sm text-red-700 dark:text-red-300">{request.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          {userTransactions.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                      <Wallet className="size-3.5 text-teal-600 dark:text-teal-400" />
                    </div>
                    Transactions Récentes
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">{userTransactions.length} dernières</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Référence</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Montant</TableHead>
                        <TableHead className="font-semibold">Statut</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[10px]">{tx.type}</Badge>
                          </TableCell>
                          <TableCell className="font-bold tabular-nums">{formatXOF(tx.montant)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`text-[10px] ${
                              tx.statut === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' :
                              tx.statut === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' :
                              'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'
                            }`}>{tx.statut}</Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{tx.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ─── TAB 3: Review & Conformité ──────────────────────────────────────── */}
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
                  {/* Step 1: Submission */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 ring-2 ring-background">
                        <FileText className="size-4 text-primary" />
                      </div>
                      <div className="w-px h-full bg-border mt-1" />
                    </div>
                    <div className="pb-6">
                      <p className="text-sm font-semibold">Demande soumise</p>
                      <p className="text-xs text-muted-foreground">{formatDateFull(request.submittedAt)}</p>
                      <p className="text-sm text-muted-foreground mt-1">{request.userName} a soumis une demande de passage de <span className="font-medium">{request.currentLevel}</span> à <span className="font-medium text-emerald-600 dark:text-emerald-400">{request.requestedLevel}</span></p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {request.documents.map((doc, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{doc}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Review assignment */}
                  {request.reviewer && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="size-9 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center shrink-0 ring-2 ring-background">
                          <UserCheck className="size-4 text-sky-600 dark:text-sky-400" />
                        </div>
                        <div className="w-px h-full bg-border mt-1" />
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-semibold">Revue assignée</p>
                        <p className="text-xs text-muted-foreground">{formatDateFull(request.reviewDate)}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <Avatar className="size-5">
                            <AvatarFallback className="bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-[8px] font-bold">
                              {request.reviewer.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">Assignée à <span className="font-medium">{request.reviewer}</span></span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Biometric check (if applicable) */}
                  {request.detailedDocuments.some((d) => d.type === 'SELFIE') && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ring-2 ring-background ${
                          request.detailedDocuments.find((d) => d.type === 'SELFIE')?.statut === 'VERIFIED'
                            ? 'bg-emerald-100 dark:bg-emerald-900/30'
                            : 'bg-amber-100 dark:bg-amber-900/30'
                        }`}>
                          <Fingerprint className={`size-4 ${
                            request.detailedDocuments.find((d) => d.type === 'SELFIE')?.statut === 'VERIFIED'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`} />
                        </div>
                        <div className="w-px h-full bg-border mt-1" />
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-semibold">Vérification biométrique</p>
                        <p className="text-xs text-muted-foreground">Smile Identity</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {request.detailedDocuments.find((d) => d.type === 'SELFIE')?.statut === 'VERIFIED'
                            ? <span className="text-emerald-600 dark:text-emerald-400 font-medium">Correspondance faciale confirmée</span>
                            : <span className="text-amber-600 dark:text-amber-400 font-medium">En cours de vérification...</span>
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Decision */}
                  {request.decisionDate && (
                    <div className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`size-9 rounded-full flex items-center justify-center shrink-0 ring-2 ring-background ${
                          isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'
                        }`}>
                          {isApproved ? <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" /> : <XCircle className="size-4 text-red-600 dark:text-red-400" />}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {isApproved ? 'Demande approuvée' : 'Demande rejetée'}
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDateFull(request.decisionDate)}</p>
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
                        <div className="size-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 animate-pulse ring-2 ring-background">
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

            {/* Review Notes + Compliance */}
            <div className="space-y-4">
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
                          rows={3}
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

              {/* Compliance Workflow */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Scale className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Workflow Conformité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Workflow steps */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="size-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Vérification documentaire</p>
                        <p className="text-xs text-muted-foreground">CNI recto/verso vérifiée</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                        request.detailedDocuments.some((d) => d.type === 'SELFIE' && d.statut === 'VERIFIED')
                          ? 'bg-emerald-100 dark:bg-emerald-900/30'
                          : 'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        {request.detailedDocuments.some((d) => d.type === 'SELFIE' && d.statut === 'VERIFIED')
                          ? <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                          : <Clock className="size-4 text-amber-600 dark:text-amber-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Vérification biométrique</p>
                        <p className="text-xs text-muted-foreground">Smile Identity</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                        request.riskScore < 30
                          ? 'bg-emerald-100 dark:bg-emerald-900/30'
                          : request.riskScore <= 60
                            ? 'bg-amber-100 dark:bg-amber-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        <AlertTriangle className={`size-4 ${
                          request.riskScore < 30 ? 'text-emerald-600 dark:text-emerald-400' :
                          request.riskScore <= 60 ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-600 dark:text-red-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Évaluation du risque</p>
                        <p className="text-xs text-muted-foreground">Score : {request.riskScore}/100 — {riskConfig.label}</p>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground shrink-0" />
                    </div>

                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                        isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                        isRejected ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-gray-100 dark:bg-gray-900/30'
                      }`}>
                        {isApproved ? <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" /> :
                         isRejected ? <XCircle className="size-4 text-red-600 dark:text-red-400" /> :
                         <Clock className="size-4 text-gray-400" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Décision finale</p>
                        <p className="text-xs text-muted-foreground">
                          {isApproved ? 'Approuvé — niveau mis à jour' :
                           isRejected ? 'Rejeté — notification envoyée' :
                           'En attente de décision'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ─── TAB 4: Limits ──────────────────────────────────────────────────── */}
        <TabsContent value="limits" className="space-y-4">
          {/* Comparison cards */}
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
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Documents requis</p>
                      <p className="text-sm">{tier.documents}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* All Tier Levels */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BadgeCheck className="size-3.5 text-primary" />
                </div>
                Référence des Niveaux KYC
              </CardTitle>
              <CardDescription>Tableau comparatif des plafonds par niveau</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="font-semibold">Niveau</TableHead>
                      <TableHead className="font-semibold">Documents</TableHead>
                      <TableHead className="font-semibold">Dépôt Max</TableHead>
                      <TableHead className="font-semibold">Retrait Max</TableHead>
                      <TableHead className="font-semibold">Transfert Max</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {kycLevels.map((tier, i) => {
                      const isCurrentLevel = tier.level.startsWith(request.currentLevel)
                      const isRequestedLevel = tier.level.startsWith(request.requestedLevel)
                      return (
                        <TableRow key={i} className={
                          isRequestedLevel ? 'bg-emerald-50/50 dark:bg-emerald-950/20' :
                          isCurrentLevel ? 'bg-muted/30' : ''
                        }>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={`text-xs font-bold ${isRequestedLevel ? 'border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400' : isCurrentLevel ? 'border-primary text-primary' : ''}`}>
                                {tier.level.split('—')[0].trim()}
                              </Badge>
                              {isCurrentLevel && (
                                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-muted text-muted-foreground">Actuel</Badge>
                              )}
                              {isRequestedLevel && (
                                <Badge className="text-[9px] px-1.5 py-0 h-4 bg-emerald-600 text-white">Demandé</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{tier.documents}</TableCell>
                          <TableCell className="text-sm font-medium">{tier.depotMax}</TableCell>
                          <TableCell className="text-sm font-medium">{tier.retraitMax}</TableCell>
                          <TableCell className="text-sm font-medium">{tier.transfertMax}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── DIALOGS ────────────────────────────────────────────────────────── */}

      {/* Approve Dialog */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-emerald-600" />
              Approuver la demande KYC
            </DialogTitle>
            <DialogDescription>
              Vous allez approuver le passage de {request.userName} de {request.currentLevel} à {request.requestedLevel}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                <strong>Effet :</strong> Les plafonds de l&apos;utilisateur seront automatiquement mis à jour au niveau {request.requestedLevel}.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Résumé de la demande</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Utilisateur</div>
                <div className="font-medium">{request.userName}</div>
                <div className="text-muted-foreground">Score de risque</div>
                <div className={`font-medium ${riskConfig.color}`}>{request.riskScore}/100 ({riskConfig.label})</div>
                <div className="text-muted-foreground">Documents vérifiés</div>
                <div className="font-medium">{verifiedDocs}/{totalDocs}</div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Annuler</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setApproveOpen(false)}>
              <CheckCircle2 className="size-4 mr-2" />
              Confirmer l&apos;approbation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="size-5 text-red-600" />
              Rejeter la demande KYC
            </DialogTitle>
            <DialogDescription>
              Vous allez rejeter la demande de {request.userName}. Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-700 dark:text-red-300">
                <strong>Attention :</strong> L&apos;utilisateur sera notifié du rejet et pourra soumettre une nouvelle demande avec des documents corrigés.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Raison du rejet *</label>
              <Textarea
                placeholder="Expliquez la raison du rejet..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Annuler</Button>
            <Button variant="destructive" disabled={!rejectReason.trim()} onClick={() => { setRejectOpen(false); setRejectReason('') }}>
              <XCircle className="size-4 mr-2" />
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
