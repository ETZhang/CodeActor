# CodeActor 🎭

**[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md)**

> Transforma bases de código en personajes 3D de dibujos animados

![CodeActor Demo](example1.png)

CodeActor es una herramienta creativa de visualización de código que analiza tu base de código y transforma cada módulo en un personaje 3D de dibujos animados único con personalidad, convirtiendo las dependencias del código en una historia social interesante.

## Características

- **Antropomorfización de Personajes 3D**: Genera automáticamente personajes 3D de dibujos animados lindos basados en la funcionalidad del código
- **Red de Relaciones Sociales**: Transforma las dependencias en descripciones sociales divertidas (mejores amigos, amor no correspondido, relaciones tóxicas...)
- **Detección de Salud**: Identifica automáticamente riesgos de bugs, los personajes enfermos tienen efectos visuales especiales
- **3D Interactivo**: Glisser, zoom, hacer clic para ver detalles
- **Múltiples Formatos de Exportación**: Soporta JSON, gráficos Mermaid, texto narrativo
- **Tuberías Súper Gruesas**: Líneas de relación claramente visibles (radio 0.8)
- **Partículas de Flujo**: Animación dinámica mostrando dirección de llamadas de código
- **Relaciones Bidireccionales**: Soporta flechas duales para dependencias mutuas

## Tipos de Personajes

| Tipo | Patrón de Código | Rasgos Visuales |
|------|---------------|-------------------|
| 🔥 Protagonista Sangre Caliente | main/app/index | Capa, ojos brillantes |
| 🛡️ Pilar Confiable | database/model | Cuerpo redondo, gafas, bigote |
| 💚 Ayudante Silencioso | util/helper | Aura de ángel, alas pequeñas |
| 🎪 Personanje Excéntrico | middleware | Cuerpo polifacético, sombrero de signo de interrogación |
| 🌙 Figura Misteriosa | config/constant | Cuerpo transparente, ojos brillantes |
| ⚡ Abeja Ocupada | llamadas de alta frecuencia | Corbata, maletín, gotas de sudor |
| 🌸 Alma Frágil | módulos complejos | Cuerpo delgado, curitas, lágrimas |
| 🌑 Viajero Solitario | sin llamadas | Semitransparente, aura que se desvanece |

## 🎯 Skill Universal para Editores AI

CodeActor funciona en **todos los principales editores e IDEs con IA**:

| Editor | Estado | Método de Instalación |
|--------|--------|---------------------|
| **Claude Code** | ✅ Nativo | Soporta de skill integrado |
| **Cursor** | ✅ Compatible | Usa sistema de skills de Claude Code |
| **OpenClaw** | ✅ Compatible | Instalar como plugin de skill |
| **GitHub Copilot** | ✅ Compatible | Instalar como extensión |
| **Continue.dev** | ✅ Compatible | Integración CLI |
| **Windsurf** | ✅ Compatible | Comando personalizado |
| **Tabnine** | ✅ Compatible | Plugin CLI |
| **Codeium** | ✅ Compatible | API de extensines |

---

## Inicio Rápido

### Como Skill de Claude Code (Recomendado)

```bash
# Instalar skill globalmente
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor

# Usar en cualquier proyecto
/code-actor
```

### Instalación para Otros Editores AI

#### OpenClaw 🤖

OpenClaw es una plataforma de asistente personal de IA de código abierto que soporta plugins de habilidades.

**Método de Instalación 1: Desde Repositorio GitHub**

```bash
# Formato de plugin de skill de OpenClaw
openclaw plugins install @ETZhang/code-actor
```

**Método de Instalación 2: Desde ClawHub**

```bash
# Buscar e instalar desde ClawHub (registro de skills de OpenClaw)
openclaw skill install code-actor
```

**Verificación de Instalación:**

```bash
# Listar habilidades instaladas
openclaw skill list

# Probar la habilidad
openclaw skill run code-actor --help
```

**Para Desarrolladores: Publicar en ClawHub**

Para que CodeActor esté disponible en ClawHub:
1. Publicar este repositorio en ClawHub
2. Usuarios pueden instalar con: `openclaw plugins install code-actor`

