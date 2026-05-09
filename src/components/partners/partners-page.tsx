'use client'

import { useState, useMemo } from "react"
import {
  Handshake,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Settings2,
  ArrowRightLeft,
  MoreHorizontal,
  Eye,
  Pencil,
  Power,
  Plug,
  Activity,
  TrendingUp,
  Hash,
  Server,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
  partners,
  type Partner,
  type PartnerStatus,
} from "@/lib/mock-data"

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatXOF(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value) + " XOF"
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("fr-FR").format(value)
}

/* ─── Badge Configs ────────────────────────────────────────────────────────── */

const statusConfig: Record<PartnerStatus, { label: string; className: string; icon: React.ElementType }> = {
  ACTIVE: {
    label: "Actif",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
    icon: CheckCircle,
  },
  INTEGRATING: {
    label: "En Intégration",
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
    icon: Clock,
  },
  INACTIVE: {
    label: "Inactif",
    className: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/40 dark:text-gray-400 dark:border-gray-700",
    icon: XCircle,
  },
}

function PartnerStatusBadge({ status }: { status: PartnerStatus }) {
  const config = statusConfig[status]
  const Icon = config.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

/* ─── Adapter Config ───────────────────────────────────────────────────────── */

interface AdapterInfo {
  id: string
  nom: string
  description: string
  statut: "disponible" | "en_cours"
  color: string
  icon: string
}

const adapters: AdapterInfo[] = [
  {
    id: "mock",
    nom: "Adaptateur Mock",
    description: "Simulation locale pour les tests et le développement. Permet de valider les flux sans partenaire réel.",
    statut: "disponible",
    color: "emerald",
    icon: "🧪",
  },
  {
    id: "orange",
    nom: "Adaptateur Orange Money",
    description: "Intégration avec l'API Orange Money Mali pour les dépôts, retraits et transferts Mobile Money.",
    statut: "en_cours",
    color: "amber",
    icon: "📱",
  },
  {
    id: "mtn",
    nom: "Adaptateur MTN MoMo",
    description: "Intégration avec l'API MTN Mobile Money pour les opérations de paiement mobile au Mali.",
    statut: "en_cours",
    color: "amber",
    icon: "📲",
  },
]

function AdapterCard({ adapter }: { adapter: AdapterInfo }) {
  const isAvailable = adapter.statut === "disponible"

  return (
    <Card className={`hover:shadow-md transition-shadow ${isAvailable ? "border-emerald-200 dark:border-emerald-800" : "border-amber-200 dark:border-amber-800"}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`size-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
            isAvailable
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : "bg-amber-100 dark:bg-amber-900/30"
          }`}>
            {adapter.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-sm">{adapter.nom}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">ID: {adapter.id}</p>
              </div>
              <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium shrink-0 ${
                isAvailable
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800"
              }`}>
                {isAvailable ? (
                  <>
                    <CheckCircle className="size-3" />
                    Disponible
                  </>
                ) : (
                  <>
                    <Clock className="size-3" />
                    En cours
                  </>
                )}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{adapter.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Partner Detail Dialog ────────────────────────────────────────────────── */

function PartnerDetailDialog({
  partner,
  open,
  onOpenChange,
}: {
  partner: Partner | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!partner) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Handshake className="size-5 text-primary" />
            Détails du Partenaire
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Partner Info Header */}
          <div className="flex items-center gap-4">
            <div className="size-14 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Server className="size-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{partner.nom}</h3>
              <p className="text-sm text-muted-foreground font-mono">{partner.code}</p>
              <div className="mt-1">
                <PartnerStatusBadge status={partner.statut} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Type</p>
              <p className="text-sm font-medium">{partner.type}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Adaptateur</p>
              <Badge variant="outline" className="font-mono text-xs">{partner.adaptateur}</Badge>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dernier Échange</p>
              <p className="text-sm">{partner.dernierEchange}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Statut</p>
              <PartnerStatusBadge status={partner.statut} />
            </div>
          </div>

          <Separator />

          {/* Financial Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3 border border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Volume Mensuel</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {partner.volumeMois > 0 ? formatXOF(partner.volumeMois) : "—"}
              </p>
            </div>
            <div className="rounded-lg bg-teal-50 dark:bg-teal-950/30 p-3 border border-teal-200 dark:border-teal-800">
              <p className="text-xs text-teal-700 dark:text-teal-400 mb-1">Transactions / Mois</p>
              <p className="text-lg font-bold text-teal-700 dark:text-teal-400">
                {partner.transactionsMois > 0 ? formatNumber(partner.transactionsMois) : "—"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Partner ID */}
          <div>
            <p className="text-xs text-muted-foreground">Identifiant</p>
            <p className="text-sm font-mono">{partner.id}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ─── Partner Card ─────────────────────────────────────────────────────────── */

function PartnerCard({
  partner,
  onViewDetail,
}: {
  partner: Partner
  onViewDetail: (partner: Partner) => void
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Server className="size-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm truncate">{partner.nom}</h3>
                <p className="text-xs text-muted-foreground font-mono">{partner.code}</p>
              </div>
            </div>
            <PartnerStatusBadge status={partner.statut} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Plug className="size-3" />
              <span>Adaptateur:</span>
              <Badge variant="outline" className="font-mono text-[10px] px-1 py-0 h-4">{partner.adaptateur}</Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Activity className="size-3" />
              <span>Dernier échange:</span>
            </div>
            <div className="col-span-2 text-xs pl-[18px] -mt-1">
              <span className="font-medium text-foreground">{partner.dernierEchange}</span>
            </div>
          </div>

          <Separator />

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Volume / Mois</p>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {partner.volumeMois > 0 ? formatXOF(partner.volumeMois) : "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Transactions / Mois</p>
              <p className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                {partner.transactionsMois > 0 ? formatNumber(partner.transactionsMois) : "—"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-7"
              onClick={() => onViewDetail(partner)}
            >
              <Eye className="size-3 mr-1" />
              Détails
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs h-7"
            >
              <Pencil className="size-3 mr-1" />
              Configurer
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-7 px-2"
            >
              <ArrowRightLeft className="size-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export function PartnersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  // Stats
  const activePartners = partners.filter((p) => p.statut === "ACTIVE").length
  const integratingPartners = partners.filter((p) => p.statut === "INTEGRATING").length
  const inactivePartners = partners.filter((p) => p.statut === "INACTIVE").length

  // Filter partners
  const filteredPartners = useMemo(() => {
    return partners.filter((partner) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        const matchesSearch =
          partner.nom.toLowerCase().includes(q) ||
          partner.code.toLowerCase().includes(q) ||
          partner.type.toLowerCase().includes(q) ||
          partner.adaptateur.toLowerCase().includes(q)
        if (!matchesSearch) return false
      }
      if (statusFilter !== "all" && partner.statut !== statusFilter) return false
      return true
    })
  }, [searchQuery, statusFilter])

  // Open detail
  const openDetail = (partner: Partner) => {
    setSelectedPartner(partner)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Handshake className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gestion des Partenaires</h1>
            <p className="text-sm text-muted-foreground">Intégrations et connecteurs de paiement externes</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Partenaires Actifs</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{activePartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="size-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">En Intégration</p>
                <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{integratingPartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-lg bg-gray-100 dark:bg-gray-800/40 flex items-center justify-center">
                <XCircle className="size-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Inactifs</p>
                <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{inactivePartners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, code, type, adaptateur..."
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
                <SelectItem value="INTEGRATING">En Intégration</SelectItem>
                <SelectItem value="INACTIVE">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Partner Cards Grid */}
      {filteredPartners.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Handshake className="size-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">Aucun partenaire trouvé</p>
            <p className="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredPartners.map((partner) => (
            <PartnerCard
              key={partner.id}
              partner={partner}
              onViewDetail={openDetail}
            />
          ))}
        </div>
      )}

      {/* Adaptateurs de Paiement Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Settings2 className="size-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Adaptateurs de Paiement</h2>
            <p className="text-xs text-muted-foreground">Connecteurs disponibles et en cours de développement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {adapters.map((adapter) => (
            <AdapterCard key={adapter.id} adapter={adapter} />
          ))}
        </div>
      </div>

      {/* Partner Detail Dialog */}
      <PartnerDetailDialog
        partner={selectedPartner}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  )
}
