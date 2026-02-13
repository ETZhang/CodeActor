# CodeActor 🎭

**[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md)**

> Transformez vos bases de code en personnages 3D de dessins animés

![CodeActor Demo](example1.png)

CodeActor est un outil créatif de visualisation de code qui analyse votre base de code et transforme chaque module en un personnage 3D de dessin animé unique avec une personnalité, transformant les dépendances du code en une histoire sociale intéressante.

## Caractéristiques

- **Anthropomorphisation de Personnages 3D**: Génère automatiquement des personnages 3D de dessins animés mignons basés sur la fonctionnalité du code
- **Réseau de Relations Sociales**: Transforme les dépendances en descriptions sociales divertissantes (meilleurs amis, amour non partagé, relations toxiques...)
- **Détection de Santé**: Identifie automatiquement les risques de bugs, les personnages malades ont des effets visuels spéciaux
- **3D Interactif**: Glisser, zoom, cliquer pour voir les détails
- **Multiples Formats d'Export**: Supporte JSON, graphiques Mermaid, texte narratif
- **Tuyaux Super Épais**: Lignes de relation clairement visibles (rayon 0.8)
- **Particules de Flux**: Animation dynamique montrant la direction des appels de code
- **Relations Bidirectionnelles**: Supporte des flèches duales pour dépendances mutuelles

## Types de Personnages

| Type | Patron de Code | Traits Visuels |
|------|-----------------|-------------------|
| 🔥 Protagoniste Sang-Chaud | main/app/index | Cape, yeux brillants |
| 🛡️ Pilier Fiable | database/model | Corps rond, lunettes, moustache |
| 💚 Aide Silencieux | util/helper | Aura d'ange, petites ailes |
| 🎪 Personnage Excentrique | middleware | Corps polyédrique, chapeau de point d'interrogation |
| 🌙 Figure Mystérieuse | config/constant | Corps transparent, yeux brillants |
| ⚡ Abeille Occupée | appels de haute fréquence | Cravate, serviette, gouttes de sueur |
| 🌸 Âme Fragile | modules complexes | Corps maigre, pansements, larmes |
| 🌑 Vagabond Solitaire | sans appels | Semitransparent, aura qui s'évaneisse |

## 🎯 Skill Universel pour Éditeurs IA

CodeActor fonctionne avec **tous les principaux éditeurs et IDEs IA** :

| Éditeur | Statut | Méthode d'Installasion |
|---------|--------|---------------------|
| **Claude Code** | ✅ Natif | Support de skill intégré |
| **Cursor** | ✅ Compatible | Utilise le système de skills de Claude Code |
| **OpenClaw** | ✅ Compatible | Installer comme plugin de skill |
| **GitHub Copilot** | ✅ Compatible | Installer comme extension |
| **Continue.dev** | ✅ Compatible | Intégration CLI |
| **Windsurf** | ✅ Compatible | Commande personnalisé |
| **Tabnine** | ✅ Compatible | Plugin CLI |
| **Codeium** | ✅ Compatible | API d'extensions |

---

## Démarrage Rapide

### Comme Skill Claude Code (Recommandé)

```bash
# Installer le skill globalement
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor

# Utiliser dans n'importe quel projet
/code-actor
```

### Installasion pour d'Autres Éditeurs IA

#### OpenClaw 🤖

OpenClaw est une plateforme deassistant personnal IA open-source qui supporte les plugins de compétences.

**Méthode 1 : Depuis le Référentiel GitHub**

```bash
# Format de plugin de skill de OpenClaw
openclaw plugins install @ETZhang/code-actor
```

**Méthode 2 : Depuis ClawHub**

```bash
# Chercher et installer depuis ClawHub (registre des skills de OpenClaw)
openclaw skill install code-actor
```

**Vérification d'Installasion :**

```bash
# Lister les compétences installées
openclaw skill list

# Tester la compétence
openclaw skill run code-actor --help
```

**Pour Développeurs : Publier sur ClawHub**

Pour que CodeActor soit disponible sur ClawHub :
1. Publier ce référentiel sur ClawHub
2. Les utilisateurs peuvent installer avec : `openclaw plugins install code-actor`

