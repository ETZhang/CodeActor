import fs from 'node:fs';
import path from 'node:path';
import { CodeModule, FunctionInfo, ClassInfo } from './types.js';

/**
 * Code Parser - Supports multiple programming languages
 */
export class CodeParser {
  /**
   * Parse entire project directory
   */
  parseProject(projectPath: string): CodeModule[] {
    const modules: CodeModule[] = [];
    const files = this.getAllCodeFiles(projectPath);

    for (const file of files) {
      try {
        const module = this.parseFile(file, projectPath);
        if (module) {
          modules.push(module);
        }
      } catch (error) {
        console.error(`Failed to parse file: ${file}`, error);
      }
    }

    return modules;
  }

  /**
   * Get all code files in project
   */
  private getAllCodeFiles(dir: string, baseDir?: string): string[] {
    const files: string[] = [];
    const basePath = baseDir || dir;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      // Filter out node_modules, dist, and other directories
      const ignoreDirs = ['node_modules', 'dist', 'build', '.git', 'coverage', 'target', '__pycache__', '.venv', 'venv'];

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
          if (!ignoreDirs.includes(entry.name)) {
            files.push(...this.getAllCodeFiles(fullPath, basePath));
          }
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          const codeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.java', '.go', '.rs', '.cs', '.php'];

          if (codeExtensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Ignore directories without permission
    }

    return files;
  }

  /**
   * Parse single file
   */
  private parseFile(filePath: string, basePath: string): CodeModule | null {
    const ext = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(basePath, filePath);
    const language = this.detectLanguage(ext);

    if (!content.trim()) {
      return null;
    }

    const module: CodeModule = {
      id: this.generateModuleId(relativePath),
      path: relativePath,
      type: this.detectModuleType(relativePath),
      language,
      imports: this.extractImports(content, language),
      exports: this.extractExports(content, language),
      functions: this.extractFunctions(content, language),
      classes: this.extractClasses(content, language),
      metadata: {
        lines: content.split('\n').length,
        hasErrors: false,
        complexity: this.calculateComplexity(content),
      },
    };

    return module;
  }

  /**
   * Generate unique module ID
   */
  private generateModuleId(path: string): string {
    return path.replace(/[\/\\]/g, '.').replace(/\.(ts|js|py|java|go|rs|tsx|jsx|cs|php)$/, '');
  }

  /**
   * Detect programming language
   */
  private detectLanguage(ext: string): string {
    const langMap: Record<string, string> = {
      '.ts': 'typescript',
      '.tsx': 'typescript',
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.py': 'python',
      '.java': 'java',
      '.go': 'go',
      '.rs': 'rust',
      '.cs': 'csharp',
      '.php': 'php',
    };

    return langMap[ext] || 'unknown';
  }

  /**
   * Detect module type
   */
  private detectModuleType(path: string): string {
    const lowerPath = path.toLowerCase();

    if (lowerPath.includes('controller') || lowerPath.includes('handler') || lowerPath.includes('router')) {
      return 'controller';
    }
    if (lowerPath.includes('service') || lowerPath.includes('manager')) {
      return 'service';
    }
    if (lowerPath.includes('model') || lowerPath.includes('schema') || lowerPath.includes('entity')) {
      return 'model';
    }
    if (lowerPath.includes('repository') || lowerPath.includes('dao')) {
      return 'repository';
    }
    if (lowerPath.includes('util') || lowerPath.includes('helper') || lowerPath.includes('common')) {
      return 'utility';
    }
    if (lowerPath.includes('config') || lowerPath.includes('constant')) {
      return 'config';
    }
    if (lowerPath.includes('middleware') || lowerPath.includes('interceptor') || lowerPath.includes('guard')) {
      return 'middleware';
    }
    if (lowerPath.includes('test') || lowerPath.includes('spec')) {
      return 'test';
    }

    return 'module';
  }

  /**
   * Extract import statements
   */
  private extractImports(content: string, language: string): string[] {
    const imports: string[] = [];

    switch (language) {
      case 'typescript':
      case 'javascript':
        // ES6 imports
        const es6ImportRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
        let match;
        while ((match = es6ImportRegex.exec(content)) !== null) {
          if (!match[1].startsWith('.')) continue; // Keep only relative imports
          imports.push(match[1]);
        }
        // CommonJS
        const cjsImportRegex = /require\(['"]([^'"]+)['"]\)/g;
        while ((match = cjsImportRegex.exec(content)) !== null) {
          if (!match[1].startsWith('.')) continue;
          imports.push(match[1]);
        }
        break;

      case 'python':
        const pyImportRegex = /from\s+(\S+)\s+import|^import\s+(\S+)/gm;
        while ((match = pyImportRegex.exec(content)) !== null) {
          const imp = match[1] || match[2];
          if (imp && !imp.startsWith('.')) {
            // Python relative imports start with .
          } else if (imp) {
            imports.push(imp.replace(/\./g, '/'));
          }
        }
        break;

      case 'java':
        const javaImportRegex = /import\s+([^;]+);/g;
        while ((match = javaImportRegex.exec(content)) !== null) {
          imports.push(match[1].replace(/\./g, '/'));
        }
        break;
    }

    return [...new Set(imports)]; // Remove duplicates
  }

