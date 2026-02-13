import { SocialRelationType, DependencyRelation, CharacterPersona, CodeModule } from './types.js';

/**
 * Relationship Analyzer - Converts code dependencies into social relationships
 */
export class RelationAnalyzer {
  /**
   * Generate social relationships between all characters
   */
  generateRelations(
    modules: CodeModule[],
    characters: CharacterPersona[]
  ): DependencyRelation[] {
    const relations: DependencyRelation[] = [];
    const processedPairs = new Set<string>();

    // Build module ID to character mapping
    const moduleToCharacter = new Map<string, CharacterPersona>();
    for (const char of characters) {
      moduleToCharacter.set(char.originalFile, char);
    }

    // Analyze import relationships for each module
    for (const module of modules) {
      for (const imp of module.imports) {
        const pairKey = `${module.id}->${imp}`;
        const reverseKey = `${imp}->${module.id}`;

        // Avoid duplicate processing
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);

        // Check for circular dependencies
        const hasReverse = modules.some(m =>
          m.id === imp && m.imports.includes(module.id)
        );

        if (hasReverse) {
          if (!processedPairs.has(reverseKey)) {
            relations.push({
              from: module.id,
              to: imp,
              relationType: SocialRelationType.TOXIC_RELATIONSHIP,
              strength: 0.9,
              description: this.generateDescription(SocialRelationType.TOXIC_RELATIONSHIP, module.id, imp),
            });
            processedPairs.add(reverseKey);
          }
        } else {
          // Unidirectional dependency
          const relation = this.analyzeSingleDependency(
            module,
            imp,
            moduleToCharacter
          );
          relations.push(relation);
        }
      }
    }

    return relations;
  }

  /**
   * Analyze unidirectional dependency relationship
   */
  private analyzeSingleDependency(
    fromModule: CodeModule,
    toModuleId: string,
    characters: Map<string, CharacterPersona>
  ): DependencyRelation {
    const fromChar = characters.get(fromModule.path);
    const relationType = this.determineRelationType(fromModule, toModuleId, characters);
    const strength = this.calculateStrength(fromModule, toModuleId);

    return {
      from: fromModule.id,
      to: toModuleId,
      relationType,
      strength,
      description: this.generateDescription(relationType, fromChar?.name || 'Unknown', toModuleId),
    };
  }

  /**
   * Determine relationship type
   */
  private determineRelationType(
    fromModule: CodeModule,
    toModuleId: string,
    characters: Map<string, CharacterPersona>
  ): SocialRelationType {
    const fromChar = characters.get(fromModule.path);
    const toChar = characters.get(toModuleId);

    // Check if async dependency (event listeners, pub-sub, etc.)
    if (this.isAsyncDependency(fromModule, toModuleId)) {
      return SocialRelationType.SECRET_ADMIRER;
    }

    // Check if interface dependency (contract relationship)
    if (this.isInterfaceDependency(fromModule, toModuleId)) {
      return SocialRelationType.CONTRACT;
    }

    // Determine based on personality type
    if (fromChar && toChar) {
      // Hero has strong dependency on everyone
      if (fromChar.personality === 'heroic') {
        return SocialRelationType.BEST_FRIEND;
      }

      // Utility classes being called are usually weak dependencies
      if (toChar.personality === 'helpful' || toChar.personality === 'busy') {
        return SocialRelationType.FAN_FOLLOWING;
      }
    }

    // Default to unidirectional dependency (unrequited love)
    return SocialRelationType.UNREQUITED_LOVE;
  }

  /**
   * Check if this is an async dependency
   */
  private isAsyncDependency(fromModule: CodeModule, toModuleId: string): boolean {
    const asyncPatterns = [
      /event/i,
      /emitter/i,
      /subscribe/i,
      /observe/i,
      /listener/i,
      /hook/i,
    ];

    for (const func of fromModule.functions) {
      if (func.async || asyncPatterns.some(p => p.test(func.name))) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if this is an interface dependency
   */
  private isInterfaceDependency(fromModule: CodeModule, toModuleId: string): boolean {
    const interfacePatterns = [/interface/i, /abstract/i, /protocol/i];

    return interfacePatterns.some(p => p.test(toModuleId));
  }

  /**
   * Calculate relationship strength
   */
  private calculateStrength(fromModule: CodeModule, toModuleId: string): number {
    // Calculate based on call frequency and type
    let strength = 0.5;

    // Used in functions
    const usedInFunctions = fromModule.functions.filter(f =>
      f.name.toLowerCase().includes(toModuleId.toLowerCase().split('/').pop() || '')
    ).length;

    strength += Math.min(0.5, usedInFunctions * 0.1);

    return Math.min(1, strength);
  }

  /**
   * Generate social description
   */
  private generateDescription(
    relationType: SocialRelationType,
    fromName: string,
    toName: string
  ): string {
    const toSimpleName = toName.split('/').pop() || toName;

    const descriptions: Record<SocialRelationType, string> = {
      [SocialRelationType.BEST_FRIEND]: `${fromName} and ${toSimpleName} are Best Friends`,
      [SocialRelationType.UNREQUITED_LOVE]: `${fromName} has Unrequited Love for ${toSimpleName}`,
      [SocialRelationType.TOXIC_RELATIONSHIP]: `${fromName} and ${toSimpleName} are in a Toxic Relationship`,
      [SocialRelationType.SECRET_ADMIRER]: `${fromName} sends Secret Admirer messages to ${toSimpleName}`,
      [SocialRelationType.FAN_FOLLOWING]: `${fromName} is a Fan Following of ${toSimpleName}`,
      [SocialRelationType.CONTRACT]: `${fromName} and ${toSimpleName} have a Contract Relationship`,
    };

    return descriptions[relationType];
  }
}
