---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments: 
  - product-brief-writer-2026-01-06.md
workflowType: 'prd'
lastStep: 11
projectType: greenfield
technicalType: saas_b2b
domain: general
complexity: low-medium
---

# Product Requirements Document - Writer

**Author:** User
**Date:** 2026-01-06

---

## Executive Summary

Writer est un **Content Intelligence Engine** SaaS B2B qui révolutionne la création de contenu en combinant :
- **RAG hybride** pour exploiter les documents internes
- **Recherche web itérative** jusqu'à complétude des informations
- **Veille proactive** avec configuration scopée
- **Génération adaptative** multi-plateforme

**Vision :** Devenir le réflexe par défaut pour la recherche d'information et la création de contenu - remplacer Google + ChatGPT par un outil plus intelligent et connecté.

**Positionnement :** Seul outil occupant le quadrant "RAG interne + Veille proactive" - un océan bleu.

### What Makes This Special

1. **Domain-agnostic** validé sur les use cases techniques exigeants
2. **Contrôle utilisateur permanent** - jamais de dead-end, pivot possible à tout moment
3. **Veille proactive** - l'outil apprend pendant que vous dormez
4. **Scores de fiabilité** - traçabilité et confiance dans les sources
5. **Interface Smart Bar B+C+Chat** - chat naturel + suggestions + slash commands

---

## Project Classification

**Technical Type:** SaaS B2B  
**Domain:** General (Domain-agnostic)  
**Complexity:** Low-Medium  
**Project Context:** Greenfield - new project  
**Validation Strategy:** Technical teams first, then expand to any domain

**Key SaaS Characteristics:**
- Multi-tenant architecture
- Subscription-based pricing
- Integration capabilities (Slack, Notion planned)
- Self-service + Enterprise tiers

---

## Success Criteria

### User Success

L'outil est considéré comme réussi quand :
- Les réponses sont pertinentes et exploitables
- La veille remonte des informations utiles
- Le contenu généré est de qualité suffisante pour être publié
- L'utilisateur peut pivoter/contrôler le workflow à tout moment

### Technical Success

- Le RAG retourne des résultats pertinents sur les docs indexés
- La recherche web complète effectivement les informations manquantes
- La veille fonctionne de façon autonome une fois configurée
- Les images générées sont utilisables
- Les scores de fiabilité sont cohérents

### Definition of Done (MVP)

L'outil est "done" quand un utilisateur peut :
1. Indexer ses documents
2. Poser une question et obtenir une réponse sourcée
3. Lancer une recherche web approfondie (/deep)
4. Configurer une veille sur un sujet (/watch)
5. Générer du contenu adapté à une plateforme
6. Générer une image pertinente (/image)
7. Voir les scores de fiabilité des sources

---

## Product Scope

### MVP - Ce qui doit fonctionner

- RAG Qdrant + recherche sémantique
- Recherche web itérative
- Veille automatique
- Génération d'images
- Scores de fiabilité
- Interface Smart Bar B+C+Chat
- Slash commands (/deep, /watch, /image, /export, /new, /help)
- Templates multi-plateforme (LinkedIn, Blog, Tweet, Discord)
- Thumbs up/down feedback

### Post-MVP

- GraphRAG (Neo4j)
- Trend Reports auto-générés
- Codebase indexation
- Intégrations Slack/Notion
- Self-hosted option
- SEO optimization
- Contradiction detection

---

## User Journeys

### Journey 1 : Lucas - Le Developer Advocate débordé

Lucas travaille chez une startup SaaS en pleine croissance. Entre les meetups, les articles techniques, et le support des développeurs, il jongle constamment. Chaque matin, il passe une heure sur HackerNews, Twitter, et Reddit pour rester à jour sur les tendances tech. C'est épuisant.

Un jour, en cherchant "comment automatiser ma veille tech", il découvre Writer. Sceptique mais intrigué par la promesse "votre radar de tendances", il s'inscrit.

**Le déclic :** En 5 minutes, il indexe la documentation de son produit et configure une veille sur "serverless" et "edge computing". Le lendemain matin, au lieu de scroller Twitter, il ouvre Writer et trouve un Trend Report.

**Le moment clé :** Lucas tape `/deep` pour approfondir. Writer croise automatiquement cette tendance avec la doc de son produit et génère un draft d'article. Lucas ajuste, clique "exporter vers LinkedIn", et publie.

**La nouvelle réalité :** "Writer fait ma veille pendant que je dors. Je n'ai plus qu'à écrire."

