'use client'

import { useState, useMemo } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  UserX,
  Wallet,
  TrendingUp,
  BarChart3,
  Zap,
  Phone,
  Mail,
  MapPin,
  Building2,
  Globe,
  Home,
  Store,
  Calendar,
  Percent,
  FileText,
  Plus,
  Ban,
  ShieldCheck,
  BadgeCheck,
  X,
  ChevronRight,
  Activity,
  Trophy,
  AlertTriangle,
  ExternalLink,
  Copy,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  agents,
  type Agent,
  type AgentStatus,
  floatMovements,
  type FloatMovementType,
  agentDocuments,
  type DocumentStatus,
  agentPerformanceData,
  transactions,
  type TransactionType,
  type TransactionStatus,
} from '@/lib/mock-data'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatXOF(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' XOF'
}

function formatCompact(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toString()
}

/* ─── Status Badge Configs ─────────────────────────────────────────────────── */

const statusConfig: Record<AgentStatus, { label: string; className: string; dotClass: string; icon: React.ElementType }> = {
  ACTIVE: { label: 'Actif', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800', dotClass: 'bg-emerald-500', icon: CheckCircle },
  PENDING: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', dotClass: 'bg-amber-500', icon: Clock },
  INACTIVE: { label: 'Inactif', className: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700', dotClass: 'bg-gray-400', icon: UserX },
  SUSPENDED: { label: 'Suspendu', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', dotClass: 'bg-red-500', icon: XCircle },
}

const typeConfig: Record<TransactionType, { label: string; className: string }> = {
  DEPOT: { label: 'Dépôt', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' },
  RETRAIT: { label: 'Retrait', className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800' },
  TRANSFERT: { label: 'Transfert', className: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800' },
  PAIEMENT: { label: 'Paiement', className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800' },
}

const statusTxConfig: Record<TransactionStatus, { label: string; className: string; icon: React.ElementType }> = {
  COMPLETED: { label: 'Réussi', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800', icon: CheckCircle },
  PENDING: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', icon: Clock },
  FAILED: { label: 'Échoué', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', icon: XCircle },
  CANCELLED: { label: 'Annulé', className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700', icon: Ban },
}

const floatTypeConfig: Record<FloatMovementType, { label: string; className: string }> = {
  APPROVISIONNEMENT: { label: 'Approvisionnement', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' },
  RETRAIT: { label: 'Retrait', className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800' },
  AJUSTEMENT: { label: 'Ajustement', className: 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700' },
}

const docStatusConfig: Record<DocumentStatus, { label: string; className: string; icon: React.ElementType }> = {
  VALIDE: { label: 'Validé', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800', icon: CheckCircle },
  EN_ATTENTE: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800', icon: Clock },
  REJETE: { label: 'Rejeté', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800', icon: XCircle },
}

/* ─── Small Badge Components ───────────────────────────────────────────────── */

function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${config.className}`}>
      <span className={`size-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  )
}

function TxTypeBadge({ type }: { type: TransactionType }) {
  const config = typeConfig[type]
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function TxStatusBadge({ status }: { status: TransactionStatus }) {
  const config = statusTxConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

function FloatTypeBadge({ type }: { type: FloatMovementType }) {
  const config = floatTypeConfig[type]
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

function DocStatusBadge({ status }: { status: DocumentStatus }) {
  const config = docStatusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

/* ─── Chart Configs ────────────────────────────────────────────────────────── */

const commissionsChartConfig: ChartConfig = {
  commissions: {
    label: 'Commissions',
    color: 'hsl(160, 84%, 39%)',
  },
}

const volumeChartConfig: ChartConfig = {
  volume: {
    label: 'Volume',
    color: 'hsl(172, 66%, 50%)',
  },
}

/* ─── Stat Card ────────────────────────────────────────────────────────────── */

function DetailStatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  subtitle,
  trend,
}: {
  title: string
  value: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  subtitle?: string
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

/* ─── Main Component ───────────────────────────────────────────────────────── */

interface AgentDetailPageProps {
  agentId: string
  onBack: () => void
}

export function AgentDetailPage({ agentId, onBack }: AgentDetailPageProps) {
  // State for modals
  const [suspendOpen, setSuspendOpen] = useState(false)
  const [reactivateOpen, setReactivateOpen] = useState(false)
  const [approveOpen, setApproveOpen] = useState(false)
  const [approvisionnerOpen, setApprovisionnerOpen] = useState(false)

  // Form state
  const [suspendJustification, setSuspendJustification] = useState('')
  const [approvMontant, setApprovMontant] = useState('')
  const [approvJustification, setApprovJustification] = useState('')
  const [approveCommission, setApproveCommission] = useState('1.5')

  // Pagination for transactions
  const [txPage, setTxPage] = useState(1)
  const txPerPage = 8

  // Find agent
  const agent = useMemo(() => agents.find((a) => a.id === agentId), [agentId])

  // Filtered data
  const agentDocs = useMemo(() => agentDocuments.filter((d) => d.agentId === agentId), [agentId])
  const agentFloatMovements = useMemo(
    () => floatMovements.filter((f) => f.agentId === agentId).sort((a, b) => b.date.localeCompare(a.date)),
    [agentId]
  )
  const agentTransactions = useMemo(() => {
    if (!agent) return []
    const fullName = `${agent.prenom} ${agent.nom}`
    const seen = new Set<string>()
    return transactions
      .filter((t) => {
        if (seen.has(t.id)) return false
        if (t.expediteur === agentId || t.destinataire === agentId || t.expediteur === fullName || t.destinataire === fullName) {
          seen.add(t.id)
          return true
        }
        return false
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [agentId, agent])

  const perfData = useMemo(() => agentPerformanceData[agentId] || [], [agentId])

  // Pagination for transactions
  const totalPages = Math.ceil(agentTransactions.length / txPerPage)
  const paginatedTransactions = agentTransactions.slice((txPage - 1) * txPerPage, txPage * txPerPage)

  // Agent not found
  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <UserX className="size-16 text-muted-foreground/50" />
        <h2 className="text-xl font-semibold">Agent introuvable</h2>
        <p className="text-muted-foreground">L&apos;agent demandé n&apos;existe pas ou a été supprimé.</p>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  // Performance color
  const perfColor =
    agent.performance > 90
      ? 'text-emerald-600 dark:text-emerald-400'
      : agent.performance > 70
        ? 'text-amber-600 dark:text-amber-400'
        : 'text-red-600 dark:text-red-400'

  const perfBg =
    agent.performance > 90
      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
      : agent.performance > 70
        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'

  // Ranking computation
  const activeAgents = agents.filter((a) => a.statut === 'ACTIVE').sort((a, b) => b.performance - a.performance)
  const rank = activeAgents.findIndex((a) => a.id === agentId) + 1
  const totalActive = activeAgents.length
  const rankLabel = agent.performance > 90 ? 'Excellent' : agent.performance > 70 ? 'Bon' : 'À améliorer'
  const rankLabelClass =
    agent.performance > 90
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
      : agent.performance > 70
        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800'

  const initials = `${agent.prenom.charAt(0)}${agent.nom.charAt(0)}`

  // Float health
  const floatRatio = agent.floatMin > 0 ? (agent.floatActuel / agent.floatMin) * 100 : 0
  const isFloatCritical = floatRatio < 50
  const isFloatLow = floatRatio < 100 && !isFloatCritical

  // Document stats
  const validDocs = agentDocs.filter((d) => d.statut === 'VALIDE').length
  const pendingDocs = agentDocs.filter((d) => d.statut === 'EN_ATTENTE').length
  const rejectedDocs = agentDocs.filter((d) => d.statut === 'REJETE').length

  return (
    <div className="space-y-6">
      {/* ─── HEADER SECTION ─────────────────────────────────────────────────── */}
      <div className="space-y-5">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Retour à la liste
        </Button>

        {/* Agent identity hero card */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center gap-4">
                <Avatar className="size-16 border-4 border-white/20 shadow-lg">
                  <AvatarFallback className="bg-white/20 text-white font-bold text-xl backdrop-blur-sm">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-white">{agent.prenom} {agent.nom}</h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/20 border border-white/30 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                      <span className="size-1.5 rounded-full bg-white" />
                      {statusConfig[agent.statut].label}
                    </span>
                    {agent.apiConnected ? (
                      <span className="inline-flex items-center rounded-full bg-white/20 border border-white/30 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        API
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] font-bold text-white/70 uppercase tracking-wider">
                        Démo
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Store className="size-3.5" />
                    <span>{agent.commerce}</span>
                    <Separator orientation="vertical" className="h-3 bg-white/30" />
                    <span className="font-mono text-xs">{agent.code}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {agent.statut === 'ACTIVE' && (
                  <>
                    <Button
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-9"
                      onClick={() => setApprovisionnerOpen(true)}
                    >
                      <Plus className="size-4 mr-1.5" />
                      Approvisionner
                    </Button>
                    <Button
                      className="bg-red-500/90 hover:bg-red-500 text-white border border-red-400/30 h-9"
                      onClick={() => setSuspendOpen(true)}
                    >
                      <Ban className="size-4 mr-1.5" />
                      Suspendre
                    </Button>
                  </>
                )}
                {agent.statut === 'SUSPENDED' && (
                  <Button
                    className="bg-white text-emerald-700 hover:bg-white/90 border border-white/30 h-9"
                    onClick={() => setReactivateOpen(true)}
                  >
                    <ShieldCheck className="size-4 mr-1.5" />
                    Réactiver
                  </Button>
                )}
                {agent.statut === 'PENDING' && (
                  <Button
                    className="bg-white text-emerald-700 hover:bg-white/90 border border-white/30 h-9"
                    onClick={() => setApproveOpen(true)}
                  >
                    <BadgeCheck className="size-4 mr-1.5" />
                    Approuver
                  </Button>
                )}
                {agent.statut === 'INACTIVE' && (
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-9"
                    onClick={() => setApprovisionnerOpen(true)}
                  >
                    <Plus className="size-4 mr-1.5" />
                    Approvisionner
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <DetailStatCard
            title="Solde Float"
            value={formatXOF(agent.floatActuel)}
            icon={Wallet}
            iconBg={isFloatCritical ? 'bg-red-100 dark:bg-red-900/30' : isFloatLow ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}
            iconColor={isFloatCritical ? 'text-red-600 dark:text-red-400' : isFloatLow ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}
            subtitle={`Seuil min : ${formatCompact(agent.floatMin)} XOF`}
          />
          <DetailStatCard
            title="Volume Journalier"
            value={formatXOF(agent.volumeJour)}
            icon={TrendingUp}
            iconBg="bg-teal-100 dark:bg-teal-900/30"
            iconColor="text-teal-600 dark:text-teal-400"
            trend={{ value: 8.4, label: 'cette semaine' }}
          />
          <DetailStatCard
            title="Transactions/Jour"
            value={agent.transactionsJour.toString()}
            icon={BarChart3}
            iconBg="bg-primary/10"
            iconColor="text-primary"
          />
          <DetailStatCard
            title="Performance"
            value={`${agent.performance}%`}
            icon={Zap}
            iconBg={perfBg}
            iconColor={perfColor}
          />
        </div>
      </div>

      {/* ─── TABS ──────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="profil" className="space-y-4">
        <TabsList className="bg-muted/50 p-1">
          <TabsTrigger value="profil" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Building2 className="size-3.5" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="float" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Wallet className="size-3.5" />
            Float
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <ArrowLeft className="size-3.5" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-1.5 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Activity className="size-3.5" />
            Performance
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: Profil ────────────────────────────────────────────────── */}
        <TabsContent value="profil" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Informations Agent */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Building2 className="size-3.5 text-primary" />
                  </div>
                  Informations Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={Building2} label="Nom" value={agent.nom} />
                <InfoRow icon={Building2} label="Prénom" value={agent.prenom} />
                <InfoRow icon={Phone} label="Téléphone" value={agent.telephone} />
                <InfoRow icon={Mail} label="Email" value={agent.email} />
                <InfoRow icon={MapPin} label="Ville" value={agent.ville} />
                <InfoRow icon={Globe} label="Pays" value={agent.pays} />
                <InfoRow icon={Home} label="Adresse" value={agent.adresse} />
              </CardContent>
            </Card>

            {/* Informations Commerce */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                    <Store className="size-3.5 text-teal-600 dark:text-teal-400" />
                  </div>
                  Informations Commerce
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <InfoRow icon={Store} label="Nom du commerce" value={agent.commerce} />
                <InfoRow icon={Calendar} label="Date de création" value={agent.dateCreation} />
                <InfoRow icon={Percent} label="Commission" value={`${agent.commission}%`} />
                {agent.dateApprobation && (
                  <InfoRow icon={BadgeCheck} label="Date d'approbation" value={agent.dateApprobation} />
                )}
                <InfoRow icon={MapPin} label="Localisation" value={agent.localisation} />
                <InfoRow icon={Activity} label="Statut" value={statusConfig[agent.statut].label} />
                <InfoRow icon={Zap} label="Connexion API" value={agent.apiConnected ? 'Oui (API)' : 'Non (Démo)'} />
              </CardContent>
            </Card>

            {/* Documents Légaux */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <FileText className="size-3.5 text-amber-600 dark:text-amber-400" />
                  </div>
                  Documents Légaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Document summary */}
                <div className="flex gap-3 mb-4">
                  <div className="flex-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 p-2 text-center">
                    <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{validDocs}</p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400">Validés</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-amber-50 dark:bg-amber-950 p-2 text-center">
                    <p className="text-lg font-bold text-amber-700 dark:text-amber-400">{pendingDocs}</p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400">En attente</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-red-50 dark:bg-red-950 p-2 text-center">
                    <p className="text-lg font-bold text-red-700 dark:text-red-400">{rejectedDocs}</p>
                    <p className="text-[10px] text-red-600 dark:text-red-400">Rejetés</p>
                  </div>
                </div>

                {agentDocs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun document</p>
                ) : (
                  <div className="space-y-2.5">
                    {agentDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="size-8 rounded-lg bg-muted/50 flex items-center justify-center shrink-0">
                          <FileText className="size-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium truncate">{doc.nom}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">{doc.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <DocStatusBadge status={doc.statut} />
                            <span className="text-xs text-muted-foreground">{doc.dateSoumission}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ─── TAB 2: Float ─────────────────────────────────────────────────── */}
        <TabsContent value="float" className="space-y-4">
          {/* Current balance card */}
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-800 dark:to-teal-800 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-sm text-white/70 font-medium">Solde Float Actuel</p>
                    <p className="text-3xl font-bold text-white mt-1">{formatXOF(agent.floatActuel)}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="size-2 rounded-full bg-white/50" />
                        <span className="text-xs text-white/70">Seuil minimum : {formatXOF(agent.floatMin)}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm h-11"
                    onClick={() => setApprovisionnerOpen(true)}
                  >
                    <Plus className="size-4 mr-2" />
                    Approvisionner
                  </Button>
                </div>
              </div>
              {/* Float health bar */}
              <div className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground">Niveau de Float</span>
                  <span className="text-xs font-bold tabular-nums">{Math.round(floatRatio)}%</span>
                </div>
                <Progress
                  value={Math.min(floatRatio, 100)}
                  className={`h-2 ${isFloatCritical ? '[&>div]:bg-red-500' : isFloatLow ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
                />
                {isFloatCritical && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-red-600 dark:text-red-400">
                    <AlertTriangle className="size-3.5" />
                    <span className="font-medium">Float critique — Approvisionnement urgent recommandé</span>
                  </div>
                )}
                {isFloatLow && !isFloatCritical && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-3.5" />
                    <span className="font-medium">Float en dessous du seuil recommandé</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Float movements table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Activity className="size-3.5 text-primary" />
                </div>
                Mouvements de Float
              </CardTitle>
              <CardDescription>Historique des approvisionnements, retraits et ajustements</CardDescription>
            </CardHeader>
            <CardContent>
              {agentFloatMovements.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Wallet className="size-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">Aucun mouvement de float</p>
                  <p className="text-sm mt-1">Cet agent n&apos;a pas encore de mouvements enregistrés</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Montant</TableHead>
                        <TableHead className="font-semibold">Solde Avant</TableHead>
                        <TableHead className="font-semibold">Solde Après</TableHead>
                        <TableHead className="font-semibold">Créé Par</TableHead>
                        <TableHead className="font-semibold">Justification</TableHead>
                        <TableHead className="font-semibold">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentFloatMovements.map((fm) => (
                        <TableRow key={fm.id}>
                          <TableCell>
                            <FloatTypeBadge type={fm.type} />
                          </TableCell>
                          <TableCell className={`font-bold tabular-nums ${fm.montant >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {fm.montant >= 0 ? '+' : ''}{formatXOF(fm.montant)}
                          </TableCell>
                          <TableCell className="text-sm tabular-nums">{formatXOF(fm.soldeAvant)}</TableCell>
                          <TableCell className="text-sm tabular-nums font-medium">{formatXOF(fm.soldeApres)}</TableCell>
                          <TableCell className="text-sm">{fm.creePar}</TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{fm.justification}</TableCell>
                          <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{fm.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 3: Transactions ──────────────────────────────────────────── */}
        <TabsContent value="transactions" className="space-y-4">
          {/* Transaction summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold">{agentTransactions.length}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {agentTransactions.filter((t) => t.statut === 'COMPLETED').length}
                </p>
                <p className="text-xs text-muted-foreground">Réussies</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {agentTransactions.filter((t) => t.statut === 'PENDING').length}
                </p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  {agentTransactions.filter((t) => t.statut === 'FAILED' || t.statut === 'CANCELLED').length}
                </p>
                <p className="text-xs text-muted-foreground">Échouées/Annulées</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="size-3.5 text-primary" />
                </div>
                Historique des Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {agentTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <BarChart3 className="size-16 mb-4 opacity-30" />
                  <p className="font-semibold text-lg">Aucune transaction trouvée</p>
                  <p className="text-sm mt-1">Cet agent n&apos;a pas encore de transactions enregistrées</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/30">
                          <TableHead className="font-semibold">Référence</TableHead>
                          <TableHead className="font-semibold">Type</TableHead>
                          <TableHead className="font-semibold">Montant</TableHead>
                          <TableHead className="font-semibold">Frais</TableHead>
                          <TableHead className="font-semibold">Expéditeur</TableHead>
                          <TableHead className="font-semibold">Destinataire</TableHead>
                          <TableHead className="font-semibold">Statut</TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedTransactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell className="font-mono text-xs">{tx.reference}</TableCell>
                            <TableCell>
                              <TxTypeBadge type={tx.type} />
                            </TableCell>
                            <TableCell className="font-bold tabular-nums">{formatXOF(tx.montant)}</TableCell>
                            <TableCell className="text-sm text-muted-foreground tabular-nums">{formatXOF(tx.frais)}</TableCell>
                            <TableCell className="text-sm max-w-[120px] truncate">{tx.expediteur}</TableCell>
                            <TableCell className="text-sm max-w-[120px] truncate">{tx.destinataire}</TableCell>
                            <TableCell>
                              <TxStatusBadge status={tx.statut} />
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{tx.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <p className="text-sm text-muted-foreground">
                        Affichage {(txPage - 1) * txPerPage + 1}–{Math.min(txPage * txPerPage, agentTransactions.length)} sur {agentTransactions.length}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={txPage <= 1}
                          onClick={() => setTxPage((p) => p - 1)}
                        >
                          Précédent
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={page === txPage ? "default" : "outline"}
                              size="sm"
                              className="size-8 p-0"
                              onClick={() => setTxPage(page)}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={txPage >= totalPages}
                          onClick={() => setTxPage((p) => p + 1)}
                        >
                          Suivant
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 4: Performance ───────────────────────────────────────────── */}
        <TabsContent value="performance" className="space-y-4">
          {perfData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Commissions Area Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <TrendingUp className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Commissions Journalières
                    </CardTitle>
                    <CardDescription>Évolution sur les 14 derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={commissionsChartConfig} className="h-[280px] w-full aspect-auto">
                      <AreaChart data={perfData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fillCommissions" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-commissions)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-commissions)" stopOpacity={0.05} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          fontSize={11}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          fontSize={11}
                          tickFormatter={(val: number) => formatCompact(val)}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                          formatter={(value: number) => formatXOF(value)}
                        />
                        <Area
                          type="monotone"
                          dataKey="commissions"
                          stroke="var(--color-commissions)"
                          fill="url(#fillCommissions)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Volume Bar Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="size-7 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                        <BarChart3 className="size-3.5 text-teal-600 dark:text-teal-400" />
                      </div>
                      Volume Journalier
                    </CardTitle>
                    <CardDescription>Évolution sur les 14 derniers jours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={volumeChartConfig} className="h-[280px] w-full aspect-auto">
                      <BarChart data={perfData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          fontSize={11}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          fontSize={11}
                          tickFormatter={(val: number) => formatCompact(val)}
                        />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                          formatter={(value: number) => formatXOF(value)}
                        />
                        <Bar
                          dataKey="volume"
                          fill="var(--color-volume)"
                          radius={[4, 4, 0, 0]}
                          maxBarSize={40}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="size-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="font-semibold">Aucune donnée de performance</p>
                <p className="text-sm text-muted-foreground mt-1">Cet agent n&apos;a pas encore de données de performance disponibles</p>
              </CardContent>
            </Card>
          )}

          {/* Ranking Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="size-7 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Trophy className="size-3.5 text-amber-600 dark:text-amber-400" />
                </div>
                Classement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Position parmi les agents actifs</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <p className="text-3xl font-bold">
                        {rank > 0 ? `#${rank}` : '—'}
                      </p>
                      <span className="text-sm text-muted-foreground">sur {totalActive} agents</span>
                    </div>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-semibold ${rankLabelClass}`}>
                    {rankLabel}
                  </span>
                </div>

                <Separator />

                {/* Visual ranking bars */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Top 10 agents par performance</p>
                  <div className="flex items-end gap-1.5 h-28">
                    {activeAgents.slice(0, 10).map((a, idx) => {
                      const isCurrentAgent = a.id === agentId
                      const barHeight = Math.max((a.performance / 100) * 100, 5)
                      return (
                        <div key={a.id} className="flex-1 flex flex-col justify-end items-center gap-1.5 relative group" style={{ height: '100%' }}>
                          {/* Tooltip */}
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                            <div className="bg-popover text-popover-foreground border rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-lg whitespace-nowrap">
                              <p className="font-semibold">{a.prenom} {a.nom}</p>
                              <p className="text-muted-foreground">{a.performance}%</p>
                            </div>
                          </div>
                          <div
                            className={`w-full rounded-t-md transition-all ${
                              isCurrentAgent
                                ? 'bg-emerald-500 ring-2 ring-emerald-300 dark:ring-emerald-700'
                                : 'bg-muted-foreground/15 hover:bg-muted-foreground/25'
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                          <span className={`text-[10px] font-bold ${isCurrentAgent ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                            {idx + 1}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Performance gauge */}
                {agent.performance > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Score de performance</span>
                        <span className={`font-bold ${perfColor}`}>{agent.performance}%</span>
                      </div>
                      <Progress
                        value={agent.performance}
                        className={`h-3 ${
                          agent.performance > 90 ? '[&>div]:bg-emerald-500' :
                          agent.performance > 70 ? '[&>div]:bg-amber-500' :
                          '[&>div]:bg-red-500'
                        }`}
                      />
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>0%</span>
                        <span className="text-red-500">Faible</span>
                        <span className="text-amber-500">Moyen</span>
                        <span className="text-emerald-500">Excellent</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── MODALS ────────────────────────────────────────────────────────── */}

      {/* Suspendre Modal */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="size-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Ban className="size-5 text-red-600 dark:text-red-400" />
              </div>
              Suspendre l&apos;Agent
            </DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de suspendre l&apos;agent <strong>{agent.prenom} {agent.nom}</strong>. Cette action désactivera toutes ses opérations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-xl bg-red-50 dark:bg-red-950/30 p-4 flex items-center gap-3">
              <Avatar className="size-10 border-2 border-red-200 dark:border-red-800">
                <AvatarFallback className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{agent.prenom} {agent.nom}</p>
                <p className="text-xs text-muted-foreground">{agent.commerce} — {agent.code}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Justification de la suspension</label>
              <Textarea
                placeholder="Raison de la suspension (obligatoire)..."
                value={suspendJustification}
                onChange={(e) => setSuspendJustification(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setSuspendOpen(false); setSuspendJustification('') }}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={!suspendJustification.trim()}
              onClick={() => { setSuspendOpen(false); setSuspendJustification('') }}
            >
              <Ban className="size-4 mr-2" />
              Confirmer la suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Réactiver Modal */}
      <Dialog open={reactivateOpen} onOpenChange={setReactivateOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <ShieldCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              Réactiver l&apos;Agent
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir réactiver cet agent ? Il pourra à nouveau effectuer des opérations.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 flex items-center gap-3">
            <Avatar className="size-10 border-2 border-emerald-200 dark:border-emerald-800">
              <AvatarFallback className="bg-emerald-600 text-white font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{agent.prenom} {agent.nom}</p>
              <p className="text-xs text-muted-foreground">{agent.commerce} — {agent.code}</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReactivateOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setReactivateOpen(false)}
            >
              <ShieldCheck className="size-4 mr-2" />
              Confirmer la réactivation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approuver Modal */}
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <BadgeCheck className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              Approuver l&apos;Agent
            </DialogTitle>
            <DialogDescription>
              Configurez les paramètres de l&apos;agent avant son activation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {/* Agent Summary */}
            <div className="rounded-xl bg-muted/50 p-4 flex items-center gap-3">
              <Avatar className="size-12 border-2 border-emerald-200 dark:border-emerald-800">
                <AvatarFallback className="bg-emerald-600 text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{agent.prenom} {agent.nom}</p>
                <p className="text-sm text-muted-foreground">{agent.commerce}</p>
              </div>
            </div>

            <Separator />

            {/* Commission rate input */}
            <div>
              <label className="text-sm font-medium mb-2 block">Taux de Commission (%)</label>
              <Input
                type="number"
                step="0.1"
                min={0.1}
                max={100}
                value={approveCommission}
                onChange={(e) => setApproveCommission(e.target.value)}
                placeholder="1.5"
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground mt-1.5">Taux standard : 1.0% – 2.0%</p>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setApproveOpen(false)}
            >
              <BadgeCheck className="size-4 mr-2" />
              Confirmer l&apos;approbation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approvisionner Modal */}
      <Dialog open={approvisionnerOpen} onOpenChange={setApprovisionnerOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-lg">
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Plus className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              Approvisionner le Float
            </DialogTitle>
            <DialogDescription>
              Ajouter des fonds au float de l&apos;agent <strong>{agent.prenom} {agent.nom}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            {/* Current balance */}
            <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-4">
              <p className="text-xs text-muted-foreground font-medium">Solde actuel</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{formatXOF(agent.floatActuel)}</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Montant (XOF)</label>
              <Input
                type="number"
                min={10000}
                max={50000000}
                value={approvMontant}
                onChange={(e) => setApprovMontant(e.target.value)}
                placeholder="Entrez le montant"
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground mt-1.5">Min : 10 000 XOF — Max : 50 000 000 XOF</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Justification</label>
              <Textarea
                placeholder="Raison de l'approvisionnement (obligatoire)..."
                value={approvJustification}
                onChange={(e) => setApprovJustification(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => { setApprovisionnerOpen(false); setApprovMontant(''); setApprovJustification('') }}>
              Annuler
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              disabled={!approvMontant.trim() || !approvJustification.trim()}
              onClick={() => { setApprovisionnerOpen(false); setApprovMontant(''); setApprovJustification('') }}
            >
              <Plus className="size-4 mr-2" />
              Confirmer l&apos;approvisionnement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
