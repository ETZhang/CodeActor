import path from 'node:path';
import { PersonalityType, CharacterPersona, CodeModule } from './types.js';

/**
 * Character Persona Generator - Generate anthropomorphized characters based on code characteristics
 */
export class CharacterGenerator {
  private moduleUsage: Map<string, number> = new Map();
  private importGraph: Map<string, Set<string>> = new Map();

  // Health level configuration
  private readonly healthLevelConfig = {
    excellent: { minScore: 90, color: 0x2ECC71, name: 'excellent' },
    good: { minScore: 75, color: 0x00BCD4, name: 'good' },
    fair: { minScore: 60, color: 0xF1C40F, name: 'fair' },
    poor: { minScore: 40, color: 0xFF6B00, name: 'poor' },
    critical: { minScore: 0, color: 0xDC2626, name: 'critical' },
  };

  /**
   * Calculate character health level
   */
  private calculateHealthLevel(module: CodeModule, bugRisk: number): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    const complexity = module.metadata.complexity;
    const lines = module.metadata.lines;

    let healthScore = 100;

    // Bug risk deduction (max 50 points)
    healthScore -= Math.min(bugRisk * 5, 50);

    // Complexity deduction (max 30 points)
    healthScore -= Math.min(complexity * 3, 30);

    // Code lines deduction (starts after 300 lines)
    if (lines > 300) {
      healthScore -= Math.min((lines - 300) / 50, 20);
    }

    // Long function penalty (more than 5 long functions)
    const longFunctions = module.functions.filter(f => f.lines > 30).length;
    healthScore -= Math.min(longFunctions * 2, 15);