  /**
   * Extract exports
   */
  private extractExports(content: string, language: string): string[] {
    const exports: string[] = [];

    if (language === 'typescript' || language === 'javascript') {
      const exportRegex = /export\s+(?:default\s+)?(?:class|function|const|let|var)\s+(\w+)/g;
      let match;
      while ((match = exportRegex.exec(content)) !== null) {
        exports.push(match[1]);
      }

      // export { xxx }
      const namedExportRegex = /export\s+\{([^}]+)\}/g;
      while ((match = namedExportRegex.exec(content)) !== null) {
        const names = match[1].split(',').map(s => s.trim().split(' ')[0]);
        exports.push(...names);
      }
    }

    return exports;
  }

  /**
   * Extract functions
   */
  private extractFunctions(content: string, language: string): FunctionInfo[] {
    const functions: FunctionInfo[] = [];

    switch (language) {
      case 'typescript':
      case 'javascript':
        // function name(...)
        const funcRegex = /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)/g;
        let match;
        while ((match = funcRegex.exec(content)) !== null) {
          functions.push({
            name: match[1],
            params: match[2] ? match[2].split(',').map(p => p.trim()) : [],
            async: content.substring(match.index - 20, match.index).includes('async'),
            lines: this.estimateFunctionLines(content, match.index),
          });
        }

        // Arrow function: const name = (...) => { or const name: Type = (...) => {
        const arrowFuncRegex = /(?:const|let|var)\s+(\w+)\s*(?::\s*[^=]+)?\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>/g;
        while ((match = arrowFuncRegex.exec(content)) !== null) {
          functions.push({
            name: match[1],
            params: match[2] ? match[2].split(',').map(p => p.trim()) : [],
            async: content.substring(match.index - 10, match.index + 50).includes('async'),
            lines: this.estimateFunctionLines(content, match.index),
          });
        }

        // Class methods
        const methodRegex = /(?:async\s+)?(\w+)\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\s*\{/g;
        let methodMatch;
        const classRegex = /class\s+\w+/g;
        let classMatch;
        let inClass = false;

        // Simple check if in class
        while ((classMatch = classRegex.exec(content)) !== null) {
          inClass = true;
        }

        if (inClass) {
          // Simplified handling, actual implementation needs more precise parsing
        }

        break;

      case 'python':
        const pyFuncRegex = /def\s+(\w+)\s*\(([^)]*)\)/g;
        while ((match = pyFuncRegex.exec(content)) !== null) {
          functions.push({
            name: match[1],
            params: match[2] ? match[2].split(',').map(p => p.trim()) : [],
            async: match[1].startsWith('async_'),
            lines: this.estimateFunctionLines(content, match.index),
          });
        }
        break;
    }

    return functions;
  }

  /**
   * Extract classes
   */
  private extractClasses(content: string, language: string): ClassInfo[] {
    const classes: ClassInfo[] = [];

    if (language === 'typescript' || language === 'javascript') {
      const classRegex = /class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?/g;
      let match;

      while ((match = classRegex.exec(content)) !== null) {
        const methods: FunctionInfo[] = [];

        // Simple extraction of methods in class
        const classContent = content.slice(match.index);
        const methodRegex = /(\w+)\s*\(([^)]*)\)\s*(?::\s*[^{]+)?\s*\{/g;
        let methodMatch;
        let braceCount = 0;
        let classEnd = 0;

        // Find class end position
        for (let i = classContent.indexOf('{'); i < classContent.length; i++) {
          if (classContent[i] === '{') braceCount++;
          if (classContent[i] === '}') braceCount--;
          if (braceCount === 0) {
            classEnd = i;
            break;
          }
        }

        const classBody = classContent.slice(0, classEnd);

        while ((methodMatch = methodRegex.exec(classBody)) !== null) {
          if (methodMatch[1] !== 'constructor' && methodMatch[1] !== 'if' && methodMatch[1] !== 'for' && methodMatch[1] !== 'while') {
            methods.push({
              name: methodMatch[1],
              params: methodMatch[2] ? methodMatch[2].split(',').map(p => p.trim()) : [],
              async: false,
              lines: 5,
            });
          }
        }

        classes.push({
          name: match[1],
          extends: match[2],
          implements: match[3] ? match[3].split(',').map(s => s.trim()) : [],
          methods,
        });
      }
    }

    if (language === 'python') {
      const pyClassRegex = /class\s+(\w+)(?:\(([^)]*)\))?:/g;
      let match;

      while ((match = pyClassRegex.exec(content)) !== null) {
        classes.push({
          name: match[1],
          implements: match[2] ? match[2].split(',').map(s => s.trim()) : [],
          methods: [],
        });
      }
    }

    return classes;
  }

  /**
   * Estimate function lines (simplified version)
   */
  private estimateFunctionLines(content: string, startIndex: number): number {
    const afterFunc = content.substring(startIndex);
    const firstBrace = afterFunc.indexOf('{');
    if (firstBrace === -1) return 5;

    let braceCount = 0;
    let lines = 0;

    for (let i = firstBrace; i < afterFunc.length && i < firstBrace + 1000; i++) {
      if (afterFunc[i] === '{') braceCount++;
      if (afterFunc[i] === '}') braceCount--;
      if (afterFunc[i] === '\n') lines++;
      if (braceCount === 0) break;
    }

    return Math.max(1, lines);
  }

  /**
   * Calculate complexity (simplified cyclomatic complexity)
   */
  private calculateComplexity(content: string): number {
    // Count control flow keywords
    const keywords = /\b(if|else|for|while|switch|case|catch|try|throw|\?|\|\||&&)\b/g;
    const matches = content.match(keywords);
    const baseComplexity = 1;
    const complexity = baseComplexity + (matches ? matches.length : 0);

    // Normalize to 1-10
    return Math.min(10, Math.max(1, Math.round(complexity / 10)));
  }
}
