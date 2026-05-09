// ─── Dashboard KPIs ───────────────────────────────────────────────────────────
export const kpiData = [
  { label: "Volume Transactions", value: "1 245 680 000 XOF", change: +12.4, period: "Ce mois", icon: "TrendingUp" as const },
  { label: "Nombre de Transactions", value: "84 532", change: +8.2, period: "Ce mois", icon: "ArrowUpRight" as const },
  { label: "Utilisateurs Actifs", value: "23 847", change: +15.6, period: "Ce mois", icon: "Users" as const },
  { label: "Agents Opérationnels", value: "1 245", change: +3.1, period: "Ce mois", icon: "UserCheck" as const },
  { label: "Taux de Succès", value: "97.8%", change: +0.5, period: "Ce mois", icon: "CheckCircle" as const },
  { label: "Solde Global", value: "8 450 230 000 XOF", change: +5.3, period: "Temps réel", icon: "Wallet" as const },
]

export const transactionVolumeData = [
  { date: "Jan", depots: 180, retraits: 120, transferts: 95, paiements: 45 },
  { date: "Fév", depots: 220, retraits: 140, transferts: 110, paiements: 55 },
  { date: "Mar", depots: 250, retraits: 160, transferts: 130, paiements: 65 },
  { date: "Avr", depots: 210, retraits: 135, transferts: 105, paiements: 50 },
  { date: "Mai", depots: 280, retraits: 175, transferts: 145, paiements: 70 },
  { date: "Jun", depots: 310, retraits: 190, transferts: 160, paiements: 80 },
  { date: "Jul", depots: 295, retraits: 180, transferts: 155, paiements: 75 },
  { date: "Aoû", depots: 330, retraits: 200, transferts: 170, paiements: 85 },
  { date: "Sep", depots: 350, retraits: 215, transferts: 180, paiements: 90 },
  { date: "Oct", depots: 370, retraits: 230, transferts: 195, paiements: 95 },
  { date: "Nov", depots: 390, retraits: 245, transferts: 210, paiements: 100 },
  { date: "Déc", depots: 420, retraits: 260, transferts: 225, paiements: 110 },
]

export const userGrowthData = [
  { date: "Jan", utilisateurs: 5200, agents: 180 },
  { date: "Fév", utilisateurs: 6100, agents: 210 },
  { date: "Mar", utilisateurs: 7300, agents: 280 },
  { date: "Avr", utilisateurs: 8900, agents: 350 },
  { date: "Mai", utilisateurs: 10200, agents: 480 },
  { date: "Jun", utilisateurs: 11800, agents: 560 },
  { date: "Jul", utilisateurs: 13200, agents: 650 },
  { date: "Aoû", utilisateurs: 15000, agents: 740 },
  { date: "Sep", utilisateurs: 16800, agents: 830 },
  { date: "Oct", utilisateurs: 18900, agents: 950 },
  { date: "Nov", utilisateurs: 21000, agents: 1080 },
  { date: "Déc", utilisateurs: 23847, agents: 1245 },
]

// ─── Alerts ──────────────────────────────────────────────────────────────────
export type AlertSeverity = "critical" | "warning" | "info"
export interface AdminAlert {
  id: string
  type: string
  message: string
  severity: AlertSeverity
  time: string
  action: string
}

export const adminAlerts: AdminAlert[] = [
  { id: "1", type: "Fraude suspectée", message: "Score de risque > seuil sur transaction #TXN-2847", severity: "critical", time: "Il y a 5 min", action: "Investigation" },
  { id: "2", type: "KYC en attente", message: "12 dossiers KYC > 48h sans traitement", severity: "warning", time: "Il y a 15 min", action: "Valider" },
  { id: "3", type: "Échec de transaction", message: "Taux d'échec 6.2% sur la dernière heure", severity: "critical", time: "Il y a 22 min", action: "Intervention" },
  { id: "4", type: "Agent dépassement", message: "Agent AGT-142 a atteint le plafond journalier", severity: "warning", time: "Il y a 45 min", action: "Réviser" },
  { id: "5", type: "Service indisponible", message: "KYC Service - Healthcheck timeout", severity: "critical", time: "Il y a 1h", action: "Technique" },
  { id: "6", type: "Float bas", message: "Agent AGT-089: Float en dessous du seuil minimum", severity: "warning", time: "Il y a 1h30", action: "Rechargement" },
  { id: "7", type: "Nouveau partenaire", message: "Intégration Orange Money en attente de validation", severity: "info", time: "Il y a 2h", action: "Consulter" },
]

// ─── Users ───────────────────────────────────────────────────────────────────
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"
export type KYCLevel = "Tier 0" | "Tier 1" | "Tier 2" | "Tier 3"

export interface User {
  id: string
  nom: string
  prenom: string
  telephone: string
  email: string
  statut: UserStatus
  kycLevel: KYCLevel
  solde: number
  dateInscription: string
  derniereActivite: string
  pays: string
}

export const users: User[] = [
  { id: "USR-001", nom: "Diallo", prenom: "Amadou", telephone: "+223 76 12 34 56", email: "amadou.diallo@email.com", statut: "ACTIVE", kycLevel: "Tier 2", solde: 345000, dateInscription: "2024-03-15", derniereActivite: "2025-06-10", pays: "ML" },
  { id: "USR-002", nom: "Traoré", prenom: "Fatoumata", telephone: "+223 77 23 45 67", email: "fatoumata.traore@email.com", statut: "ACTIVE", kycLevel: "Tier 1", solde: 125000, dateInscription: "2024-05-22", derniereActivite: "2025-06-09", pays: "ML" },
  { id: "USR-003", nom: "Keita", prenom: "Moussa", telephone: "+223 78 34 56 78", email: "moussa.keita@email.com", statut: "SUSPENDED", kycLevel: "Tier 0", solde: 50000, dateInscription: "2024-07-10", derniereActivite: "2025-05-30", pays: "ML" },
  { id: "USR-004", nom: "Coulibaly", prenom: "Aïssata", telephone: "+223 79 45 67 89", email: "aissata.coulibaly@email.com", statut: "ACTIVE", kycLevel: "Tier 3", solde: 2800000, dateInscription: "2024-01-08", derniereActivite: "2025-06-10", pays: "ML" },
  { id: "USR-005", nom: "Sissoko", prenom: "Boubacar", telephone: "+223 70 56 78 90", email: "boubacar.sissoko@email.com", statut: "INACTIVE", kycLevel: "Tier 1", solde: 0, dateInscription: "2024-09-14", derniereActivite: "2025-02-15", pays: "ML" },
  { id: "USR-006", nom: "Konaté", prenom: "Mariam", telephone: "+223 71 67 89 01", email: "mariam.konate@email.com", statut: "ACTIVE", kycLevel: "Tier 2", solde: 875000, dateInscription: "2024-04-03", derniereActivite: "2025-06-10", pays: "ML" },
  { id: "USR-007", nom: "Sacko", prenom: "Ibrahim", telephone: "+223 72 78 90 12", email: "ibrahim.sacko@email.com", statut: "ACTIVE", kycLevel: "Tier 1", solde: 230000, dateInscription: "2024-06-18", derniereActivite: "2025-06-08", pays: "ML" },
  { id: "USR-008", nom: "Diabaté", prenom: "Kadiatou", telephone: "+223 73 89 01 23", email: "kadiatou.diabate@email.com", statut: "ACTIVE", kycLevel: "Tier 2", solde: 1520000, dateInscription: "2024-02-25", derniereActivite: "2025-06-10", pays: "ML" },
  { id: "USR-009", nom: "Camara", prenom: "Seydou", telephone: "+223 74 90 12 34", email: "seydou.camara@email.com", statut: "SUSPENDED", kycLevel: "Tier 0", solde: 15000, dateInscription: "2024-11-05", derniereActivite: "2025-04-20", pays: "ML" },
  { id: "USR-010", nom: "Sangaré", prenom: "Oumou", telephone: "+223 75 01 23 45", email: "oumou.sangare@email.com", statut: "ACTIVE", kycLevel: "Tier 3", solde: 4500000, dateInscription: "2024-01-12", derniereActivite: "2025-06-10", pays: "ML" },
  { id: "USR-011", nom: "Bah", prenom: "Abdoulaye", telephone: "+223 76 12 34 57", email: "abdoulaye.bah@email.com", statut: "ACTIVE", kycLevel: "Tier 2", solde: 670000, dateInscription: "2024-08-19", derniereActivite: "2025-06-09", pays: "ML" },
  { id: "USR-012", nom: "Dembélé", prenom: "Aminata", telephone: "+223 77 23 45 68", email: "aminata.dembele@email.com", statut: "INACTIVE", kycLevel: "Tier 0", solde: 0, dateInscription: "2024-10-30", derniereActivite: "2025-01-10", pays: "ML" },
]

// ─── KYC ─────────────────────────────────────────────────────────────────────
export type KYCStatus = "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED"

export interface KYCRequest {
  id: string
  userId: string
  userName: string
  currentLevel: KYCLevel
  requestedLevel: KYCLevel
  status: KYCStatus
  submittedAt: string
  documents: string[]
  riskScore: number
}

export const kycRequests: KYCRequest[] = [
  { id: "KYC-001", userId: "USR-001", userName: "Amadou Diallo", currentLevel: "Tier 1", requestedLevel: "Tier 2", status: "IN_REVIEW", submittedAt: "2025-06-08", documents: ["CNI recto/verso", "Selfie biométrique"], riskScore: 12 },
  { id: "KYC-002", userId: "USR-003", userName: "Moussa Keita", currentLevel: "Tier 0", requestedLevel: "Tier 1", status: "PENDING", submittedAt: "2025-06-10", documents: ["CNI recto/verso"], riskScore: 45 },
  { id: "KYC-003", userId: "USR-005", userName: "Boubacar Sissoko", currentLevel: "Tier 0", requestedLevel: "Tier 1", status: "REJECTED", submittedAt: "2025-06-01", documents: ["CNI recto/verso"], riskScore: 78 },
  { id: "KYC-004", userId: "USR-007", userName: "Ibrahim Sacko", currentLevel: "Tier 1", requestedLevel: "Tier 2", status: "PENDING", submittedAt: "2025-06-09", documents: ["CNI recto/verso", "Selfie biométrique"], riskScore: 15 },
  { id: "KYC-005", userId: "USR-009", userName: "Seydou Camara", currentLevel: "Tier 0", requestedLevel: "Tier 1", status: "IN_REVIEW", submittedAt: "2025-06-07", documents: ["CNI recto/verso"], riskScore: 62 },
  { id: "KYC-006", userId: "USR-011", userName: "Abdoulaye Bah", currentLevel: "Tier 1", requestedLevel: "Tier 2", status: "APPROVED", submittedAt: "2025-06-04", documents: ["CNI recto/verso", "Selfie biométrique"], riskScore: 8 },
  { id: "KYC-007", userId: "USR-002", userName: "Fatoumata Traoré", currentLevel: "Tier 1", requestedLevel: "Tier 2", status: "IN_REVIEW", submittedAt: "2025-06-09", documents: ["CNI recto/verso", "Selfie biométrique"], riskScore: 22 },
  { id: "KYC-008", userId: "USR-006", userName: "Mariam Konaté", currentLevel: "Tier 2", requestedLevel: "Tier 3", status: "PENDING", submittedAt: "2025-06-10", documents: ["CNI recto/verso", "Selfie biométrique", "Justificatif revenus", "Vidéo"], riskScore: 5 },
]