    // Determine health level
    if (healthScore >= this.healthLevelConfig.excellent.minScore) return 'excellent';
    if (healthScore >= this.healthLevelConfig.good.minScore) return 'good';
    if (healthScore >= this.healthLevelConfig.fair.minScore) return 'fair';
    if (healthScore >= this.healthLevelConfig.poor.minScore) return 'poor';
    return 'critical';
  }

  /**
   * Generate character personas for all code modules
   */
  generatePersonas(modules: CodeModule[]): CharacterPersona[] {
    // First analyze call relationships
    this.analyzeUsage(modules);

    const personas: CharacterPersona[] = [];

    for (const module of modules) {
      const persona = this.createPersona(module);
      personas.push(persona);
    }

    return personas;
  }

  /**
   * Analyze module usage
   */
  private analyzeUsage(modules: CodeModule[]): void {
    // Count how many times each module is imported
    for (const module of modules) {
      this.importGraph.set(module.id, new Set(module.imports));

      for (const imp of module.imports) {
        const current = this.moduleUsage.get(imp) || 0;
        this.moduleUsage.set(imp, current + 1);
      }
    }

    // Ensure all modules have records
    for (const module of modules) {
      if (!this.moduleUsage.has(module.id)) {
        this.moduleUsage.set(module.id, 0);
      }
    }
  }

  /**
   * Create persona for a single module
   */
  private createPersona(module: CodeModule): CharacterPersona {
    const personality = this.determinePersonality(module);
    const callCount = this.moduleUsage.get(module.id) || 0;
    const bugRisk = this.calculateBugRisk(module);
    const healthLevel = this.calculateHealthLevel(module, bugRisk);

    return {
      name: this.generateName(module),
      originalFile: module.path,
      personality,
      traits: this.generateTraits(personality, module),
      role: this.determineRole(module),
      color: this.getPersonalityColor(personality),
      icon: this.getIconForPersonality(personality),
      health: healthLevel,
      stats: {
        linesOfCode: module.metadata.lines,
        complexity: module.metadata.complexity,
        callCount,
        bugRisk,
      },
    };
  }

  /**
   * Determine personality type based on module characteristics
   */
  private determinePersonality(module: CodeModule): PersonalityType {
    const { path, metadata, exports } = module;
    const basename = path.split('/').pop() || '';
    const callCount = this.moduleUsage.get(module.id) || 0;

    // Main entry file
    if (basename.match(/^(index|main|app|server|entry)\./i)) {
      return PersonalityType.HEROIC;
    }

    // Data/storage related
    if (path.match(/(model|schema|store|repository|database|db|dao)/i)) {
      return PersonalityType.RELIABLE;
    }

    // Utility/helper classes
    if (path.match(/(util|helper|common|shared|lib)/i)) {
      return callCount > 10 ? PersonalityType.BUSY : PersonalityType.HELPFUL;
    }

    // Middleware
    if (path.match(/(middleware|interceptor|guard)/i)) {
      return PersonalityType.QUIRKY;
    }

    // Config/constants
    if (path.match(/(config|constant|env|setting)/i)) {
      return PersonalityType.MYSTERIOUS;
    }

    // Judge by call count
    if (callCount === 0) {
      return PersonalityType.LONELY;
    }

    // High complexity modules are fragile
    if (metadata.complexity > 7) {
      return PersonalityType.FRAGILE;
    }

    // Default to busy
    return PersonalityType.BUSY;
  }

  /**
   * Generate character name
   */
  private generateName(module: CodeModule): string {
    const basename = module.path.split('/').pop() || '';
    const nameWithoutExt = basename.replace(/\.(ts|js|py|java|go|rs)$/, '');
    const personality = this.determinePersonality(module);

    // Generate name prefix based on personality type
    const prefixes: Record<PersonalityType, string[]> = {
      [PersonalityType.HEROIC]: ['Hero', 'Captain', 'Protagonist', 'Vanguard'],
      [PersonalityType.RELIABLE]: ['Elder', 'Sage', 'Gatekeeper', 'Administrator'],
      [PersonalityType.HELPFUL]: ['Assistant', 'Spirit', 'Butler', 'Helper'],
      [PersonalityType.QUIRKY]: ['Eccentric', 'Guardian', 'Checkpoint', 'Inspector'],
      [PersonalityType.MYSTERIOUS]: ['Hermit', 'Puzzle', 'Secret Tome', 'Prophet'],
      [PersonalityType.FRAGILE]: ['GlassHeart', 'Sensitive', 'Fragile', 'Delicate'],
      [PersonalityType.BUSY]: ['Worker', 'Bee', 'Diligent', 'Hustler'],
      [PersonalityType.LONELY]: ['Loner', 'Hermit', 'Ronin', 'Outcast'],
    };

    const possiblePrefixes = prefixes[personality];
    const prefix = possiblePrefixes[Math.floor(Math.random() * possiblePrefixes.length)];

    // Format filename
    const formattedName = nameWithoutExt
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .replace(/\s+/g, '');

    return `${prefix}${formattedName}`;
  }

  /**
   * Generate personality trait descriptions
   */
  private generateTraits(personality: PersonalityType, module: CodeModule): string[] {
    const traitsMap: Record<PersonalityType, string[]> = {
      [PersonalityType.HEROIC]: [
        'Full of enthusiasm but crashes easily',
        'Always at the forefront',
        'Carrying the hopes of the entire project',
        'Slightly chuunibyou',
      ],
      [PersonalityType.RELIABLE]: [
        'Steady and reliable personality',
        'Excellent memory but slow-moving',
        'Never late or leaves early',
        'The anchor of the team',
      ],
      [PersonalityType.HELPFUL]: [
        'Low-profile invisible assistant',
        'Always available when called',
        'Silent dedication without asking for return',
        'The most reliable support of the team',
      ],
      [PersonalityType.QUIRKY]: [
        'Eccentric and hard to understand',
        'Likes to set up checkpoints',
        'Always has strange requirements',
        'But reliable at critical moments',
      ],
      [PersonalityType.MYSTERIOUS]: [
        'Hidden expert',
        'Always silent',
        'Holds unknown secrets',
        'Rarely appears in the storyline',
      ],
      [PersonalityType.FRAGILE]: [
        'Sensitive and fragile',
        'Easily hurt',
        'Needs gentle treatment',
        'Bearing too much responsibility',
      ],
      [PersonalityType.BUSY]: [
        'Always bustling',
        'The worker of the team',
        'Keeps things running without me',
        'Completes tasks with high efficiency',
      ],
      [PersonalityType.LONELY]: [
        'Always alone',
        'Rarely summoned',
        'May be waiting to be deleted',
        'Has an unknown past',
      ],
    };

    return traitsMap[personality];
  }

  /**
   * Determine team role
   */
  private determineRole(module: CodeModule): string {
    const basename = module.path.split('/').pop() || '';

    if (basename.match(/^(index|main|app|server)\./i)) return '🎭 Protagonist';
    if (basename.match(/controller|router|handler/i)) return '⚔️ Scout';
    if (basename.match(/service|manager/i)) return '🛡️ Shield';
    if (basename.match(/model|schema|repository/i)) return '📚 Administrator';
    if (basename.match(/util|helper|common/i)) return '💚 Support';
    if (basename.match(/middleware|interceptor/i)) return '🚧 Checkpoint Guard';
    if (basename.match(/config|constant/i)) return '📜 Mastermind';
    if (basename.match(/test|spec/i)) return '🔍 Guardian';

    return '👤 Passerby';
  }

  /**
   * Get color corresponding to personality
   */
  private getPersonalityColor(personality: PersonalityType): string {
    const colors: Record<PersonalityType, string> = {
      [PersonalityType.HEROIC]: '#FF6B6B',      // Red - Heroic
      [PersonalityType.RELIABLE]: '#4ECDC4',    // Cyan - Reliable
      [PersonalityType.HELPFUL]: '#95E1D3',     // Green - Helpful
      [PersonalityType.QUIRKY]: '#FFA07A',      // Orange - Quirky
      [PersonalityType.MYSTERIOUS]: '#9B59B6',  // Purple - Mysterious
      [PersonalityType.FRAGILE]: '#DDA0DD',     // Pink - Fragile
      [PersonalityType.BUSY]: '#F39C12',        // Gold - Busy
      [PersonalityType.LONELY]: '#95A5A6',      // Gray - Lonely
    };
    return colors[personality];
  }

  /**
   * Get icon type corresponding to personality
   */
  private getIconForPersonality(personality: PersonalityType): string {
    return personality;
  }

  /**
   * Calculate bug risk
   */
  private calculateBugRisk(module: CodeModule): number {
    let risk = 0;

    // Complexity impact
    risk += module.metadata.complexity * 0.5;

    // Code lines impact (increases after 500 lines)
    if (module.metadata.lines > 500) {
      risk += 2;
    }

    // Function count impact
    risk += module.functions.length * 0.3;

    // Class count impact
    risk += module.classes.length * 0.5;

    // Syntax errors are high risk
    if (module.metadata.hasErrors) {
      risk = 10;
    }

    return Math.min(10, Math.round(risk));
  }

  /**
   * Get module call count
   */
  getModuleUsage(moduleId: string): number {
    return this.moduleUsage.get(moduleId) || 0;
  }

  /**
   * Get module import relationships
   */
  getImportGraph(): Map<string, Set<string>> {
    return this.importGraph;
  }
}
