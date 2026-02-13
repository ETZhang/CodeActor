# CodeActor 🎭

**[English](README.md) | [简体中文](README.zh-CN.md) | [日本語](README.ja.md) | [Español](README.es.md) | [Français](README.fr.md)**

> Transforma bases de código en personajes 3D de dibujos animados

![CodeActor Demo](example1.png)

CodeActor es una herramienta creativa de visualización de código que analiza tu base de código y transforma cada módulo en un personaje 3D de dibujos animados único con personalidad, convirtiendo las dependencias del código en una historia social interesante.

## Características

- **Antropomorfización de Personajes 3D**: Genera automáticamente personajes 3D de dibujos animados lindos basados en la funcionalidad del código
- **Red de Relaciones Sociales**: Transforma las dependencias en descripciones sociales divertidas (mejores amigos, amor no correspondido, relaciones tóxicas...)
- **Detección de Salud**: Identifica automáticamente riesgos de bugs, personajes enfermos tienen efectos visuales especiales
- **3D Interactivo**: Arrastrar, zoom, hacer clic para ver detalles
- **Múltiples Formatos de Exportación**: Soporta JSON, gráficos Mermaid, texto narrativo
- **Tuberías Súper Gruesas**: Líneas de relación claramente visibles (radio 0.8)
- **Partículas de Flujo**: Animación dinámica mostrando dirección de llamadas de código
- **Relaciones Bidireccionales**: Soporta flechas duales para dependencias mutuas

## Tipos de Personajes

| Tipo | Patrón de Código | Rasgos Visuales |
|------|-------------------|-------------------|
| 🔥 Protagonista Sangre Caliente | main/app/index | Capa, ojos brillantes |
| 🛡️ Pilar Confiable | database/model | Cuerpo redondo, gafas, bigote |
| 💚 Ayudante Silencioso | util/helper | Aura de ángel, alas pequeñas |
| 🎪 Personaje Excéntrico | middleware | Cuerpo polifacético, sombrero de signo de interrogación |
| 🌙 Figura Misteriosa | config/constant | Cuerpo transparente, ojos brillantes |
| ⚡ Abeja Ocupada | llamadas de alta frecuencia | Corbata, maletín, gotas de sudor |
| 🌸 Alma Frágil | módulos complejos | Cuerpo delgado, curitas, lágrimas |
| 🌑 Viajero Solitario | sin llamadas | Semitransparente, aura que se desvanece |

## 🎯 Skill Universal para Editores AI

CodeActor funciona en **todos los principales editores e IDEs con IA**:

| Editor | Estado | Método de Instalación |
|--------|--------|---------------------|
| **Claude Code** | ✅ Natio | Soporta de skill integrado |
| **Cursor** | ✅ Compatible | Usa sistema de skills de Claude Code |
| **OpenHands（ex Moltbot）** | ✅ Compatible | Comando personalizado |
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

#### OpenHands 🦾（ex Moltbot）

**Método 1: Añadir como Servidor Personalizado**

1. Abrir configuración de OpenHands
2. Ir a **Custom Servers** o **Model Settings**
3. Añadir nuevo servidor:
   - Nombre: `CodeActor`
   - URL: `https://npx.code-actor.dev`
   - O usar localmente: `node /path/to/CodeActor/dist/cli/index.js serve .`

**Método 2: Integración npx directa**

```bash
# OpenHands puede ejecutar comandos npx directamente
npx code-actor analyze ./path --format=json
npx code-actor serve ./path
```

#### Editor Cursor

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

### Interfaz Web

Abrir `index.html` directamente en el navegador.

## Tipos de Relaciones

| Tipo | Significado de Código | Descripción Social |
|------|---------------------|-------------------|
| Mejores Amigos | Acoplamiento fuerte | Inseparables |
| Amor No Correspondido | Dependencia unidireccional | Uno depende del otro |
| Relación Tóxica | Dependencia circular | Enredo complicado |
| Admirador Secreto | Comunicación asíncrona | Mensajes del grupo |
| Seguidor de Fan | Dependencia débil | El fan sigue |
| Relación Contractual | Dependencia de interfaz | Contrato firmado |

## Niveles de Salud

- **Excelente** 🟢: Riesgo de bugs bajo, visualización saludable
- **Bueno** 🔵: Buena calidad de código
- **Regular** 🟡: Riesgo de bugs medio, necesita atención
- **Pobre** 🟠: Alta complejidad, se recomienda refatorización
- **Crítico** 🔴: Riesgo de bugs alto, necesita corrección urgente

## Interaciones

- **Un Clic**: Ver panel de atributos detallados
- **Doble Clic**: Resaltar todas las relaciones relacionadas
- **Arrastrar**: Ajustar posición del personaje para desentrelar redes complejas
- **Desplazarse**: Zoom a la vista
- **Arrastrar Derecho**: Rotar cámara

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
│   │   ├── scene-manager.ts        # Gestión de escenas
│   │   ├── character-mesh.ts       # Generación de personajes 3D (radio de ojos 0.15)
│   │   ├── interaction-manager.ts  # Manejo de interación
│   │   └── animation-manager.ts     # Efectos de animación
│   ├── cli/              # Entrada CLI
│   └── web/              # Frontend web
├── skills/               # Definicines de Skill de Claude Code
└── index.html            # Entrada de interfaz web
```

## Stack Tecnológico

- **Motor de Análisis**: TypeScript, soporta JS/TS/Python/Java y más
- **Renderizado 3D**: Three.js, generación procedimental de personajes
- **Frontend**: Vite + TypeScript nativo
- **CLI**: Node.js + Express + WebSocket

## Actualizaciones Recientes

- ✅ Radio de tubería fijado en 0.8 para máxima visibilidad
- ✅ Tamaño de ojos aumentado a 0.15 para mejor expresividad
- ✅ Agregada animación de partículas de flujo mostrando dirección
- ✅ Soporte para relaciones bidireccionales con flechas duales
- ✅ Skill de Claude Code creada soportando comando `/code-actor`

## Licencia

MIT

---

¡Haga que entender código sea más divertido! 🎭✨
