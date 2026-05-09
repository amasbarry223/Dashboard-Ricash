'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  ArrowLeft, Mail, Phone, MapPin, ShieldCheck,
  Calendar, Wallet, FileText, Clock, Hash, CheckCircle2, XCircle,
  AlertTriangle, User, ArrowUpRight, ArrowDownLeft, ArrowLeftRight, QrCode,
  Activity, Ban, Copy, Download, ExternalLink, Info,
} from "lucide-react"
import { useState, useMemo } from "react"
import {
  transactions, users, kycDocuments, userActivities,
  type Transaction, type TransactionType, type TransactionStatus,
} from "@/lib/mock-data"

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatXOF(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + " XOF"
}

function formatDateFR(dateStr: string): string {
  const [datePart, timePart] = dateStr.split(" ")
  const [year, month, day] = datePart.split("-")
  const months = [
    "janvier", "février", "mars", "avril", "mai", "juin",
    "juillet", "août", "septembre", "octobre", "novembre", "déc.",
  ]
  const monthName = months[parseInt(month, 10) - 1]
  return `${parseInt(day, 10)} ${monthName} ${year} à ${timePart}`
}

function formatDateShort(dateStr: string): string {
  const [datePart] = dateStr.split(" ")
  const [year, month, day] = datePart.split("-")
  const months = [
    "janv.", "févr.", "mars", "avr.", "mai", "juin",
    "juil.", "août", "sept.", "oct.", "nov.", "déc.",
  ]
  return `${parseInt(day, 10)} ${months[parseInt(month, 10) - 1]} ${year}`
}

// ─── Badge configs ────────────────────────────────────────────────────────────
const txStatusLabel: Record<TransactionStatus, string> = {
  COMPLETED: "Complété", PENDING: "En attente", FAILED: "Échoué", CANCELLED: "Annulé",
}
const txStatusClass: Record<TransactionStatus, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  FAILED: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  CANCELLED: "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
}
const txStatusIcon: Record<TransactionStatus, React.ElementType> = {
  COMPLETED: CheckCircle2, PENDING: Clock, FAILED: XCircle, CANCELLED: Ban,
}

