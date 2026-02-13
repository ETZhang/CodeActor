# CodeActor 🎭

**[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md)**

> Transform codebases into 3D cartoon characters

![CodeActor Demo](example1.png)

CodeActor is a creative code visualization tool that analyzes your codebase and transforms each module into a unique 3D cartoon character with personality, turning code dependencies into an interesting social story.

## Features

- **3D Character Anthropomorphization**: Automatically generate cute 3D cartoon characters based on code functionality
- **Social Relationship Network**: Transform dependencies into fun social descriptions (best friends, unrequited love, toxic relationships...)
- **Health Detection**: Automatically identify bug risks with special visual effects for sick characters
- **Interactive 3D**: Drag, zoom, click to view details
- **Multiple Exports**: Support JSON, Mermaid charts, narrative text
- **Super Thick Pipes**: Relationship lines clearly visible (radius 0.8)
- **Flow Particles**: Dynamic flow animation showing code call direction
- **Bidirectional Relationships**: Dual arrows for mutual dependencies

## Character Types

| Type | Code Pattern | Visual Traits |
|------|---------------|---------------|
| 🔥 Hot-Blooded Protagonist | main/app/index | Cape, glowing eyes |
| 🛡️ Reliable Pillar | database/model | Round body, glasses, mustache |
| 💚 Silent Helper | util/helper | Angel halo, small wings |
| 🎪 Quirky Character | middleware | Multi-sided body, question mark hat |
| 🌙 Mysterious Figure | config/constant | Transparent body, glowing eyes |
| ⚡ Busy Bee | High-frequency calls | Tie, briefcase, sweat drops |
| 🌸 Fragile Soul | Complex modules | Thin body, bandages, tears |
| 🌑 Lonely Wanderer | No calls | Semi-transparent, fading halo |

## Quick Start

### As Claude Code Skill (Recommended)

```bash
# Install skill globally
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor

# Use in any project
/code-actor
```

### Standalone

```bash
# Clone repository
git clone https://github.com/ETZhang/CodeActor.git
cd code-actor

# Install dependencies
npm install

# Start development server
npm run dev

# Build
npm run build
```

### Web Interface

Open `index.html` directly in browser.

## Relationship Types

| Type | Code Meaning | Social Description |
|------|---------------|-------------------|
| Best Friends | Strong coupling | Inseparable |
| Unrequited Love | One-way dependency | One depends on another |
| Toxic Relationship | Circular dependency | Complicated mess |
| Secret Admirer | Async notification | Group chat messages |
| Fan Following | Weak dependency | Fan follows |
| Contract Relationship | Interface dependency | Signed contract |

## Health Status

- **Excellent** 🟢: Low bug risk, healthy display
- **Good** 🔵: Good code quality
- **Fair** 🟡: Medium bug risk, needs attention
- **Poor** 🟠: High complexity, recommend refactoring
- **Critical** 🔴: High bug risk, urgent fix needed

## Interactions

- **Single Click**: View detailed attribute panel
- **Double Click**: Highlight all related relationships
- **Drag**: Adjust character position to untangle complex networks
- **Scroll**: Zoom view
- **Right Drag**: Rotate camera

## Project Structure

```
code-actor/
├── src/
│   ├── analyzer/          # Code analysis engine
│   │   ├── parser.ts      # Multi-language parser
│   │   ├── character-generator.ts  # Character personality generator
│   │   ├── relation-analyzer.ts    # Relationship analysis
│   │   └── types.ts       # Type definitions
│   ├── visualizer/        # Three.js visualization
│   │   ├── scene-manager.ts        # Scene management
│   │   ├── character-mesh.ts       # 3D character generation (eye radius 0.15)
│   │   ├── interaction-manager.ts  # Interaction handling
│   │   └── animation-manager.ts     # Animation effects
│   ├── cli/              # CLI entry
│   └── web/              # Web frontend
├── skills/               # Claude Code Skill definitions
└── index.html            # Web interface entry
```

## Tech Stack

- **Analysis Engine**: TypeScript, supporting JS/TS/Python/Java and more
- **3D Rendering**: Three.js, procedurally generated cartoon characters
- **Frontend**: Vite + Native TypeScript
- **CLI**: Node.js + Express + WebSocket

## Recent Updates

- ✅ Fixed pipe radius to 0.8 for clear visibility
- ✅ Increased eye size to 0.15 for better character expressiveness
- ✅ Added flow particle animation for call direction
- ✅ Support for bidirectional relationships with dual arrows
- ✅ Created Claude Code Skill supporting `/code-actor` command

## License

MIT

---

Make code understanding more fun! 🎭✨
