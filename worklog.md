---
Task ID: 1
Agent: Main Agent
Task: Fix duplicate TXN-005 key error and build Agent Detail Page

Work Log:
- Fixed duplicate transaction ID error by adding deduplication in transactions-page.tsx useMemo
- Extended Agent interface with new fields: email, ville, pays, adresse, dateCreation, performance, apiConnected
- Updated all 10 agents in mock data with new fields
- Added FloatMovement interface and 14 float movement records for 6 agents
- Added AgentDocument interface and 22 document records for all 10 agents
- Added AgentDailyPerformance interface and performance data for 4 key agents (14 days each)
- Created comprehensive AgentDetailPage component (927 lines) with:
  - Header: back button, avatar, name, status badge, API/Demo badge, commerce/code, conditional action buttons
  - 4 stat cards: Solde Float, Volume Journalier, Transactions/Jour, Performance %
  - 4 tabs: Profil (3-column info grid), Float (balance + movements table), Transactions (filtered + deduped), Performance (bar charts + ranking)
  - 4 modals: Suspendre (justification required), Réactiver (confirmation), Approuver (commission rate), Approvisionner (amount + justification)
- Updated AgentsPage to navigate to detail page instead of dialog
- Moved hooks before conditional return to fix React hooks order
- Removed unused AgentDetailDialog component
- Fixed bar chart layout (justify-end instead of marginTop:auto)
- Fixed dynamic Tailwind class issue (replaced group-hover: with hover:opacity-80)
- Lint passes, dev server compiles successfully

Stage Summary:
- Full Agent Detail Page created with all requested features
- Mock data extended with float movements, documents, and performance data
- Navigation from agents list to detail page working
- All lint checks pass
