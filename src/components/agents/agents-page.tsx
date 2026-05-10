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
  MapPin,
  Phone,
  Store,
  Hash,
  BadgeCheck,
  X,
  Wallet,
  ArrowUpDown,
  Plus,
  MoreHorizontal,
  ShieldCheck,
  Ban,
  Download,
  FilterX,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  agents,
  type Agent,
  type AgentStatus,
} from "@/lib/mock-data"
import { AgentDetailPage } from "./agent-detail-page"

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatXOF(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " XOF"
}

function formatCompact(value: number): string {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`
  return value.toString()
}

const ITEMS_PER_PAGE = 8

type SortField = "code" | "nom" | "statut" | "commerce" | "transactionsJour" | "volumeJour" | "performance"
type SortDirection = "asc" | "desc"

function getInitials(nom: string, prenom: string): string {
  return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()
}

/* ─── Badge Configs ────────────────────────────────────────────────────────── */

const statusConfig: Record<AgentStatus, { label: string; className: string; dotClass: string; icon: React.ElementType }> = {
  ACTIVE: {
    label: "Actif",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    dotClass: "bg-emerald-500",
    icon: CheckCircle,
  },
  PENDING: {
    label: "En attente",
    className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    dotClass: "bg-amber-500",
    icon: Clock,
  },
  INACTIVE: {
    label: "Inactif",
    className: "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
    dotClass: "bg-gray-400",
    icon: UserX,
  },
  SUSPENDED: {
    label: "Suspendu",
    className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    dotClass: "bg-red-500",
    icon: XCircle,
  },
}

function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={`gap-1.5 font-medium ${config.className}`}>
      <span className={`size-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </Badge>
  )
}