export const kycLevels = [
  { level: "Tier 0 — Non vérifié", documents: "Aucun", depotMax: "50 000 XOF/mois", retraitMax: "50 000 XOF/mois", transfertMax: "10 000 XOF/op." },
  { level: "Tier 1 — Basique", documents: "Pièce d'identité nationale", depotMax: "500 000 XOF/mois", retraitMax: "300 000 XOF/mois", transfertMax: "100 000 XOF/op." },
  { level: "Tier 2 — Standard", documents: "ID + biométrie Smile Identity", depotMax: "5 000 000 XOF/mois", retraitMax: "1 500 000 XOF/mois", transfertMax: "500 000 XOF/op." },
  { level: "Tier 3 — Avancé", documents: "Dossier complet multi-documents", depotMax: "Illimité*", retraitMax: "Illimité*", transfertMax: "2 000 000 XOF/op." },
]

// ─── Transactions ────────────────────────────────────────────────────────────
export type TransactionType = "DEPOT" | "RETRAIT" | "TRANSFERT" | "PAIEMENT"
export type TransactionStatus = "COMPLETED" | "PENDING" | "FAILED" | "CANCELLED"

export interface Transaction {
  id: string
  reference: string
  type: TransactionType
  montant: number
  frais: number
  expediteur: string
  destinataire: string
  statut: TransactionStatus
  date: string
  methode: string
}

