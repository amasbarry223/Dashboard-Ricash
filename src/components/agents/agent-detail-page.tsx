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
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  agents,
  type Agent,
  type AgentStatus,
  floatMovements,
  type FloatMovement,
  type FloatMovementType,
  agentDocuments,
  type AgentDocument,
  type DocumentStatus,
  agentPerformanceData,
  type AgentDailyPerformance,
  transactions,
  type Transaction,
  type TransactionType,
  type TransactionStatus,
} from '@/lib/mock-data'

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatXOF(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value) + ' XOF'
}

/* ─── Status Badge Configs ─────────────────────────────────────────────────── */

const statusConfig: Record<AgentStatus, { label: string; className: string; icon: React.ElementType }> = {
  ACTIVE: { label: 'Actif', className: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800', icon: CheckCircle },
  PENDING: { label: 'En attente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800', icon: Clock },
  INACTIVE: { label: 'Inactif', className: 'bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700', icon: UserX },
  SUSPENDED: { label: 'Suspendu', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800', icon: XCircle },
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

const docStatusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  VALIDE: { label: 'Validé', className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800' },
  EN_ATTENTE: { label: 'En attente', className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800' },
  REJETE: { label: 'Rejeté', className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800' },
}

/* ─── Small Badge Components ───────────────────────────────────────────────── */

function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
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
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}

/* ─── Simple Bar Chart ─────────────────────────────────────────────────────── */

function SimpleBarChart({
  data,
  valueKey,
  label,
  colorClass = 'bg-emerald-500',
  hoverColorClass = 'bg-emerald-400',
}: {
  data: AgentDailyPerformance[]
  valueKey: 'commissions' | 'volume'
  label: string
  colorClass?: string
  hoverColorClass?: string
}) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        Aucune donnée disponible
      </div>
    )
  }

  const maxValue = Math.max(...data.map((d) => d[valueKey]), 1)

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="flex items-end gap-1 h-48">
        {data.map((item, index) => {
          const heightPct = (item[valueKey] / maxValue) * 100
          return (
            <div key={index} className="flex-1 flex flex-col justify-end items-center gap-1 min-w-0 group relative" style={{ height: '100%' }}>
              <div
                className={`w-full rounded-t-sm transition-all ${colorClass} cursor-pointer relative hover:opacity-80`}
                style={{ height: `${Math.max(heightPct, 2)}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                  <div className="bg-popover text-popover-foreground border rounded-md px-2 py-1 text-xs font-medium shadow-md whitespace-nowrap">
                    {formatXOF(item[valueKey])}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex gap-1">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center min-w-0">
            <span className="text-[9px] text-muted-foreground block truncate">{item.date}</span>
          </div>
        ))}
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

  // Agent not found
  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <UserX className="size-16 text-muted-foreground" />
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

  return (
    <div className="space-y-6">
      {/* ─── HEADER SECTION ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        {/* Back button */}
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Retour
        </Button>

        {/* Agent identity row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-emerald-600 text-white font-bold text-lg">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold">{agent.prenom} {agent.nom}</h1>
                <AgentStatusBadge status={agent.statut} />
                {agent.apiConnected ? (
                  <span className="inline-flex items-center rounded-md border bg-emerald-50 border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                    API
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-md border bg-orange-50 border-orange-200 px-2 py-0.5 text-xs font-medium text-orange-700 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                    Démo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-muted-foreground">{agent.commerce}</span>
                <Separator orientation="vertical" className="h-3" />
                <span className="text-sm font-mono text-muted-foreground">{agent.code}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {agent.statut === 'ACTIVE' && (
              <Button variant="destructive" onClick={() => setSuspendOpen(true)}>
                <XCircle className="size-4 mr-2" />
                Suspendre
              </Button>
            )}
            {agent.statut === 'SUSPENDED' && (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setReactivateOpen(true)}>
                <ShieldCheck className="size-4 mr-2" />
                Réactiver
              </Button>
            )}
            {agent.statut === 'PENDING' && (
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setApproveOpen(true)}>
                <BadgeCheck className="size-4 mr-2" />
                Approuver
              </Button>
            )}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Wallet className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Solde Float</p>
                  <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatXOF(agent.floatActuel)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <TrendingUp className="size-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Volume Journalier</p>
                  <p className="text-lg font-bold text-teal-700 dark:text-teal-400">{formatXOF(agent.volumeJour)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transactions/Jour</p>
                  <p className="text-lg font-bold">{agent.transactionsJour}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`size-9 rounded-lg ${perfBg} flex items-center justify-center`}>
                  <Zap className="size-4" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Performance %</p>
                  <p className={`text-lg font-bold ${perfColor}`}>{agent.performance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ─── TABS ──────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="profil" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="float">Float</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: Profil ────────────────────────────────────────────────── */}
        <TabsContent value="profil" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Informations Agent */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="size-4 text-primary" />
                  Informations Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  <Store className="size-4 text-primary" />
                  Informations Commerce
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Store} label="Nom du commerce" value={agent.commerce} />
                <InfoRow icon={Calendar} label="Date de création" value={agent.dateCreation} />
                <InfoRow icon={Percent} label="Commission" value={`${agent.commission}%`} />
                {agent.dateApprobation && (
                  <InfoRow icon={BadgeCheck} label="Date d'approbation" value={agent.dateApprobation} />
                )}
              </CardContent>
            </Card>

            {/* Documents Légaux */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Documents Légaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                {agentDocs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Aucun document</p>
                ) : (
                  <div className="space-y-3">
                    {agentDocs.map((doc) => (
                      <div key={doc.id} className="flex items-start gap-3">
                        <FileText className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium truncate">{doc.nom}</span>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">{doc.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
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
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Solde Float Actuel</p>
                  <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400">{formatXOF(agent.floatActuel)}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Seuil minimum : {formatXOF(agent.floatMin)}
                  </p>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setApprovisionnerOpen(true)}>
                  <Plus className="size-4 mr-2" />
                  Approvisionner
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Float movements table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Mouvements de Float</CardTitle>
            </CardHeader>
            <CardContent>
              {agentFloatMovements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Aucun mouvement de float</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Solde Avant</TableHead>
                        <TableHead>Solde Après</TableHead>
                        <TableHead>Créé Par</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentFloatMovements.map((fm) => (
                        <TableRow key={fm.id}>
                          <TableCell>
                            <FloatTypeBadge type={fm.type} />
                          </TableCell>
                          <TableCell className={`font-medium ${fm.montant >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                            {fm.montant >= 0 ? '+' : ''}{formatXOF(fm.montant)}
                          </TableCell>
                          <TableCell>{formatXOF(fm.soldeAvant)}</TableCell>
                          <TableCell>{formatXOF(fm.soldeApres)}</TableCell>
                          <TableCell className="text-sm">{fm.creePar}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{fm.date}</TableCell>
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Transactions de l&apos;Agent</CardTitle>
            </CardHeader>
            <CardContent>
              {agentTransactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <BarChart3 className="size-12 mb-3" />
                  <p className="font-medium">Aucune transaction trouvée</p>
                  <p className="text-sm mt-1">Cet agent n&apos;a pas encore de transactions enregistrées</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agentTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="font-mono text-sm">{tx.reference}</TableCell>
                          <TableCell>
                            <TxTypeBadge type={tx.type} />
                          </TableCell>
                          <TableCell className="font-medium">{formatXOF(tx.montant)}</TableCell>
                          <TableCell>
                            <TxStatusBadge status={tx.statut} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tx.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ─── TAB 4: Performance ───────────────────────────────────────────── */}
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Commissions chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Commissions Journalières (14 jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart
                  data={perfData}
                  valueKey="commissions"
                  label="Commissions"
                  colorClass="bg-emerald-500"
                  hoverColorClass="bg-emerald-400"
                />
              </CardContent>
            </Card>

            {/* Volume chart */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Volume Journalier (14 jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleBarChart
                  data={perfData}
                  valueKey="volume"
                  label="Volume"
                  colorClass="bg-teal-500"
                  hoverColorClass="bg-teal-400"
                />
              </CardContent>
            </Card>
          </div>

          {/* Ranking Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="size-4 text-primary" />
                Classement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Position parmi les agents actifs</p>
                    <p className="text-2xl font-bold">
                      {rank > 0 ? `#${rank}` : '—'} <span className="text-sm font-normal text-muted-foreground">sur {totalActive}</span>
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium ${rankLabelClass}`}>
                    {rankLabel}
                  </span>
                </div>

                {/* Visual progress bar showing position among top 10 */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Top 10 agents par performance</p>
                  <div className="flex items-end gap-1 h-24">
                    {activeAgents.slice(0, 10).map((a, idx) => {
                      const isCurrentAgent = a.id === agentId
                      const barHeight = Math.max((a.performance / 100) * 100, 5)
                      return (
                        <div key={a.id} className="flex-1 flex flex-col justify-end items-center gap-1" style={{ height: '100%' }}>
                          <div
                            className={`w-full rounded-t-sm transition-colors ${
                              isCurrentAgent
                                ? 'bg-emerald-500 ring-2 ring-emerald-300'
                                : 'bg-muted-foreground/20'
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                          <span className={`text-[9px] ${isCurrentAgent ? 'font-bold text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'}`}>
                            {idx + 1}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ─── MODALS ────────────────────────────────────────────────────────── */}

      {/* Suspendre Modal */}
      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="size-5 text-red-600" />
              Suspendre l&apos;Agent
            </DialogTitle>
            <DialogDescription>
              Vous êtes sur le point de suspendre l&apos;agent {agent.prenom} {agent.nom}. Cette action désactivera toutes ses opérations.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Justification</label>
              <Textarea
                placeholder="Raison de la suspension..."
                value={suspendJustification}
                onChange={(e) => setSuspendJustification(e.target.value)}
                rows={3}
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
              <XCircle className="size-4 mr-2" />
              Confirmer la suspension
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Réactiver Modal */}
      <Dialog open={reactivateOpen} onOpenChange={setReactivateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-emerald-600" />
              Réactiver l&apos;Agent
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir réactiver cet agent ? Il pourra à nouveau effectuer des opérations.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/50 p-4 flex items-center gap-3">
            <Avatar className="size-10">
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BadgeCheck className="size-5 text-emerald-600" />
              Approuver l&apos;Agent
            </DialogTitle>
            <DialogDescription>
              Configurez les paramètres de l&apos;agent avant approbation.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Agent Summary */}
            <div className="rounded-lg bg-muted/50 p-3 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-emerald-600 text-white font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{agent.prenom} {agent.nom}</p>
                <p className="text-xs text-muted-foreground">{agent.commerce}</p>
              </div>
            </div>

            <Separator />

            {/* Commission rate input */}
            <div>
              <label className="text-sm font-medium mb-1.5 block">Taux de Commission (%)</label>
              <Input
                type="number"
                step="0.1"
                min={0.1}
                max={100}
                value={approveCommission}
                onChange={(e) => setApproveCommission(e.target.value)}
                placeholder="1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">Taux standard : 1.0% – 2.0%</p>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-5 text-emerald-600" />
              Approvisionner le Float
            </DialogTitle>
            <DialogDescription>
              Ajouter des fonds au float de l&apos;agent {agent.prenom} {agent.nom}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Solde actuel</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">{formatXOF(agent.floatActuel)}</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Montant (XOF)</label>
              <Input
                type="number"
                min={10000}
                max={50000000}
                value={approvMontant}
                onChange={(e) => setApprovMontant(e.target.value)}
                placeholder="Entrez le montant"
              />
              <p className="text-xs text-muted-foreground mt-1">Min : 10 000 XOF — Max : 50 000 000 XOF</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">Justification</label>
              <Textarea
                placeholder="Raison de l'approvisionnement..."
                value={approvJustification}
                onChange={(e) => setApprovJustification(e.target.value)}
                rows={3}
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

/* ─── Info Row Helper ──────────────────────────────────────────────────────── */

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="size-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  )
}
