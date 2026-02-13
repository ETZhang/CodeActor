import * as THREE from 'three';
import { CharacterPersona, DependencyRelation } from '../analyzer/types.js';

/**
 * Interaction Manager - Handle clicks, drags, hovers, and other interactions
 */
export class InteractionManager {
  private camera: THREE.Camera;
  private scene: THREE.Scene;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  private characters: Map<THREE.Group, CharacterPersona> = new Map();
  private relations: DependencyRelation[] = [];
  private characterMeshes: Set<THREE.Object3D> = new Set();
  private relationLines: THREE.Group[] = [];

  private hoveredCharacter: THREE.Group | null = null;
  private selectedCharacter: THREE.Group | null = null;
  private doubleClickCharacter: THREE.Group | null = null;

  private isDragging = false;
  private dragOffset = new THREE.Vector3();
  private dragPlane: THREE.Plane;

  // Double-click detection
  private lastClickTime = 0;
  private clickTimeout: number | null = null;

  // Callback functions
  private onCharacterClick?: (character: CharacterPersona) => void;
  private onCharacterHover?: (character: CharacterPersona | null) => void;
  private onCharacterDoubleClick?: (character: CharacterPersona) => void;

  // UI elements
  private tooltip: HTMLElement | null = null;
  private infoPanel: HTMLElement | null = null;

  constructor(camera: THREE.Camera, scene: THREE.Scene) {
    this.camera = camera;
    this.scene = scene;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    this.createTooltip();
    this.createInfoPanel();
  }

  /**
   * Create floating tooltip
   */
  private createTooltip(): void {
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'code-actor-tooltip';
    this.tooltip.style.cssText = `
      position: fixed;
      background: rgba(26, 26, 46, 0.95);
      border: 1px solid #444;
      border-radius: 8px;
      padding: 12px 16px;
      color: #fff;
      font-size: 14px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 1000;
      max-width: 300px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    `;
    document.body.appendChild(this.tooltip);
  }

  /**
   * Create info panel
   */
  private createInfoPanel(): void {
    this.infoPanel = document.createElement('div');
    this.infoPanel.className = 'code-actor-info-panel';
    this.infoPanel.style.cssText = `
      position: fixed;
      top: 180px;
      right: 20px;
      width: 320px;
      background: rgba(26, 26, 46, 0.95);
      border: 1px solid #444;
      border-radius: 12px;
      padding: 20px;
      color: #fff;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
      transform: translateX(50px);
      z-index: 999;
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(10px);
    `;
    document.body.appendChild(this.infoPanel);
  }

