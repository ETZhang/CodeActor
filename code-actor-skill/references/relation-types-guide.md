# Code Dependency Relationship Types Guide

This document explains the actual meaning of each relationship type in CodeActor at the code level.

## Relationship Types Reference Table

| CodeActor Relationship | Code-Level Meaning | Example | Severity |
|-----------------------|-------------------|---------|----------|
| **Best Friends** (best_friend) | **Bidirectional strong coupling**<br>Two modules directly import and use each other's exports<br>A.ts: `import { B } from './b'`<br>B.ts: `import { A } from './a'` | 🟡 Medium |
| **Unrequited Love** (unrequited) | **Unidirectional dependency**<br>Module A imports B's functionality, but B doesn't know about or depend on A<br>`import { helper } from './utils'` | 🟢 Normal |
| **Toxic Relationship** (toxic) | **Circular dependency**<br>A → B → A, forming a closed loop<br>Makes modules difficult to decouple and test | 🔴 **Severe** |
| **Secret Admirer** (secret) | **Asynchronous communication**<br>EventEmitter, Pub/Sub, message queues<br>Modules communicate through events/messages, not direct calls | 🟢 Normal |
| **Fan Following** (fan) | **Weak dependency**<br>Only uses type definitions or interfaces, doesn't directly instantiate<br>`import type { User } from './types'` | 🟢 Normal |
| **Contract Relationship** (contract) | **Interface implementation**<br>Programming based on interfaces, depending on abstractions rather than concrete implementations<br>`class UserController implements IUserController` | 🟢 Normal |

## Code-Level Relationship Patterns

### 1. Healthy Dependency Patterns

```
┌─────────────────────────────────────────────────┐
│                                           │
│           Controller (Entry)                 │
│                 ↓                        │
│            Service (Business Logic)             │
│                 ↓                    ↓       ↓
│         Repository 1    Repository 2       │
│                 ↓                    ↓       ↓
│            Database / Storage               │
└─────────────────────────────────────────────────┘

Features:
- Unidirectional flow
- Clear responsibilities
- Easy to test
```

### 2. Warning Anti-Patterns

#### ⚠️ Circular Dependency (Toxic Relationship)
```
A ──→ B ──→ C ──→ A
   ↑       ↑       ↑
   └───────┘

Problems:
- Difficult to understand and maintain
- Prone to bugs
- Difficult to test in isolation
```

**How to fix**:
- Introduce event system/message queue
- Use dependency injection
- Refactor to layered architecture

#### ⚠️ Cross-Layer Calls
```
Controller directly calls Repository (skipping Service layer)

Problems:
- Bypasses business logic
- Poor code reusability
- Difficult to maintain

Fix:
- Follow layered architecture principles
- All data access goes through Service layer
```

#### ⚠️ God Object
```
One class knows/controls too much

Features:
- Over 1000 lines
- More than 20 methods
- Controls multiple responsibilities

Fix:
- Single Responsibility Principle (SRP)
- Split into multiple small classes
- Use interface segregation
```

## Quick Recognition Guide

### Determining Relationships from File Names

| File Name Pattern | Likely Relationship Type |
|------------------|------------------------|
| `XService.ts` → `XRepository.ts` | Unidirectional dependency (normal) |
| `XController.ts` ↔ `XService.ts` | Bidirectional dependency (normal) |
| `X.types.ts` referenced by `Y.ts` | Fan following/Contract relationship |
| `XEventHandler.ts` ↔ `YEventEmitter.ts` | Contract relationship/Bidirectional communication |

### Determining Relationships from Directory Structure

```
src/
├── controllers/     # Controller layer
│   └── services/      # ← Usually has dependency (normal)
├── services/
│   ├── repositories/  # ← Depends on data layer
│   └── types/         # ← Uses type definitions
├── shared/            # ← Utility modules (depended on by all)
└── middleware/        # ← Interceptors (all requests pass through)
```

## Detection Recommendations

### Automatic Detection Rules

Use the following rules to automatically identify potential issues:

1. **Detect circular dependencies**
   ```typescript
   // ❌ Warning: A and B depend on each other
   ```

2. **Detect cross-layer calls**
   ```typescript
   // ❌ Warning: Controller directly calls Repository
   ```

3. **Detect large files**
   ```typescript
   // ⚠️ Warning: Single file exceeds 500 lines
   ```

4. **Detect high complexity**
   ```typescript
   // 🚨 Danger: Cyclomatic complexity exceeds 10
   ```

### Refactoring Priority

| Priority | Issue Type | Suggested Timeline |
|----------|-----------|-------------------|
| 🔴 P0 | Circular dependencies | Immediate |
| 🟠 P1 | High complexity/Large files | This week |
| 🟡 P2 | Cross-layer calls/God objects | Next iteration |
| 🟢 P3 | Code style/Minor issues | Technical debt |
