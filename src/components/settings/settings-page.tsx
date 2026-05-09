'use client'

import { useState } from "react"
import {
  User,
  Shield,
  Bell,
  Palette,
  Monitor,
  Moon,
  Sun,
  Save,
  Camera,
  Mail,
  Phone,
  Building2,
  Globe,
  Clock,
  KeyRound,
  Smartphone,
  LogOut,
  Trash2,
  Check,
  Copy,
  Eye,
  EyeOff,
  AlertTriangle,
  FileText,
  ChevronRight,
  Languages,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Progress } from "@/components/ui/progress"
import {
  adminProfile,
  notificationPreferences,
  type NotificationPreference,
  activeSessions,
  auditLog,
} from "@/lib/mock-data"

/* ─── Profile Tab ──────────────────────────────────────────────────────────── */

function ProfileTab() {
  const [profile, setProfile] = useState({ ...adminProfile })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Avatar Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <Avatar className="size-24 border-4 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold rounded-full">
                  {profile.avatar}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="size-6 text-white" />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-xl font-bold">{profile.nom}</h3>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
              <div className="flex flex-wrap items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800">
                  {profile.role}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Building2 className="size-3 mr-1" />
                  {profile.departement}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Compte créé le {profile.dateCreation} · Dernière connexion {profile.derniereConnexion}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleSave}
              >
                {saved ? <Check className="size-4 mr-2" /> : <Save className="size-4 mr-2" />}
                {saved ? "Enregistré !" : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="size-4 text-primary" />
            Informations Personnelles
          </CardTitle>
          <CardDescription className="text-xs">
            Mettez à jour vos informations de profil et vos coordonnées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="settings-name"
                  value={profile.nom}
                  onChange={(e) => setProfile({ ...profile, nom: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-email">Adresse email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="settings-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-phone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="settings-phone"
                  value={profile.telephone}
                  onChange={(e) => setProfile({ ...profile, telephone: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-dept">Département</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="settings-dept"
                  value={profile.departement}
                  onChange={(e) => setProfile({ ...profile, departement: e.target.value })}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Settings */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="size-4 text-primary" />
            Paramètres Régionaux
          </CardTitle>
          <CardDescription className="text-xs">
            Langue, fuseau horaire et format d&apos;affichage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="settings-lang" className="flex items-center gap-1.5">
                <Languages className="size-3.5" />
                Langue
              </Label>
              <Select value={profile.langue} onValueChange={(v) => setProfile({ ...profile, langue: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Français">Français</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Bamanankan">Bamanankan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-tz" className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Fuseau horaire
              </Label>
              <Select value={profile.fuseauHoraire} onValueChange={(v) => setProfile({ ...profile, fuseauHoraire: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Africa/Bamako (GMT+0)">Africa/Bamako (GMT+0)</SelectItem>
                  <SelectItem value="Europe/Paris (GMT+1)">Europe/Paris (GMT+1)</SelectItem>
                  <SelectItem value="America/New_York (GMT-5)">America/New_York (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Devise d&apos;affichage</Label>
              <Select defaultValue="XOF">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XOF">XOF (Franc CFA)</SelectItem>
                  <SelectItem value="EUR">EUR (Euro)</SelectItem>
                  <SelectItem value="USD">USD (Dollar US)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Security Tab ─────────────────────────────────────────────────────────── */

function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <KeyRound className="size-4" />
          Changer le mot de passe
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="size-5 text-primary" />
            Changer le mot de passe
          </DialogTitle>
          <DialogDescription>
            Votre mot de passe doit contenir au moins 12 caractères, une majuscule, un chiffre et un caractère spécial.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Mot de passe actuel</Label>
            <div className="relative">
              <Input type={showCurrent ? "text" : "password"} placeholder="Entrez le mot de passe actuel" className="pr-10" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff className="size-3.5 text-muted-foreground" /> : <Eye className="size-3.5 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Nouveau mot de passe</Label>
            <div className="relative">
              <Input type={showNew ? "text" : "password"} placeholder="Min. 12 caractères" className="pr-10" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff className="size-3.5 text-muted-foreground" /> : <Eye className="size-3.5 text-muted-foreground" />}
              </Button>
            </div>
            <Progress value={60} className="h-1.5" />
            <p className="text-[10px] text-amber-600 dark:text-amber-400">Force : Moyen — Ajoutez un caractère spécial</p>
          </div>
          <div className="space-y-2">
            <Label>Confirmer le mot de passe</Label>
            <div className="relative">
              <Input type={showConfirm ? "text" : "password"} placeholder="Retapez le nouveau mot de passe" className="pr-10" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff className="size-3.5 text-muted-foreground" /> : <Eye className="size-3.5 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setOpen(false)}>
              Mettre à jour
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function SecurityTab() {
  const [twoFA, setTwoFA] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState("30")

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            Mot de passe
          </CardTitle>
          <CardDescription className="text-xs">
            Gérez votre mot de passe et les exigences de sécurité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50 border">
            <div>
              <p className="text-sm font-medium">Dernière modification</p>
              <p className="text-xs text-muted-foreground">Il y a 5 jours (05 Juin 2025)</p>
            </div>
            <ChangePasswordDialog />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Min. 12 caractères</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Majuscule requise</span>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
              <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Caractère spécial</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2FA Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="size-4 text-primary" />
            Authentification à deux facteurs (2FA)
          </CardTitle>
          <CardDescription className="text-xs">
            Couche de sécurité supplémentaire pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className={`size-10 rounded-lg flex items-center justify-center ${twoFA ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                <Shield className={`size-5 ${twoFA ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
              </div>
              <div>
                <p className="text-sm font-medium">2FA {twoFA ? "activée" : "désactivée"}</p>
                <p className="text-xs text-muted-foreground">
                  {twoFA ? "Votre compte est protégé par double authentification" : "Activez la 2FA pour sécuriser votre compte"}
                </p>
              </div>
            </div>
            <Switch checked={twoFA} onCheckedChange={setTwoFA} />
          </div>

          {twoFA && (
            <div className="space-y-3 p-4 rounded-lg bg-muted/50 border">
              <p className="text-sm font-medium">Méthode 2FA</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 cursor-pointer">
                  <Smartphone className="size-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium">Application TOTP</p>
                    <p className="text-xs text-muted-foreground">Google Authenticator, Authy</p>
                  </div>
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 ml-auto" />
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                  <Mail className="size-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">Code par email</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <Copy className="size-3" />
                  Codes de récupération
                </Button>
                <span className="text-[10px] text-muted-foreground">10 codes restants</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login Security */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            Sécurité de connexion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Alertes de connexion</p>
              <p className="text-xs text-muted-foreground">Recevoir une notification lors d&apos;une connexion depuis un nouvel appareil</p>
            </div>
            <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Expiration de session</p>
              <p className="text-xs text-muted-foreground">Déconnexion automatique après inactivité</p>
            </div>
            <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="size-4 text-primary" />
                Sessions actives
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Gérez vos appareils connectés
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {activeSessions.filter((s) => s.actif).length} active(s)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`size-10 rounded-lg flex items-center justify-center ${
                    session.actif
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : "bg-gray-100 dark:bg-gray-800/40"
                  }`}>
                    <Monitor className={`size-5 ${session.actif ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{session.appareil}</p>
                      {session.actif && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800 text-[10px] px-1.5">
                          Actif
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {session.navigateur} · {session.localisation} · {session.ip}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Dernière activité : {session.dernierActivite}
                    </p>
                  </div>
                </div>
                {!session.actif && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive text-xs gap-1.5">
                    <LogOut className="size-3" />
                    Révoquer
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-1.5">
              <LogOut className="size-3.5" />
              Déconnecter toutes les autres sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-red-600 dark:text-red-400">
            <AlertTriangle className="size-4" />
            Zone de danger
          </CardTitle>
          <CardDescription className="text-xs">
            Actions irréversibles pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
            <div>
              <p className="text-sm font-medium text-red-700 dark:text-red-400">Supprimer le compte</p>
              <p className="text-xs text-red-600/70 dark:text-red-400/70">
                Cette action est irréversible. Toutes vos données seront supprimées.
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-1.5">
                  <Trash2 className="size-3.5" />
                  Supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte
                    et supprimera vos données de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                    Supprimer définitivement
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Notifications Tab ────────────────────────────────────────────────────── */

function NotificationsTab() {
  const [prefs, setPrefs] = useState<NotificationPreference[]>(notificationPreferences)
  const [globalEmail, setGlobalEmail] = useState(true)
  const [globalPush, setGlobalPush] = useState(true)
  const [globalSms, setGlobalSms] = useState(false)
  const [globalInApp, setGlobalInApp] = useState(true)

  const toggleChannel = (id: string, channel: "email" | "sms" | "push" | "inApp") => {
    setPrefs((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, [channel]: !p[channel] } : p
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Global Toggle */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            Canaux de notification
          </CardTitle>
          <CardDescription className="text-xs">
            Activez ou désactivez les canaux globalement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-blue-500" />
                <span className="text-sm font-medium">Email</span>
              </div>
              <Switch checked={globalEmail} onCheckedChange={setGlobalEmail} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Bell className="size-4 text-emerald-500" />
                <span className="text-sm font-medium">Push</span>
              </div>
              <Switch checked={globalPush} onCheckedChange={setGlobalPush} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Smartphone className="size-4 text-amber-500" />
                <span className="text-sm font-medium">SMS</span>
              </div>
              <Switch checked={globalSms} onCheckedChange={setGlobalSms} />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-purple-500" />
                <span className="text-sm font-medium">In-App</span>
              </div>
              <Switch checked={globalInApp} onCheckedChange={setGlobalInApp} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Preferences */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Préférences détaillées</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                Personnalisez les notifications par catégorie
              </CardDescription>
            </div>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              size="sm"
            >
              <Save className="size-3.5 mr-1.5" />
              Sauvegarder
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Catégorie</TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Mail className="size-3.5" />
                      <span className="text-[10px]">Email</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Smartphone className="size-3.5" />
                      <span className="text-[10px]">SMS</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Bell className="size-3.5" />
                      <span className="text-[10px]">Push</span>
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Monitor className="size-3.5" />
                      <span className="text-[10px]">In-App</span>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prefs.map((pref) => (
                  <TableRow key={pref.id} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{pref.categorie}</p>
                        <p className="text-xs text-muted-foreground">{pref.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={pref.email}
                        onCheckedChange={() => toggleChannel(pref.id, "email")}
                        disabled={!globalEmail}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={pref.sms}
                        onCheckedChange={() => toggleChannel(pref.id, "sms")}
                        disabled={!globalSms}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={pref.push}
                        onCheckedChange={() => toggleChannel(pref.id, "push")}
                        disabled={!globalPush}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={pref.inApp}
                        onCheckedChange={() => toggleChannel(pref.id, "inApp")}
                        disabled={!globalInApp}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Heures calmes
          </CardTitle>
          <CardDescription className="text-xs">
            Désactiver les notifications pendant certaines heures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Switch defaultChecked={false} />
              <span className="text-sm">Activer les heures calmes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>De</span>
              <Input type="time" defaultValue="22:00" className="w-28 h-8 text-xs" disabled />
              <span>à</span>
              <Input type="time" defaultValue="07:00" className="w-28 h-8 text-xs" disabled />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Appearance Tab ───────────────────────────────────────────────────────── */

function AppearanceTab() {
  const [theme, setTheme] = useState("system")
  const [compactMode, setCompactMode] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [density, setDensity] = useState("comfortable")

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Palette className="size-4 text-primary" />
            Thème
          </CardTitle>
          <CardDescription className="text-xs">
            Choisissez l&apos;apparence de l&apos;interface
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => setTheme("light")}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                theme === "light"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
              }`}
            >
              <div className="size-16 rounded-lg bg-white border shadow-sm flex items-center justify-center">
                <Sun className="size-6 text-amber-500" />
              </div>
              <span className="text-sm font-medium">Clair</span>
              {theme === "light" && (
                <div className="absolute top-2 right-2 size-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
              }`}
            >
              <div className="size-16 rounded-lg bg-gray-900 border border-gray-700 shadow-sm flex items-center justify-center">
                <Moon className="size-6 text-blue-400" />
              </div>
              <span className="text-sm font-medium">Sombre</span>
              {theme === "dark" && (
                <div className="absolute top-2 right-2 size-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setTheme("system")}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                theme === "system"
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
              }`}
            >
              <div className="size-16 rounded-lg bg-gradient-to-br from-white to-gray-900 border shadow-sm flex items-center justify-center">
                <Monitor className="size-6 text-gray-500" />
              </div>
              <span className="text-sm font-medium">Système</span>
              {theme === "system" && (
                <div className="absolute top-2 right-2 size-5 rounded-full bg-emerald-500 flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Layout Preferences */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Monitor className="size-4 text-primary" />
            Mise en page
          </CardTitle>
          <CardDescription className="text-xs">
            Personnalisez l&apos;agencement de l&apos;interface
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Position de la barre latérale</p>
              <p className="text-xs text-muted-foreground">Choisir le côté d&apos;affichage de la sidebar</p>
            </div>
            <Select defaultValue="left">
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Gauche</SelectItem>
                <SelectItem value="right">Droite</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Densité d&apos;affichage</p>
              <p className="text-xs text-muted-foreground">Ajuster l&apos;espacement des éléments</p>
            </div>
            <Select value={density} onValueChange={setDensity}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="comfortable">Confortable</SelectItem>
                <SelectItem value="spacious">Spacieux</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Mode compact</p>
              <p className="text-xs text-muted-foreground">Réduire les marges et espacements pour voir plus de contenu</p>
            </div>
            <Switch checked={compactMode} onCheckedChange={setCompactMode} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Animations</p>
              <p className="text-xs text-muted-foreground">Activer les transitions et animations de l&apos;interface</p>
            </div>
            <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="size-4 text-primary" />
            Accessibilité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Taille du texte</p>
              <p className="text-xs text-muted-foreground">Ajuster la taille de police de l&apos;interface</p>
            </div>
            <Select defaultValue="medium">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Petite</SelectItem>
                <SelectItem value="medium">Moyenne</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Contraste élevé</p>
              <p className="text-xs text-muted-foreground">Augmenter le contraste pour une meilleure lisibilité</p>
            </div>
            <Switch defaultChecked={false} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div>
              <p className="text-sm font-medium">Réduire les mouvements</p>
              <p className="text-xs text-muted-foreground">Minimiser les animations et les transitions</p>
            </div>
            <Switch defaultChecked={false} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ─── Audit Log Tab ────────────────────────────────────────────────────────── */

const actionColorMap: Record<string, { bg: string; text: string; border: string }> = {
  "Connexion": { bg: "bg-emerald-100 dark:bg-emerald-900/30", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  "Modification KYC": { bg: "bg-teal-100 dark:bg-teal-900/30", text: "text-teal-700 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800" },
  "Configuration frais": { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  "Suspension utilisateur": { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
  "Ajout admin": { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  "Export données": { bg: "bg-sky-100 dark:bg-sky-900/30", text: "text-sky-700 dark:text-sky-400", border: "border-sky-200 dark:border-sky-800" },
  "Changement mot de passe": { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
}

function AuditLogTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <FileText className="size-4 text-primary" />
            Journal d&apos;activité
          </h3>
          <p className="text-xs text-muted-foreground">Historique des actions effectuées sur votre compte</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Copy className="size-3.5" />
          Exporter
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Date & Heure</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                  <TableHead className="font-semibold">Détails</TableHead>
                  <TableHead className="font-semibold">IP</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLog.map((entry) => {
                  const colors = actionColorMap[entry.action] || { bg: "bg-gray-100 dark:bg-gray-800/40", text: "text-gray-700 dark:text-gray-400", border: "border-gray-200 dark:border-gray-700" }
                  return (
                    <TableRow key={entry.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="text-xs whitespace-nowrap text-muted-foreground font-mono">
                        {entry.date}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}>
                          {entry.action}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{entry.details}</TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">{entry.ip}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Affichage de {auditLog.length} dernières activités
        </p>
        <Button variant="ghost" size="sm" className="text-xs gap-1.5">
          Voir tout
          <ChevronRight className="size-3" />
        </Button>
      </div>
    </div>
  )
}

/* ─── Main Component ───────────────────────────────────────────────────────── */

export function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <User className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Paramètres</h1>
            <p className="text-sm text-muted-foreground">Gérez votre profil, sécurité et préférences</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="size-3.5" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="size-3.5" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="size-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="size-3.5" />
            Apparence
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-1.5">
            <FileText className="size-3.5" />
            Journal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="appearance">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="audit">
          <AuditLogTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
