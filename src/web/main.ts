import { CodeAnalyzer } from '../analyzer/index.js';
import { SceneManager } from '../visualizer/index.js';

/**
 * CodeActor Web Entry
 *
 * This is a standalone frontend application that can:
 * 1. Analyze codebases
 * 2. Generate 3D visualizations
 * 3. Provide interactive interface
 */

// Global instances
let sceneManager: SceneManager | null = null;
let codeAnalyzer: CodeAnalyzer | null = null;

// WebSocket connection - for communication with backend
let ws: WebSocket | null = null;

/**
 * Initialize application
 */
async function init() {
  console.log('🎭 CodeActor initializing...');

  // Initialize scene manager
  sceneManager = new SceneManager();
  codeAnalyzer = new CodeAnalyzer();

  // Mount to DOM
  const container = document.getElementById('canvas-container');
  if (!container) {
    console.error('Canvas-container element not found');
    return;
  }

  sceneManager.mount(container);

  // Setup UI events
  setupUI();

  // Try to connect to WebSocket server
  connectWebSocket();

  console.log('✅ CodeActor initialization complete');
}

/**
 * Setup UI events
 */
function setupUI() {
  // Analyze button
  const analyzeBtn = document.getElementById('analyze-btn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', handleAnalyze);
  }

  // Path input box
  const pathInput = document.getElementById('project-path') as HTMLInputElement;
  if (pathInput) {
    // Set default path to current working directory
    const urlParams = new URLSearchParams(window.location.search);
    pathInput.value = urlParams.get('path') || '.';
  }

  // Export buttons
  const exportJsonBtn = document.getElementById('export-json-btn');
  const exportMermaidBtn = document.getElementById('export-mermaid-btn');
  const exportNarrativeBtn = document.getElementById('export-narrative-btn');

  if (exportJsonBtn) exportJsonBtn.addEventListener('click', () => exportResult('json'));
  if (exportMermaidBtn) exportMermaidBtn.addEventListener('click', () => exportResult('mermaid'));
  if (exportNarrativeBtn) exportNarrativeBtn.addEventListener('click', () => exportResult('narrative'));

  // Help button
  const helpBtn = document.getElementById('help-btn');
  if (helpBtn) {
    helpBtn.addEventListener('click', showHelp);
  }
}

/**
 * Handle analysis request
 */
