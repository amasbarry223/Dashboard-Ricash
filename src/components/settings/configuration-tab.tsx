'use client'

import { useState } from "react"
import {
  Settings,
  Percent,
  Shield,
  Users,
  Pencil,
  AlertTriangle,
  AlertOctagon,
  Clock,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  Plus,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  feeConfigs, type FeeConfig,
  securityConfigs, type SecurityConfig,
  adminUsers, type AdminUser, type AdminRole,
} from "@/lib/mock-data"

/* ─── Fee Config Sub-Tab ──────────────────────────────────────────────────── */

function FeesSubTab() {
  const [fees, setFees] = useState<FeeConfig[]>(feeConfigs)

  const toggleFeeActive = (id: string) => {
    setFees((prev) =>
      prev.map((f) => (f.id === id ? { ...f, actif: !f.actif } : f))
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Configuration des Frais de Service</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Définissez les modèles de tarification pour chaque type de transaction
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {fees.filter((f) => f.actif).length} / {fees.length} actifs
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Modèle</TableHead>
                  <TableHead className="font-semibold">Valeur</TableHead>
                  <TableHead className="font-semibold text-center">Paramétrable</TableHead>
                  <TableHead className="font-semibold text-center">Actif</TableHead>
                  <TableHead className="font-semibold w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {fees.map((fee) => (
                  <TableRow key={fee.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium text-sm">{fee.type}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{fee.modele}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${
                          fee.valeur === "Gratuit"
                            ? "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                            : fee.valeur === "Variable"
                              ? "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-400"
                              : ""
                        }`}
                      >
                        {fee.valeur}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {fee.parametrable ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] px-1.5">
                          Oui
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] px-1.5 text-muted-foreground">
                          Non
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={fee.actif}
                        onCheckedChange={() => toggleFeeActive(fee.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <Pencil className="size-3.5 text-muted-foreground" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Security Config Sub-Tab ─────────────────────────────────────────────── */

const securityIconMap: Record<string, React.ElementType> = {
  "Seuil alerte fraude": AlertTriangle,
  "Taux échec critique": AlertOctagon,
  "Durée max KYC en attente": Clock,
  "Politique mot de passe": KeyRound,
  "2FA Admin": Shield,
  "Rotation JWT": RefreshCw,
  "Blocage après tentatives": ShieldAlert,
}

const securityColorMap: Record<string, { bg: string; icon: string; border: string }> = {
  "Seuil alerte fraude": { bg: "bg-red-100 dark:bg-red-900/30", icon: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  "Taux échec critique": { bg: "bg-red-100 dark:bg-red-900/30", icon: "text-red-600 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  "Durée max KYC en attente": { bg: "bg-amber-100 dark:bg-amber-900/30", icon: "text-amber-600 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  "Politique mot de passe": { bg: "bg-teal-100 dark:bg-teal-900/30", icon: "text-teal-600 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800" },
  "2FA Admin": { bg: "bg-emerald-100 dark:bg-emerald-900/30", icon: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  "Rotation JWT": { bg: "bg-purple-100 dark:bg-purple-900/30", icon: "text-purple-600 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  "Blocage après tentatives": { bg: "bg-orange-100 dark:bg-orange-900/30", icon: "text-orange-600 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
}

function SecurityCard({ config }: { config: SecurityConfig }) {
  const Icon = securityIconMap[config.parametre] || Shield
  const colors = securityColorMap[config.parametre] || { bg: "bg-gray-100 dark:bg-gray-800/40", icon: "text-gray-600 dark:text-gray-400", border: "border-gray-200 dark:border-gray-700" }

  return (
    <Card className={`hover:shadow-md transition-shadow ${colors.border}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${colors.bg}`}>
            <Icon className={`size-5 ${colors.icon}`} />
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm">{config.parametre}</h3>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 shrink-0">
                <Pencil className="size-3.5 text-muted-foreground" />
              </Button>
            </div>
            <Badge variant="outline" className="font-mono text-xs">{config.valeur}</Badge>
            <p className="text-xs text-muted-foreground leading-relaxed">{config.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SecuritySubTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Paramètres de Sécurité</h3>
          <p className="text-xs text-muted-foreground">Configuration des règles de sécurité et de conformité</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {securityConfigs.length} paramètres
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {securityConfigs.map((config) => (
          <SecurityCard key={config.id} config={config} />
        ))}
      </div>
    </div>
  )
}

/* ─── Admin Users Sub-Tab ─────────────────────────────────────────────────── */

const roleBadgeConfig: Record<AdminRole, { className: string }> = {
  "Super Admin": {
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  "Admin Financier": {
    className: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
  },
  "Admin Conformité": {
    className: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-800",
  },
  "Admin Support": {
    className: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
  },
  "Admin Reporting": {
    className: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
  },
}

function RoleBadge({ role }: { role: AdminRole }) {
  const config = roleBadgeConfig[role]
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${config.className}`}>
      {role}
    </span>
  )
}

function AddAdminDialog() {
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <Plus className="size-4 mr-2" />
          Ajouter un Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            Ajouter un Administrateur
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-name">Nom complet</Label>
            <Input id="admin-name" placeholder="Ex: Amadou Diallo" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Adresse email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input id="admin-email" type="email" placeholder="nom@ricash.com" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-role">Rôle</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Admin Financier">Admin Financier</SelectItem>
                <SelectItem value="Admin Conformité">Admin Conformité</SelectItem>
                <SelectItem value="Admin Support">Admin Support</SelectItem>
                <SelectItem value="Admin Reporting">Admin Reporting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Mot de passe initial</Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 12 caractères"
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="size-3.5 text-muted-foreground" /> : <Eye className="size-3.5 text-muted-foreground" />}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground">
              Le mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un caractère spécial.
            </p>
          </div>
          <Separator />
          <div className="flex gap-3">
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setOpen(false)}>
              <Shield className="size-4 mr-2" />
              Créer l&apos;Administrateur
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AdminsSubTab() {
  const [admins, setAdmins] = useState<AdminUser[]>(adminUsers)

  const toggleAdminStatus = (id: string) => {
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, statut: a.statut === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : a
      )
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold">Gestion des Administrateurs</h3>
          <p className="text-xs text-muted-foreground">Comptes d&apos;accès au back-office RICASH</p>
        </div>
        <AddAdminDialog />
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Administrateur</TableHead>
                  <TableHead className="font-semibold">Email</TableHead>
                  <TableHead className="font-semibold">Rôle</TableHead>
                  <TableHead className="font-semibold text-center">Statut</TableHead>
                  <TableHead className="font-semibold">Dernière Connexion</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                            {admin.nom.split(" ").map((n) => n.charAt(0)).join("").slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm">{admin.nom}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{admin.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={admin.role} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={admin.statut === "ACTIVE"}
                        onCheckedChange={() => toggleAdminStatus(admin.id)}
                      />
                    </TableCell>
                    <TableCell className="text-xs whitespace-nowrap text-muted-foreground">
                      {admin.derniereConnexion}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Main Tab Component ──────────────────────────────────────────────────── */

export function ConfigurationTab() {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="fees" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="fees" className="gap-1.5">
            <Percent className="size-3.5" />
            Frais de Service
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="size-3.5" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="admins" className="gap-1.5">
            <Users className="size-3.5" />
            Administrateurs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fees">
          <FeesSubTab />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySubTab />
        </TabsContent>

        <TabsContent value="admins">
          <AdminsSubTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