  /**
   * Add character to interaction manager
   */
  addCharacter(mesh: THREE.Group, character: CharacterPersona): void {
    this.characters.set(mesh, character);

    // Collect all child meshes for raycasting
    mesh.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.userData.parentGroup = mesh;
        this.characterMeshes.add(child);
      }
    });
  }

  /**
   * Set relationship data
   */
  setRelations(relations: DependencyRelation[]): void {
    this.relations = relations;
  }

  /**
   * Set relationship lines (for updates after dragging)
   */
  setRelationLines(lines: THREE.Group[]): void {
    this.relationLines = lines;
  }

  /**
   * Set click callback
   */
  setCharacterClickCallback(callback: (character: CharacterPersona) => void): void {
    this.onCharacterClick = callback;
  }

  /**
   * Set double-click callback
   */
  setCharacterDoubleClickCallback(callback: (character: CharacterPersona) => void): void {
    this.onCharacterDoubleClick = callback;
  }

  /**
   * Set hover callback
   */
  setCharacterHoverCallback(callback: (character: CharacterPersona | null) => void): void {
    this.onCharacterHover = callback;
  }

  /**
   * Setup event listeners
   */
  setupEvents(container: HTMLElement): void {
    container.addEventListener('mousemove', this.onMouseMove.bind(this));
    container.addEventListener('click', this.onClick.bind(this));
    container.addEventListener('dblclick', this.onDoubleClick.bind(this));
    container.addEventListener('mousedown', this.onMouseDown.bind(this));
    container.addEventListener('mouseup', this.onMouseUp.bind(this));
    container.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
  }

  /**
   * Handle mouse movement
   */
  private onMouseMove(event: MouseEvent): void {
    // Update mouse position
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Handle drag
    if (this.isDragging && this.selectedCharacter) {
      this.handleDrag(event);
      return;
    }

    // Raycasting
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.characterMeshes));

    if (intersects.length > 0) {
      const group = intersects[0].object.userData.parentGroup as THREE.Group;

      if (group && group !== this.hoveredCharacter) {
        this.onCharacterHoverEnter(group);
      }

      // Update tooltip position
      if (this.tooltip) {
        this.tooltip.style.left = event.clientX + 15 + 'px';
        this.tooltip.style.top = event.clientY + 15 + 'px';
      }
    } else {
      if (this.hoveredCharacter) {
        this.onCharacterHoverLeave();
      }
    }
  }

  /**
   * Character hover enter
   */
  private onCharacterHoverEnter(group: THREE.Group): void {
    this.hoveredCharacter = group;
    const character = this.characters.get(group);

    if (character && this.tooltip) {
      this.tooltip.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px; color: ${character.color};">
          ${character.name}
        </div>
        <div>${character.role}</div>
        <div style="margin-top: 8px; font-size: 12px; opacity: 0.8;">
          ${character.traits[0]}
        </div>
      `;
      this.tooltip.style.opacity = '1';
    }

    // Highlight effect
    this.highlightCharacter(group, true);

    // Trigger callback
    if (character && this.onCharacterHover) {
      this.onCharacterHover(character);
    }
  }

  /**
   * Character hover leave
   */
  private onCharacterHoverLeave(): void {
    if (this.hoveredCharacter) {
      this.highlightCharacter(this.hoveredCharacter, false);
    }
    this.hoveredCharacter = null;

    if (this.tooltip) {
      this.tooltip.style.opacity = '0';
    }

    if (this.onCharacterHover) {
      this.onCharacterHover(null);
    }
  }

  /**
   * Highlight character (hover effect only - no selection ring)
   */
  private highlightCharacter(group: THREE.Group, highlight: boolean): void {
    const character = group.userData.character;
    if (!character) return;

    // Update selection state
    if (highlight) {
      group.userData.isSelected = true;
    } else {
      group.userData.isSelected = false;
    }

    group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        if (Array.isArray(child.material)) {
          for (const mat of child.material) {
            if (mat instanceof THREE.MeshToonMaterial || mat instanceof THREE.MeshStandardMaterial) {
              mat.emissive = highlight ? new THREE.Color(0x333333) : new THREE.Color(0x000000);
              mat.emissiveIntensity = highlight ? 0.8 : 0;
            }
          }
        } else {
          if (child.material instanceof THREE.MeshToonMaterial || child.material instanceof THREE.MeshStandardMaterial) {
            child.material.emissive = highlight ? new THREE.Color(0x333333) : new THREE.Color(0x000000);
            child.material.emissiveIntensity = highlight ? 0.8 : 0;
          }
        }
      }
    });

    // DO NOT add selection ring on hover - only on double-click
    // Selection ring is only managed by onDoubleClick and clearAllSelections
  }

  /**
   * Add selection ring around character
   */
  private addSelectionRing(group: THREE.Group): void {
    // Remove existing ring
    this.removeSelectionRing(group);

    const ringGeo = new THREE.RingGeometry(1.0, 1.15, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x00FF00,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 0.05;
    ring.rotation.x = -Math.PI / 2;
    ring.userData.isSelectionRing = true;
    group.add(ring);
  }

  /**
   * Remove selection ring from Character
   */
  private removeSelectionRing(group: THREE.Group): void {
    group.traverse((child) => {
      if (child instanceof THREE.Mesh && child.userData?.isSelectionRing) {
        group.remove(child);
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    });
  }

  /**
   * Clear all selections
   */
  private clearAllSelections(): void {
    for (const [mesh] of this.characters) {
      this.removeSelectionRing(mesh);
      mesh.userData.isSelected = false;
    }
  }

  /**
   * Handle click
   */
  private onClick(event: MouseEvent): void {
    if (this.isDragging) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.characterMeshes));

    if (intersects.length > 0) {
      const group = intersects[0].object.userData.parentGroup as THREE.Group;
      const character = this.characters.get(group);

      if (character) {
        this.selectedCharacter = group;
        this.showInfoPanel(character);

        if (this.onCharacterClick) {
          this.onCharacterClick(character);
        }
      }
    } else {
      this.hideInfoPanel();
      this.selectedCharacter = null;
      this.clearAllSelections();
    }
  }

  /**
   * Handle double-click
   */
  private onDoubleClick(event: MouseEvent): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.characterMeshes));

    if (intersects.length > 0) {
      const group = intersects[0].object.userData.parentGroup as THREE.Group;

      if (group) {
        // Toggle selection on double-click
        if (this.selectedCharacter === group) {
          // Deselect
          this.removeSelectionRing(group);
          this.selectedCharacter = null;
          group.userData.isSelected = false;
          group.userData.isDraggable = false;
        } else {
          // Clear previous selection
          if (this.selectedCharacter) {
            this.removeSelectionRing(this.selectedCharacter);
            this.selectedCharacter.userData.isSelected = false;
            this.selectedCharacter.userData.isDraggable = false;
          }
          // Select new character
          this.selectedCharacter = group;
          this.addSelectionRing(group);
          group.userData.isSelected = true;
          group.userData.isDraggable = true;  // Ensure draggable
          const character = this.characters.get(group);
          if (character && this.onCharacterDoubleClick) {
            this.onCharacterDoubleClick(character);
          }
        }
      }
    } else {
      // Click on blank area to clear highlight
      this.clearAllSelections();
      this.clearHighlightNetwork();
    }
  }

  /**
   * Handle double-click - highlight relationship network
   */
  private handleDoubleClick(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.characterMeshes));

    if (intersects.length === 0) return;

    const group = intersects[0].object.userData.parentGroup as THREE.Group;
    const character = this.characters.get(group);

    if (!character) return;

    // If already double-clicked this character, clear highlight
    if (this.doubleClickCharacter === group) {
      this.clearHighlightNetwork();
      this.doubleClickCharacter = null;
      return;
    }

    this.doubleClickCharacter = group;

    // Highlight selected character's relationship network
    this.highlightNetwork(character.originalFile);

    // Trigger callback
    if (this.onCharacterDoubleClick) {
      this.onCharacterDoubleClick(character);
    }
  }

  /**
   * Highlight relationship network
   */
  private highlightNetwork(characterFile: string): void {
    // Find all related character files
    const relatedFiles = new Set<string>();
    const highlightedLines = new Set<THREE.Group>();

    for (const relation of this.relations) {
      if (relation.from === characterFile || relation.to === characterFile) {
        relatedFiles.add(relation.from);
        relatedFiles.add(relation.to);

        // Find corresponding relationship lines
        for (const line of this.relationLines) {
          if (line.userData.relation === relation) {
            highlightedLines.add(line);
          }
        }
      }
    }

    // Dim unrelated relationship lines
    for (const line of this.relationLines) {
      if (!highlightedLines.has(line)) {
        line.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.opacity = 0.1;
          }
        });
      }
    }

    // Highlight related relationship lines
    for (const line of highlightedLines) {
      line.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.opacity = 0.9;
        }
      });
    }

    // Make unrelated characters semi-transparent
    for (const [mesh, char] of this.characters) {
      if (!relatedFiles.has(char.originalFile)) {
        mesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              for (const mat of child.material) {
                if (mat instanceof THREE.MeshToonMaterial || mat instanceof THREE.MeshStandardMaterial) {
                  mat.transparent = true;
                  mat.opacity = 0.3;
                }
              }
            } else if (child.material instanceof THREE.MeshToonMaterial || child.material instanceof THREE.MeshStandardMaterial) {
              child.material.transparent = true;
              child.material.opacity = 0.3;
            }
          }
        });
      } else {
        // Restore related characters to normal
        mesh.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            if (Array.isArray(child.material)) {
              for (const mat of child.material) {
                if (mat instanceof THREE.MeshToonMaterial || mat instanceof THREE.MeshStandardMaterial) {
                  mat.transparent = mat.userData?.wasTransparent || false;
                  mat.opacity = mat.userData?.originalOpacity || 1;
                }
              }
            } else if (child.material instanceof THREE.MeshToonMaterial || child.material instanceof THREE.MeshStandardMaterial) {
              if (!child.material.userData) {
                child.material.userData = {
                  wasTransparent: child.material.transparent,
                  originalOpacity: child.material.opacity,
                };
              }
              child.material.transparent = false;
              child.material.opacity = 1;
            }
          }
        });
      }
    }
  }

  /**
   * Clear highlight
   */
  private clearHighlightNetwork(): void {
    this.doubleClickCharacter = null;

    // Restore all character transparency
    for (const [mesh] of this.characters) {
      mesh.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            for (const mat of child.material) {
              if (mat instanceof THREE.MeshToonMaterial || mat instanceof THREE.MeshStandardMaterial) {
                mat.transparent = mat.userData?.wasTransparent || false;
                mat.opacity = mat.userData?.originalOpacity || 1;
              }
            }
          } else if (child.material instanceof THREE.MeshToonMaterial || child.material instanceof THREE.MeshStandardMaterial) {
            const userData = child.material.userData || {};
            child.material.transparent = userData.wasTransparent || false;
            child.material.opacity = userData.originalOpacity || 1;
          }
        }
      });
    }

    // Restore all relationship line transparency
    for (const group of this.relationLines) {
      group.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          // Restore original opacity based on relation strength
          const relation = group.userData.relation;
          if (relation) {
            child.material.opacity = relation.strength * 0.8;
          }
        }
      });
    }
  }

  /**
   * Mouse down - start dragging
   */
  private onMouseDown(event: MouseEvent): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(Array.from(this.characterMeshes));

    if (intersects.length > 0) {
      const group = intersects[0].object.userData.parentGroup as THREE.Group;

      // Only allow dragging for selected and draggable characters
      if (group && group.userData.isDraggable) {
        this.isDragging = true;
        this.selectedCharacter = group;
        // Record drag offset
        const intersectionPoint = new THREE.Vector3();
        this.raycaster.ray.intersectPlane(this.dragPlane, intersectionPoint);
        this.dragOffset.copy(intersectionPoint).sub(group.position);
      }
    }
  }

  /**
   * Mouse up - end dragging
   */
  private onMouseUp(): void {
    this.isDragging = false;
  }

  /**
   * Handle dragging
   */
  private handleDrag(event: MouseEvent): void {
    if (!this.selectedCharacter) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersectionPoint = new THREE.Vector3();
    this.raycaster.ray.intersectPlane(this.dragPlane, intersectionPoint);

    const newPosition = intersectionPoint.sub(this.dragOffset);

    // Update character position
    this.selectedCharacter.position.copy(newPosition);

    // Update related relationship lines' positions
    this.updateRelationLines(this.selectedCharacter, newPosition);
  }

  /**
   * Update relationship line positions (when character is dragged)
   */
  private updateRelationLines(character: THREE.Group, newPosition: THREE.Vector3): void {
    const characterFile = character.userData.character?.originalFile;
    if (!characterFile) return;

    const headY = 1; // Height where line connects to character

    for (const group of this.relationLines) {
      const relation = group.userData.relation;
      if (!relation) continue;

      if (relation.from === characterFile || relation.to === characterFile) {
        const pipe = group.userData.pipe as THREE.Mesh;
        const arrow = group.userData.arrow as THREE.Mesh;
        const arrow1 = group.userData.arrow1 as THREE.Mesh;
        const arrow2 = group.userData.arrow2 as THREE.Mesh;
        const startPoint = group.userData.startPoint as THREE.Vector3;
        const endPoint = group.userData.endPoint as THREE.Vector3;
        const isBidirectional = group.userData.isBidirectional as boolean;

        // Update points
        if (relation.from === characterFile) {
          startPoint.set(newPosition.x, headY, newPosition.z);
        }

        if (relation.to === characterFile) {
          endPoint.set(newPosition.x, headY, newPosition.z);
        }

        // Recalculate direction and length
        const newDirection = new THREE.Vector3().subVectors(endPoint, startPoint);
        const length = newDirection.length();
        newDirection.normalize();

        // Update pipe
        if (pipe) {
          pipe.position.copy(startPoint).add(endPoint).multiplyScalar(0.5);
          pipe.scale.set(1, length / 2, 1); // Cylinder default height is 2, scale to match length
          pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), newDirection);
        }

        // Update arrows based on bidirectional status
        const arrowLength = 0.5;

        if (isBidirectional && arrow1 && arrow2) {
          // Update both arrows for bidirectional
          arrow1.position.copy(startPoint).add(newDirection.clone().multiplyScalar(arrowLength * 0.5));
          arrow1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), newDirection.clone().negate());

          arrow2.position.copy(endPoint).sub(newDirection.clone().multiplyScalar(arrowLength * 0.5));
          arrow2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), newDirection);
        } else if (arrow) {
          // Update single arrow for unidirectional
          arrow.position.copy(endPoint).sub(newDirection.clone().multiplyScalar(arrowLength * 0.5));
          arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), newDirection);
        }

        // Update direction for flow particles
        group.userData.direction = newDirection;

        // Update icons
        const midX = (startPoint.x + endPoint.x) / 2;
        const midY = (startPoint.y + endPoint.y) / 2 + 0.5;
        const midZ = (startPoint.z + endPoint.z) / 2;

        group.traverse((child) => {
          if (child instanceof THREE.Sprite && (child.userData.isRelationIcon || child.userData.isRelationLabel)) {
            child.position.set(midX, child.userData.isRelationLabel ? midY - 0.4 : midY, midZ);
          }
        });
      }
    }
  }

  /**
   * Handle wheel scroll - zoom to character
   */
  private onWheel(event: WheelEvent): void {
    if (this.hoveredCharacter) {
      event.preventDefault();
      // Can add zoom to character logic here
    }
  }

  /**
   * Show info panel
   */
  private showInfoPanel(character: CharacterPersona): void {
    if (!this.infoPanel) return;

    const healthColors: Record<string, string> = {
      excellent: '#2ECC71',
      good: '#00BCD4',
      fair: '#F1C40F',
      poor: '#FF6B00',
      critical: '#DC2626',
    };

    const healthIcons: Record<string, string> = {
      excellent: '✓',
      good: '✓',
      fair: '!',
      poor: '⚠',
      critical: '✖',
    };

    const healthColor = healthColors[character.health] || '#999';
    const healthIcon = healthIcons[character.health] || '?';

    // Find related relationships
    const relatedRelations = this.relations.filter(
      r => r.from === character.originalFile || r.to === character.originalFile
    );

    this.infoPanel.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="width: 40px; height: 40px; border-radius: 50%; background: ${character.color}; display: flex; align-items: center; justify-content: center; font-size: 20px;">🎭</div>
        <div>
          <div style="font-size: 18px; font-weight: bold; color: ${character.color};">${character.name}</div>
          <div style="font-size: 14px; opacity: 0.7;">${character.role}</div>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; opacity: 0.6; margin-bottom: 4px;">PERSONALITY</div>
        <div style="font-size: 14px;">${character.personality}</div>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; opacity: 0.6; margin-bottom: 4px;">TRAITS</div>
        <div style="display: flex; flex-wrap: wrap; gap: 6px;">
          ${character.traits.map(t => `<span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; font-size: 12px;">${t}</span>`).join('')}
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; opacity: 0.6; margin-bottom: 4px;">HEALTH STATUS</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div style="width: 24px; height: 24px; border-radius: 50%; background: ${healthColor}; display: flex; align-items: center; justify-content: center;">
            <span style="font-size: 14px; color: #fff;">${healthIcon}</span>
          </div>
          <span style="font-size: 14px; font-weight: 500; text-transform: capitalize;">${character.health}</span>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <div style="font-size: 12px; opacity: 0.6; margin-bottom: 4px;">STATISTICS</div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px;">
          <div>Lines of Code:</div>
          <div style="font-weight: 500;">${character.stats.linesOfCode}</div>
          <div>Complexity:</div>
          <div style="font-weight: 500;">${character.stats.complexity}/10</div>
          <div>Bug Risk:</div>
          <div style="font-weight: 500; color: ${character.stats.bugRisk > 5 ? '#E74C3C' : '#2ECC71'};">${character.stats.bugRisk}</div>
          <div>Call Count:</div>
          <div style="font-weight: 500;">${character.stats.callCount}</div>
        </div>
      </div>

      ${relatedRelations.length > 0 ? `
        <div style="margin-bottom: 16px;">
          <div style="font-size: 12px; opacity: 0.6; margin-bottom: 8px;">RELATIONSHIPS (${relatedRelations.length})</div>
          <div style="max-height: 150px; overflow-y: auto;">
            ${relatedRelations.map(r => `
              <div style="padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 6px; font-size: 12px;">
                ${r.description}
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
        <div style="font-size: 11px; opacity: 0.6;">File: ${character.originalFile}</div>
      </div>
    `;

    this.infoPanel.style.opacity = '1';
    this.infoPanel.style.transform = 'translateX(0)';
  }

  /**
   * Hide info panel
   */
  private hideInfoPanel(): void {
    if (this.infoPanel) {
      this.infoPanel.style.opacity = '0';
      this.infoPanel.style.transform = 'translateX(50px)';
    }
  }

  /**
   * Clear
   */
  clear(): void {
    this.characters.clear();
    this.characterMeshes.clear();
    this.relations = [];
    this.hoveredCharacter = null;
    this.selectedCharacter = null;
  }

  /**
   * Dispose
   */
  dispose(): void {
    this.clear();

    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }

    if (this.infoPanel) {
      this.infoPanel.remove();
      this.infoPanel = null;
    }
  }
}
