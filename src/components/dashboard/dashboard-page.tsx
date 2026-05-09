"use client"

import {
  TrendingUp,
  ArrowUpRight,
  Users,
  UserCheck,
  CheckCircle,
  Wallet,
  AlertTriangle,
  Shield,
  Activity,
  Server,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  kpiData,
  transactionVolumeData,
  userGrowthData,
  adminAlerts,
  transactions,
  serviceStatuses,
  type AdminAlert,
} from "@/lib/mock-data"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const iconMap = {
  TrendingUp,
  ArrowUpRight,
  Users,
  UserCheck,
  CheckCircle,
  Wallet,
}

function formatXOF(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value) + " XOF"
}

function KpiCard({ kpi, index }: { kpi: typeof kpiData[0]; index: number }) {
  const Icon = iconMap[kpi.icon] || Activity
  const isPositive = kpi.change > 0

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardDescription className="text-xs font-medium">{kpi.label}</CardDescription>
        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="size-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl font-bold tracking-tight">{kpi.value}</div>
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`text-xs font-medium ${
              isPositive ? "text-success" : "text-destructive"
            }`}
          >
            {isPositive ? "+" : ""}
            {kpi.change}%
          </span>
          <span className="text-muted-foreground text-xs">vs mois précédent</span>
        </div>
      </CardContent>
      <div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 to-primary"
        style={{ opacity: 0.6 }}
      />
    </Card>
  )
}

function AlertCard({ alert }: { alert: AdminAlert }) {
  const severityStyles = {
    critical: "border-l-destructive bg-destructive/5",
    warning: "border-l-warning bg-warning/5",
    info: "border-l-info bg-info/5",
  }

  const severityBadge = {
    critical: "destructive" as const,
    warning: "outline" as const,
    info: "secondary" as const,
  }

  return (
    <div
      className={`border-l-4 rounded-md p-3 ${severityStyles[alert.severity]}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={severityBadge[alert.severity]} className="text-[10px] px-1.5 py-0">
              {alert.type}
            </Badge>
            <span className="text-muted-foreground text-[10px]">{alert.time}</span>
          </div>
          <p className="text-xs text-foreground/80">{alert.message}</p>
        </div>
        <Button variant="outline" size="sm" className="shrink-0 text-[10px] h-6 px-2">
          {alert.action}
        </Button>
      </div>
    </div>
  )
}

function RecentTransaction({ tx }: { tx: typeof transactions[0] }) {
  const typeColors = {
    DEPOT: "bg-success/10 text-success",
    RETRAIT: "bg-warning/10 text-warning-foreground",
    TRANSFERT: "bg-primary/10 text-primary",
    PAIEMENT: "bg-info/10 text-info",
  }

  const typeLabels = {
    DEPOT: "Dépôt",
    RETRAIT: "Retrait",
    TRANSFERT: "Transfert",
    PAIEMENT: "Paiement",
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${typeColors[tx.type]}`}>
        {tx.type.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {typeLabels[tx.type]} — {formatXOF(tx.montant)}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {tx.expediteur} → {tx.destinataire}
        </p>
      </div>
      <div className="text-right shrink-0">
        <Badge
          variant={
            tx.statut === "COMPLETED"
              ? "default"
              : tx.statut === "PENDING"
              ? "outline"
              : tx.statut === "FAILED"
              ? "destructive"
              : "secondary"
          }
          className="text-[10px]"
        >
          {tx.statut === "COMPLETED" ? "Réussi" : tx.statut === "PENDING" ? "En attente" : tx.statut === "FAILED" ? "Échoué" : "Annulé"}
        </Badge>
        <p className="text-[10px] text-muted-foreground mt-0.5">{tx.date.split(" ")[1]}</p>
      </div>
    </div>
  )
}

function ServiceStatusCard({ service }: { service: typeof serviceStatuses[0] }) {
  const statusStyles = {
    UP: "bg-success",
    DOWN: "bg-destructive",
    DEGRADED: "bg-warning",
  }

  const statusLabels = {
    UP: "Opérationnel",
    DOWN: "Indisponible",
    DEGRADED: "Dégradé",
  }

  return (
    <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-2">
        <span className={`size-2.5 rounded-full ${statusStyles[service.status]} animate-pulse`} />
        <Server className="size-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{service.name}</p>
        <p className="text-[10px] text-muted-foreground">{service.tech} · :{service.port}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs font-medium">{statusLabels[service.status]}</p>
        <p className="text-[10px] text-muted-foreground">Uptime: {service.uptime}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => (
          <KpiCard key={i} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transaction Volume Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Volume des Transactions</CardTitle>
            <CardDescription className="text-xs">Montants en millions XOF par mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionVolumeData} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="depots" name="Dépôts" fill="hsl(155, 70%, 40%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="retraits" name="Retraits" fill="hsl(75, 70%, 55%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="transferts" name="Transferts" fill="hsl(160, 50%, 60%)" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="paiements" name="Paiements" fill="hsl(230, 50%, 55%)" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Croissance Utilisateurs & Agents</CardTitle>
            <CardDescription className="text-xs">Nombre d'utilisateurs et agents actifs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Area
                    type="monotone"
                    dataKey="utilisateurs"
                    name="Utilisateurs"
                    stroke="hsl(155, 70%, 40%)"
                    fill="hsl(155, 70%, 40%)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="agents"
                    name="Agents"
                    stroke="hsl(75, 70%, 55%)"
                    fill="hsl(75, 70%, 55%)"
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Alerts + Recent Transactions + Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <AlertTriangle className="size-4 text-warning" />
                Alertes
              </CardTitle>
              <Badge variant="destructive" className="text-[10px]">
                {adminAlerts.filter((a) => a.severity === "critical").length} critiques
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 max-h-80 overflow-y-auto scrollbar-thin">
            {adminAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Transactions Récentes</CardTitle>
          </CardHeader>
          <CardContent className="max-h-80 overflow-y-auto scrollbar-thin">
            {transactions.slice(0, 6).map((tx) => (
              <RecentTransaction key={tx.id} tx={tx} />
            ))}
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                Microservices
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">
                {serviceStatuses.filter((s) => s.status === "UP").length}/{serviceStatuses.length} UP
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 max-h-80 overflow-y-auto scrollbar-thin">
            {serviceStatuses.map((service) => (
              <ServiceStatusCard key={service.name} service={service} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
