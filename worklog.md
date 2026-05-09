---
Task ID: 1
Agent: Main Agent
Task: Remove 'Modèles' tab from Notifications page and move Partenaires & Configuration into Settings

Work Log:
- Checked Notifications page - already had only 2 tabs (Créer une notification, Historique), Modèles tab was already removed
- Created `src/components/settings/partners-tab.tsx` with full PartnersTab component (stats, search/filter, partner cards, adapter cards, detail dialog)
- Created `src/components/settings/configuration-tab.tsx` with full ConfigurationTab component (Frais de Service, Sécurité params, Administrateurs sub-tabs)
- Updated `src/components/settings/settings-page.tsx` to import and include PartnersTab and ConfigurationTab as new tabs
- Updated sidebar navigation to remove "Partenaires" and "Configuration" from secondary nav
- Updated store PageKey type to remove "partners" and "configuration"
- Updated page.tsx to remove PartnersPage and ConfigurationPage imports and mappings
- Updated app-header.tsx to remove partners/configuration from pageTitles
- Ran lint check - all passing
- Verified dev server returning 200

Stage Summary:
- Notifications page: already clean (no Modèles tab)
- Settings page now has 7 tabs: Profil, Sécurité, Notifications, Apparence, Partenaires, Configuration, Journal
- Sidebar simplified: only "Notifications" and "Paramètres" in Système section
- Old partners-page.tsx and configuration-page.tsx files still exist but are no longer imported/used