**→ Capabilities :** Indexation docs, veille auto, /deep, génération multi-plateforme, export

---

### Journey 2 : Camille - La Tech Lead qui n'a plus le temps d'expliquer

Camille dirige une équipe de 8 développeurs dans une scale-up. Son architecture est devenue complexe : microservices, event-driven, multi-cloud. Chaque semaine, elle répond aux mêmes questions : "Comment fonctionne l'auth ?", "Pourquoi on utilise Kafka ici ?".

Elle a documenté, mais les docs sont éparpillées : Notion, Confluence, README.md dans 20 repos. Personne ne trouve rien.

**Le déclic :** Un nouveau dev lui demande une question. Camille indexe tous les repos et la doc Notion en 20 minutes.

**Le moment clé :** Le nouveau dev pose sa question dans Writer. En 30 secondes, il obtient une réponse sourcée avec liens vers les fichiers exacts. Il n'a pas eu besoin d'interrompre Camille.

**L'imprévu :** Camille elle-même utilise Writer pour des questions d'impact : "Que se passe-t-il si on change X ?". Writer croise doc interne et recherche web.

**La nouvelle réalité :** Les interruptions ont chuté de 60%. L'onboarding prend 2 semaines au lieu de 4.

**→ Capabilities :** Indexation multi-sources, questions relationnelles, sources citées

---

### Journey 3 : Théo - Le Content Manager qui ne parle pas code

Théo travaille dans le marketing B2B d'une entreprise tech. Il doit produire 3 articles de blog par semaine. Problème : il n'est pas technique, et ses sujets le sont.

Actuellement, il passe 4 heures par article : 2h de recherche, 2h de rédaction. Il a peur de dire des bêtises techniques.

**Le test :** Théo demande : "Quels sont les avantages de notre nouvelle feature X ?". Writer répond avec des bullet points sourcés. Théo clique sur "Générer article de blog".

**Le moment clé :** En 20 minutes, Théo a un draft de 800 mots, SEO-optimisé, avec le ton de sa marque.

**L'addiction :** Théo ouvre Writer chaque matin. La veille lui remonte les posts des concurrents. Il tape `/image` et génère une infographie.

**La nouvelle réalité :** Théo produit 5 articles par semaine au lieu de 3. Il ne demande plus jamais aux devs "c'est quoi déjà une API ?".

**→ Capabilities :** Interface simple, génération contenu, templates, /image, veille concurrentielle

---

### Journey 4 : Sarah - La VP qui doit justifier les outils

Sarah dirige l'engineering de 50 personnes. Elle reçoit 10 demandes d'achat d'outils par mois. Son critère : "Est-ce que ça va vraiment changer quelque chose ?".

**Le test exigé :** Sarah demande une démo sur LEURS données. Pas de démo générique.

**Le moment clé :** En 30 minutes, l'équipe indexe 3 repos et la doc Confluence. Sarah pose une question difficile. Writer répond avec une liste sourcée et un score de fiabilité.

**La validation :** Sarah voit son équipe arrêter de l'interrompre. Elle voit le temps d'onboarding diminuer.

**La nouvelle réalité :** Sarah signe. 6 mois plus tard, elle cite Writer au board comme exemple de "tooling qui crée de la valeur".

**→ Capabilities :** Proof-of-value sur données clients, métriques, compliance (GDPR)

---

### Journey 5 : Marc - L'Admin qui configure tout

Marc est l'Admin IT. Son rôle : configurer Writer pour l'équipe, gérer les accès, monitorer l'usage.

**Setup initial :** Marc connecte les sources : repos GitHub, Notion, Confluence. Il configure les permissions : "Marketing ne voit que les docs publiques, Engineering voit tout."

**Gestion quotidienne :** Marc surveille les alertes de veille. Quand un utilisateur configure une veille trop large, il reçoit une notif.

**Incident :** Un utilisateur signale un problème. Marc vérifie l'état de synchronisation, relance une indexation, problème résolu en 2 minutes.

**→ Capabilities :** Dashboard admin, gestion permissions, monitoring sources, logs

---

### Journey Requirements Summary

| Journey | Capabilities clés |
|---------|-------------------|
| **Lucas (DevRel)** | Indexation, veille, /deep, export multi-plateforme |
| **Camille (Tech Lead)** | Multi-sources, questions relationnelles, sources citées |
| **Théo (Content)** | Interface simple, génération contenu, /image |
| **Sarah (VP)** | Proof-of-value, métriques, compliance |
| **Marc (Admin)** | Dashboard, permissions, monitoring, sync |