/* ─── Stat Card ────────────────────────────────────────────────────────────── */

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBg,
  iconColor,
}: {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: string
  iconBg: string
  iconColor: string
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-4 md:p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
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

/* ─── Float Progress ───────────────────────────────────────────────────────── */

function FloatProgress({ actuel, min }: { actuel: number; min: number }) {
  const ratio = min > 0 ? Math.min((actuel / min) * 100, 100) : 0
  const isLow = ratio < 50
  const isCritical = ratio < 25

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Float</span>
        <span className={`text-xs font-bold tabular-nums ${isCritical ? "text-red-600 dark:text-red-400" : isLow ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"}`}>
          {formatCompact(actuel)} / {formatCompact(min)}
        </span>
      </div>
      <Progress
        value={ratio}
        className={`h-1.5 ${isCritical ? "[&>div]:bg-red-500" : isLow ? "[&>div]:bg-amber-500" : "[&>div]:bg-emerald-500"}`}
      />
    </div>
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
                {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{agent.prenom} {agent.nom}</p>
              <p className="text-sm text-muted-foreground">{agent.commerce} — {agent.localisation}</p>
            </div>
          </div>

          <Separator />

          {/* Configuration Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Float Initial (XOF)</label>
              <Input
                type="number"
                value={floatAmount}
                onChange={(e) => setFloatAmount(e.target.value)}
                placeholder="500000"
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Minimum recommandé : {formatXOF(agent.floatMin)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Taux de Commission (%)</label>
              <Input
                type="number"
                step="0.1"
                value={commissionRate}
                onChange={(e) => setCommissionRate(e.target.value)}
                placeholder="1.5"
                className="text-lg font-semibold"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Taux standard : 1.0% – 2.0%
              </p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-11"
              onClick={() => onOpenChange(false)}
            >
              <BadgeCheck className="size-4 mr-2" />
              Confirmer l&apos;Approbation
            </Button>
            <Button
              variant="destructive"
              className="flex-1 h-11"
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

/* ─── Agent Row (Desktop Table) ────────────────────────────────────────────── */

function AgentTableRow({
  agent,
  onViewDetail,
}: {
  agent: Agent
  onViewDetail: (agent: Agent) => void
}) {
  return (
    <TableRow className="cursor-pointer hover:bg-muted/50 group" onClick={() => onViewDetail(agent)}>
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="size-9 border">
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              {getInitials(agent.nom, agent.prenom)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm group-hover:text-primary transition-colors">{agent.prenom} {agent.nom}</p>
            <p className="text-xs text-muted-foreground font-mono">{agent.code}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <AgentStatusBadge status={agent.statut} />
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="space-y-0.5">
          <p className="text-sm font-medium">{agent.commerce}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="size-3" />
            {agent.localisation}
          </p>
        </div>
      </TableCell>
      <TableCell className="hidden sm:table-cell text-right">
        <p className="text-sm font-bold tabular-nums">{agent.transactionsJour}</p>
        <p className="text-xs text-muted-foreground">tx/jour</p>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-right">
        <p className="text-sm font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{formatCompact(agent.volumeJour)}</p>
        <p className="text-xs text-muted-foreground">XOF/jour</p>
      </TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="w-24">
          <FloatProgress actuel={agent.floatActuel} min={agent.floatMin} />
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        <div className="flex items-center gap-1">
          <span className={`text-sm font-bold tabular-nums ${
            agent.performance > 90 ? "text-emerald-600 dark:text-emerald-400" :
            agent.performance > 70 ? "text-amber-600 dark:text-amber-400" :
            "text-red-600 dark:text-red-400"
          }`}>
            {agent.performance > 0 ? `${agent.performance}%` : "—"}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewDetail(agent) }}>
              <Eye className="size-4 mr-2" />
              Voir détails
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {agent.statut === "ACTIVE" && (
              <DropdownMenuItem className="text-red-600">
                <Ban className="size-4 mr-2" />
                Suspendre
              </DropdownMenuItem>
            )}
            {agent.statut === "SUSPENDED" && (
              <DropdownMenuItem className="text-emerald-600">
                <ShieldCheck className="size-4 mr-2" />
                Réactiver
              </DropdownMenuItem>
            )}
            {agent.statut === "PENDING" && (
              <DropdownMenuItem className="text-emerald-600">
                <BadgeCheck className="size-4 mr-2" />
                Approuver
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

/* ─── Pending Agent Card ───────────────────────────────────────────────────── */

function PendingAgentCard({
  agent,
  onApprove,
  onViewDetail,
}: {
  agent: Agent
  onApprove: (agent: Agent) => void
  onViewDetail: (agent: Agent) => void
}) {
  return (
    <Card className="border-amber-200 dark:border-amber-800/50 hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <Avatar className="size-14 border-2 border-amber-200 dark:border-amber-800 shrink-0">
            <AvatarFallback className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-lg">
              {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-base">{agent.prenom} {agent.nom}</h3>
                <p className="text-xs text-muted-foreground font-mono">{agent.code}</p>
              </div>
              <AgentStatusBadge status={agent.statut} />
            </div>

            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="size-4" />
                <span>{agent.telephone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Store className="size-4" />
                <span className="font-medium text-foreground">{agent.commerce}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                <span>{agent.localisation}</span>
              </div>
            </div>

            <div className="mt-3 rounded-xl bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">Float minimum requis</p>
              <p className="text-lg font-bold">{formatXOF(agent.floatMin)}</p>
            </div>

            <div className="mt-4 flex gap-2">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-10"
                onClick={(e) => { e.stopPropagation(); onApprove(agent) }}
              >
                <BadgeCheck className="size-4 mr-1.5" />
                Approuver
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-10"
              >
                <X className="size-4 mr-1.5" />
                Rejeter
              </Button>
              <Button
                variant="outline"
                className="h-10 px-3"
                onClick={(e) => { e.stopPropagation(); onViewDetail(agent) }}
              >
                <Eye className="size-4" />
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
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>("nom")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [approvalAgent, setApprovalAgent] = useState<Agent | null>(null)
  const [approvalOpen, setApprovalOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)

  // Stats (must be before conditional return — hooks order)
  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.statut === "ACTIVE").length
  const pendingAgents = agents.filter((a) => a.statut === "PENDING").length
  const totalVolume = agents.reduce((s, a) => s + a.volumeJour, 0)
  const lowFloatAgents = agents.filter((a) => a.statut === "ACTIVE" && a.floatActuel < a.floatMin).length
  const activeRate = totalAgents > 0 ? ((activeAgents / totalAgents) * 100).toFixed(0) : "0"

  // Filter agents for "Tous les Agents" tab
  const filteredAgents = useMemo(() => {
    const filtered = agents.filter((agent) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase().trim()
        const searchable = [
          agent.code,
          agent.id,
          agent.nom,
          agent.prenom,
          `${agent.prenom} ${agent.nom}`,
          `${agent.nom} ${agent.prenom}`,
          agent.commerce,
          agent.localisation,
          agent.telephone,
          agent.email,
        ].join(" ").toLowerCase()
        if (!searchable.includes(q)) return false
      }
      if (statusFilter !== "all" && agent.statut !== statusFilter) return false
      return true
    })

    filtered.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case "code": cmp = a.code.localeCompare(b.code); break
        case "nom": cmp = `${a.prenom} ${a.nom}`.localeCompare(`${b.prenom} ${b.nom}`); break
        case "statut": cmp = a.statut.localeCompare(b.statut); break
        case "commerce": cmp = a.commerce.localeCompare(b.commerce); break
        case "transactionsJour": cmp = a.transactionsJour - b.transactionsJour; break
        case "volumeJour": cmp = a.volumeJour - b.volumeJour; break
        case "performance": cmp = a.performance - b.performance; break
      }
      return sortDirection === "asc" ? cmp : -cmp
    })

    return filtered
  }, [searchQuery, statusFilter, sortField, sortDirection])

  const totalPages = Math.max(1, Math.ceil(filteredAgents.length / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const paginatedAgents = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredAgents.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredAgents, safeCurrentPage])

  // Pending agents
  const pendingAgentsList = agents.filter((a) => a.statut === "PENDING")

  const handleSort = (field: SortField) => {
    setSortDirection((prev) => sortField === field && prev === "asc" ? "desc" : "asc")
    setSortField(field)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCurrentPage(1)
  }

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
  const endIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, filteredAgents.length)
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all"

  // If an agent is selected, show detail page
  if (selectedAgentId) {
    return <AgentDetailPage agentId={selectedAgentId} onBack={() => setSelectedAgentId(null)} />
  }

  // Open detail — navigate to detail page
  const openDetail = (agent: Agent) => {
    setSelectedAgentId(agent.id)
  }

  // Open approval — open modal
  const openApproval = (agent: Agent) => {
    setApprovalAgent(agent)
    setApprovalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Gestion des Agents</h1>
          <p className="text-muted-foreground mt-1">Supervisez les agents, leur float et les demandes d&apos;activation RICASH</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-4" />
            Exporter
          </Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm gap-2">
            <Plus className="size-4" />
            Nouvel Agent
          </Button>
        </div>
      </div>

      {/* ─── Stat Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total"
          value={totalAgents.toLocaleString("fr-FR")}
          icon={UserCog}
          iconBg="bg-emerald-100 dark:bg-emerald-950"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend="Tous les agents"
        />
        <StatCard
          title="Actifs"
          value={activeAgents.toLocaleString("fr-FR")}
          icon={CheckCircle}
          iconBg="bg-emerald-100 dark:bg-emerald-950"
          iconColor="text-emerald-600 dark:text-emerald-400"
          trend={`${activeRate}% du parc`}
        />
        <StatCard
          title="En attente"
          value={pendingAgents.toLocaleString("fr-FR")}
          icon={Clock}
          iconBg="bg-amber-100 dark:bg-amber-950"
          iconColor="text-amber-600 dark:text-amber-400"
          trend="Approbation requise"
        />
        <StatCard
          title="Float bas"
          value={lowFloatAgents.toLocaleString("fr-FR")}
          icon={Wallet}
          iconBg="bg-red-100 dark:bg-red-950"
          iconColor="text-red-600 dark:text-red-400"
          trend={`${formatCompact(totalVolume)} XOF traités/jour`}
        />
      </div>

      {/* ─── Tabs ───────────────────────────────────────────────────────────── */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="all" className="gap-1.5 data-[state=active]:bg-background">
            <Hash className="size-3.5" />
            Tous les Agents
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1.5 data-[state=active]:bg-background relative">
            <Clock className="size-3.5" />
            En Attente
            {pendingAgentsList.length > 0 && (
              <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                {pendingAgentsList.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* ─── Tab 1: All Agents ──────────────────────────────────────────── */}
        <TabsContent value="all" className="space-y-4">
          {/* Search & Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom, code, téléphone, commerce..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Select
                    value={statusFilter}
                    onValueChange={handleStatusChange}
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
                  {hasActiveFilters && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-foreground" onClick={resetFilters}>
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

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Liste des Agents</CardTitle>
                  <CardDescription className="mt-1">
                    {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""} trouvé{filteredAgents.length !== 1 ? "s" : ""}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead>
                        <SortableHeader label="Agent" field="nom" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead>
                        <SortableHeader label="Statut" field="statut" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <SortableHeader label="Commerce" field="commerce" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead className="hidden sm:table-cell text-right">
                        <SortableHeader label="Tx/Jour" field="transactionsJour" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="justify-end" />
                      </TableHead>
                      <TableHead className="hidden lg:table-cell text-right">
                        <SortableHeader label="Volume" field="volumeJour" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} className="justify-end" />
                      </TableHead>
                      <TableHead className="hidden lg:table-cell">Float</TableHead>
                      <TableHead className="hidden md:table-cell">
                        <SortableHeader label="Perf." field="performance" sortField={sortField} sortDirection={sortDirection} onSort={handleSort} />
                      </TableHead>
                      <TableHead className="w-[60px] text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedAgents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <UserCog className="size-8 opacity-40" />
                            <p className="text-sm">Aucun agent trouvé pour ces critères.</p>
                            {hasActiveFilters && (
                              <Button variant="link" size="sm" onClick={resetFilters}>
                                Réinitialiser les filtres
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedAgents.map((agent) => (
                        <AgentTableRow
                          key={agent.id}
                          agent={agent}
                          onViewDetail={openDetail}
                        />
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredAgents.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    {startIndex}–{endIndex} sur {filteredAgents.length} agent{filteredAgents.length !== 1 ? "s" : ""}
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
        </TabsContent>

        {/* ─── Tab 2: Pending Approval ────────────────────────────────────── */}
        <TabsContent value="pending" className="space-y-4">
          {pendingAgentsList.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle className="size-16 text-emerald-500/50 mx-auto mb-4" />
                <p className="font-semibold text-lg">Tout est à jour !</p>
                <p className="text-sm text-muted-foreground mt-1">Aucun agent en attente d&apos;approbation</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingAgentsList.map((agent) => (
                <PendingAgentCard
                  key={agent.id}
                  agent={agent}
                  onApprove={openApproval}
                  onViewDetail={openDetail}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* ─── Approval Dialog ────────────────────────────────────────────────── */}
      <ApprovalDialog
        agent={approvalAgent}
        open={approvalOpen}
        onOpenChange={setApprovalOpen}
      />
    </div>
  )
}