export const transactions: Transaction[] = [
  // ── Amadou Diallo (USR-001) — 15 transactions ──
  { id: "TXN-001", reference: "REF-20250610-001", type: "DEPOT", montant: 150000, frais: 0, expediteur: "AGT-012", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-10 14:32", methode: "Agent" },
  { id: "TXN-002", reference: "REF-20250610-002", type: "TRANSFERT", montant: 75000, frais: 750, expediteur: "Amadou Diallo", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-06-10 13:15", methode: "App mobile" },
  { id: "TXN-012", reference: "REF-20250608-012", type: "TRANSFERT", montant: 150000, frais: 1500, expediteur: "Kadiatou Diabaté", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-08 15:45", methode: "App mobile" },
  { id: "TXN-013", reference: "REF-20250607-013", type: "PAIEMENT", montant: 12500, frais: 125, expediteur: "Amadou Diallo", destinataire: "Marchand #MRC-034", statut: "COMPLETED", date: "2025-06-07 09:20", methode: "QR Code" },
  { id: "TXN-014", reference: "REF-20250606-014", type: "RETRAIT", montant: 40000, frais: 400, expediteur: "Amadou Diallo", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-06-06 16:10", methode: "Agent" },
  { id: "TXN-015", reference: "REF-20250605-015", type: "DEPOT", montant: 200000, frais: 0, expediteur: "AGT-012", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-05 11:30", methode: "Agent" },
  { id: "TXN-016", reference: "REF-20250604-016", type: "TRANSFERT", montant: 50000, frais: 500, expediteur: "Amadou Diallo", destinataire: "Ibrahim Sacko", statut: "COMPLETED", date: "2025-06-04 14:45", methode: "App mobile" },
  { id: "TXN-017", reference: "REF-20250603-017", type: "PAIEMENT", montant: 8500, frais: 85, expediteur: "Amadou Diallo", destinataire: "Marchand #MRC-056", statut: "COMPLETED", date: "2025-06-03 16:20", methode: "QR Code" },
  { id: "TXN-018", reference: "REF-20250602-018", type: "TRANSFERT", montant: 120000, frais: 1200, expediteur: "Amadou Diallo", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-06-02 10:00", methode: "App mobile" },
  { id: "TXN-019", reference: "REF-20250601-019", type: "DEPOT", montant: 100000, frais: 0, expediteur: "AGT-067", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-01 08:45", methode: "Agent" },
  { id: "TXN-020", reference: "REF-20250530-020", type: "RETRAIT", montant: 30000, frais: 300, expediteur: "Amadou Diallo", destinataire: "AGT-012", statut: "COMPLETED", date: "2025-05-30 17:30", methode: "Agent" },
  { id: "TXN-021", reference: "REF-20250528-021", type: "PAIEMENT", montant: 22000, frais: 220, expediteur: "Amadou Diallo", destinataire: "Marchand #MRC-078", statut: "FAILED", date: "2025-05-28 13:15", methode: "Code marchand" },
  { id: "TXN-022", reference: "REF-20250525-022", type: "TRANSFERT", montant: 60000, frais: 600, expediteur: "Abdoulaye Bah", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-05-25 15:00", methode: "App mobile" },
  { id: "TXN-023", reference: "REF-20250520-023", type: "DEPOT", montant: 300000, frais: 0, expediteur: "AGT-023", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-05-20 09:30", methode: "Agent" },
  { id: "TXN-024", reference: "REF-20250515-024", type: "TRANSFERT", montant: 45000, frais: 450, expediteur: "Amadou Diallo", destinataire: "Boubacar Sissoko", statut: "CANCELLED", date: "2025-05-15 11:20", methode: "App mobile" },

  // ── Fatoumata Traoré (USR-002) — 12 transactions ──
  { id: "TXN-025", reference: "REF-20250610-025", type: "TRANSFERT", montant: 75000, frais: 750, expediteur: "Amadou Diallo", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-06-10 13:16", methode: "App mobile" },
  { id: "TXN-011", reference: "REF-20250608-011", type: "RETRAIT", montant: 80000, frais: 800, expediteur: "Fatoumata Traoré", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-06-08 17:30", methode: "Agent" },
  { id: "TXN-026", reference: "REF-20250607-026", type: "DEPOT", montant: 50000, frais: 0, expediteur: "AGT-012", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-06-07 10:00", methode: "Agent" },
  { id: "TXN-027", reference: "REF-20250606-027", type: "PAIEMENT", montant: 15000, frais: 150, expediteur: "Fatoumata Traoré", destinataire: "Marchand #MRC-023", statut: "COMPLETED", date: "2025-06-06 14:30", methode: "QR Code" },
  { id: "TXN-028", reference: "REF-20250605-028", type: "TRANSFERT", montant: 25000, frais: 250, expediteur: "Fatoumata Traoré", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-05 16:45", methode: "App mobile" },
  { id: "TXN-029", reference: "REF-20250603-029", type: "DEPOT", montant: 100000, frais: 0, expediteur: "AGT-067", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-06-03 09:15", methode: "Agent" },
  { id: "TXN-030", reference: "REF-20250601-030", type: "RETRAIT", montant: 35000, frais: 350, expediteur: "Fatoumata Traoré", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-06-01 12:00", methode: "Agent" },
  { id: "TXN-031", reference: "REF-20250529-031", type: "PAIEMENT", montant: 7500, frais: 75, expediteur: "Fatoumata Traoré", destinataire: "Marchand #MRC-045", statut: "COMPLETED", date: "2025-05-29 11:30", methode: "QR Code" },
  { id: "TXN-032", reference: "REF-20250527-032", type: "TRANSFERT", montant: 40000, frais: 400, expediteur: "Fatoumata Traoré", destinataire: "Aminata Dembélé", statut: "PENDING", date: "2025-05-27 15:20", methode: "App mobile" },
  { id: "TXN-033", reference: "REF-20250522-033", type: "DEPOT", montant: 75000, frais: 0, expediteur: "AGT-023", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-05-22 08:45", methode: "Agent" },
  { id: "TXN-034", reference: "REF-20250518-034", type: "RETRAIT", montant: 20000, frais: 200, expediteur: "Fatoumata Traoré", destinataire: "AGT-012", statut: "FAILED", date: "2025-05-18 16:30", methode: "Agent" },
  { id: "TXN-035", reference: "REF-20250510-035", type: "PAIEMENT", montant: 12000, frais: 120, expediteur: "Fatoumata Traoré", destinataire: "Marchand #MRC-067", statut: "COMPLETED", date: "2025-05-10 10:15", methode: "Code marchand" },

  // ── Moussa Keita (USR-003) — 10 transactions ──
  { id: "TXN-003", reference: "REF-20250610-003", type: "RETRAIT", montant: 50000, frais: 500, expediteur: "Moussa Keita", destinataire: "AGT-045", statut: "PENDING", date: "2025-06-10 12:45", methode: "Agent" },
  { id: "TXN-036", reference: "REF-20250605-036", type: "DEPOT", montant: 25000, frais: 0, expediteur: "AGT-012", destinataire: "Moussa Keita", statut: "COMPLETED", date: "2025-06-05 10:00", methode: "Agent" },
  { id: "TXN-037", reference: "REF-20250601-037", type: "PAIEMENT", montant: 5000, frais: 50, expediteur: "Moussa Keita", destinataire: "Marchand #MRC-012", statut: "COMPLETED", date: "2025-06-01 14:30", methode: "QR Code" },
  { id: "TXN-038", reference: "REF-20250528-038", type: "RETRAIT", montant: 15000, frais: 150, expediteur: "Moussa Keita", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-05-28 11:00", methode: "Agent" },
  { id: "TXN-039", reference: "REF-20250525-039", type: "DEPOT", montant: 30000, frais: 0, expediteur: "AGT-067", destinataire: "Moussa Keita", statut: "COMPLETED", date: "2025-05-25 09:30", methode: "Agent" },
  { id: "TXN-040", reference: "REF-20250520-040", type: "TRANSFERT", montant: 10000, frais: 100, expediteur: "Moussa Keita", destinataire: "Seydou Camara", statut: "FAILED", date: "2025-05-20 16:00", methode: "App mobile" },
  { id: "TXN-041", reference: "REF-20250515-041", type: "PAIEMENT", montant: 3500, frais: 35, expediteur: "Moussa Keita", destinataire: "Marchand #MRC-034", statut: "COMPLETED", date: "2025-05-15 12:45", methode: "QR Code" },
  { id: "TXN-042", reference: "REF-20250510-042", type: "DEPOT", montant: 20000, frais: 0, expediteur: "AGT-012", destinataire: "Moussa Keita", statut: "COMPLETED", date: "2025-05-10 08:15", methode: "Agent" },
  { id: "TXN-043", reference: "REF-20250505-043", type: "RETRAIT", montant: 8000, frais: 80, expediteur: "Moussa Keita", destinataire: "AGT-045", statut: "CANCELLED", date: "2025-05-05 15:30", methode: "Agent" },
  { id: "TXN-044", reference: "REF-20250428-044", type: "PAIEMENT", montant: 2500, frais: 25, expediteur: "Moussa Keita", destinataire: "Marchand #MRC-089", statut: "COMPLETED", date: "2025-04-28 10:00", methode: "Code marchand" },

  // ── Aïssata Coulibaly (USR-004) — 14 transactions ──
  { id: "TXN-004", reference: "REF-20250610-004", type: "PAIEMENT", montant: 25000, frais: 250, expediteur: "Aïssata Coulibaly", destinataire: "Marchand #MRC-089", statut: "COMPLETED", date: "2025-06-10 11:20", methode: "QR Code" },
  { id: "TXN-009", reference: "REF-20250609-009", type: "TRANSFERT", montant: 320000, frais: 3200, expediteur: "Aïssata Coulibaly", destinataire: "Seydou Camara", statut: "CANCELLED", date: "2025-06-09 12:30", methode: "App mobile" },
  { id: "TXN-045", reference: "REF-20250608-045", type: "DEPOT", montant: 500000, frais: 0, expediteur: "AGT-023", destinataire: "Aïssata Coulibaly", statut: "COMPLETED", date: "2025-06-08 09:00", methode: "Agent" },
  { id: "TXN-046", reference: "REF-20250607-046", type: "TRANSFERT", montant: 150000, frais: 1500, expediteur: "Aïssata Coulibaly", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-06-07 14:30", methode: "App mobile" },
  { id: "TXN-047", reference: "REF-20250606-047", type: "PAIEMENT", montant: 45000, frais: 450, expediteur: "Aïssata Coulibaly", destinataire: "Marchand #MRC-102", statut: "COMPLETED", date: "2025-06-06 11:15", methode: "QR Code" },
  { id: "TXN-048", reference: "REF-20250604-048", type: "RETRAIT", montant: 200000, frais: 2000, expediteur: "Aïssata Coulibaly", destinataire: "AGT-012", statut: "COMPLETED", date: "2025-06-04 16:00", methode: "Agent" },
  { id: "TXN-049", reference: "REF-20250602-049", type: "DEPOT", montant: 750000, frais: 0, expediteur: "AGT-023", destinataire: "Aïssata Coulibaly", statut: "COMPLETED", date: "2025-06-02 08:30", methode: "Agent" },
  { id: "TXN-050", reference: "REF-20250530-050", type: "TRANSFERT", montant: 100000, frais: 1000, expediteur: "Aïssata Coulibaly", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-05-30 13:45", methode: "App mobile" },
  { id: "TXN-051", reference: "REF-20250528-051", type: "PAIEMENT", montant: 18000, frais: 180, expediteur: "Aïssata Coulibaly", destinataire: "Marchand #MRC-056", statut: "COMPLETED", date: "2025-05-28 10:00", methode: "Code marchand" },
  { id: "TXN-052", reference: "REF-20250525-052", type: "DEPOT", montant: 300000, frais: 0, expediteur: "AGT-067", destinataire: "Aïssata Coulibaly", statut: "COMPLETED", date: "2025-05-25 09:15", methode: "Agent" },
  { id: "TXN-053", reference: "REF-20250520-053", type: "RETRAIT", montant: 150000, frais: 1500, expediteur: "Aïssata Coulibaly", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-05-20 15:30", methode: "Agent" },
  { id: "TXN-054", reference: "REF-20250515-054", type: "TRANSFERT", montant: 250000, frais: 2500, expediteur: "Aïssata Coulibaly", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-05-15 12:00", methode: "App mobile" },
  { id: "TXN-055", reference: "REF-20250510-055", type: "PAIEMENT", montant: 35000, frais: 350, expediteur: "Aïssata Coulibaly", destinataire: "Marchand #MRC-078", statut: "PENDING", date: "2025-05-10 14:00", methode: "QR Code" },
  { id: "TXN-056", reference: "REF-20250505-056", type: "DEPOT", montant: 400000, frais: 0, expediteur: "AGT-012", destinataire: "Aïssata Coulibaly", statut: "COMPLETED", date: "2025-05-05 08:45", methode: "Agent" },

  // ── Boubacar Sissoko (USR-005) — 8 transactions ──
  { id: "TXN-024", reference: "REF-20250515-024", type: "TRANSFERT", montant: 45000, frais: 450, expediteur: "Amadou Diallo", destinataire: "Boubacar Sissoko", statut: "CANCELLED", date: "2025-05-15 11:20", methode: "App mobile" },
  { id: "TXN-057", reference: "REF-20250510-057", type: "DEPOT", montant: 10000, frais: 0, expediteur: "AGT-012", destinataire: "Boubacar Sissoko", statut: "COMPLETED", date: "2025-05-10 09:00", methode: "Agent" },
  { id: "TXN-058", reference: "REF-20250428-058", type: "PAIEMENT", montant: 5000, frais: 50, expediteur: "Boubacar Sissoko", destinataire: "Marchand #MRC-023", statut: "COMPLETED", date: "2025-04-28 14:30", methode: "QR Code" },
  { id: "TXN-059", reference: "REF-20250415-059", type: "RETRAIT", montant: 5000, frais: 50, expediteur: "Boubacar Sissoko", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-04-15 11:00", methode: "Agent" },
  { id: "TXN-060", reference: "REF-20250401-060", type: "DEPOT", montant: 15000, frais: 0, expediteur: "AGT-067", destinataire: "Boubacar Sissoko", statut: "COMPLETED", date: "2025-04-01 08:30", methode: "Agent" },
  { id: "TXN-061", reference: "REF-20250320-061", type: "PAIEMENT", montant: 3000, frais: 30, expediteur: "Boubacar Sissoko", destinataire: "Marchand #MRC-012", statut: "FAILED", date: "2025-03-20 16:00", methode: "Code marchand" },
  { id: "TXN-062", reference: "REF-20250310-062", type: "TRANSFERT", montant: 5000, frais: 50, expediteur: "Boubacar Sissoko", destinataire: "Moussa Keita", statut: "COMPLETED", date: "2025-03-10 10:15", methode: "App mobile" },
  { id: "TXN-063", reference: "REF-20250225-063", type: "DEPOT", montant: 20000, frais: 0, expediteur: "AGT-023", destinataire: "Boubacar Sissoko", statut: "COMPLETED", date: "2025-02-25 09:45", methode: "Agent" },

  // ── Mariam Konaté (USR-006) — 13 transactions ──
  { id: "TXN-006", reference: "REF-20250609-006", type: "DEPOT", montant: 500000, frais: 0, expediteur: "AGT-023", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-06-09 16:40", methode: "Agent" },
  { id: "TXN-018", reference: "REF-20250602-018", type: "TRANSFERT", montant: 120000, frais: 1200, expediteur: "Amadou Diallo", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-06-02 10:00", methode: "App mobile" },
  { id: "TXN-050", reference: "REF-20250530-050", type: "TRANSFERT", montant: 100000, frais: 1000, expediteur: "Aïssata Coulibaly", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-05-30 13:45", methode: "App mobile" },
  { id: "TXN-064", reference: "REF-20250608-064", type: "PAIEMENT", montant: 28000, frais: 280, expediteur: "Mariam Konaté", destinataire: "Marchand #MRC-102", statut: "COMPLETED", date: "2025-06-08 14:15", methode: "QR Code" },
  { id: "TXN-065", reference: "REF-20250606-065", type: "RETRAIT", montant: 75000, frais: 750, expediteur: "Mariam Konaté", destinataire: "AGT-012", statut: "COMPLETED", date: "2025-06-06 11:30", methode: "Agent" },
  { id: "TXN-066", reference: "REF-20250604-066", type: "TRANSFERT", montant: 200000, frais: 2000, expediteur: "Mariam Konaté", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-04 09:45", methode: "App mobile" },
  { id: "TXN-067", reference: "REF-20250601-067", type: "DEPOT", montant: 300000, frais: 0, expediteur: "AGT-023", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-06-01 08:00", methode: "Agent" },
  { id: "TXN-068", reference: "REF-20250528-068", type: "PAIEMENT", montant: 15000, frais: 150, expediteur: "Mariam Konaté", destinataire: "Marchand #MRC-034", statut: "COMPLETED", date: "2025-05-28 16:30", methode: "Code marchand" },
  { id: "TXN-069", reference: "REF-20250525-069", type: "TRANSFERT", montant: 50000, frais: 500, expediteur: "Mariam Konaté", destinataire: "Abdoulaye Bah", statut: "COMPLETED", date: "2025-05-25 14:00", methode: "App mobile" },
  { id: "TXN-070", reference: "REF-20250520-070", type: "RETRAIT", montant: 100000, frais: 1000, expediteur: "Mariam Konaté", destinataire: "AGT-045", statut: "FAILED", date: "2025-05-20 10:15", methode: "Agent" },
  { id: "TXN-071", reference: "REF-20250515-071", type: "DEPOT", montant: 250000, frais: 0, expediteur: "AGT-067", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-05-15 08:45", methode: "Agent" },
  { id: "TXN-072", reference: "REF-20250510-072", type: "PAIEMENT", montant: 32000, frais: 320, expediteur: "Mariam Konaté", destinataire: "Marchand #MRC-067", statut: "COMPLETED", date: "2025-05-10 12:30", methode: "QR Code" },
  { id: "TXN-073", reference: "REF-20250505-073", type: "TRANSFERT", montant: 80000, frais: 800, expediteur: "Mariam Konaté", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-05-05 15:00", methode: "App mobile" },

  // ── Ibrahim Sacko (USR-007) — 11 transactions ──
  { id: "TXN-007", reference: "REF-20250609-007", type: "RETRAIT", montant: 100000, frais: 1000, expediteur: "Ibrahim Sacko", destinataire: "AGT-012", statut: "FAILED", date: "2025-06-09 15:22", methode: "Agent" },
  { id: "TXN-016", reference: "REF-20250604-016", type: "TRANSFERT", montant: 50000, frais: 500, expediteur: "Amadou Diallo", destinataire: "Ibrahim Sacko", statut: "COMPLETED", date: "2025-06-04 14:45", methode: "App mobile" },
  { id: "TXN-074", reference: "REF-20250607-074", type: "DEPOT", montant: 80000, frais: 0, expediteur: "AGT-012", destinataire: "Ibrahim Sacko", statut: "COMPLETED", date: "2025-06-07 10:30", methode: "Agent" },
  { id: "TXN-075", reference: "REF-20250605-075", type: "PAIEMENT", montant: 12000, frais: 120, expediteur: "Ibrahim Sacko", destinataire: "Marchand #MRC-089", statut: "COMPLETED", date: "2025-06-05 13:45", methode: "QR Code" },
  { id: "TXN-076", reference: "REF-20250602-076", type: "TRANSFERT", montant: 30000, frais: 300, expediteur: "Ibrahim Sacko", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-02 16:00", methode: "App mobile" },
  { id: "TXN-077", reference: "REF-20250530-077", type: "RETRAIT", montant: 25000, frais: 250, expediteur: "Ibrahim Sacko", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-05-30 11:15", methode: "Agent" },
  { id: "TXN-078", reference: "REF-20250525-078", type: "DEPOT", montant: 150000, frais: 0, expediteur: "AGT-023", destinataire: "Ibrahim Sacko", statut: "COMPLETED", date: "2025-05-25 09:00", methode: "Agent" },
  { id: "TXN-079", reference: "REF-20250520-079", type: "PAIEMENT", montant: 8500, frais: 85, expediteur: "Ibrahim Sacko", destinataire: "Marchand #MRC-056", statut: "COMPLETED", date: "2025-05-20 14:30", methode: "Code marchand" },
  { id: "TXN-080", reference: "REF-20250515-080", type: "TRANSFERT", montant: 40000, frais: 400, expediteur: "Ibrahim Sacko", destinataire: "Fatoumata Traoré", statut: "PENDING", date: "2025-05-15 16:45", methode: "App mobile" },
  { id: "TXN-081", reference: "REF-20250510-081", type: "RETRAIT", montant: 20000, frais: 200, expediteur: "Ibrahim Sacko", destinataire: "AGT-012", statut: "COMPLETED", date: "2025-05-10 10:00", methode: "Agent" },
  { id: "TXN-082", reference: "REF-20250505-082", type: "DEPOT", montant: 60000, frais: 0, expediteur: "AGT-067", destinataire: "Ibrahim Sacko", statut: "CANCELLED", date: "2025-05-05 08:15", methode: "Agent" },

  // ── Kadiatou Diabaté (USR-008) — 12 transactions ──
  { id: "TXN-005", reference: "REF-20250610-005", type: "TRANSFERT", montant: 200000, frais: 2000, expediteur: "Oumou Sangaré", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-10 10:55", methode: "App mobile" },
  { id: "TXN-012", reference: "REF-20250608-012", type: "TRANSFERT", montant: 150000, frais: 1500, expediteur: "Kadiatou Diabaté", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-08 15:45", methode: "App mobile" },
  { id: "TXN-028", reference: "REF-20250605-028", type: "TRANSFERT", montant: 25000, frais: 250, expediteur: "Fatoumata Traoré", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-05 16:45", methode: "App mobile" },
  { id: "TXN-054", reference: "REF-20250515-054", type: "TRANSFERT", montant: 250000, frais: 2500, expediteur: "Aïssata Coulibaly", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-05-15 12:00", methode: "App mobile" },
  { id: "TXN-066", reference: "REF-20250604-066", type: "TRANSFERT", montant: 200000, frais: 2000, expediteur: "Mariam Konaté", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-04 09:45", methode: "App mobile" },
  { id: "TXN-083", reference: "REF-20250607-083", type: "DEPOT", montant: 350000, frais: 0, expediteur: "AGT-023", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-07 08:30", methode: "Agent" },
  { id: "TXN-084", reference: "REF-20250603-084", type: "RETRAIT", montant: 120000, frais: 1200, expediteur: "Kadiatou Diabaté", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-06-03 14:00", methode: "Agent" },
  { id: "TXN-085", reference: "REF-20250530-085", type: "PAIEMENT", montant: 42000, frais: 420, expediteur: "Kadiatou Diabaté", destinataire: "Marchand #MRC-102", statut: "COMPLETED", date: "2025-05-30 11:30", methode: "QR Code" },
  { id: "TXN-086", reference: "REF-20250525-086", type: "DEPOT", montant: 200000, frais: 0, expediteur: "AGT-012", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-05-25 09:15", methode: "Agent" },
  { id: "TXN-087", reference: "REF-20250520-087", type: "TRANSFERT", montant: 180000, frais: 1800, expediteur: "Kadiatou Diabaté", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-05-20 15:45", methode: "App mobile" },
  { id: "TXN-088", reference: "REF-20250515-088", type: "RETRAIT", montant: 80000, frais: 800, expediteur: "Kadiatou Diabaté", destinataire: "AGT-012", statut: "FAILED", date: "2025-05-15 10:30", methode: "Agent" },
  { id: "TXN-089", reference: "REF-20250510-089", type: "PAIEMENT", montant: 22000, frais: 220, expediteur: "Kadiatou Diabaté", destinataire: "Marchand #MRC-078", statut: "COMPLETED", date: "2025-05-10 13:00", methode: "Code marchand" },

  // ── Seydou Camara (USR-009) — 10 transactions ──
  { id: "TXN-009", reference: "REF-20250609-009", type: "TRANSFERT", montant: 320000, frais: 3200, expediteur: "Aïssata Coulibaly", destinataire: "Seydou Camara", statut: "CANCELLED", date: "2025-06-09 12:30", methode: "App mobile" },
  { id: "TXN-040", reference: "REF-20250520-040", type: "TRANSFERT", montant: 10000, frais: 100, expediteur: "Moussa Keita", destinataire: "Seydou Camara", statut: "FAILED", date: "2025-05-20 16:00", methode: "App mobile" },
  { id: "TXN-090", reference: "REF-20250605-090", type: "DEPOT", montant: 15000, frais: 0, expediteur: "AGT-012", destinataire: "Seydou Camara", statut: "COMPLETED", date: "2025-06-05 09:30", methode: "Agent" },
  { id: "TXN-091", reference: "REF-20250530-091", type: "RETRAIT", montant: 5000, frais: 50, expediteur: "Seydou Camara", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-05-30 14:15", methode: "Agent" },
  { id: "TXN-092", reference: "REF-20250525-092", type: "PAIEMENT", montant: 3000, frais: 30, expediteur: "Seydou Camara", destinataire: "Marchand #MRC-012", statut: "COMPLETED", date: "2025-05-25 11:00", methode: "QR Code" },
  { id: "TXN-093", reference: "REF-20250520-093", type: "DEPOT", montant: 10000, frais: 0, expediteur: "AGT-067", destinataire: "Seydou Camara", statut: "COMPLETED", date: "2025-05-20 08:45", methode: "Agent" },
  { id: "TXN-094", reference: "REF-20250515-094", type: "RETRAIT", montant: 5000, frais: 50, expediteur: "Seydou Camara", destinataire: "AGT-012", statut: "FAILED", date: "2025-05-15 16:30", methode: "Agent" },
  { id: "TXN-095", reference: "REF-20250510-095", type: "TRANSFERT", montant: 5000, frais: 50, expediteur: "Seydou Camara", destinataire: "Moussa Keita", statut: "COMPLETED", date: "2025-05-10 10:00", methode: "App mobile" },
  { id: "TXN-096", reference: "REF-20250505-096", type: "PAIEMENT", montant: 2000, frais: 20, expediteur: "Seydou Camara", destinataire: "Marchand #MRC-034", statut: "COMPLETED", date: "2025-05-05 13:30", methode: "Code marchand" },
  { id: "TXN-097", reference: "REF-20250428-097", type: "DEPOT", montant: 8000, frais: 0, expediteur: "AGT-023", destinataire: "Seydou Camara", statut: "COMPLETED", date: "2025-04-28 09:15", methode: "Agent" },

  // ── Oumou Sangaré (USR-010) — 13 transactions ──
  { id: "TXN-005", reference: "REF-20250610-005", type: "TRANSFERT", montant: 200000, frais: 2000, expediteur: "Oumou Sangaré", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-10 10:55", methode: "App mobile" },
  { id: "TXN-010", reference: "REF-20250609-010", type: "DEPOT", montant: 250000, frais: 0, expediteur: "AGT-067", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-06-09 09:15", methode: "Agent" },
  { id: "TXN-046", reference: "REF-20250607-046", type: "TRANSFERT", montant: 150000, frais: 1500, expediteur: "Aïssata Coulibaly", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-06-07 14:30", methode: "App mobile" },
  { id: "TXN-087", reference: "REF-20250520-087", type: "TRANSFERT", montant: 180000, frais: 1800, expediteur: "Kadiatou Diabaté", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-05-20 15:45", methode: "App mobile" },
  { id: "TXN-098", reference: "REF-20250608-098", type: "PAIEMENT", montant: 55000, frais: 550, expediteur: "Oumou Sangaré", destinataire: "Marchand #MRC-056", statut: "COMPLETED", date: "2025-06-08 11:00", methode: "QR Code" },
  { id: "TXN-099", reference: "REF-20250605-099", type: "DEPOT", montant: 800000, frais: 0, expediteur: "AGT-023", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-06-05 08:30", methode: "Agent" },
  { id: "TXN-100", reference: "REF-20250602-100", type: "TRANSFERT", montant: 300000, frais: 3000, expediteur: "Oumou Sangaré", destinataire: "Aïssata Coulibaly", statut: "COMPLETED", date: "2025-06-02 14:15", methode: "App mobile" },
  { id: "TXN-101", reference: "REF-20250530-101", type: "RETRAIT", montant: 150000, frais: 1500, expediteur: "Oumou Sangaré", destinataire: "AGT-012", statut: "COMPLETED", date: "2025-05-30 16:00", methode: "Agent" },
  { id: "TXN-102", reference: "REF-20250525-102", type: "PAIEMENT", montant: 75000, frais: 750, expediteur: "Oumou Sangaré", destinataire: "Marchand #MRC-102", statut: "COMPLETED", date: "2025-05-25 10:30", methode: "Code marchand" },
  { id: "TXN-103", reference: "REF-20250520-103", type: "DEPOT", montant: 500000, frais: 0, expediteur: "AGT-067", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-05-20 09:00", methode: "Agent" },
  { id: "TXN-104", reference: "REF-20250515-104", type: "TRANSFERT", montant: 250000, frais: 2500, expediteur: "Oumou Sangaré", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-05-15 13:45", methode: "App mobile" },
  { id: "TXN-105", reference: "REF-20250510-105", type: "RETRAIT", montant: 100000, frais: 1000, expediteur: "Oumou Sangaré", destinataire: "AGT-045", statut: "PENDING", date: "2025-05-10 11:15", methode: "Agent" },
  { id: "TXN-106", reference: "REF-20250505-106", type: "DEPOT", montant: 600000, frais: 0, expediteur: "AGT-023", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-05-05 08:00", methode: "Agent" },

  // ── Abdoulaye Bah (USR-011) — 12 transactions ──
  { id: "TXN-008", reference: "REF-20250609-008", type: "PAIEMENT", montant: 35000, frais: 350, expediteur: "Abdoulaye Bah", destinataire: "Marchand #MRC-102", statut: "COMPLETED", date: "2025-06-09 14:10", methode: "Code marchand" },
  { id: "TXN-022", reference: "REF-20250525-022", type: "TRANSFERT", montant: 60000, frais: 600, expediteur: "Abdoulaye Bah", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-05-25 15:00", methode: "App mobile" },
  { id: "TXN-069", reference: "REF-20250525-069", type: "TRANSFERT", montant: 50000, frais: 500, expediteur: "Mariam Konaté", destinataire: "Abdoulaye Bah", statut: "COMPLETED", date: "2025-05-25 14:00", methode: "App mobile" },
  { id: "TXN-107", reference: "REF-20250608-107", type: "DEPOT", montant: 120000, frais: 0, expediteur: "AGT-012", destinataire: "Abdoulaye Bah", statut: "COMPLETED", date: "2025-06-08 09:30", methode: "Agent" },
  { id: "TXN-108", reference: "REF-20250606-108", type: "RETRAIT", montant: 40000, frais: 400, expediteur: "Abdoulaye Bah", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-06-06 14:15", methode: "Agent" },
  { id: "TXN-109", reference: "REF-20250603-109", type: "TRANSFERT", montant: 85000, frais: 850, expediteur: "Abdoulaye Bah", destinataire: "Ibrahim Sacko", statut: "COMPLETED", date: "2025-06-03 11:00", methode: "App mobile" },
  { id: "TXN-110", reference: "REF-20250530-110", type: "PAIEMENT", montant: 15000, frais: 150, expediteur: "Abdoulaye Bah", destinataire: "Marchand #MRC-023", statut: "COMPLETED", date: "2025-05-30 16:30", methode: "QR Code" },
  { id: "TXN-111", reference: "REF-20250525-111", type: "DEPOT", montant: 200000, frais: 0, expediteur: "AGT-023", destinataire: "Abdoulaye Bah", statut: "COMPLETED", date: "2025-05-25 08:45", methode: "Agent" },
  { id: "TXN-112", reference: "REF-20250520-112", type: "RETRAIT", montant: 60000, frais: 600, expediteur: "Abdoulaye Bah", destinataire: "AGT-012", statut: "FAILED", date: "2025-05-20 13:00", methode: "Agent" },
  { id: "TXN-113", reference: "REF-20250515-113", type: "PAIEMENT", montant: 25000, frais: 250, expediteur: "Abdoulaye Bah", destinataire: "Marchand #MRC-089", statut: "COMPLETED", date: "2025-05-15 10:30", methode: "Code marchand" },
  { id: "TXN-114", reference: "REF-20250510-114", type: "TRANSFERT", montant: 30000, frais: 300, expediteur: "Abdoulaye Bah", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-05-10 15:15", methode: "App mobile" },
  { id: "TXN-115", reference: "REF-20250505-115", type: "DEPOT", montant: 150000, frais: 0, expediteur: "AGT-067", destinataire: "Abdoulaye Bah", statut: "COMPLETED", date: "2025-05-05 09:00", methode: "Agent" },

  // ── Aminata Dembélé (USR-012) — 9 transactions ──
  { id: "TXN-032", reference: "REF-20250527-032", type: "TRANSFERT", montant: 40000, frais: 400, expediteur: "Fatoumata Traoré", destinataire: "Aminata Dembélé", statut: "PENDING", date: "2025-05-27 15:20", methode: "App mobile" },
  { id: "TXN-116", reference: "REF-20250110-116", type: "DEPOT", montant: 5000, frais: 0, expediteur: "AGT-012", destinataire: "Aminata Dembélé", statut: "COMPLETED", date: "2025-01-10 09:00", methode: "Agent" },
  { id: "TXN-117", reference: "REF-20250108-117", type: "PAIEMENT", montant: 2500, frais: 25, expediteur: "Aminata Dembélé", destinataire: "Marchand #MRC-012", statut: "COMPLETED", date: "2025-01-08 14:30", methode: "QR Code" },
  { id: "TXN-118", reference: "REF-20241220-118", type: "DEPOT", montant: 10000, frais: 0, expediteur: "AGT-023", destinataire: "Aminata Dembélé", statut: "COMPLETED", date: "2024-12-20 10:15", methode: "Agent" },
  { id: "TXN-119", reference: "REF-20241215-119", type: "RETRAIT", montant: 5000, frais: 50, expediteur: "Aminata Dembélé", destinataire: "AGT-045", statut: "COMPLETED", date: "2024-12-15 11:00", methode: "Agent" },
  { id: "TXN-120", reference: "REF-20241210-120", type: "TRANSFERT", montant: 3000, frais: 30, expediteur: "Aminata Dembélé", destinataire: "Moussa Keita", statut: "FAILED", date: "2024-12-10 16:00", methode: "App mobile" },
  { id: "TXN-121", reference: "REF-20241205-121", type: "PAIEMENT", montant: 1500, frais: 15, expediteur: "Aminata Dembélé", destinataire: "Marchand #MRC-034", statut: "COMPLETED", date: "2024-12-05 13:45", methode: "Code marchand" },
  { id: "TXN-122", reference: "REF-20241130-122", type: "DEPOT", montant: 8000, frais: 0, expediteur: "AGT-067", destinataire: "Aminata Dembélé", statut: "COMPLETED", date: "2024-11-30 08:30", methode: "Agent" },
  { id: "TXN-123", reference: "REF-20241125-123", type: "RETRAIT", montant: 3000, frais: 30, expediteur: "Aminata Dembélé", destinataire: "AGT-012", statut: "CANCELLED", date: "2024-11-25 15:00", methode: "Agent" },
]

// ─── Agents ──────────────────────────────────────────────────────────────────
export type AgentStatus = "ACTIVE" | "PENDING" | "INACTIVE" | "SUSPENDED"

export interface Agent {
  id: string
  code: string
  nom: string
  prenom: string
  telephone: string
  commerce: string
  localisation: string
  statut: AgentStatus
  floatActuel: number
  floatMin: number
  commission: number
  dateApprobation: string
  transactionsJour: number
  volumeJour: number
}

export const agents: Agent[] = [
  { id: "AGT-012", code: "AGT012", nom: "Koné", prenom: "Mamadou", telephone: "+223 76 55 55 01", commerce: "Boutique Al Baraka", localisation: "Bamako, Commune III", statut: "ACTIVE", floatActuel: 2500000, floatMin: 500000, commission: 1.5, dateApprobation: "2024-02-15", transactionsJour: 45, volumeJour: 3200000 },
  { id: "AGT-023", code: "AGT023", nom: "Touré", prenom: "Awa", telephone: "+223 77 55 55 02", commerce: "Supermarché Sira", localisation: "Bamako, Commune V", statut: "ACTIVE", floatActuel: 4200000, floatMin: 800000, commission: 1.2, dateApprobation: "2024-03-20", transactionsJour: 62, volumeJour: 5100000 },
  { id: "AGT-045", code: "AGT045", nom: "Diarra", prenom: "Souleymane", telephone: "+223 78 55 55 03", commerce: "Pharmacie Santé Plus", localisation: "Bamako, Commune I", statut: "ACTIVE", floatActuel: 1800000, floatMin: 600000, commission: 1.8, dateApprobation: "2024-04-10", transactionsJour: 28, volumeJour: 2100000 },
  { id: "AGT-067", code: "AGT067", nom: "Sidibé", prenom: "Rokia", telephone: "+223 79 55 55 04", commerce: "Marché Central", localisation: "Bamako, Commune II", statut: "ACTIVE", floatActuel: 850000, floatMin: 500000, commission: 1.5, dateApprobation: "2024-05-05", transactionsJour: 38, volumeJour: 2800000 },
  { id: "AGT-089", code: "AGT089", nom: "Sylla", prenom: "Modibo", telephone: "+223 70 55 55 05", commerce: "Cyber Café Digital", localisation: "Sikasso", statut: "ACTIVE", floatActuel: 200000, floatMin: 400000, commission: 1.3, dateApprobation: "2024-06-12", transactionsJour: 15, volumeJour: 950000 },
  { id: "AGT-142", code: "AGT142", nom: "Haidara", prenom: "Fatoumata", telephone: "+223 71 55 55 06", commerce: "Station Total Les Pins", localisation: "Bamako, Commune IV", statut: "ACTIVE", floatActuel: 3800000, floatMin: 700000, commission: 1.0, dateApprobation: "2024-01-08", transactionsJour: 55, volumeJour: 4500000 },
  { id: "AGT-201", code: "AGT201", nom: "Maïga", prenom: "Boureima", telephone: "+223 72 55 55 07", commerce: "Boutique La Chance", localisation: "Kayes", statut: "PENDING", floatActuel: 0, floatMin: 500000, commission: 0, dateApprobation: "", transactionsJour: 0, volumeJour: 0 },
  { id: "AGT-202", code: "AGT202", nom: "Cissé", prenom: "Adama", telephone: "+223 73 55 55 08", commerce: "Épicerie Bon Prix", localisation: "Mopti", statut: "PENDING", floatActuel: 0, floatMin: 400000, commission: 0, dateApprobation: "", transactionsJour: 0, volumeJour: 0 },
  { id: "AGT-099", code: "AGT099", nom: "Traoré", prenom: "Lassine", telephone: "+223 74 55 55 09", commerce: "Depot Express", localisation: "Ségou", statut: "SUSPENDED", floatActuel: 0, floatMin: 300000, commission: 1.5, dateApprobation: "2024-03-01", transactionsJour: 0, volumeJour: 0 },
  { id: "AGT-100", code: "AGT100", nom: "Sakho", prenom: "Mamadou", telephone: "+223 75 55 55 10", commerce: "Shop Express", localisation: "Gao", statut: "INACTIVE", floatActuel: 0, floatMin: 300000, commission: 1.2, dateApprobation: "2024-07-15", transactionsJour: 0, volumeJour: 0 },
]

// ─── Partners ────────────────────────────────────────────────────────────────
export type PartnerStatus = "ACTIVE" | "INTEGRATING" | "INACTIVE"

export interface Partner {
  id: string
  code: string
  nom: string
  type: string
  statut: PartnerStatus
  adaptateur: string
  dernierEchange: string
  volumeMois: number
  transactionsMois: number
}

export const partners: Partner[] = [
  { id: "PTR-001", code: "ORANGE_ML", nom: "Orange Money Mali", type: "Mobile Money", statut: "INTEGRATING", adaptateur: "orange", dernierEchange: "2025-06-10", volumeMois: 125000000, transactionsMois: 15200 },
  { id: "PTR-002", code: "MTN_ML", nom: "MTN Mobile Money", type: "Mobile Money", statut: "INTEGRATING", adaptateur: "mtn", dernierEchange: "2025-06-09", volumeMois: 98000000, transactionsMois: 11500 },
  { id: "PTR-003", code: "MOCK", nom: "Simulation Locale", type: "Test", statut: "ACTIVE", adaptateur: "mock", dernierEchange: "2025-06-10", volumeMois: 45000000, transactionsMois: 8900 },
  { id: "PTR-004", code: "BANK_UEMOA", nom: "Banque UEMOA", type: "Virement bancaire", statut: "INACTIVE", adaptateur: "bank", dernierEchange: "2025-05-15", volumeMois: 0, transactionsMois: 0 },
  { id: "PTR-005", code: "WORLDREMIT", nom: "WorldRemit", type: "Transfert international", statut: "INACTIVE", adaptateur: "intl", dernierEchange: "2025-04-20", volumeMois: 0, transactionsMois: 0 },
]

// ─── Notifications ───────────────────────────────────────────────────────────
export type NotificationChannel = "SMS" | "EMAIL" | "PUSH"
export type NotificationType = "OTP" | "TRANSACTION" | "SECURITY" | "KYC" | "SYSTEM" | "PROMOTION" | "MAINTENANCE"
export type NotificationAudience = "ALL_USERS" | "ALL_AGENTS" | "ALL" | "SPECIFIC_USERS" | "SPECIFIC_AGENTS"
export type NotificationPriority = "NORMAL" | "HIGH" | "URGENT"

export interface Notification {
  id: string
  type: NotificationType
  canal: NotificationChannel
  destinataire: string
  message: string
  statut: "SENT" | "DELIVERED" | "FAILED"
  date: string
}

export interface SentNotification {
  id: string
  titre: string
  type: NotificationType
  canaux: NotificationChannel[]
  audience: NotificationAudience
  audienceDetail: string
  message: string
  priorite: NotificationPriority
  statut: "SENT" | "DELIVERED" | "PARTIAL" | "FAILED"
  nbDestinataires: number
  nbDelivres: number
  nbEchoues: number
  dateEnvoi: string
  envoyePar: string
}

export interface NotificationTemplate {
  id: string
  nom: string
  categorie: NotificationType
  objet: string
  contenu: string
  canauxSuggere: NotificationChannel[]
  audienceSuggere: NotificationAudience
  variableSlots: string[]
}

export const notifications: Notification[] = [
  { id: "NOT-001", type: "OTP", canal: "SMS", destinataire: "+223 76 12 34 56", message: "Code OTP: 8472 - Validation inscription Ricash", statut: "DELIVERED", date: "2025-06-10 14:35" },
  { id: "NOT-002", type: "TRANSACTION", canal: "SMS", destinataire: "+223 77 23 45 67", message: "Vous avez reçu 75 000 XOF de Amadou Diallo", statut: "DELIVERED", date: "2025-06-10 13:16" },
  { id: "NOT-003", type: "SECURITY", canal: "SMS", destinataire: "+223 78 34 56 78", message: "Connexion détectée depuis un nouvel appareil", statut: "SENT", date: "2025-06-10 12:00" },
  { id: "NOT-004", type: "KYC", canal: "PUSH", destinataire: "+223 79 45 67 89", message: "Votre vérification KYC Tier 2 a été approuvée", statut: "DELIVERED", date: "2025-06-10 10:20" },
  { id: "NOT-005", type: "TRANSACTION", canal: "EMAIL", destinataire: "amadou.diallo@email.com", message: "Reçu de dépôt - 150 000 XOF", statut: "DELIVERED", date: "2025-06-10 14:33" },
  { id: "NOT-006", type: "OTP", canal: "SMS", destinataire: "+223 70 56 78 90", message: "Code OTP: 2951 - Changement code secret", statut: "FAILED", date: "2025-06-10 09:45" },
  { id: "NOT-007", type: "SYSTEM", canal: "PUSH", destinataire: "All Admins", message: "Alerte: KYC Service indisponible - Vérification en cours", statut: "SENT", date: "2025-06-10 08:30" },
  { id: "NOT-008", type: "TRANSACTION", canal: "SMS", destinataire: "+223 71 67 89 01", message: "Retrait de 50 000 XOF effectué avec succès", statut: "DELIVERED", date: "2025-06-09 16:42" },
]

export const sentNotifications: SentNotification[] = [
  { id: "SN-001", titre: "Maintenance planifiée — 15 Juin", type: "MAINTENANCE", canaux: ["SMS", "PUSH"], audience: "ALL_USERS", audienceDetail: "23 847 utilisateurs actifs", message: "Cher utilisateur, une maintenance est planifiée le 15 juin de 02h à 05h GMT. Les services seront temporairement indisponibles. Merci de votre compréhension.", priorite: "HIGH", statut: "DELIVERED", nbDestinataires: 23847, nbDelivres: 23412, nbEchoues: 435, dateEnvoi: "2025-06-09 10:00", envoyePar: "Super Admin" },
  { id: "SN-002", titre: "Nouveaux plafonds KYC Tier 2", type: "KYC", canaux: ["SMS", "EMAIL"], audience: "ALL_USERS", audienceDetail: "8 320 utilisateurs Tier 2", message: "Bonne nouvelle ! Vos plafonds ont été augmentés : Dépôt 5M XOF/mois, Retrait 1.5M XOF/mois. Vérifiez votre espace pour plus de détails.", priorite: "NORMAL", statut: "DELIVERED", nbDestinataires: 8320, nbDelivres: 8156, nbEchoues: 164, dateEnvoi: "2025-06-08 09:00", envoyePar: "Admin Conformité" },
  { id: "SN-003", titre: "Rechargement Float — Action requise", type: "SYSTEM", canaux: ["SMS"], audience: "ALL_AGENTS", audienceDetail: "1 245 agents actifs", message: "Votre float est inférieur au seuil minimum. Veuillez procéder à un rechargement pour continuer à offrir le service dépôt/retrait.", priorite: "URGENT", statut: "PARTIAL", nbDestinataires: 1245, nbDelivres: 1189, nbEchoues: 56, dateEnvoi: "2025-06-07 14:30", envoyePar: "Admin Financier" },
  { id: "SN-004", titre: "Alerte Sécurité — Vérification requise", type: "SECURITY", canaux: ["SMS", "EMAIL", "PUSH"], audience: "SPECIFIC_USERS", audienceDetail: "12 utilisateurs concernés", message: "Nous avons détecté une activité suspecte sur votre compte. Pour votre sécurité, veuillez vérifier vos dernières transactions et changer votre code secret.", priorite: "URGENT", statut: "DELIVERED", nbDestinataires: 12, nbDelivres: 12, nbEchoues: 0, dateEnvoi: "2025-06-07 11:15", envoyePar: "Super Admin" },
  { id: "SN-005", titre: "Promo — 0% frais de transfert ce week-end", type: "PROMOTION", canaux: ["SMS", "PUSH"], audience: "ALL_USERS", audienceDetail: "23 847 utilisateurs actifs", message: "🎉 Ce week-end, envoyez de l'argent gratuitement ! 0% de frais sur tous les transferts du samedi 7h au dimanche 23h.", priorite: "NORMAL", statut: "DELIVERED", nbDestinataires: 23847, nbDelivres: 22015, nbEchoues: 1832, dateEnvoi: "2025-06-06 08:00", envoyePar: "Admin Reporting" },
  { id: "SN-006", titre: "Rappel KYC — Complétez votre vérification", type: "KYC", canaux: ["SMS"], audience: "SPECIFIC_USERS", audienceDetail: "3 450 utilisateurs Tier 0", message: "Complétez votre vérification KYC pour bénéficier de plafonds plus élevés. Soumettez votre pièce d'identité directement dans l'app.", priorite: "NORMAL", statut: "PARTIAL", nbDestinataires: 3450, nbDelivres: 3201, nbEchoues: 249, dateEnvoi: "2025-06-05 16:00", envoyePar: "Admin Conformité" },
  { id: "SN-007", titre: "Nouveau partenaire — Orange Money", type: "SYSTEM", canaux: ["EMAIL", "PUSH"], audience: "ALL_AGENTS", audienceDetail: "1 245 agents actifs", message: "Orange Money Mali est maintenant intégré ! Vous pouvez désormais effectuer des cash-in/cash-out Orange Money. Formation disponible dans l'espace agent.", priorite: "HIGH", statut: "DELIVERED", nbDestinataires: 1245, nbDelivres: 1230, nbEchoues: 15, dateEnvoi: "2025-06-04 10:30", envoyePar: "Admin Support" },
  { id: "SN-008", titre: "Incident technique résolu", type: "MAINTENANCE", canaux: ["PUSH"], audience: "ALL", audienceDetail: "Tous les utilisateurs et agents", message: "L'incident technique sur les paiements par QR code est résolu. Tous les services sont de nouveau opérationnels. Merci pour votre patience.", priorite: "HIGH", statut: "DELIVERED", nbDestinataires: 25092, nbDelivres: 24800, nbEchoues: 292, dateEnvoi: "2025-06-03 18:45", envoyePar: "Super Admin" },
  { id: "SN-009", titre: "Rapport hebdomadaire disponible", type: "SYSTEM", canaux: ["EMAIL"], audience: "ALL_AGENTS", audienceDetail: "1 245 agents actifs", message: "Votre rapport hebdomadaire est disponible : volume de transactions, commissions gagnées et performances. Consultez-le dans votre espace.", priorite: "NORMAL", statut: "PARTIAL", nbDestinataires: 1245, nbDelivres: 1198, nbEchoues: 47, dateEnvoi: "2025-06-02 07:00", envoyePar: "Admin Reporting" },
  { id: "SN-010", titre: "Alerte Fraude — Suspicion de compte compromis", type: "SECURITY", canaux: ["SMS", "EMAIL", "PUSH"], audience: "SPECIFIC_USERS", audienceDetail: "5 utilisateurs signalés", message: "Alerte de sécurité : des transactions inhabituelles ont été détectées sur votre compte. Votre accès a été temporairement restreint. Contactez le support au 80 00 00 00.", priorite: "URGENT", statut: "DELIVERED", nbDestinataires: 5, nbDelivres: 5, nbEchoues: 0, dateEnvoi: "2025-06-01 22:30", envoyePar: "Super Admin" },
]

export const notificationTemplates: NotificationTemplate[] = [
  { id: "TPL-001", nom: "Maintenance planifiée", categorie: "MAINTENANCE", objet: "Maintenance planifiée — {{date}}", contenu: "Cher {{role}}, une maintenance est planifiée le {{date}} de {{heure_debut}} à {{heure_fin}} GMT. Les services seront temporairement indisponibles. Merci de votre compréhension.", canauxSuggere: ["SMS", "PUSH"], audienceSuggere: "ALL_USERS", variableSlots: ["date", "heure_debut", "heure_fin", "role"] },
  { id: "TPL-002", nom: "Alerte de sécurité", categorie: "SECURITY", objet: "Alerte Sécurité — Action requise", contenu: "Nous avons détecté une activité suspecte sur votre compte. Pour votre sécurité, veuillez {{action}} immédiatement. Si vous n'êtes pas à l'origine de cette activité, contactez le support au {{telephone_support}}.", canauxSuggere: ["SMS", "EMAIL", "PUSH"], audienceSuggere: "SPECIFIC_USERS", variableSlots: ["action", "telephone_support"] },
  { id: "TPL-003", nom: "Promotion frais réduits", categorie: "PROMOTION", objet: "Offre spéciale — {{reduction}} de frais !", contenu: "🎉 Offre spéciale ! Profitez de {{reduction}} sur les frais de {{type_operation}} du {{date_debut}} au {{date_fin}}. Ne manquez pas cette opportunité !", canauxSuggere: ["SMS", "PUSH"], audienceSuggere: "ALL_USERS", variableSlots: ["reduction", "type_operation", "date_debut", "date_fin"] },
  { id: "TPL-004", nom: "Rappel vérification KYC", categorie: "KYC", objet: "Complétez votre vérification KYC", contenu: "Complétez votre vérification KYC pour bénéficier de plafonds plus élevés. Soumettez votre {{document_requis}} directement dans l'application. Passer au {{niveau_cible}} vous permet de {{avantage}}.", canauxSuggere: ["SMS", "EMAIL"], audienceSuggere: "SPECIFIC_USERS", variableSlots: ["document_requis", "niveau_cible", "avantage"] },
  { id: "TPL-005", nom: "Rechargement Float agent", categorie: "SYSTEM", objet: "Rechargement Float — Action requise", contenu: "Votre float actuel de {{float_actuel}} XOF est inférieur au seuil minimum de {{float_min}} XOF. Veuillez procéder à un rechargement pour continuer à offrir le service dépôt/retrait.", canauxSuggere: ["SMS"], audienceSuggere: "ALL_AGENTS", variableSlots: ["float_actuel", "float_min"] },
  { id: "TPL-006", nom: "Incident technique résolu", categorie: "MAINTENANCE", objet: "Incident technique résolu", contenu: "L'incident technique sur {{service_affecte}} est résolu. Tous les services sont de nouveau opérationnels. Nous nous excusons pour la gêne occasionnée et vous remercions pour votre patience.", canauxSuggere: ["PUSH", "EMAIL"], audienceSuggere: "ALL", variableSlots: ["service_affecte"] },
  { id: "TPL-007", nom: "Nouveau partenaire intégré", categorie: "SYSTEM", objet: "Nouveau partenaire — {{nom_partenaire}}", contenu: "{{nom_partenaire}} est maintenant intégré ! Vous pouvez désormais {{action_disponible}}. Formation disponible dans votre espace.", canauxSuggere: ["EMAIL", "PUSH"], audienceSuggere: "ALL_AGENTS", variableSlots: ["nom_partenaire", "action_disponible"] },
  { id: "TPL-008", nom: "Confirmation de transaction", categorie: "TRANSACTION", objet: "Confirmation — {{type_transaction}} de {{montant}} XOF", contenu: "Votre {{type_transaction}} de {{montant}} XOF a été {{statut_transaction}}. Référence : {{reference}}. Frais : {{frais}} XOF. Solde restant : {{solde}} XOF.", canauxSuggere: ["SMS"], audienceSuggere: "SPECIFIC_USERS", variableSlots: ["type_transaction", "montant", "statut_transaction", "reference", "frais", "solde"] },
]

// ─── Configuration / Fees ────────────────────────────────────────────────────
export interface FeeConfig {
  id: string
  type: string
  modele: string
  valeur: string
  parametrable: boolean
  actif: boolean
}

export const feeConfigs: FeeConfig[] = [
  { id: "FEE-001", type: "Transfert inter-utilisateurs", modele: "% montant + fixe", valeur: "1% + 100 XOF", parametrable: true, actif: true },
  { id: "FEE-002", type: "Retrait via agent", modele: "% montant", valeur: "1%", parametrable: true, actif: true },
  { id: "FEE-003", type: "Dépôt via agent", modele: "Gratuit ou % plafonné", valeur: "Gratuit", parametrable: true, actif: true },
  { id: "FEE-004", type: "Paiement marchand", modele: "% à charge marchand", valeur: "1.5%", parametrable: true, actif: true },
  { id: "FEE-005", type: "Cash-in via opérateur", modele: "Selon SLA partenaire", valeur: "Variable", parametrable: true, actif: true },
  { id: "FEE-006", type: "Transfert international", modele: "% variable par corridor", valeur: "2-5%", parametrable: true, actif: true },
]

export interface SecurityConfig {
  id: string
  parametre: string
  valeur: string
  description: string
}

export const securityConfigs: SecurityConfig[] = [
  { id: "SEC-001", parametre: "Seuil alerte fraude", valeur: "Score > 70", description: "Score de risque au-delà duquel une alerte est générée" },
  { id: "SEC-002", parametre: "Taux échec critique", valeur: "5%", description: "Taux d'échec sur 1h déclenchant une alerte technique" },
  { id: "SEC-003", parametre: "Durée max KYC en attente", valeur: "48h", description: "Délai maximum avant alerte KYC non traité" },
  { id: "SEC-004", parametre: "Politique mot de passe", valeur: "Min 12 car., majuscule, chiffre, spécial", description: "Règles de complexité des mots de passe admin" },
  { id: "SEC-005", parametre: "2FA Admin", valeur: "Obligatoire", description: "Double authentification pour tous les admins" },
  { id: "SEC-006", parametre: "Rotation JWT", valeur: "30 jours", description: "Fréquence de rotation des secrets JWT" },
  { id: "SEC-007", parametre: "Blocage après tentatives", valeur: "3 tentatives / 15 min", description: "Blocage automatique du compte après échecs consécutifs" },
]

// ─── Admin Users ─────────────────────────────────────────────────────────────
export type AdminRole = "Super Admin" | "Admin Financier" | "Admin Conformité" | "Admin Support" | "Admin Reporting"

export interface AdminUser {
  id: string
  nom: string
  email: string
  role: AdminRole
  statut: "ACTIVE" | "INACTIVE"
  derniereConnexion: string
}

export const adminUsers: AdminUser[] = [
  { id: "ADM-001", nom: "Super Admin", email: "superadmin@ricash.com", role: "Super Admin", statut: "ACTIVE", derniereConnexion: "2025-06-10 14:00" },
  { id: "ADM-002", nom: "Oumar Konaté", email: "oumar.konate@ricash.com", role: "Admin Financier", statut: "ACTIVE", derniereConnexion: "2025-06-10 13:30" },
  { id: "ADM-003", nom: "Aminata Diarra", email: "aminata.diarra@ricash.com", role: "Admin Conformité", statut: "ACTIVE", derniereConnexion: "2025-06-10 12:15" },
  { id: "ADM-004", nom: "Seydou Bah", email: "seydou.bah@ricash.com", role: "Admin Support", statut: "ACTIVE", derniereConnexion: "2025-06-09 17:45" },
  { id: "ADM-005", nom: "Fatoumata Sacko", email: "fatoumata.sacko@ricash.com", role: "Admin Reporting", statut: "INACTIVE", derniereConnexion: "2025-05-20 10:00" },
]

// ─── Settings / Paramètres ──────────────────────────────────────────────────
export interface AdminProfile {
  id: string
  nom: string
  email: string
  telephone: string
  role: string
  avatar: string
  departement: string
  dateCreation: string
  derniereConnexion: string
  langue: string
  fuseauHoraire: string
}

export const adminProfile: AdminProfile = {
  id: "ADM-001",
  nom: "Super Admin",
  email: "superadmin@ricash.com",
  telephone: "+223 76 00 00 01",
  role: "Super Admin",
  avatar: "SA",
  departement: "Direction Générale",
  dateCreation: "2024-01-01",
  derniereConnexion: "2025-06-10 14:00",
  langue: "Français",
  fuseauHoraire: "Africa/Bamako (GMT+0)",
}

export interface NotificationPreference {
  id: string
  categorie: string
  description: string
  email: boolean
  sms: boolean
  push: boolean
  inApp: boolean
}

export const notificationPreferences: NotificationPreference[] = [
  { id: "NP-001", categorie: "Transactions", description: "Alertes sur les transactions suspectes et échecs", email: true, sms: true, push: true, inApp: true },
  { id: "NP-002", categorie: "KYC & Conformité", description: "Nouvelles demandes KYC et alertes de conformité", email: true, sms: false, push: true, inApp: true },
  { id: "NP-003", categorie: "Sécurité", description: "Connexions suspectes, tentatives de piratage", email: true, sms: true, push: true, inApp: true },
  { id: "NP-004", categorie: "Agents", description: "Nouvelles inscriptions agents, alertes float bas", email: true, sms: false, push: false, inApp: true },
  { id: "NP-005", categorie: "Système", description: "Pannes de services, maintenance planifiée", email: true, sms: true, push: true, inApp: true },
  { id: "NP-006", categorie: "Rapports", description: "Rapports quotidiens et hebdomadaires disponibles", email: true, sms: false, push: false, inApp: false },
  { id: "NP-007", categorie: "Partenaires", description: "Statut des intégrations et échanges API", email: true, sms: false, push: true, inApp: true },
]

export interface ActiveSession {
  id: string
  appareil: string
  navigateur: string
  localisation: string
  ip: string
  dernierActivite: string
  actif: boolean
}

export const activeSessions: ActiveSession[] = [
  { id: "SES-001", appareil: "MacBook Pro", navigateur: "Chrome 126", localisation: "Bamako, Mali", ip: "196.47.xxx.xxx", dernierActivite: "2025-06-10 14:32", actif: true },
  { id: "SES-002", appareil: "iPhone 15", navigateur: "Safari Mobile", localisation: "Bamako, Mali", ip: "154.72.xxx.xxx", dernierActivite: "2025-06-10 11:15", actif: true },
  { id: "SES-003", appareil: "Windows Desktop", navigateur: "Firefox 127", localisation: "Bamako, Mali", ip: "196.47.xxx.xxx", dernierActivite: "2025-06-09 17:45", actif: false },
]

export interface AuditLogEntry {
  id: string
  action: string
  details: string
  date: string
  ip: string
}

export const auditLog: AuditLogEntry[] = [
  { id: "LOG-001", action: "Connexion", details: "Connexion réussie depuis Chrome / MacBook Pro", date: "2025-06-10 14:00", ip: "196.47.xxx.xxx" },
  { id: "LOG-002", action: "Modification KYC", details: "Approbation KYC-006 (Abdoulaye Bah → Tier 2)", date: "2025-06-10 13:45", ip: "196.47.xxx.xxx" },
  { id: "LOG-003", action: "Configuration frais", details: "Modification taux transfert inter-utilisateurs: 1% → 1.1%", date: "2025-06-10 11:20", ip: "196.47.xxx.xxx" },
  { id: "LOG-004", action: "Suspension utilisateur", details: "Suspension USR-003 (Moussa Keita) — Fraude suspectée", date: "2025-06-09 16:30", ip: "196.47.xxx.xxx" },
  { id: "LOG-005", action: "Ajout admin", details: "Création compte Admin Support — Seydou Bah", date: "2025-06-08 10:00", ip: "196.47.xxx.xxx" },
  { id: "LOG-006", action: "Export données", details: "Export rapport transactions Juin 2025 (CSV)", date: "2025-06-07 09:15", ip: "196.47.xxx.xxx" },
  { id: "LOG-007", action: "Changement mot de passe", details: "Mise à jour du mot de passe personnel", date: "2025-06-05 08:30", ip: "196.47.xxx.xxx" },
  { id: "LOG-008", action: "Connexion", details: "Connexion réussie depuis Safari / iPhone 15", date: "2025-06-05 08:00", ip: "154.72.xxx.xxx" },
]

// ─── User Detail: KYC Documents ────────────────────────────────────────────────
export type KYCDocStatus = "VERIFIED" | "PENDING" | "REJECTED" | "EXPIRED"

export interface KYCDocument {
  id: string
  userId: string
  type: string
  numero: string
  dateSoumission: string
  dateExpiration: string
  statut: KYCDocStatus
  verifiedBy: string
  commentaire: string
}

export const kycDocuments: KYCDocument[] = [
  { id: "DOC-001", userId: "USR-001", type: "CNI recto/verso", numero: "NIA-2018-45231", dateSoumission: "2024-03-15", dateExpiration: "2028-03-15", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Document lisible et conforme" },
  { id: "DOC-002", userId: "USR-001", type: "Selfie biométrique", numero: "SELFIE-2024-001", dateSoumission: "2024-06-20", dateExpiration: "", statut: "VERIFIED", verifiedBy: "Smile Identity API", commentaire: "Score correspondance: 98.5%" },
  { id: "DOC-003", userId: "USR-002", type: "CNI recto/verso", numero: "NIA-2019-78432", dateSoumission: "2024-05-22", dateExpiration: "2029-05-22", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Document valide" },
  { id: "DOC-004", userId: "USR-003", type: "CNI recto/verso", numero: "NIA-2020-12345", dateSoumission: "2024-07-10", dateExpiration: "2025-07-10", statut: "EXPIRED", verifiedBy: "", commentaire: "Document expiré — renouvellement requis" },
  { id: "DOC-005", userId: "USR-004", type: "CNI recto/verso", numero: "NIA-2017-91234", dateSoumission: "2024-01-08", dateExpiration: "2027-01-08", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Document conforme" },
  { id: "DOC-006", userId: "USR-004", type: "Selfie biométrique", numero: "SELFIE-2024-004", dateSoumission: "2024-02-15", dateExpiration: "", statut: "VERIFIED", verifiedBy: "Smile Identity API", commentaire: "Score: 99.1%" },
  { id: "DOC-007", userId: "USR-004", type: "Justificatif de revenus", numero: "JIR-2024-089", dateSoumission: "2024-03-01", dateExpiration: "2025-03-01", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Revenus confirmés" },
  { id: "DOC-008", userId: "USR-004", type: "Vidéo de vérification", numero: "VID-2024-012", dateSoumission: "2024-03-02", dateExpiration: "", statut: "VERIFIED", verifiedBy: "Smile Identity API", commentaire: "Vidéo validée" },
  { id: "DOC-009", userId: "USR-005", type: "CNI recto/verso", numero: "NIA-2021-55678", dateSoumission: "2024-09-14", dateExpiration: "2026-09-14", statut: "REJECTED", verifiedBy: "Admin Conformité", commentaire: "Photo illisible — nouvelle soumission requise" },
  { id: "DOC-010", userId: "USR-006", type: "CNI recto/verso", numero: "NIA-2019-33456", dateSoumission: "2024-04-03", dateExpiration: "2029-04-03", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Document valide" },
  { id: "DOC-011", userId: "USR-006", type: "Selfie biométrique", numero: "SELFIE-2024-006", dateSoumission: "2024-05-10", dateExpiration: "", statut: "VERIFIED", verifiedBy: "Smile Identity API", commentaire: "Score: 97.8%" },
  { id: "DOC-012", userId: "USR-007", type: "CNI recto/verso", numero: "NIA-2022-87654", dateSoumission: "2024-06-18", dateExpiration: "2027-06-18", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Document conforme" },
  { id: "DOC-013", userId: "USR-009", type: "CNI recto/verso", numero: "NIA-2023-44321", dateSoumission: "2024-11-05", dateExpiration: "2026-11-05", statut: "PENDING", verifiedBy: "", commentaire: "En attente de vérification" },
  { id: "DOC-014", userId: "USR-010", type: "CNI recto/verso", numero: "NIA-2016-22110", dateSoumission: "2024-01-12", dateExpiration: "2026-01-12", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Document valide" },
  { id: "DOC-015", userId: "USR-010", type: "Selfie biométrique", numero: "SELFIE-2024-010", dateSoumission: "2024-01-20", dateExpiration: "", statut: "VERIFIED", verifiedBy: "Smile Identity API", commentaire: "Score: 99.3%" },
  { id: "DOC-016", userId: "USR-010", type: "Justificatif de revenus", numero: "JIR-2024-110", dateSoumission: "2024-02-01", dateExpiration: "2025-02-01", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Certificat employeur validé" },
  { id: "DOC-017", userId: "USR-010", type: "Vidéo de vérification", numero: "VID-2024-020", dateSoumission: "2024-02-02", dateExpiration: "", statut: "VERIFIED", verifiedBy: "Smile Identity API", commentaire: "Vidéo validée" },
  { id: "DOC-018", userId: "USR-011", type: "CNI recto/verso", numero: "NIA-2020-67890", dateSoumission: "2024-08-19", dateExpiration: "2028-08-19", statut: "VERIFIED", verifiedBy: "Admin Conformité", commentaire: "Document valide" },
  { id: "DOC-019", userId: "USR-011", type: "Selfie biométrique", numero: "SELFIE-2024-011", dateSoumission: "2024-08-25", dateExpiration: "", statut: "VERIFIED", verifiedBy: "Smile Identity API", commentaire: "Score: 96.2%" },
]

// ─── User Detail: Activity History ─────────────────────────────────────────────
export interface UserActivity {
  id: string
  userId: string
  action: string
  details: string
  date: string
  ip: string
  categorie: "AUTH" | "TRANSACTION" | "KYC" | "SECURITY" | "PROFILE" | "SYSTEM"
}

export const userActivities: UserActivity[] = [
  { id: "ACT-001", userId: "USR-001", action: "Connexion", details: "Connexion depuis Android / Chrome Mobile", date: "2025-06-10 14:30", ip: "196.47.xxx.xxx", categorie: "AUTH" },
  { id: "ACT-002", userId: "USR-001", action: "Transfert émis", details: "Transfert de 75 000 XOF vers Fatoumata Traoré", date: "2025-06-10 13:15", ip: "196.47.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-003", userId: "USR-001", action: "Dépôt reçu", details: "Dépôt de 150 000 XOF via AGT-012", date: "2025-06-10 14:32", ip: "196.47.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-004", userId: "USR-001", action: "Modification KYC", details: "Soumission demande Tier 2 — CNI + Selfie biométrique", date: "2025-06-08 09:20", ip: "196.47.xxx.xxx", categorie: "KYC" },
  { id: "ACT-005", userId: "USR-001", action: "Changement code secret", details: "Code secret modifié avec succès", date: "2025-06-05 11:45", ip: "196.47.xxx.xxx", categorie: "SECURITY" },
  { id: "ACT-006", userId: "USR-001", action: "Connexion", details: "Connexion depuis iPhone / Safari Mobile", date: "2025-06-04 08:00", ip: "154.72.xxx.xxx", categorie: "AUTH" },
  { id: "ACT-007", userId: "USR-001", action: "Paiement marchand", details: "Paiement de 12 500 XOF à Marchand #MRC-034", date: "2025-06-03 16:20", ip: "196.47.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-008", userId: "USR-001", action: "Mise à jour profil", details: "Numéro de téléphone mis à jour", date: "2025-05-28 10:15", ip: "196.47.xxx.xxx", categorie: "PROFILE" },
  { id: "ACT-009", userId: "USR-002", action: "Connexion", details: "Connexion depuis Android / Chrome Mobile", date: "2025-06-09 18:30", ip: "154.72.xxx.xxx", categorie: "AUTH" },
  { id: "ACT-010", userId: "USR-002", action: "Transfert reçu", details: "Réception de 75 000 XOF de Amadou Diallo", date: "2025-06-10 13:16", ip: "154.72.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-011", userId: "USR-002", action: "Retrait", details: "Retrait de 80 000 XOF via AGT-045", date: "2025-06-08 17:30", ip: "154.72.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-012", userId: "USR-002", action: "Soumission KYC", details: "Demande Tier 2 — CNI + Selfie biométrique", date: "2025-06-09 10:00", ip: "154.72.xxx.xxx", categorie: "KYC" },
  { id: "ACT-013", userId: "USR-003", action: "Connexion", details: "Tentative de connexion échouée (3ème tentative)", date: "2025-05-30 09:45", ip: "102.33.xxx.xxx", categorie: "SECURITY" },
  { id: "ACT-014", userId: "USR-003", action: "Suspension", details: "Compte suspendu par l'admin — Fraude suspectée", date: "2025-05-30 10:00", ip: "196.47.xxx.xxx", categorie: "SYSTEM" },
  { id: "ACT-015", userId: "USR-004", action: "Dépôt reçu", details: "Dépôt de 500 000 XOF via AGT-023", date: "2025-06-10 08:30", ip: "196.47.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-016", userId: "USR-004", action: "Paiement marchand", details: "Paiement de 25 000 XOF via QR Code", date: "2025-06-10 11:20", ip: "196.47.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-017", userId: "USR-004", action: "Approbation KYC", details: "Niveau Tier 3 approuvé — Dossier complet validé", date: "2024-03-05 14:00", ip: "196.47.xxx.xxx", categorie: "KYC" },
  { id: "ACT-018", userId: "USR-006", action: "Soumission KYC", details: "Demande Tier 3 — Dossier complet avec vidéo", date: "2025-06-10 09:30", ip: "154.72.xxx.xxx", categorie: "KYC" },
  { id: "ACT-019", userId: "USR-006", action: "Transfert émis", details: "Transfert de 200 000 XOF vers Oumou Sangaré", date: "2025-06-07 15:00", ip: "154.72.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-020", userId: "USR-009", action: "Alerte sécurité", details: "Connexion depuis IP suspecte détectée", date: "2025-04-18 22:30", ip: "85.203.xxx.xxx", categorie: "SECURITY" },
  { id: "ACT-021", userId: "USR-010", action: "Dépôt reçu", details: "Dépôt de 250 000 XOF via AGT-067", date: "2025-06-09 09:15", ip: "196.47.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-022", userId: "USR-010", action: "Transfert émis", details: "Transfert de 200 000 XOF vers Kadiatou Diabaté", date: "2025-06-10 10:55", ip: "196.47.xxx.xxx", categorie: "TRANSACTION" },
  { id: "ACT-023", userId: "USR-011", action: "Approbation KYC", details: "Niveau Tier 2 approuvé", date: "2025-06-04 16:00", ip: "196.47.xxx.xxx", categorie: "KYC" },
  { id: "ACT-024", userId: "USR-012", action: "Dernière connexion", details: "Dernière activité enregistrée le 2025-01-10", date: "2025-01-10 14:30", ip: "154.72.xxx.xxx", categorie: "AUTH" },
]

// ─── Services Status ─────────────────────────────────────────────────────────
export interface ServiceStatus {
  name: string
  tech: string
  port: number
  status: "UP" | "DOWN" | "DEGRADED"
  uptime: string
  lastCheck: string
}

export const serviceStatuses: ServiceStatus[] = [
  { name: "User Service", tech: "Spring Boot / Java 22", port: 8001, status: "UP", uptime: "99.98%", lastCheck: "2025-06-10 14:35" },
  { name: "Payment Service", tech: "Spring Boot / Java 17+", port: 8080, status: "UP", uptime: "99.95%", lastCheck: "2025-06-10 14:35" },
  { name: "Wallet Service", tech: "NestJS / TypeScript", port: 3000, status: "UP", uptime: "99.99%", lastCheck: "2025-06-10 14:35" },
  { name: "Partner Service", tech: "FastAPI / Python 3.11", port: 8003, status: "UP", uptime: "99.90%", lastCheck: "2025-06-10 14:35" },
  { name: "Notification Service", tech: "Node.js / Express / TS", port: 8000, status: "DEGRADED", uptime: "98.50%", lastCheck: "2025-06-10 14:35" },
  { name: "KYC Service", tech: "FastAPI / Python 3.11", port: 8000, status: "DOWN", uptime: "0%", lastCheck: "2025-06-10 14:35" },
]
