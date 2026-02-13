/**
 * CodeActor - Code Analyzer
 *
 * Responsible for analyzing codebase structure, generating character personas and relationship networks
 */

import { CodeParser } from './parser.js';
import { CharacterGenerator } from './character-generator.js';
import { RelationAnalyzer } from './relation-analyzer.js';
import { AnalysisResult, CharacterPersona, DependencyRelation } from './types.js';

/**
 * Code Analyzer
 */
export class CodeAnalyzer {
  private parser: CodeParser;
  private characterGenerator: CharacterGenerator;
  private relationAnalyzer: RelationAnalyzer;

  constructor() {
    this.parser = new CodeParser();
    this.characterGenerator = new CharacterGenerator();
    this.relationAnalyzer = new RelationAnalyzer();
  }

  /**
   * Analyze project directory
   */
  analyze(projectPath: string): AnalysisResult {
    // 1. Parse code
    const modules = this.parser.parseProject(projectPath);

    // 2. Generate character personas
    const characters = this.characterGenerator.generatePersonas(modules);

    // 3. Analyze dependency relationships
    const relations = this.relationAnalyzer.generateRelations(
      modules,
      characters
    );

    // 4. Calculate project health score
    const healthScore = this.calculateHealthScore(characters);

    // 5. Identify main character
    const mainCharacter = this.identifyMainCharacter(characters, relations);

    return {
      projectName: this.extractProjectName(projectPath),
      modules,
      characters,
      relations,
      summary: {
        totalModules: modules.length,
        totalRelations: relations.length,
        healthScore,
        mainCharacter,
      },
    };
  }

  /**
   * Calculate project health score
   */
  private calculateHealthScore(characters: CharacterPersona[]): number {
    if (characters.length === 0) return 100;

    let totalScore = 0;
    let totalWeight = 0;

    for (const char of characters) {
      // Bug risk weight (max deduction 40 points)
      const bugRiskWeight = Math.min(char.stats.bugRisk * 4, 40);

      // Complexity weight (max deduction 20 points)
      const complexityWeight = Math.min(char.stats.complexity * 2, 20);

      // Lines of code weight (deduction starts after 500 lines)
      const sizeWeight = Math.max(
        0,
        Math.min((char.stats.linesOfCode - 500) / 50, 10)
      );

      // Call count bonus (max +10 points)
      const callBonus = Math.min(char.stats.callCount, 10);

      const charScore = 100 - bugRiskWeight - complexityWeight - sizeWeight + callBonus;
      const weight = 1;

      totalScore += charScore * weight;
      totalWeight += weight;
    }

    return Math.round(totalScore / totalWeight);
  }

  /**
   * Identify main character
   */
  private identifyMainCharacter(
    characters: CharacterPersona[],
    relations: DependencyRelation[]
  ): string {
    // Find the most depended-upon module
    const dependencyCount = new Map<string, number>();

    for (const rel of relations) {
      dependencyCount.set(
        rel.to,
        (dependencyCount.get(rel.to) || 0) + 1
      );
    }

    let maxDeps = 0;
    let mainChar = '';

    for (const [char, count] of dependencyCount) {
      if (count > maxDeps) {
        maxDeps = count;
        mainChar = char;
      }
    }

    return mainChar || characters[0]?.name || '';
  }

  /**
   * Extract project name
   */
  private extractProjectName(path: string): string {
    const parts = path.split(/\/|\\/);
    return parts[parts.length - 1] || 'my-project';
  }

  /**
   * Export as JSON format
   */
  exportJSON(analysis: AnalysisResult): string {
    return JSON.stringify(analysis, null, 2);
  }

  /**
   * Export as Mermaid diagram
   */
  exportMermaid(analysis: AnalysisResult): string {
    let output = `graph TD\n`;

    // Add nodes (characters)
    for (const char of analysis.characters) {
      const healthIcon = char.health === 'excellent' || char.health === 'good' ? '' : char.health === 'fair' ? '🤒' : char.health === 'poor' ? '🟠' : '🚨';
      const label = `${healthIcon}${char.name}\\n${char.role}\\nLoC: ${char.stats.linesOfCode}`;
      const safeId = char.originalFile.replace(/[\/\\.-]/g, '_');
      output += `  ${safeId}["${label}"]\n`;
    }

    // Add edges (relationships)
    for (const rel of analysis.relations) {
      const colors: Record<string, string> = {
        best_friend: '#FF6B6B',
        unrequited: '#9B59B6',
        toxic: '#E74C3C',
        secret: '#3498DB',
        fan: '#2ECC71',
        contract: '#95A5A6',
      };

      const color = colors[rel.relationType] || '#999999';
      const fromId = rel.from.replace(/[\/\\.-]/g, '_');
      const toId = rel.to.replace(/[\/\\.-]/g, '_');
      const style = rel.strength > 0.7 ? ' style="bold,stroke-width:3"' : '';

      output += `  ${fromId} -->|${style}${color}|${rel.description}|${toId}\n`;
    }

    return output;
  }

  /**
   * Export as narrative text
   */
  exportNarrative(analysis: AnalysisResult): string {
    let output = `# ${analysis.projectName} - Code Theater\n\n`;
    output += `## 📋 Cast List (${analysis.characters.length} characters)\n\n`;

    // Group by personality
    const grouped = new Map<string, CharacterPersona[]>();
    for (const char of analysis.characters) {
      if (!grouped.has(char.personality)) {
        grouped.set(char.personality, []);
      }
      grouped.get(char.personality)!.push(char);
    }

    const personalityNames: Record<string, string> = {
      heroic: '🔥 Heroic Protagonist',
      reliable: '🛡️ Reliable Pillar',
      helpful: '💚 Silent Helper',
      quirky: '🎪 Quirky Character',
      mysterious: '🌙 Mysterious Figure',
      fragile: '🌸 Fragile Soul',
      busy: '⚡ Busy Bee',
      lonely: '🌑 Lonely Wanderer',
    };

    for (const [personality, chars] of grouped) {
      output += `### ${personalityNames[personality] || personality}\n`;
      for (const char of chars) {
        const healthStatus = char.health === 'excellent' || char.health === 'good' ? '' : ` [${char.health === 'fair' ? '⚠️ Fair' : char.health === 'poor' ? '🟠 Poor' : '🔴 Critical'}]`;
        output += `- **${char.name}**${healthStatus}: ${char.traits.join(', ')} (${char.stats.linesOfCode} LOC)\n`;
      }
      output += '\n';
    }

    output += `## 🕸️ Social Network (${analysis.relations.length} relationships)\n\n`;

    // Show interesting relationships
    const interestingRelations = analysis.relations.filter(r =>
      r.relationType === 'toxic' || r.relationType === 'best_friend'
    );

    if (interestingRelations.length > 0) {
      output += '### 💕 Notable Relationships\n';
      for (const rel of interestingRelations) {
        output += `- ${rel.description}\n`;
      }
      output += '\n';
    }

    output += `## 🏥 Project Health: ${analysis.summary.healthScore}%\n`;
    output += `## 🎭 Main Character: ${analysis.summary.mainCharacter}\n`;

    // Add characters needing attention
    const unhealthyCharacters = analysis.characters.filter(c => c.health !== 'excellent' && c.health !== 'good');
    if (unhealthyCharacters.length > 0) {
      output += '\n### 🚑 Needs Attention:\n';
      for (const char of unhealthyCharacters) {
        const status = char.health === 'fair' ? 'Fair' : char.health === 'poor' ? 'Poor' : 'Critical';
        output += `- ${char.name}: ${status}\n`;
      }
    }

    return output;
  }
}

// Re-export all types
export * from './types.js';