---

#### Editor Cursor

```bash
# Cursor usa skills de Claude Code
# Misma instalación que Claude Code
cd /path/to/CodeActor
npm run build
mkdir -p ~/.claude/skills
cp -r . ~/.claude/skills/code-actor
# Disponible en Cursor
```

#### GitHub Copilot

```bash
# Instalar via npm (próximamente)
npm install -g code-actor

# O usar directamente
npx code-actor analyze ./path/to/project
```

#### Continue.dev / Windsurf / Tabnine

```bash
# Usar como herramienta CLI
npx code-actor analyze ./path --format=json
npx code-actor analyze ./path --format=mermaid
npx code-actor serve ./path
```

#### Extensión VS Code

```bash
# Instalar desde marketplace (próximamente)
code --install-extension ETZhang.code-actor

# O construir localmente
cd /path/to/CodeActor
npm run build
code --install-extension ./dist/vscode
```

### Independiente

```bash
# Clonar repositorio
git clone https://github.com/ETZhang/CodeActor.git
cd code-actor

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir
npm run build
```

### Interface Web

Abrir `index.html` directamente en el navegador.

## Tipos de Relaciones

| Tipo | Significado de Código | Descripción Social |
|------|---------------|-------------------|
| Mejores Amis | Acoplamiento fuerte | Inseparables |
| Amor No Correspondido | Dependencia unidireccional | Uno depende del otro |
| Relación Tóxica | Dependencia circular | Enredo complicado |
| Admirador Secreto | Comunicación asíncrona | Mensajes del grupo |
| Seguidor de Fan | Dependencia débil | El fan sigue |
| Relación Contractual | Dependencia de interfaz | Contrato firmado |

## Niveles de Salud

- **Excelente** 🟢: Riesgo de bugs bajo, visualización saludable
- **Bueno** 🔵: Buena calidad de código
- **Regular** 🟡: Riesgo de bugs medio, atención necesaria
- **Pobre** 🟠: Alta complejidad, se recomienda refatorización
- **Crítico** 🔴: Riesgo de bugs elevado, corrección urgente necesaria

## Interaciones

- **Un Clic**: Ver panel de atributos detallados
- **Doble Clic**: Resaltar todas las relaciones conectadas
- **Glisser**: Ajustar posición del personaje para desentralear redes complejas
- **Desplazar**: Zoom a la vista
- **Clic Derecho**: Rotar cámara

## Estructura del Proyecto

```
code-actor/
├── src/
│   ├── analyzer/          # Motor de análisis de código
│   │   ├── parser.ts      # Parser multi-idioma
│   │   ├── character-generator.ts  # Generador de personalidad del personaje
│   │   ├── relation-analyzer.ts    # Análisis de relaciones
│   │   └── types.ts       # Definiciones de tipos
│   ├── visualizer/        # Visualización Three.js
│   │   ├── scene-manager.ts        # Gestión de escena
│   │   ├── character-mesh.ts       # Generación de personajes 3D (radio de ojos 0.15)
│   │   ├── interaction-manager.ts  # Gestión de interaciones
│   │   └── animation-manager.ts     # Efectos de animación
│   ├── cli/              # Entrada CLI
│   └── web/              # Frontend web
├── skills/               # Definiciones de Skill de Claude Code
└── index.html            # Entrada de interfaz web
```

## Stack Tecnológico

- **Motor de Análisis**: TypeScript, soporta JS/TS/Python/Java y más
- **Renderizado 3D**: Three.js, generación procedimental de personajes
- **Frontend**: Vite + TypeScript nativo
- **CLI**: Node.js + Express + WebSocket

## Actualizaciones Recientes

- ✅ Radio de tubería fijado en 0.8 para visibilidad maximable
- ✅ Tamaño de ojos aumentado a 0.15 para mejor expresividad
- ✅ Agregada animación de partículas de flujo mostrando dirección
- ✅ Soporte para relaciones bidireccionales con flechas duales
- ✅ Skill de Claude Code creada soportando comando `/code-actor`

## Licencia

MIT

---

¡Haga que entender código sea más divertido! 🎭✨