---

## Domain-Specific Requirements

### Data Privacy & GDPR Compliance

**Data Residency:**
- Stockage EU par défaut (Vercel EU, Qdrant Cloud EU)
- Option de choix de région pour clients enterprise

**Data Subject Rights:**
- Droit à l'oubli : suppression complète des données sur demande
- Portabilité : export JSON/Markdown de toutes les données
- Accès : dashboard montrant les données stockées

**LLM Data Privacy:**
- Utilisation exclusive des API "no training" (OpenAI, Anthropic)
- Documentation claire du flux de données
- Roadmap : LLM self-hosted pour enterprise (Phase 2+)

### Security Requirements

**Tenant Isolation:**
- Chaque organisation a son propre namespace de données
- Aucun croisement possible entre tenants

**Encryption:**
- At-rest : AES-256
- In-transit : TLS 1.3

**Authentication & Authorization:**
- OAuth2/OIDC (Google, GitHub, SSO enterprise)
- API keys avec scopes limités
- RBAC pour permissions internes

**Auditability:**
- Logs d'accès aux données
- Historique des actions admin
- Rétention logs : 90 jours par défaut

---

## Innovation & Novel Patterns

### Innovation Phare : Veille Contextualisée

**Le pitch :** "Writer sait ce qui est pertinent pour VOUS, pas juste ce qui est nouveau."

Contrairement aux outils de veille générique (Google Alerts, SparkToro), Writer croise les flux externes avec vos documents internes. Quand quelque chose de pertinent pour VOTRE contexte apparaît, vous êtes notifié.

**Pourquoi c'est différenciateur :**
- Facile à expliquer en une phrase
- WOW factor élevé lors des démos
- Techniquement simple à implémenter

### Autres Innovations

**1. Quadrant inexploité : RAG + Veille proactive**
Writer combine RAG interne, recherche web, veille automatique, et génération. Les concurrents font 1-2 axes, jamais les 4.

**2. Boucle de recherche itérative**
Writer itère automatiquement jusqu'à complétude de l'information. L'utilisateur n'a pas à reformuler.

**3. Contrôle utilisateur permanent**
L'IA suggère, l'humain contrôle. Approche progressive disclosure : novice → intermédiaire → power user.

### Technical Implementation Notes

**Boucle itérative :**
- MAX_ITERATIONS = 5 pour éviter boucle infinie
- Timeout global de 15s
- Score de confiance LLM pour décider "assez complet"
- Streaming agressif pour UX fluide

**UX de la recherche en cours :**
```
🔍 Recherche en cours...
├─ ✅ Documents internes (3 sources)
├─ ✅ Web search #1 (5 résultats)
├─ 🔄 Web search #2 (affinage)
└─ ⏳ Synthèse en cours...
```

### Validation Approach

| Innovation | Métrique | Seuil de succès |
|------------|----------|----------------|
| 4 axes combinés | % users utilisant 3+ axes | > 60% |
| Boucle itérative | Qualité perçue vs single-shot | +20% satisfaction |
| **Veille contextualisée** | % notifications cliquées | > 40% |
| Contrôle permanent | % users utilisant slash cmd | > 30% après J30 |

### Risk Mitigation

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Boucle infinie | 🔴 Haut | MAX_ITERATIONS = 5, timeout 15s |
| Coût LLM explosif | 🔴 Haut | Rate limiting, cache, budget par user |
| Veille trop bruyante | 🟡 Moyen | Seuil pertinence ajustable par user |
| Contrôle trop complexe | 🟡 Moyen | Progressive disclosure, onboarding doux |

### Notification Strategy (Veille)

- **Priorité 1 :** Dashboard in-app (temps réel)
- **Priorité 2 :** Email digest (quotidien/hebdo, opt-in)
- **Éviter :** Push notifications (fatigue utilisateur)

---

## SaaS B2B Specific Requirements

### Multi-Tenancy Architecture

**Hiérarchie des données :**
```
Organisation (Tenant)
│
├── 🏢 Workspaces partagés (gérés par Admin)
│   ├── Workspace "All Company" → Accès: Tous
│   ├── Workspace "Engineering" → Accès: Groupe Engineering
│   └── Workspace "Marketing" → Accès: Groupe Marketing
│
└── 👤 Espaces personnels (un par user)
    └── "My Space" → Accès: User uniquement
```

**Isolation Qdrant (performance maximale) :**
- Une collection par workspace
- Une collection par espace personnel
- Recherche multi-collection en parallèle
- Self-hosted pour contrôle total

