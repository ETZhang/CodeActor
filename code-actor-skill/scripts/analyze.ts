#!/usr/bin/env node
/**
 * CodeActor Analysis Script
 *
 * Usage: node scripts/analyze.ts <project-path>
 *
 * Features:
 * - Scan project code, generate anthropomorphized characters and social relationship networks
 * - Export complete analysis report (characters, relationships, health score, etc.)
 *
 * Supported Options:
 *   --format, -f: Specify export format (json|mermaid|narrative|report)
 *
 */

import CodeAnalyzer from '../dist/analyzer/index.js';

// Get project path from command line arguments
const projectPath = process.argv[2] || '.';

console.log('🎭 CodeActor Analysis running...\n');

try {
  const analyzer = new CodeAnalyzer();
  const result = analyzer.analyze(projectPath);

  console.log('✅ Analysis complete!\n');
  console.log(`📊 Project: ${result.projectName}`);
  console.log(`👥 Characters: ${result.summary.totalModules}`);
  console.log(`🕸️ Relations: ${result.summary.totalRelations}`);
  console.log(`💚 Health Score: ${result.summary.healthScore}%`);
  console.log(`🌟 Main Character: ${result.summary.mainCharacter}\n`);

  // Display health warnings
  const healthWarnings = result.characters
    .filter((c: any) => c.health !== 'excellent' && c.health !== 'good')
    .map((c: any) => {
      const level = c.health === 'fair' ? '⚠️ Fair' : c.health === 'poor' ? '🟠 Poor' : '🔴 Critical';
      const risk = c.stats.bugRisk;
      const complexity = c.stats.complexity;
      return `${level} ${c.name} (${c.originalFile})\n     Bug Risk: ${risk}/10, Complexity: ${complexity}/10`;
    });

  if (healthWarnings.length > 0) {
    console.log('🚑 Needs attention:\n');
    for (const warning of healthWarnings) {
      console.log(`  ${warning}`);
    }
    console.log('');
  }

  // Get format argument
  const formatArg = process.argv.find(arg => arg.startsWith('--format='));
  const format = formatArg ? formatArg.split('=')[1] : 'json';

  switch (format) {
    case 'json':
      console.log('\n📄 Export JSON format:\n');
      console.log(analyzer.exportJSON(result));
      break;

    case 'mermaid':
      console.log('\n📄 Export Mermaid chart:\n');
      console.log(analyzer.exportMermaid(result));
      break;

    case 'narrative':
      console.log('\n📜 Export Narrative text:\n');
      console.log(analyzer.exportNarrative(result));
      break;

    case 'report':
    case 'architecture':
      console.log('\n📊 Export Architecture Analysis Report:\n');
      console.log(analyzer.exportArchitectureReport(result));
      break;

    default:
      // Default export JSON
      console.log('\n📄 Export JSON format (default):\n');
      console.log(analyzer.exportJSON(result));
  }

} catch (error) {
  console.error(`❌ Analysis failed: ${error}`);
  process.exit(1);
}
