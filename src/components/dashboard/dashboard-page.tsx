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
  ArrowRight,
  Sparkles,
  Clock,
  Zap,
  Gem,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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

/* ─── KPI Card ──────────────────────────────────────────────────────────────── */
function KpiCard({ kpi, index }: { kpi: typeof kpiData[0]; index: number }) {
  const Icon = iconMap[kpi.icon] || Activity
  const isPositive = kpi.change > 0

  return (
    <Card className={`card-hover-lift card-hover-glow relative overflow-hidden animate-fade-slide-up stagger-${index + 1}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="size-10 rounded-xl bg-primary/8 dark:bg-primary/15 flex items-center justify-center ring-1 ring-primary/10 dark:ring-primary/20">
            <Icon className="size-[18px] text-primary" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
            isPositive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {isPositive ? <ArrowUpRight className="size-3" /> : <ArrowRight className="size-3" />}
            {isPositive ? "+" : ""}{kpi.change}%
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
          <p className="text-2xl font-bold tracking-tight animate-count-up">{kpi.value}</p>
        </div>
        <p className="text-[10px] text-muted-foreground/70 mt-1.5">{kpi.period}</p>
      </CardContent>
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary/40 via-primary to-primary/40 opacity-50" />
    </Card>
  )
}

/* ─── Alert Card ────────────────────────────────────────────────────────────── */
function AlertCard({ alert }: { alert: AdminAlert }) {
  const severityConfig = {
    critical: {
      border: "border-l-red-500 dark:border-l-red-400",
      bg: "bg-red-50/60 dark:bg-red-900/15",
      dot: "bg-red-500 dark:bg-red-400",
      badge: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800" as const,
    },
    warning: {
      border: "border-l-amber-500 dark:border-l-amber-400",
      bg: "bg-amber-50/60 dark:bg-amber-900/15",
      dot: "bg-amber-500 dark:bg-amber-400",
      badge: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800" as const,
    },
    info: {
      border: "border-l-sky-500 dark:border-l-sky-400",
      bg: "bg-sky-50/60 dark:bg-sky-900/15",
      dot: "bg-sky-500 dark:bg-sky-400",
      badge: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800" as const,
    },
  }

  const config = severityConfig[alert.severity]

  return (
    <div className={`border-l-[3px] rounded-lg p-3 ${config.border} ${config.bg} transition-all hover:translate-x-0.5`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`size-2 rounded-full ${config.dot} shrink-0`} />
            <span className={`inline-flex items-center rounded-md border px-1.5 py-0 text-[10px] font-semibold ${config.badge}`}>
              {alert.type}
            </span>
            <span className="text-muted-foreground text-[10px] ml-auto">{alert.time}</span>
          </div>
          <p className="text-xs text-foreground/80 leading-relaxed">{alert.message}</p>
        </div>
        <Button variant="ghost" size="sm" className="shrink-0 text-[10px] h-7 px-2.5 hover:bg-background/60 font-medium">
          {alert.action}
        </Button>
      </div>
    </div>
  )
}

/* ─── Recent Transaction ────────────────────────────────────────────────────── */
function RecentTransaction({ tx }: { tx: typeof transactions[0] }) {
  const typeConfig = {
    DEPOT: { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-300", label: "Dépôt" },
    RETRAIT: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300", label: "Retrait" },
    TRANSFERT: { bg: "bg-primary/10 dark:bg-primary/20", text: "text-primary", label: "Transfert" },
    PAIEMENT: { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-300", label: "Paiement" },
  }

  const statusConfig = {
    COMPLETED: { label: "Réussi", className: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800" },
    PENDING: { label: "En attente", className: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800" },
    FAILED: { label: "Échoué", className: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800" },
    CANCELLED: { label: "Annulé", className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700" },
  }

  const cfg = typeConfig[tx.type]
  const sCfg = statusConfig[tx.statut]

  return (
    <div className="flex items-center gap-3 py-2.5 group">
      <div className={`size-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${cfg.bg} ${cfg.text} transition-transform group-hover:scale-105`}>
        {tx.type.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {cfg.label} — {formatXOF(tx.montant)}
        </p>
        <p className="text-[11px] text-muted-foreground truncate">
          {tx.expediteur} → {tx.destinataire}
        </p>
      </div>
      <div className="text-right shrink-0">
        <span className={`inline-flex items-center rounded-md border px-1.5 py-0 text-[10px] font-semibold ${sCfg.className}`}>
          {sCfg.label}
        </span>
        <p className="text-[10px] text-muted-foreground mt-0.5">{tx.date.split(" ")[1]}</p>
      </div>
    </div>
  )
}

/* ─── Service Status ────────────────────────────────────────────────────────── */
function ServiceStatusCard({ service }: { service: typeof serviceStatuses[0] }) {
  const statusStyles = {
    UP: { dot: "bg-emerald-500 dark:bg-emerald-400", label: "Opérationnel", labelClass: "text-emerald-700 dark:text-emerald-400" },
    DOWN: { dot: "bg-red-500 dark:bg-red-400", label: "Indisponible", labelClass: "text-red-700 dark:text-red-400" },
    DEGRADED: { dot: "bg-amber-500 dark:bg-amber-400", label: "Dégradé", labelClass: "text-amber-700 dark:text-amber-400" },
  }

  const cfg = statusStyles[service.status]

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-muted/50 transition-colors group">
      <div className="relative flex items-center gap-2.5">
        <span className={`size-2.5 rounded-full ${cfg.dot}`}>
          {service.status === "UP" && (
            <span className={`absolute inset-0 size-2.5 rounded-full ${cfg.dot} animate-pulse-ring opacity-75`} />
          )}
        </span>
        <Server className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{service.name}</p>
        <p className="text-[10px] text-muted-foreground">{service.tech}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`text-xs font-semibold ${cfg.labelClass}`}>{cfg.label}</p>
        <p className="text-[10px] text-muted-foreground">{service.uptime}</p>
      </div>
    </div>
  )
}

/* ─── Custom Chart Tooltip ──────────────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (!active || !payload) return null
  return (
    <div className="glass-card rounded-xl p-3 shadow-lg border border-border/50">
      <p className="text-xs font-semibold mb-2">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-[11px] text-muted-foreground">{entry.name}:</span>
            <span className="text-[11px] font-semibold">{new Intl.NumberFormat("fr-FR").format(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Dashboard Page ────────────────────────────────────────────────────────── */
export function DashboardPage() {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir"

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="gradient-hero rounded-2xl p-6 md:p-8 text-white relative overflow-hidden animate-fade-slide-up">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 size-64 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/4 size-48 rounded-full bg-white/10 translate-y-1/2" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white/70 text-xs font-medium">
              <Sparkles className="size-3.5" />
              <span>RICASH Back-Office</span>
              <span className="mx-1">·</span>
              <Clock className="size-3" />
              <span>{now.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {greeting}, Super Admin
            </h1>
            <p className="text-white/70 text-sm max-w-lg">
              Voici un aperçu de votre plateforme. {adminAlerts.filter(a => a.severity === "critical").length} alertes critiques nécessitent votre attention.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card rounded-xl px-4 py-3 text-center min-w-[100px]">
              <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Aujourd&apos;hui</p>
              <p className="text-xl font-bold">{now.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</p>
            </div>
            <div className="glass-card rounded-xl px-4 py-3 text-center min-w-[100px]">
              <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">Alertes</p>
              <p className="text-xl font-bold flex items-center justify-center gap-1">
                <Zap className="size-4" />
                {adminAlerts.filter(a => a.severity === "critical").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => (
          <KpiCard key={i} kpi={kpi} index={i} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fade-slide-up stagger-3">
        {/* Transaction Volume Chart */}
        <Card className="card-hover-glow overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Volume des Transactions</CardTitle>
                <CardDescription className="text-[11px]">Montants en millions XOF par mois</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-medium">2025</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionVolumeData} barGap={3} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                  <Bar dataKey="depots" name="Dépôts" fill="oklch(0.55 0.17 155)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="retraits" name="Retraits" fill="oklch(0.65 0.15 160)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="transferts" name="Transferts" fill="oklch(0.75 0.12 160)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="paiements" name="Paiements" fill="oklch(0.6 0.15 230)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* User Growth Chart */}
        <Card className="card-hover-glow overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Croissance Utilisateurs & Agents</CardTitle>
                <CardDescription className="text-[11px]">Nombre d&apos;utilisateurs et agents actifs</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] font-medium">+15.6% YoY</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="gradientUtilisateurs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.55 0.17 155)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.55 0.17 155)" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="gradientAgents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.65 0.15 160)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="oklch(0.65 0.15 160)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/50" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} className="fill-muted-foreground" axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
                  <Area
                    type="monotone"
                    dataKey="utilisateurs"
                    name="Utilisateurs"
                    stroke="oklch(0.55 0.17 155)"
                    fill="url(#gradientUtilisateurs)"
                    strokeWidth={2.5}
                  />
                  <Area
                    type="monotone"
                    dataKey="agents"
                    name="Agents"
                    stroke="oklch(0.65 0.15 160)"
                    fill="url(#gradientAgents)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row: Alerts + Recent Transactions + Services */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 animate-fade-slide-up stagger-4">
        {/* Alerts */}
        <Card className="card-hover-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="size-7 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="size-3.5 text-red-600 dark:text-red-400" />
                </div>
                Alertes
              </CardTitle>
              <Badge className="bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800 text-[10px]">
                {adminAlerts.filter((a) => a.severity === "critical").length} critiques
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5 max-h-96 overflow-y-auto scrollbar-thin">
            {adminAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="card-hover-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                  <Activity className="size-3.5 text-primary" />
                </div>
                Transactions Récentes
              </CardTitle>
              <Button variant="ghost" size="sm" className="text-[10px] h-7 text-primary font-medium gap-1">
                Voir tout <ArrowRight className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto scrollbar-thin">
            {transactions.slice(0, 6).map((tx) => (
              <RecentTransaction key={tx.id} tx={tx} />
            ))}
          </CardContent>
        </Card>

        {/* Service Status */}
        <Card className="card-hover-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <div className="size-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Server className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                Microservices
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-medium">
                {serviceStatuses.filter((s) => s.status === "UP").length}/{serviceStatuses.length} UP
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-0.5 max-h-96 overflow-y-auto scrollbar-thin">
            {serviceStatuses.map((service) => (
              <ServiceStatusCard key={service.name} service={service} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