```
Qdrant Collections:
├── ws_tenant123_shared
├── ws_tenant123_engineering
├── personal_tenant123_user456
└── personal_tenant123_user789
```

### RBAC (Role-Based Access Control)

| Rôle | Permissions |
|------|-------------|
| **Owner** | Tout (billing, users, settings) |
| **Admin** | Users, sources, workspaces, configuration |
| **Member** | Utilisation complète, pas de config org |
| **Viewer** | Lecture seule (pas de génération) |

### Groupes et Workspaces

- Un user appartient à plusieurs groupes
- Un groupe a accès à plusieurs workspaces
- Chaque user a son espace personnel automatiquement

### Technical Stack (Qdrant)

**Déploiement :**
- Self-hosted Qdrant cluster (3 nodes pour HA)
- Protocole gRPC (2-3x plus rapide que REST)
- Storage NVMe SSD
- RAM 16 GB+ par node

**Recherche multi-collection :**
```python
# Recherche parallèle sur toutes les collections accessibles
async def search(query, user):
    collections = get_accessible_collections(user)
    results = await asyncio.gather(*[
        qdrant.search(coll, query) for coll in collections
    ])
    return merge_and_rerank(results)
```

### Subscription Tiers (Future)

| Tier | Features | Users |
|------|----------|-------|
| **Free** | Limité, 1 workspace | 1 |
| **Pro** | Full features, workspaces illimités | 5-20 |
| **Enterprise** | SSO, self-hosted, SLA | Illimité |

### Integrations (MVP Priority)

| Intégration | Priorité | Rationale |
|-------------|----------|-----------|
| **Slack** | P1 | Notifications, commandes inline |
| **Notion** | P1 | Export docs vers RAG |
| **Confluence** | P2 | Enterprise adoption |
| **GitHub/GitLab** | P2 | Docs techniques, code |

---

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP
Délivrer l'expérience complète de "veille contextualisée + génération" avec qualité, plutôt qu'un produit partiel. L'innovation phare (veille contextualisée) doit fonctionner parfaitement dès le MVP.

**Validation cible :** Early adopters techniques qui adoptent Writer comme leur outil de recherche par défaut.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Lucas (DevRel) : Veille + génération d'articles
- Camille (Tech Lead) : Questions sur docs internes
- Théo (Content) : Génération de contenu multi-plateforme
- Marc (Admin) : Configuration workspaces/sources

**Must-Have Capabilities:**

| Capability | Rationale |
|------------|----------|
| RAG Qdrant | Core de la proposition |
| Web search itératif | Différenciateur |
| Veille automatique | Innovation phare |
| Génération images | Demande utilisateur forte |
| Scores fiabilité | Traçabilité |
| Workspaces + Espaces perso | Sécurité données |
| Smart Bar B+C+Chat | UX différenciante |

### Post-MVP Features

**Phase 2:**
- GraphRAG (Neo4j) pour questions relationnelles
- Trend Reports auto-générés
- Intégrations Slack/Notion
- Codebase indexation

**Phase 3:**
- Self-hosted option complète
- API publique
- Marketplace de templates
- White-label pour agences

### Risk Mitigation Strategy

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Boucle itérative coûteuse | 🔴 Haut | MAX_ITERATIONS=5, cache, budget/user |
| Veille trop bruyante | 🟡 Moyen | Seuil pertinence configurable |
| Multi-tenant complexe | 🟡 Moyen | Collections séparées Qdrant |
| UX trop complexe | 🟡 Moyen | Progressive disclosure |

---

## Functional Requirements

### 1. Document & Knowledge Management

- **FR1:** Users can upload documents (PDF, Markdown, TXT) to their personal space
- **FR2:** Users can connect external sources (GitHub repos, Notion workspaces, Confluence)
- **FR3:** Admins can create and configure shared workspaces
- **FR4:** Admins can assign groups to workspaces
- **FR5:** Users can view which sources are indexed in their accessible workspaces
- **FR6:** System automatically indexes connected sources and makes them searchable

### 2. Intelligent Search & RAG

- **FR7:** Users can ask natural language questions and receive sourced answers
- **FR8:** Users can trigger deep research with /deep command or contextual suggestion
- **FR9:** System performs iterative web search until information is complete (max 5 iterations)
- **FR10:** Users can see cited sources with links to original documents
- **FR11:** Users can view reliability scores for each source
- **FR12:** Users can search across multiple workspaces they have access to simultaneously

