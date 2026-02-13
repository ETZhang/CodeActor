/**
 * Code Anthropomorphization Visualization - Core Type Definitions
 */

// Character personality types
export enum PersonalityType {
  HEROIC = 'heroic',        // Heroic Protagonist (Main/AppEntry)
  RELIABLE = 'reliable',     // Reliable Steadfast (Database/Store)
  HELPFUL = 'helpful',       // Helpful Assistant (Utility/Common)
  QUIRKY = 'quirky',         // Quirky Character (Middleware)
  MYSTERIOUS = 'mysterious', // Mysterious Figure (Config/Constants)
  FRAGILE = 'fragile',       // Fragile Soul (Bug-prone modules)
  BUSY = 'busy',             // Busy Bee (High-frequency modules)
  LONELY = 'lonely',         // Lonely Wanderer (Isolated modules)
}

// Social relationship types
export enum SocialRelationType {
  BEST_FRIEND = 'best_friend',       // Best Friends (Strong coupling)
  UNREQUITED_LOVE = 'unrequited',    // Unrequited Love (One-way dependency)
  TOXIC_RELATIONSHIP = 'toxic',      // Toxic Relationship (Circular dependency)
  SECRET_ADMIRER = 'secret',         // Secret Admirer (Async communication)
  FAN_FOLLOWING = 'fan',             // Fan Following (Weak dependency)
  CONTRACT = 'contract',             // Contract Relationship (Interface dependency)
}

// Character persona
export interface CharacterPersona {
  name: string;                   // Character name
  originalFile: string;           // Original file path
  personality: PersonalityType;    // Personality type
  traits: string[];                // Personality traits
  role: string;                    // Team role
  color: string;                   // Representative color
  icon: string;                    // Icon type (for 3D generation)
  health: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';  // Health level
  stats: {
    linesOfCode: number;           // Lines of code
    complexity: number;             // Complexity 1-10
    callCount: number;             // Number of calls
    bugRisk: number;               // Bug risk 1-10
  };
}

// Dependency relation
export interface DependencyRelation {
  from: string;                    // Source module
  to: string;                      // Target module
  relationType: SocialRelationType; // Relationship type
  strength: number;                // Relationship strength 0-1
  description: string;              // Socialized description
}

// Code module
export interface CodeModule {
  id: string;                      // Module unique identifier
  path: string;                    // File path
  type: string;                    // Module type (controller/model/util, etc.)
  language: string;                // Programming language
  imports: string[];               // Imported modules
  exports: string[];                // Exported content
  functions: FunctionInfo[];       // Function list
  classes: ClassInfo[];            // Class list
  metadata: {
    lines: number;                 // Lines of code
    hasErrors: boolean;            // Whether there are syntax errors
    complexity: number;            // Cyclomatic complexity
  };
}

// Function info
export interface FunctionInfo {
  name: string;
  params: string[];
  async: boolean;
  lines: number;
}

// Class info
export interface ClassInfo {
  name: string;
  extends?: string;
  implements: string[];
  methods: FunctionInfo[];
}

// Analysis result
export interface AnalysisResult {
  projectName: string;
  modules: CodeModule[];
  characters: CharacterPersona[];
  relations: DependencyRelation[];
  summary: {
    totalModules: number;
    totalRelations: number;
    healthScore: number;          // Project health score 0-100
    mainCharacter: string;        // Main character module
  };
}
