---
name: code-actor
description: Transform codebases into 3D cartoon characters. Visualize code architecture with anthropomorphic personas.
---

# CodeActor - Code Anthropomorphization Visualization Tool

Transform your codebase into a lively 3D cartoon character theater. Make architecture review feel like watching an animation!

## Feature Highlights

- **8 Character Types** - Auto-identify Main, Database, Utility, Middleware patterns
- **6 Relationship Types** - Strong coupling, circular deps, one-way dependencies
- **5-Tier Health System** - Excellent/Good/Fair/Poor/Critical with color coding
- **Multiple Output Formats** - JSON, Mermaid, narrative text
- **3D Visualization Output** - Generate interactive 3D scene HTML
- **Code Analysis** - Auto-detect module layers, architecture patterns, technical debt
- **Auto-Prompt for 3D UI** - Analysis automatically prompts to launch 3D visualization

## Quick Start

### As Claude Code Skill

```
/code-actor
```

### As Standalone Tool

```bash
# Analyze current directory
node dist/cli/index.js analyze .

# Export Mermaid chart
node dist/cli/index.js analyze . --format=mermaid

# Export narrative text
node dist/cli/index.js analyze . --format=narrative

# Start Web visualization server
node dist/cli/index.js serve .
```

## Output Formats

| Format | Description | Use Case |
|:--------|:----------|:----------|
| **json** | Full analysis data | API integration, data processing |
| **mermaid** | Mermaid dependency graph | Documentation, architecture diagrams |
| **narrative** | Narrative text | Team sharing, project introduction |
| **visual** | 3D visualization HTML | Web presentation, interactive exploration |

## Character Types

| Type | Code Pattern | Color |
|:-----|:----------|:------|
| Hot-Blooded Protagonist | Main/AppEntry | Red/Orange |
| Reliable Pillar | Database/Store | Blue/Cyan |
| Silent Helper | Utility/Common | Green/Lime |
| Quirky Character | Middleware | Purple/Pink |
| Mysterious Figure | Config/Constants | Dark Blue/Purple |
| Fragile Soul | High Bug Risk | Yellow/Orange |
| Busy Bee | High-frequency calls | Gold/Yellow |
| Lonely Wanderer | Isolated module | Gray/Silver |

## Relationship Types

| Relationship | Code Meaning | Risk |
|:-----------|:----------|:------|
| Best Friends | Strong coupling (two-way) | High Risk |
| Unrequited Love | One-way dependency | Low Risk |
| Toxic Relationship | Circular dependency | High Risk |
| Secret Admirer | Async communication | Low Risk |
| Fan Following | Weak dependency | Low Risk |
| Contract Relationship | Interface dependency | Low Risk |

## Health Levels

| Level | Score | Visual |
|:-----|:-----|:----------|
| Excellent | 90-100 | Green aura |
| Good | 75-89 | Cyan aura |
| Fair | 60-74 | Yellow aura |
| Poor | 40-59 | Orange aura |
| Critical | 0-39 | Red aura + pulsing |

## Visualization Interactions

- **Double-click character** - Highlight relationship network
- **Drag character** - Real-time connection line updates
- **Hover** - Show detailed info
- **Scroll to zoom** - Zoom view
- **Code size impact** - More code = bigger character (max 1.5x)

## Tech Stack

- **Three.js** - 3D rendering
- **TypeScript** - Type safety
- **Acorn** - Code parsing
- **Express** - Web server (optional)

## Use Cases

### 1. Quick Code Review

```bash
/code-actor --format=narrative > review.md
cat review.md
```

### 2. Architecture Visualization

```bash
# Generate 3D visualization
node dist/cli/index.js serve .

# Open in browser
open http://localhost:5173
```

### 3. CI/CD Integration

```yaml
# GitHub Actions example
- name: Code Review
  run: npx @your-org/code-actor analyze --format=json
```

## FAQ

<details>
<summary><b>Q: What languages are supported?</b></summary>

Supports JavaScript/TypeScript (.js, .ts, .jsx, .tsx) and Python (.py) files.

</details>

<details>
<summary><b>Q: How are character personalities interpreted?</b></summary>

Character personalities are auto-assigned based on file naming patterns and code characteristics:
- Main/App/AppEntry -> Hot-Blooded Protagonist
- Database/Store/Repository -> Reliable Pillar
- Util/Helper/Common -> Silent Helper
- Middleware/Adapter -> Quirky Character
- Config/Constants -> Mysterious Figure
- High complexity/Bug clusters -> Fragile Soul
- High-frequency call modules -> Busy Bee
- No dependency modules -> Lonely Wanderer

</details>

<details>
<summary><b>Q: How is health score calculated?</b></summary>

Composite score = 100 - Bug Risk Weight - Complexity Weight - Code Size Penalty + Call Count Bonus
- Bug Risk: max -40 points
- Complexity: max -20 points
- Code Size: penalty starts after 500 lines
- Call Count: max +10 points

</details>

---

## Other Languages

📖 **[English](README.md)** | **[中文](README.zh-CN.md)**

---

MIT License - Free for personal and commercial projects