const txTypeLabel: Record<TransactionType, string> = {
  DEPOT: "Dépôt", RETRAIT: "Retrait", TRANSFERT: "Transfert", PAIEMENT: "Paiement",
}
const txTypeIcon: Record<TransactionType, React.ElementType> = {
  DEPOT: ArrowDownLeft, RETRAIT: ArrowUpRight, TRANSFERT: ArrowLeftRight, PAIEMENT: QrCode,
}
const txTypeColor: Record<TransactionType, string> = {
  DEPOT: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950",
  RETRAIT: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950",
  TRANSFERT: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950",
  PAIEMENT: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950",
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TransactionDetailPage({ transactionId, onBack }: { transactionId: string; onBack: () => void }) {
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const tx = transactions.find((t) => t.id === transactionId)

  // Find related user data
  const senderUser = useMemo(() => {
    if (!tx) return null
    return users.find((u) =>
      tx.expediteur.includes(`${u.prenom} ${u.nom}`) || tx.expediteur === u.id
    )
  }, [tx])

  const receiverUser = useMemo(() => {
    if (!tx) return null
    return users.find((u) =>
      tx.destinataire.includes(`${u.prenom} ${u.nom}`) || tx.destinataire === u.id
    )
  }, [tx])

  // Related transactions (same sender or receiver, excluding current)
  const relatedTransactions = useMemo(() => {
    if (!tx) return []
    const seen = new Set<string>([tx.id])
    return transactions.filter((t) => {
      if (seen.has(t.id)) return false
      const sameSender = t.expediteur === tx.expediteur
      const sameReceiver = t.destinataire === tx.destinataire
      if (sameSender || sameReceiver) {
        seen.add(t.id)
        return true
      }
      return false
    }).slice(0, 10)
  }, [tx])

  // Copy helper
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-muted-foreground">
        <Wallet className="size-12 opacity-40" />
        <p className="text-lg font-medium">Transaction introuvable</p>
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="size-4" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  const StatusIcon = txStatusIcon[tx.statut]
  const TypeIcon = txTypeIcon[tx.type]
  const totalAmount = tx.montant + tx.frais

  return (
    <div className="space-y-6">
      {/* ── Back button + Header ────────────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="shrink-0" onClick={onBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className={`flex size-12 items-center justify-center rounded-xl ${txTypeColor[tx.type]}`}>
              <TypeIcon className="size-6" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight">
                {txTypeLabel[tx.type]}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm text-muted-foreground font-mono">{tx.reference}</span>
                <Badge variant="outline" className={`gap-1.5 font-medium text-xs ${txStatusClass[tx.statut]}`}>
                  <StatusIcon className="size-3" />
                  {txStatusLabel[tx.statut]}
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" onClick={() => copyToClipboard(tx.reference, "reference")}>
                <Copy className="size-3.5" />
                {copiedField === "reference" ? "Copié !" : "Copier réf."}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copier la référence</TooltipContent>
          </Tooltip>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="size-3.5" />
            Exporter
          </Button>
        </div>
      </div>

      {/* ── Amount & Key Info Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 shrink-0">
              <Wallet className="size-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Montant</p>
              <p className="text-base font-bold tabular-nums text-emerald-700 dark:text-emerald-400">{formatXOF(tx.montant)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-950 shrink-0">
              <Hash className="size-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Frais</p>
              <p className="text-base font-bold tabular-nums">{tx.frais === 0 ? "Gratuit" : formatXOF(tx.frais)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-950 shrink-0">
              <Activity className="size-5 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-base font-bold tabular-nums">{formatXOF(totalAmount)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 shrink-0">
              <Calendar className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-bold">{formatDateShort(tx.date)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Detail Grid ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Transaction Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informations de la transaction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Hash className="size-4 text-muted-foreground" />
                <span className="text-sm">Référence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-semibold">{tx.reference}</span>
                <Button variant="ghost" size="icon" className="size-6" onClick={() => copyToClipboard(tx.reference, "ref")}>
                  <Copy className="size-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Info className="size-4 text-muted-foreground" />
                <span className="text-sm">ID Interne</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">{tx.id}</span>
                <Button variant="ghost" size="icon" className="size-6" onClick={() => copyToClipboard(tx.id, "id")}>
                  <Copy className="size-3" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <TypeIcon className="size-4 text-muted-foreground" />
                <span className="text-sm">Type</span>
              </div>
              <Badge variant="outline" className={`text-xs ${txTypeColor[tx.type]}`}>
                {txTypeLabel[tx.type]}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <StatusIcon className="size-4 text-muted-foreground" />
                <span className="text-sm">Statut</span>
              </div>
              <Badge variant="outline" className={`gap-1.5 text-xs ${txStatusClass[tx.statut]}`}>
                <StatusIcon className="size-3" />
                {txStatusLabel[tx.statut]}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <QrCode className="size-4 text-muted-foreground" />
                <span className="text-sm">Méthode</span>
              </div>
              <span className="text-sm font-medium">{tx.methode}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm">Date & Heure</span>
              </div>
              <span className="text-sm font-medium">{formatDateFR(tx.date)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Sender & Receiver */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Expéditeur & Destinataire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Sender */}
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Expéditeur</p>
              {senderUser ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-950 dark:text-emerald-300">
                      {senderUser.prenom.charAt(0)}{senderUser.nom.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{senderUser.prenom} {senderUser.nom}</p>
                    <p className="text-xs text-muted-foreground">{senderUser.email} · {senderUser.telephone}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-7 shrink-0">
                    <ExternalLink className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <User className="size-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.expediteur}</p>
                    <p className="text-xs text-muted-foreground">Agent ou tiers</p>
                  </div>
                </div>
              )}
            </div>

            {/* Arrow indicator */}
            <div className="flex justify-center">
              <div className="flex size-8 items-center justify-center rounded-full bg-muted">
                <ArrowDownLeft className="size-4 text-muted-foreground rotate-180" />
              </div>
            </div>

            {/* Receiver */}
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Destinataire</p>
              {receiverUser ? (
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold dark:bg-emerald-950 dark:text-emerald-300">
                      {receiverUser.prenom.charAt(0)}{receiverUser.nom.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{receiverUser.prenom} {receiverUser.nom}</p>
                    <p className="text-xs text-muted-foreground">{receiverUser.email} · {receiverUser.telephone}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-7 shrink-0">
                    <ExternalLink className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                    <User className="size-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{tx.destinataire}</p>
                    <p className="text-xs text-muted-foreground">Marchand ou agent</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Financial Summary ───────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Résumé financier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800 dark:text-emerald-300">Montant</span>
              <span className="text-sm font-semibold tabular-nums">{formatXOF(tx.montant)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-emerald-800 dark:text-emerald-300">Frais</span>
              <span className="text-sm font-semibold tabular-nums">{tx.frais === 0 ? "Gratuit" : `+ ${formatXOF(tx.frais)}`}</span>
            </div>
            <Separator className="bg-emerald-200 dark:bg-emerald-800" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Total</span>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">{formatXOF(totalAmount)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Related Transactions ────────────────────────────────────────────── */}
      {relatedTransactions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Transactions liées</CardTitle>
                <CardDescription>Autres transactions impliquant les mêmes parties</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead>Référence</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead className="hidden sm:table-cell">Expéditeur</TableHead>
                    <TableHead className="hidden md:table-cell">Destinataire</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="hidden lg:table-cell">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {relatedTransactions.map((rtx) => {
                    const RTypeIcon = txTypeIcon[rtx.type]
                    return (
                      <TableRow key={rtx.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-mono text-xs">{rtx.reference}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`flex size-6 items-center justify-center rounded-md ${txTypeColor[rtx.type]}`}>
                              <RTypeIcon className="size-3" />
                            </div>
                            <span className="text-sm font-medium">{txTypeLabel[rtx.type]}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium tabular-nums text-sm">{formatXOF(rtx.montant)}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm truncate max-w-[120px]">{rtx.expediteur}</TableCell>
                        <TableCell className="hidden md:table-cell text-sm truncate max-w-[120px]">{rtx.destinataire}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${txStatusClass[rtx.statut]}`}>{txStatusLabel[rtx.statut]}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{rtx.date}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
