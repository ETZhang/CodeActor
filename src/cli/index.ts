#!/usr/bin/env node

import express from 'express';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { CodeAnalyzer } from '../analyzer/index.js';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * CodeActor CLI
 *
 * Usage:
 *   code-actor [path]          # Analyze specified path and start Web server
 *   code-actor --export [path] # Export analysis result as text
 *   code-actor --help          # Show help
 */

interface CliOptions {
  export?: boolean;
  help?: boolean;
  port?: number;
  format?: 'json' | 'mermaid' | 'narrative';
}

async function main() {
  const args = process.argv.slice(2);
  const options = parseOptions(args);
  const projectPath = getProjectPath(args);

  if (options.help) {
    showHelp();
    return;
  }

  console.log('🎭 CodeActor - Codebase Personification Visualization Tool\n');

  // Analyze project
  console.log(`📂 Analyzing project: ${projectPath}`);
  const analyzer = new CodeAnalyzer();

  try {
    const result = analyzer.analyze(projectPath);

    console.log(`✅ Analysis complete!`);
    console.log(`   - Characters: ${result.summary.totalModules}`);
    console.log(`   - Relationships: ${result.summary.totalRelations}`);
    console.log(`   - Health Score: ${result.summary.healthScore}%\n`);

    if (options.export) {
      // Export mode
      exportResult(result, options.format || 'narrative');
    } else {
      // Start Web server
      const port = options.port || 5173;
      startServer(result, port);
    }
  } catch (error) {
    console.error(`❌ Analysis failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

/**
 * Parse command line options
 */
function parseOptions(args: string[]): CliOptions {
  const options: CliOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--export' || arg === '-e') {
      options.export = true;
    } else if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--port' || arg === '-p') {
      options.port = parseInt(args[++i]) || undefined;
    } else if (arg === '--format' || arg === '-f') {
      options.format = args[++i] as any;
    }
  }

  return options;
}

/**
 * Get project path
 */
function getProjectPath(args: string[]): string {
  // Find first non-option parameter
  for (const arg of args) {
    if (!arg.startsWith('-')) {
      return arg;
    }
  }
  return '.';
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
CodeActor - Codebase Personification Visualization Tool

Usage:
  code-actor [path]          Analyze specified path and start Web server
  code-actor --export [path] Export analysis result as text
  code-actor --help          Show this help message

Options:
  -e, --export              Export result only, do not start server
  -f, --format <format>     Export format: json, mermaid, narrative (default: narrative)
  -p, --port <port>         Web server port (default: 5173)
  -h, --help                Show help message

Examples:
  code-actor                     # Analyze current directory
  code-actor ./src               # Analyze specified directory
  code-actor --export ./project  # Export analysis result
  code-actor -f mermaid .        # Export as Mermaid diagram

About:
  CodeActor transforms codebases into cute 3D cartoon character theaters,
  making code understanding more lively and interesting.

  GitHub: https://github.com/yourusername/code-actor
`);
}

/**
 * Export result
 */
function exportResult(result: any, format: string) {
  const analyzer = new CodeAnalyzer();

  switch (format) {
    case 'json':
      console.log(analyzer.exportJSON(result));
      break;
    case 'mermaid':
      console.log(analyzer.exportMermaid(result));
      break;
    case 'narrative':
    default:
      console.log(analyzer.exportNarrative(result));
      break;
  }
}

/**
 * Start Web server
 */
function startServer(analysisResult: any, port: number) {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  // Static file service
  const distPath = join(__dirname, '../../');
  app.use(express.static(distPath));
  app.use(express.json());

  // API endpoints
  app.get('/api/result', (_req, res) => {
    res.json(analysisResult);
  });

  // WebSocket handling
  wss.on('connection', (ws) => {
    console.log('✅ Client connected');

    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'analyze') {
          // Return cached analysis result
          ws.send(JSON.stringify({
            type: 'analysis-result',
            result: analysisResult,
          }));
        }
      } catch (error) {
        ws.send(JSON.stringify({
          type: 'error',
          message: error instanceof Error ? error.message : String(error),
        }));
      }
    });

    ws.on('close', () => {
      console.log('❌ Client disconnected');
    });
  });

  // Start server
  server.listen(port, () => {
    console.log(`\n🌐 Server started:`);
    console.log(`   http://localhost:${port}\n`);
    console.log(`Press Ctrl+C to stop server\n`);
  });
}

// Run
main().catch(console.error);
