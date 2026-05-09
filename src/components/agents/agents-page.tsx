"use client"

import { useState, useMemo } from "react"
import {
  UserCog,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  UserX,
  Eye,
  Pencil,
  ToggleLeft,
  MapPin,
  Phone,
  Store,
  Hash,
  BadgeCheck,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  agents,
  type Agent,
  type AgentStatus,
} from "@/lib/mock-data"

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatXOF(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " XOF"
}

/* ─── Badge Configs ────────────────────────────────────────────────────────── */

const statusConfig: Record<AgentStatus, { label: string; className: string; icon: React.ElementType }> = {
  ACTIVE: {
    label: "Actif",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle,
  },
  PENDING: {
    label: "En attente",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800",
    icon: Clock,
  },
  INACTIVE: {
    label: "Inactif",
    className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700",
    icon: UserX,
  },
  SUSPENDED: {
    label: "Suspendu",
    className: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
    icon: XCircle,
  },
}

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

/* ─── Float Progress ───────────────────────────────────────────────────────── */

function FloatProgress({ actuel, min }: { actuel: number; min: number }) {
  const ratio = min > 0 ? Math.min((actuel / min) * 100, 100) : 0
  const isLow = ratio < 50
  const isCritical = ratio < 25

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Float</span>
        <span className={`font-medium ${isCritical ? "text-red-600 dark:text-red-400" : isLow ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
          {formatXOF(actuel)} / {formatXOF(min)}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${
            isCritical ? "bg-red-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${ratio}%` }}
        />
      </div>
    </div>
  )
}

/* ─── Agent Detail Dialog ──────────────────────────────────────────────────── */