async function handleAnalyze() {
  const pathInput = document.getElementById('project-path') as HTMLInputElement;
  const projectPath = pathInput?.value || '.';

  console.log(`📂 Analyzing project: ${projectPath}`);

  // Show loading state
  showLoading(true);

  try {
    let analysisResult;

    // Try to get analysis result via WebSocket
    if (ws && ws.readyState === WebSocket.OPEN) {
      analysisResult = await analyzeViaWebSocket(projectPath);
    } else {
      // If no WebSocket, use mock data or prompt user
      console.warn('WebSocket not connected, using mock data');
      analysisResult = createMockAnalysis();
    }

    // Load into 3D scene
    if (sceneManager) {
      sceneManager.loadAnalysis(analysisResult);
    }

    // Update UI
    updateSummary(analysisResult);

    console.log('✅ Analysis complete');
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    showError(`Analysis failed: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    showLoading(false);
  }
}

/**
 * Analyze via WebSocket
 */
function analyzeViaWebSocket(projectPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    if (!ws) {
      reject(new Error('WebSocket not connected'));
      return;
    }

    ws.send(JSON.stringify({
      type: 'analyze',
      path: projectPath,
    }));

    // Set up one-time listener
    const handler = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'analysis-result') {
          ws?.removeEventListener('message', handler);
          resolve(data.result);
        } else if (data.type === 'error') {
          ws?.removeEventListener('message', handler);
          reject(new Error(data.message));
        }
      } catch (e) {
        ws?.removeEventListener('message', handler);
        reject(e);
      }
    };

    ws.addEventListener('message', handler);

    // Timeout handling
    setTimeout(() => {
      ws?.removeEventListener('message', handler);
      reject(new Error('Analysis timeout'));
    }, 60000);
  });
}

/**
 * Create mock analysis result (for demonstration)
 */
function createMockAnalysis() {
  return {
    projectName: 'Demo Project',
    characters: [
      {
        name: 'HeroMain',
        originalFile: 'src/index.ts',
        personality: 'heroic',
        traits: ['Enthusiastic but crash-prone', 'Always rushes to the front'],
        role: '🎭 Protagonist',
        color: '#FF6B6B',
        health: 'healthy',
        stats: { linesOfCode: 150, complexity: 3, callCount: 5, bugRisk: 2 },
      },
      {
        name: 'HelperUtils',
        originalFile: 'src/utils/helpers.ts',
        personality: 'helpful',
        traits: ['Low-key invisible helper', 'Always on call'],
        role: '💚 Healer',
        color: '#95E1D3',
        health: 'healthy',
        stats: { linesOfCode: 300, complexity: 4, callCount: 15, bugRisk: 3 },
      },
      {
        name: 'ElderDatabase',
        originalFile: 'src/db/connection.ts',
        personality: 'reliable',
        traits: ['Steady and reliable', 'Great memory but slow movement'],
        role: '📚 Administrator',
        color: '#4ECDC4',
        health: 'sick',
        stats: { linesOfCode: 200, complexity: 6, callCount: 8, bugRisk: 6 },
      },
    ],
    relations: [
      {
        from: 'src/index.ts',
        to: 'src/utils/helpers.ts',
        relationType: 'best_friend',
        strength: 0.9,
        description: 'HeroMain and HelperUtils are inseparable Best Friends',
      },
      {
        from: 'src/index.ts',
        to: 'src/db/connection.ts',
        relationType: 'unrequited',
        strength: 0.7,
        description: 'HeroMain has Unrequited Love for ElderDatabase',
      },
    ],
    summary: {
      totalModules: 3,
      totalRelations: 2,
      healthScore: 75,
      mainCharacter: 'HeroMain',
    },
  };
}

/**
 * Connect to WebSocket server
 */
function connectWebSocket() {
  const wsUrl = `ws://${window.location.hostname}:8765`;
  console.log(`🔌 Connecting to WebSocket: ${wsUrl}`);

  try {
    ws = new WebSocket(wsUrl);

    ws.addEventListener('open', () => {
      console.log('✅ WebSocket connected');
      updateConnectionStatus(true);
    });

    ws.addEventListener('close', () => {
      console.log('❌ WebSocket disconnected');
      updateConnectionStatus(false);
      // Reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    });

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      updateConnectionStatus(false);
    });
  } catch (error) {
    console.error('Unable to connect WebSocket:', error);
    updateConnectionStatus(false);
  }
}

/**
 * Update connection status display
 */
function updateConnectionStatus(connected: boolean) {
  const statusEl = document.getElementById('connection-status');
  if (statusEl) {
    statusEl.className = connected ? 'status-connected' : 'status-disconnected';
    statusEl.textContent = connected ? '● Connected' : '○ Disconnected';
  }
}

/**
 * Update summary information
 */
function updateSummary(result: any) {
  const summaryEl = document.getElementById('summary-content');
  if (!summaryEl) return;

  const healthClass = result.summary.healthScore > 80 ? 'good' : result.summary.healthScore > 50 ? 'warning' : 'danger';

  summaryEl.innerHTML = `
    <div class="summary-item">
      <span class="summary-label">Project Name</span>
      <span class="summary-value">${result.projectName}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Characters</span>
      <span class="summary-value">${result.summary.totalModules}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Relationships</span>
      <span class="summary-value">${result.summary.totalRelations}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Health Score</span>
      <span class="summary-value health-${healthClass}">${result.summary.healthScore}%</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">Team Core</span>
      <span class="summary-value">${result.summary.mainCharacter}</span>
    </div>
  `;
}

/**
 * Export result
 */
function exportResult(format: 'json' | 'mermaid' | 'narrative') {
  // Need to save current analysis result here
  console.log(`Export format: ${format}`);

  // In actual implementation, this would call CodeAnalyzer's export methods
  alert(`Export ${format} format - Feature under development`);
}

/**
 * Show help
 */
function showHelp() {
  const helpHtml = `
    <div style="padding: 20px;">
      <h2>🎭 CodeActor Usage Help</h2>

      <h3>What is CodeActor?</h3>
      <p>CodeActor is a codebase personification visualization tool that turns your code into cute 3D cartoon character theaters.</p>

      <h3>Character Types</h3>
      <ul>
        <li><strong>Heroic Protagonist</strong>: Entry files like main/app/index</li>
        <li><strong>Reliable Pillar</strong>: Data layer like database/model/store</li>
        <li><strong>Silent Helper</strong>: Utility classes like util/helper/common</li>
        <li><strong>Quirky Character</strong>: Middleware like middleware/interceptor</li>
        <li><strong>Mysterious Figure</strong>: Configuration files like config/constant</li>
      </ul>

      <h3>Relationship Types</h3>
      <ul>
        <li><strong>Best Friends</strong>: Strong coupling dependency</li>
        <li><strong>Unrequited Love</strong>: Unidirectional dependency</li>
        <li><strong>Toxic Relationship</strong>: Circular dependency</li>
        <li><strong>Secret Admirer</strong>: Asynchronous communication</li>
      </ul>

      <h3>Health Status</h3>
      <ul>
        <li><strong>Healthy</strong>: Low bug risk</li>
        <li><strong>Sick 🤒</strong>: Medium bug risk</li>
        <li><strong>Critical 🚨</strong>: High bug risk, needs attention</li>
      </ul>

      <h3>Operation Instructions</h3>
      <ul>
        <li><strong>Drag</strong>: Left-click drag to rotate view</li>
        <li><strong>Zoom</strong>: Scroll wheel to zoom</li>
        <li><strong>Click character</strong>: View detailed information</li>
        <li><strong>Drag character</strong>: Reorganize layout</li>
      </ul>
    </div>
  `;

  const modal = document.createElement('div');
  modal.className = 'code-actor-modal';
  modal.innerHTML = `
    <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
    <div class="modal-content">
      ${helpHtml}
      <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px; padding: 10px 20px;">Close</button>
    </div>
  `;
  document.body.appendChild(modal);
}

/**
 * Show loading state
 */
function showLoading(show: boolean) {
  const overlay = document.getElementById('loading-overlay');
  if (overlay) {
    overlay.style.display = show ? 'flex' : 'none';
  }

  const analyzeBtn = document.getElementById('analyze-btn') as HTMLButtonElement;
  if (analyzeBtn) {
    analyzeBtn.disabled = show;
    analyzeBtn.textContent = show ? 'Analyzing...' : 'Analyze Code';
  }
}

/**
 * Show error
 */
function showError(message: string) {
  const errorEl = document.createElement('div');
  errorEl.className = 'code-actor-error';
  errorEl.textContent = message;
  document.body.appendChild(errorEl);

  setTimeout(() => errorEl.remove(), 5000);
}

// Initialize after page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for external use
(window as any).CodeActor = {
  init,
  analyze: handleAnalyze,
};