---

#### Éditeur Cursor

```bash
# Cursor utilise les skills Claude Code
# Même installation que Claude Code
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor
# Disponible dans Cursor
```

#### GitHub Copilot

```bash
# Installer via npm (bientôt)
npm install -g code-actor

# Ou utiliser directement
npx code-actor analyze ./path/to/project
```

#### Continue.dev / Windsurf / Tabnine

```bash
# Utiliser comme outil CLI
npx code-actor analyze ./path --format=json
npx code-actor analyze ./path --format=mermaid
npx code-actor serve ./path
```

#### Extension VS Code

```bash
# Installer depuis marketplace (bientôt)
code --install-extension ETZhang.code-actor

# Ou construire localement
cd /path/to/CodeActor
npm run build
code --install-extension ./dist/vscode
```

### Indépendant

```bash
# Cloner le référentiel
git clone https://github.com/ETZhang/CodeActor.git
cd code-actor

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Construire
npm run build
```

### Interface Web

Ouvrir `index.html` directement dans le navigateur.

## Types de Relations

| Type | Signification de Code | Description Sociale |
|------|---------------------|-------------------|
| Meilleurs Amis | Couplage fort | Inséparables |
| Amor Non Partagé | Dépendance unidirectionnelle | Un dépend de l'autre |
| Relation Toxique | Dépendance circulaire | Enchevêtrement compliqué |
| Admirateur Secrete | Communication asynchrone | Messages de groupe |
| Suiveur de Fan | Dépendance foible | Le fan suit |
| Relation Contractuelle | Dépendance d'interface | Contrat signé |

## Niveaux de Santé

- **Excellent** 🟢: Risque de bugs faible, visualisation saine
- **Bon** 🔵: Bonne qualité de code
- **Régulier** 🟡: Risque de bugs moyen, attention nécessaire
- **Pauvre** 🟠: Haute complexité, restructuration recommandée
- **Critique** 🔴: Risque de bugs élevé, correction urgente nécessaire

## Interactions

- **Un Clic**: Voir le panneau d'attributs détaillés
- **Double Clic**: Resaltar toutes les relations connexes
- **Glisser**: Ajuster la position du personnage pour démêler les réseaux complexes
- **Défiler**: Zoom sur la vue
- **Clic Droit**: Tourner la caméra

## Structure du Projet

```
code-actor/
├── src/
│   ├── analyzer/          # Moteur d'analyse de code
│   │   ├── parser.ts      # Parseur multilingue
│   │   ├── character-generator.ts  # Générateur de personnalité
│   │   ├── relation-analyzer.ts    # Analyse des relations
│   │   └── types.ts       # Définitions de types
│   ├── visualizer/        # Visualisation Three.js
│   │   ├── scene-manager.ts        # Gestion de scène
│   │   ├── character-mesh.ts       # Génération de personnages 3D (rayon des yeux 0.15)
│   │   ├── interaction-manager.ts  # Gestion des interactions
│   │   └── animation-manager.ts     # Effets d'animation
│   ├── cli/              # Entrée CLI
│   └── web/              # Frontend web
├── skills/               # Définitions de Skill Claude Code
└── index.html            # Entrée d'interface web
```

## Stack Technique

- **Moteur d'Analyse**: TypeScript, supporte JS/TS/Python/Java et plus
- **Rendu 3D**: Three.js, génération procédurale de personnages
- **Frontend**: Vite + TypeScript natif
- **CLI**: Node.js + Express + WebSocket

## Mises à Jour Récentes

- ✅ Rayon de tuyauterie fixé à 0.8 pour visibilité maximale
- ✅ Taille des yeux augmentée à 0.15 pour meilleure expressivité
- ✅ Ajoutée animation de particules de flux montrant la direction
- ✅ Support pour les relations bidirectionnelles avec flèches duales
- ✅ Créé Skill Claude Code supportant la commande `/code-actor`

## Licence

MIT

---

Rendez la compréhension du code plus amusant ! 🎭✨