### 3. Automated Monitoring (Veille)

- **FR13:** Users can configure watch topics with /watch command
- **FR14:** Users can specify sources to monitor (web, RSS, social)
- **FR15:** Users can set monitoring frequency (hourly, daily, weekly)
- **FR16:** System automatically cross-references new content with user's indexed documents
- **FR17:** Users receive contextual notifications when relevant content is detected
- **FR18:** Users can view a veille dashboard with recent alerts and trends

### 4. Content Generation

- **FR19:** Users can generate content adapted to specific platforms (LinkedIn, Blog, Tweet, Discord)
- **FR20:** Users can select from pre-defined templates for each platform
- **FR21:** Users can customize output style (tone, length, format)
- **FR22:** Users can generate images with /image command
- **FR23:** Users can export generated content (Markdown, PDF)
- **FR24:** System includes cited sources in generated content

### 5. Smart Bar Interface (UX)

- **FR25:** Users can interact via natural language chat
- **FR26:** System displays max 2 contextual suggestions after each response
- **FR27:** Users can use slash commands (/deep, /watch, /image, /export, /new, /help)
- **FR28:** Users can access command menu on mobile via visible button
- **FR29:** Users can always pivot to a different action (no dead-ends)
- **FR30:** System detects user intent and suggests appropriate next actions

### 6. User & Team Management

- **FR31:** Users can sign up with OAuth (Google, GitHub)
- **FR32:** Admins can invite users to the organization
- **FR33:** Admins can assign roles (Owner, Admin, Member, Viewer)
- **FR34:** Admins can create groups and assign users to groups
- **FR35:** Each user automatically has a personal space upon account creation
- **FR36:** Users can manage their personal settings (default model, preferences)

### 7. Administration & Configuration

- **FR37:** Admins can view and manage all workspaces
- **FR38:** Admins can view sync status of connected sources
- **FR39:** Admins can manually trigger re-indexation of sources
- **FR40:** Admins can view usage logs and audit trails
- **FR41:** Admins can configure organization-wide settings
- **FR42:** Admins can configure veille alert thresholds

### 8. Feedback & Quality

- **FR43:** Users can rate responses with thumbs up/down
- **FR44:** Users can provide optional text feedback on responses
- **FR45:** Users can report issues with specific responses

---

## Non-Functional Requirements

### Performance

**Response Times:**
- Chat response: First token < 500ms (streaming)
- RAG search: Results < 2s
- Web search (single): < 3s
- Iterative search (full /deep): < 15s total
- Image generation: < 10s

**Concurrency:**
- Support 100+ concurrent users par tenant
- No degradation perceptible jusqu'à 1000 users simultanés

**Streaming:**
- Toutes les réponses LLM en streaming (pas de block jusqu'à completion)

### Security

**Data Protection:**
- Encryption at-rest (AES-256)
- Encryption in-transit (TLS 1.3)
- Tenant isolation via collections Qdrant séparées

**Authentication:**
- OAuth2/OIDC (Google, GitHub)
- Session tokens avec expiration configurable
- SSO Enterprise (Phase 2)

**Compliance:**
- GDPR compliant (data residency EU, droit à l'oubli, portabilité)
- LLM "no training" APIs uniquement
- Audit logs rétention 90 jours

### Scalability

**User Growth:**
- Architecture supportant 10x croissance sans refonte
- Horizontal scaling via Qdrant cluster

**Storage:**
- Pas de limite sur nombre de documents indexés par workspace
- Archivage automatique des données anciennes (configurable)

**Infrastructure:**
- Self-hosted Qdrant (scalable)
- Vercel Edge Functions pour latence minimale

### Reliability

**Uptime:**
- Cible 99.5% uptime (MVP acceptable : 99%)
- Veille automatique avec retry en cas d'échec

**Data Durability:**
- Backups quotidiens
- Restauration possible sous 24h

**Graceful Degradation:**
- Si LLM provider down → message explicite + retry
- Si source down → skip avec notification

### Integration

**APIs:**
- REST API pour toutes les fonctionnalités
- Webhooks pour événements (veille alerts)

**Connectors:**
- GitHub API
- Notion API
- Confluence API (Phase 2)
- Slack API (Phase 2)

**LLM Providers:**
- OpenAI API
- Anthropic API
- Architecture LLM-agnostic (switch facile)

### Accessibility (Basic)

- Interface responsive (mobile, tablet, desktop)
- Keyboard navigation pour Smart Bar
- High contrast mode (optionnel Phase 2)

<!-- PRD Complete -->
