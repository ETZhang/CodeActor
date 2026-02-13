# TypeScript/JavaScript Project Architecture Best Practices

This document summarizes the latest best practices for TypeScript/JavaScript project architecture and code quality from 2024-2025.

## Directory Structure Best Practices

### General Principles

1. **Name folders by technical capability** - Not by hierarchy
2. **Separate code files from configuration files** - Config files in root directory, code in `src/` or `app/`
3. **Single Responsibility Principle** - Each folder/module does only one thing

### Node.js/TypeScript Backend Project Structure (2024)

```
project-root/
├── src/
│   ├── api/              # API routes and controllers
│   ├── services/         # Business logic layer
│   ├── repositories/     # Data access layer
│   ├── models/           # Data models/Schemas
│   ├── middleware/       # Express/Koa middleware
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration management
│   ├── types/            # TypeScript type definitions
│   └── index.ts          # Entry file
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── .env.example
```

**Reference**: [Production-Grade Node.js & TypeScript Folder Structure for 2024](https://mingyang-li.medium.com/production-grade-node-js-typescript-folder-structure-for-2024-f975edeabefd)

### React/TypeScript Frontend Project Structure (2024-2025)

```
project-root/
├── src/
│   ├── components/       # UI components
│   │   ├── ui/          # Common UI components (Button, Card, Modal)
│   │   ├── forms/        # Form components
│   │   └── layouts/      # Layout components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React Hooks
│   ├── services/         # API service layer
│   ├── store/            # State management (Redux/Zustand)
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── constants/        # Constant definitions
│   └── App.tsx
├── public/
├── package.json
└── vite.config.ts
```

**References**:
- [Effective React TypeScript Project Structure](https://medium.com/@tusharupadhyay691/effective-react-typescript-project-structure-best-practices-for-scalability-and-maintainability-bcbcf0e09bd5)
- [React Project Structure 2024](https://www.tiepphan.com/practical-react-project-structure-2024/)

## Code Quality and Complexity Detection

### Cyclomatic Complexity

Cyclomatic complexity measures the number of independent paths in code:

| Complexity | Assessment | Recommendation |
|------------|------------|----------------|
| 1-10 | Simple | No refactoring needed |
| 11-20 | Moderate | Acceptable |
| 21-50 | Complex | Refactoring recommended |
| 50+ | Very Complex | Must refactor |

**Reference**: [Understanding Cyclomatic Complexity](https://medium.com/beyond-the-code-by-typo/understanding-cyclomatic-complexity-a-developers-comprehensive-guide-820772732514)

### Common Code Smells

#### 1. Long Method
- **Symptom**: Single method over 50 lines
- **Solution**: Split into multiple smaller methods

#### 2. Large Class
- **Symptom**: Class over 300 lines or more than 10 methods
- **Solution**: Split into multiple small classes with single responsibilities

#### 3. Circular Dependency
- **Symptom**: A depends on B, B depends on A
- **Solution**: Introduce event system or dependency injection

#### 4. God Object
- **Symptom**: Single class knows/controls too much
- **Solution**: Separate responsibilities, use interfaces

#### 5. Feature Envy
- **Symptom**: Class overuses functionality of another class
- **Solution**: Move functionality to the correct class

**References**:
- [Best Practices for Identifying Code Smells](https://blog.codacy.com/best-practices-for-identifying-and-eliminating-code-smells)
- [Cracking The Code Smells](https://itnext.io/cracking-the-code-smells-a1260093e9e7)

### ESLint Complexity Rules

```json
{
  "rules": {
    "complexity": ["error", { "max": 10 }],
    "max-lines-per-function": ["warn", { "max": 50 }],
    "max-depth": ["error", { "max": 4 }],
    "max-params": ["warn", { "max": 4 }]
  }
}
```

## Module Identification and Character Assignment

### Automatic Recognition Patterns

#### 1. Controllers/Routes
**Pattern**: `*Controller.ts`, `*Router.ts`, `routes/`
**Character**: 🎭 Heroic Protagonist
**Responsibility**: Handle HTTP requests, coordinate business logic

#### 2. Services
**Pattern**: `*Service.ts`, `services/`
**Character**: 🛡️ Reliable Shield
**Responsibility**: Core business logic, transaction processing

#### 3. Data Access Layer (Repositories)
**Pattern**: `*Repository.ts`, `dao/`, `repositories/`
**Character**: 📚 Administrator
**Responsibility**: Database operations, data persistence

#### 4. Models/Schemas
**Pattern**: `*Model.ts`, `*Schema.ts`, `entities/`, `models/`
**Character**: 📚 Administrator
**Responsibility**: Data structure definition

#### 5. Utilities/Helpers
**Pattern**: `*Util.ts`, `*Helper.ts`, `utils/`, `helpers/`, `common/`
**Character**: 💚 Silent Helper
**Responsibility**: Reusable utility functions

#### 6. Middleware
**Pattern**: `*Middleware.ts`, `middleware/`, `interceptors/`
**Character**: 🎪 Quirky Character
**Responsibility**: Request/response interception, cross-cutting concerns

#### 7. Configuration
**Pattern**: `config/`, `*.config.ts`, `constants/`
**Character**: 🌙 Mysterious Figure
**Responsibility**: Application configuration, environment variables

#### 8. Type Definitions
**Pattern**: `types/`, `interfaces/`, `@types/`
**Character**: 🌙 Mysterious Figure
**Responsibility**: TypeScript type definitions

#### 9. Test Files
**Pattern**: `*.test.ts`, `*.spec.ts`, `__tests__/`
**Character**: 🔍 Guardian
**Responsibility**: Ensure code correctness

## Dependency Relationship Patterns

### Healthy Dependency Patterns

```
Upper Layer (Controller)
    ↓
Middle Layer (Service)
    ↓
Lower Layer (Repository/DAO)
    ↓
Database
```

### Warning Dependency Patterns

#### 1. Circular Dependency
- **Type**: Toxic Relationship 🚫
- **Harm**: Makes code difficult to understand and test
- **Solution**: Refactor, use events/dependency injection

#### 2. Excessive Coupling
- **Type**: Best Friends 🔒
- **Harm**: Modifying one module affects other modules
- **Solution**: Introduce interfaces, dependency inversion

#### 3. Cross-Layer Calls
- **Example**: Controller directly calls Repository, skipping Service layer
- **Harm**: Bypasses business logic layer
- **Solution**: Follow layered architecture principles

## Detection Recommendations

### High-Risk Module Characteristics

1. **Cyclomatic complexity > 10**: 🚨 Critical
2. **Single file > 500 lines**: 🤒 Sick risk
3. **Circular dependency**: 🚫 Toxic relationship
4. **Function parameters > 4**: Increased complexity
5. **Nesting level > 4**: Hard to maintain

### Refactoring Priority

| Priority | Type | Timeline |
|----------|------|----------|
| 🔴 P0 | Critical/Circular dependencies | Immediate |
| 🟠 P1 | High complexity/Large files | This week |
| 🟡 P2 | Medium risk | Next iteration |
| 🟢 P3 | Low risk | Technical debt |

## References

- [Production-Grade Node.js & TypeScript Folder Structure for 2024](https://mingyang-li.medium.com/production-grade-node-js-typescript-folder-structure-for-2024-f975edeabefd)
- [Recommended Folder Structure for Node(TS) 2025](https://dev.to/pramod_boda/recommended-folder-structure-for-nodets-2025-39jl)
- [Effective React TypeScript Project Structure](https://medium.com/@tusharupadhyay691/effective-react-typescript-project-structure-best-practices-for-scalability-and-maintainability-bcbcf0e09bd5)
- [Node.js Project Architecture Best Practices](https://blog.logrocket.com/node-js-project-architecture-best-practices/)
- [React Project Structure 2024](https://www.tiepphan.com/practical-react-project-structure-2024/)
- [React Folder Structure in 5 Steps 2025](https://www.robinwieruch.de/react-folder-structure/)
- [A Front-End Application Folder Structure](https://fadamakis.com/a-front-end-application-folder-structure-that-makes-sense-ecc0b690968b)
- [Understanding Cyclomatic Complexity](https://medium.com/beyond-the-code-by-typo/understanding-cyclomatic-complexity-a-developers-comprehensive-guide-820772732514)
- [Best Practices for Identifying Code Smells](https://blog.codacy.com/best-practices-for-identifying-and-eliminating-code-smells)
- [What Is Code Complexity?](https://axify.io/blog/code-complexity-explained)
- [Continuous Inspection: 3 Steps to Manage Complexity](https://dev.to/krishnam/continuous-inspection-3-steps-to-manage-complexity-5ii)
