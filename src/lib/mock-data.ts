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
  { id: "TXN-001", reference: "REF-20250610-001", type: "DEPOT", montant: 150000, frais: 0, expediteur: "AGT-012", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-10 14:32", methode: "Agent" },
  { id: "TXN-002", reference: "REF-20250610-002", type: "TRANSFERT", montant: 75000, frais: 750, expediteur: "Amadou Diallo", destinataire: "Fatoumata Traoré", statut: "COMPLETED", date: "2025-06-10 13:15", methode: "App mobile" },
  { id: "TXN-003", reference: "REF-20250610-003", type: "RETRAIT", montant: 50000, frais: 500, expediteur: "Moussa Keita", destinataire: "AGT-045", statut: "PENDING", date: "2025-06-10 12:45", methode: "Agent" },
  { id: "TXN-004", reference: "REF-20250610-004", type: "PAIEMENT", montant: 25000, frais: 250, expediteur: "Aïssata Coulibaly", destinataire: "Marchand #MRC-089", statut: "COMPLETED", date: "2025-06-10 11:20", methode: "QR Code" },
  { id: "TXN-005", reference: "REF-20250610-005", type: "TRANSFERT", montant: 200000, frais: 2000, expediteur: "Oumou Sangaré", destinataire: "Kadiatou Diabaté", statut: "COMPLETED", date: "2025-06-10 10:55", methode: "App mobile" },
  { id: "TXN-006", reference: "REF-20250609-006", type: "DEPOT", montant: 500000, frais: 0, expediteur: "AGT-023", destinataire: "Mariam Konaté", statut: "COMPLETED", date: "2025-06-09 16:40", methode: "Agent" },
  { id: "TXN-007", reference: "REF-20250609-007", type: "RETRAIT", montant: 100000, frais: 1000, expediteur: "Ibrahim Sacko", destinataire: "AGT-012", statut: "FAILED", date: "2025-06-09 15:22", methode: "Agent" },
  { id: "TXN-008", reference: "REF-20250609-008", type: "PAIEMENT", montant: 35000, frais: 350, expediteur: "Abdoulaye Bah", destinataire: "Marchand #MRC-102", statut: "COMPLETED", date: "2025-06-09 14:10", methode: "Code marchand" },
  { id: "TXN-009", reference: "REF-20250609-009", type: "TRANSFERT", montant: 320000, frais: 3200, expediteur: "Aïssata Coulibaly", destinataire: "Seydou Camara", statut: "CANCELLED", date: "2025-06-09 12:30", methode: "App mobile" },
  { id: "TXN-010", reference: "REF-20250609-010", type: "DEPOT", montant: 250000, frais: 0, expediteur: "AGT-067", destinataire: "Oumou Sangaré", statut: "COMPLETED", date: "2025-06-09 09:15", methode: "Agent" },
  { id: "TXN-011", reference: "REF-20250608-011", type: "RETRAIT", montant: 80000, frais: 800, expediteur: "Fatoumata Traoré", destinataire: "AGT-045", statut: "COMPLETED", date: "2025-06-08 17:30", methode: "Agent" },
  { id: "TXN-012", reference: "REF-20250608-012", type: "TRANSFERT", montant: 150000, frais: 1500, expediteur: "Kadiatou Diabaté", destinataire: "Amadou Diallo", statut: "COMPLETED", date: "2025-06-08 15:45", methode: "App mobile" },
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
export type NotificationType = "OTP" | "TRANSACTION" | "SECURITY" | "KYC" | "SYSTEM"

export interface Notification {
  id: string
  type: NotificationType
  canal: NotificationChannel
  destinataire: string
  message: string
  statut: "SENT" | "DELIVERED" | "FAILED"
  date: string
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