function AgentDetailDialog({
  agent,
  open,
  onOpenChange,
}: {
  agent: Agent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!agent) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="size-5 text-primary" />
            Détails de l&apos;Agent
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Agent Info Header */}
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{agent.prenom} {agent.nom}</h3>
              <p className="text-sm text-muted-foreground font-mono">{agent.code}</p>
              <div className="mt-1">
                <AgentStatusBadge status={agent.statut} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground" />
              <span className="text-sm">{agent.telephone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-muted-foreground" />
              <span className="text-sm">{agent.localisation}</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Store className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">{agent.commerce}</span>
            </div>
          </div>

          <Separator />

          {/* Financial Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Float Actuel</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {formatXOF(agent.floatActuel)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Float Minimum</p>
              <p className="text-lg font-semibold text-muted-foreground">
                {formatXOF(agent.floatMin)}
              </p>
            </div>
          </div>

          <FloatProgress actuel={agent.floatActuel} min={agent.floatMin} />

          <Separator />

          {/* Performance */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Commission</p>
              <p className="text-sm font-semibold">{agent.commission}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tx Aujourd&apos;hui</p>
              <p className="text-sm font-semibold">{agent.transactionsJour}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Volume Jour</p>
              <p className="text-sm font-semibold">{agent.volumeJour > 0 ? formatXOF(agent.volumeJour) : "—"}</p>
            </div>
          </div>

          {agent.dateApprobation && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground">Date d&apos;approbation</p>
                <p className="text-sm">{agent.dateApprobation}</p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Approval Form Dialog ─────────────────────────────────────────────────── */

function ApprovalDialog({
  agent,
  open,
  onOpenChange,
}: {
  agent: Agent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [floatAmount, setFloatAmount] = useState("500000")
  const [commissionRate, setCommissionRate] = useState("1.5")

  if (!agent) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BadgeCheck className="size-5 text-emerald-600" />
            Approuver l&apos;Agent
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Agent Summary */}
          <div className="rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{agent.prenom} {agent.nom}</p>
                <p className="text-xs text-muted-foreground">{agent.commerce} — {agent.localisation}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Configuration Form */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Float Initial (XOF)</label>
              <Input
                type="number"
                value={floatAmount}
                onChange={(e) => setFloatAmount(e.target.value)}
                placeholder="500000"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Minimum recommandé : {formatXOF(agent.floatMin)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Taux de Commission (%)</label>
              <Input
                type="number"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="1.5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Taux standard : 1.0% – 2.0%
              </p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => onOpenChange(false)}
            >
              <BadgeCheck className="size-4 mr-2" />
              Confirmer l&apos;Approbation
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4 mr-2" />
              Rejeter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Agent Card ───────────────────────────────────────────────────────────── */

function AgentCard({
  agent,
  onViewDetail,
}: {
  agent: Agent
  onViewDetail: (agent: Agent) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-11 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{agent.prenom} {agent.nom}</h3>
                <p className="text-xs text-muted-foreground font-mono">{agent.code}</p>
              </div>
              <AgentStatusBadge status={agent.statut} />
            </div>

            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="size-3" />
                <span>{agent.telephone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Store className="size-3" />
                <span className="truncate">{agent.commerce}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                <span className="truncate">{agent.localisation}</span>
              </div>
            </div>

            <div className="mt-3">
              <FloatProgress actuel={agent.floatActuel} min={agent.floatMin} />
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-[10px] text-muted-foreground">Commission</p>
                <p className="text-xs font-semibold">{agent.commission}%</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Tx/Jour</p>
                <p className="text-xs font-semibold">{agent.transactionsJour}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Vol/Jour</p>
                <p className="text-xs font-semibold">{agent.volumeJour > 0 ? formatXOF(agent.volumeJour) : "—"}</p>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-7"
                onClick={() => onViewDetail(agent)}
              >
                <Eye className="size-3 mr-1" />
                Voir détails
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-7"
              >
                <Pencil className="size-3 mr-1" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2"
              >
                <ToggleLeft className="size-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Pending Agent Card ───────────────────────────────────────────────────── */

function PendingAgentCard({
  agent,
  onApprove,
}: {
  agent: Agent
  onApprove: (agent: Agent) => void
}) {
  return (
    <Card className="border-yellow-200 dark:border-yellow-800 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12 shrink-0">
            <AvatarFallback className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-bold">
              {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{agent.prenom} {agent.nom}</h3>
                <p className="text-xs text-muted-foreground font-mono">{agent.code}</p>
              </div>
              <AgentStatusBadge status={agent.statut} />
            </div>

            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-3.5" />
                <span>{agent.telephone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Store className="size-3.5" />
                <span className="font-medium text-foreground">{agent.commerce}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-3.5" />
                <span>{agent.localisation}</span>
              </div>
            </div>

            <div className="mt-3 rounded-lg bg-muted/50 p-2.5">
              <p className="text-xs text-muted-foreground">Float minimum requis</p>
              <p className="text-sm font-semibold">{formatXOF(agent.floatMin)}</p>
            </div>

            <div className="mt-3 flex gap-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-9"
                onClick={() => onApprove(agent)}
              >
                <BadgeCheck className="size-4 mr-1.5" />
                Approuver
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-9"
              >
                <X className="size-4 mr-1.5" />
                Rejeter
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export function AgentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [approvalAgent, setApprovalAgent] = useState<Agent | null>(null)
  const [approvalOpen, setApprovalOpen] = useState(false)

  // Stats
  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.statut === "ACTIVE").length
  const pendingAgents = agents.filter((a) => a.statut === "PENDING").length
  const suspendedAgents = agents.filter((a) => a.statut === "SUSPENDED").length

  // Filter agents for "Tous les Agents" tab
  const filteredAgents = useMemo(() => {
    return agents.filter((agent) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          agent.code.toLowerCase().includes(q) ||
          agent.nom.toLowerCase().includes(q) ||
          agent.prenom.toLowerCase().includes(q) ||
          agent.commerce.toLowerCase().includes(q) ||
          agent.localisation.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (statusFilter !== "all" && agent.statut !== statusFilter) return false
      return true
    })
  }, [searchQuery, statusFilter])

  // Pending agents
  const pendingAgentsList = agents.filter((a) => a.statut === "PENDING")

  // Open detail
  const openDetail = (agent: Agent) => {
    setSelectedAgent(agent)
    setDetailOpen(true)
  }

  // Open approval
  const openApproval = (agent: Agent) => {
    setApprovalAgent(agent)
    setApprovalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserCog className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gestion des Agents</h1>
            <p className="text-sm text-muted-foreground">Gestion et suivi des agents RICASH</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <UserCog className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Agents</p>
                <p className="text-xl font-bold">{totalAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Actifs</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{activeAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Clock className="size-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En attente</p>
                <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">{pendingAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="size-4 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Suspendus</p>
                <p className="text-xl font-bold text-red-700 dark:text-red-400">{suspendedAgents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all" className="gap-1.5">
            <Hash className="size-3.5" />
            Tous les Agents
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5 relative">
            <Clock className="size-3.5" />
            En Attente d&apos;Approbation
            {pendingAgentsList.length > 0 && (
              <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-white">
                {pendingAgentsList.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: All Agents */}
        <TabsContent value="all" className="space-y-4">
          {/* Search & Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, code, commerce, localisation..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="ACTIVE">Actif</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="INACTIVE">Inactif</SelectItem>
                    <SelectItem value="SUSPENDED">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Agent Cards Grid */}
          {filteredAgents.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Aucun agent trouvé
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onViewDetail={openDetail}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Tab 2: Pending Approval */}
        <TabsContent value="pending" className="space-y-4">
          {pendingAgentsList.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <CheckCircle className="size-12 text-emerald-500 mx-auto mb-3" />
                <p className="font-medium">Aucun agent en attente d&apos;approbation</p>
                <p className="text-sm mt-1">Toutes les demandes ont été traitées</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAgentsList.map((agent) => (
                <PendingAgentCard
                  key={agent.id}
                  agent={agent}
                  onApprove={openApproval}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Agent Detail Dialog */}
      <AgentDetailDialog
        agent={selectedAgent}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      {/* Approval Dialog */}
      <ApprovalDialog
        agent={approvalAgent}
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
      />
    </div>
  )
}
