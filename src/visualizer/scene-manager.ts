import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CharacterMeshGenerator } from './character-mesh.js';
import { InteractionManager } from './interaction-manager.js';
import { AnimationManager } from './animation-manager.js';
import { AnalysisResult, CharacterPersona, DependencyRelation } from '../analyzer/types.js';

/**
 * 3D Scene Manager - Responsible for scene setup and rendering loop
 */
export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private characterGenerator: CharacterMeshGenerator;
  private interactionManager: InteractionManager;
  private animationManager: AnimationManager;

  private container: HTMLElement | null = null;
  private characters: Map<string, THREE.Group> = new Map();
  private relations: THREE.Group[] = [];

  private clock: THREE.Clock;

  constructor() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.Fog(0x1a1a2e, 20, 80);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 15, 30);

    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.autoRotate = false;  // Ensure no auto-rotation
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.minDistance = 10;
    this.controls.maxDistance = 100;

    // Initialize managers
    this.characterGenerator = new CharacterMeshGenerator();
    this.interactionManager = new InteractionManager(this.camera, this.scene);
    this.animationManager = new AnimationManager();

    this.clock = new THREE.Clock();

    this.setupLights();
    this.setupGround();
  }

  /**
   * Setup lighting
   */
  private setupLights(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    // Main light source
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(20, 30, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 1;
    mainLight.shadow.camera.far = 100;
    mainLight.shadow.camera.left = -30;
    mainLight.shadow.camera.right = 30;
    mainLight.shadow.camera.top = 30;
    mainLight.shadow.camera.bottom = -30;
    this.scene.add(mainLight);

    // Fill light
    const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
    fillLight.position.set(-20, 20, -20);
    this.scene.add(fillLight);

    // Rim light - enhance cartoon effect
    const rimLight = new THREE.DirectionalLight(0xffaa00, 0.2);
    rimLight.position.set(0, 10, -30);
    this.scene.add(rimLight);
  }

  /**
   * Setup ground
   */
  private setupGround(): void {
    // Grid ground
    const gridHelper = new THREE.GridHelper(100, 50, 0x444466, 0x333355);
    this.scene.add(gridHelper);

    // Reflective ground
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.8,
      metalness: 0.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.1;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Add decorative particles
    this.addParticles();
  }

  /**
   * Add ambient particles
   */
  private addParticles(): void {
    const particleCount = 500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = Math.random() * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

      // Random colors - gold, blue, purple
      const colorChoice = Math.random();
      if (colorChoice < 0.33) {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 0;
      } else if (colorChoice < 0.66) {
        colors[i * 3] = 0.5;
        colors[i * 3 + 1] = 0.8;
        colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 0.8;
        colors[i * 3 + 1] = 0.5;
        colors[i * 3 + 2] = 1;
      }
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particles.userData.isParticles = true;
    this.scene.add(particles);
  }

  /**
   * Load analysis result and create 3D scene
   */
  loadAnalysis(result: AnalysisResult): void {
    // Clear old content
    this.clearScene();

    // Calculate layout positions
    const positions = this.calculateLayout(result.characters, result.relations);

    // Create characters
    for (const character of result.characters) {
      const charMesh = this.characterGenerator.generateCharacter(character);
      const pos = positions.get(character.originalFile) || { x: 0, z: 0 };
      charMesh.position.set(pos.x, 0, pos.z);
      charMesh.castShadow = true;
      charMesh.receiveShadow = true;

      this.scene.add(charMesh);
      this.characters.set(character.originalFile, charMesh);

      // Add to interaction manager
      this.interactionManager.addCharacter(charMesh, character);
    }

    // Create relationship lines
    this.createRelationLines(result.relations);

    // Add animations
    this.animationManager.setCharacters(this.characters);

    // Update interaction manager's relationship data
    this.interactionManager.setRelations(result.relations);

    // Set double-click callback
    this.interactionManager.setCharacterDoubleClickCallback((character) => {
      console.log('Double-clicked character:', character.name);
      // Can add additional double-click handling logic here
    });
  }

  /**
   * Calculate character layout positions - using force-directed graph layout algorithm
   */
  private calculateLayout(
    characters: CharacterPersona[],
    relations: DependencyRelation[]
  ): Map<string, { x: number; z: number }> {
    const positions = new Map<string, { x: number; z: number }>();
    const nodes = new Map<string, { x: number; z: number; vx: number; vz: number }>();

    // Initialize positions - circular layout
    const radius = Math.max(10, Math.sqrt(characters.length) * 3);
    for (let i = 0; i < characters.length; i++) {
      const angle = (i / characters.length) * Math.PI * 2;
      const char = characters[i];
      nodes.set(char.originalFile, {
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        vx: 0,
        vz: 0,
      });
    }

    // Force-directed algorithm iterations
    const iterations = 100;
    const k = radius * 2; // Ideal spring length

    for (let iter = 0; iter < iterations; iter++) {
      // Repulsive force - between all nodes
      for (const [id1, node1] of nodes) {
        for (const [id2, node2] of nodes) {
          if (id1 === id2) continue;

          const dx = node1.x - node2.x;
          const dz = node1.z - node2.z;
          const dist = Math.sqrt(dx * dx + dz * dz) || 1;

          const force = (k * k) / dist;
          node1.vx += (dx / dist) * force * 0.1;
          node1.vz += (dz / dist) * force * 0.1;
        }
      }

      // Attractive force - nodes with relationships
      for (const rel of relations) {
        const node1 = nodes.get(rel.from);
        const node2 = nodes.get(rel.to);

        if (node1 && node2) {
          const dx = node2.x - node1.x;
          const dz = node2.z - node1.z;
          const dist = Math.sqrt(dx * dx + dz * dz) || 1;

          const force = (dist * dist) / k;
          const fx = (dx / dist) * force * 0.01;
          const fz = (dz / dist) * force * 0.01;

          node1.vx += fx;
          node1.vz += fz;
          node2.vx -= fx;
          node2.vz -= fz;
        }
      }

      // Attractive force toward center
      for (const node of nodes.values()) {
        const dist = Math.sqrt(node.x * node.x + node.z * node.z) || 1;
        node.vx -= (node.x / dist) * 0.5;
        node.vz -= (node.z / dist) * 0.5;
      }

      // Update positions and add damping
      for (const node of nodes.values()) {
        node.vx *= 0.7;
        node.vz *= 0.7;
        node.x += node.vx;
        node.z += node.vz;
      }
    }

    // Convert to results
    for (const [id, node] of nodes) {
      positions.set(id, { x: node.x, z: node.z });
    }

    return positions;
  }

  /**
   * Create relationship lines
   */
  private createRelationLines(relations: DependencyRelation[]): void {
    for (const relation of relations) {
      const fromChar = this.characters.get(relation.from);
      const toChar = this.characters.get(relation.to);

      if (fromChar && toChar) {
        const line = this.createRelationLine(fromChar, toChar, relation, relations);
        this.scene.add(line);
        this.relations.push(line);
      }
    }
  }

  /**
   * Create single relationship line with 3D pipe and arrow
   */
  private createRelationLine(
    from: THREE.Group,
    to: THREE.Group,
    relation: DependencyRelation,
    allRelations: DependencyRelation[]
  ): THREE.Group {
    // Calculate start and end points
    const startPoint = from.position.clone().add(new THREE.Vector3(0, 1, 0));
    const endPoint = to.position.clone().add(new THREE.Vector3(0, 1, 0));

    // Calculate direction and distance
    const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
    const length = direction.length();
    direction.normalize();

    // Set colors based on relationship type
    const colors: Record<string, number> = {
      best_friend: 0xFF6B6B,      // Red - Best Friends
      unrequited: 0x9B59B6,      // Purple - Unrequited Love
      toxic: 0xFF4500,            // Orange-red - Toxic Relationship
      secret: 0x3498DB,           // Blue - Secret Admirer
      fan: 0x2ECC71,              // Green - Fan Following
      contract: 0x95A5A6,         // Gray - Contract
    };

    const color = colors[relation.relationType] || 0xFFFFFF;

    // Create pipe (tube)
    const pipeRadius = 0.8;  // Super thick pipe for maximum visibility
    const pipeGeometry = new THREE.CylinderGeometry(pipeRadius, pipeRadius, length, 16);
    const pipeMaterial = new THREE.MeshStandardMaterial({
      color: color,
      transparent: true,
      opacity: relation.strength * 0.7,  // Higher opacity for better visibility
      roughness: 0.4,
      metalness: 0.3,
    });
    const pipe = new THREE.Mesh(pipeGeometry, pipeMaterial);

    // Set pipe position and orientation
    pipe.position.copy(startPoint).add(endPoint).multiplyScalar(0.5);
    pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    pipe.castShadow = true;

    // Check for bidirectional relationship
    const isBidirectional = this.isBidirectionalRelation(relation.from, relation.to, allRelations);
    const arrowLength = 0.8;  // Longer arrows for thicker pipes
    const arrowRadius = 0.25;  // Wider arrows for thicker pipes
    const arrowGeometry = new THREE.ConeGeometry(arrowRadius, arrowLength, 16);

    // Create group and add pipe
    const group = new THREE.Group();
    group.add(pipe);

    // Create arrows based on bidirectional status
    if (isBidirectional) {
      // For bidirectional: create two arrows (one at each end)
      const arrow1 = new THREE.Mesh(arrowGeometry, pipeMaterial);
      arrow1.position.copy(startPoint).add(direction.clone().multiplyScalar(arrowLength * 0.5));
      arrow1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().negate());
      arrow1.castShadow = true;
      group.add(arrow1);

      const arrow2 = new THREE.Mesh(arrowGeometry, pipeMaterial);
      arrow2.position.copy(endPoint).sub(direction.clone().multiplyScalar(arrowLength * 0.5));
      arrow2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      arrow2.castShadow = true;
      group.add(arrow2);

      // Save both arrows
      group.userData.arrow1 = arrow1;
      group.userData.arrow2 = arrow2;
    } else {
      // Unidirectional: single arrow at end
      const arrow = new THREE.Mesh(arrowGeometry, pipeMaterial);
      arrow.position.copy(endPoint).sub(direction.clone().multiplyScalar(arrowLength * 0.5));
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
      arrow.castShadow = true;
      group.add(arrow);
      group.userData.arrow = arrow;
    }

    // Create flowing particles - larger and more visible
    const flowParticles: Array<{ mesh: THREE.Mesh; speed: number; offset: number; direction: number }> = [];
    const particleCount = isBidirectional ? 4 : 3;

    for (let i = 0; i < particleCount; i++) {
      const particleGeo = new THREE.SphereGeometry(0.1, 8, 8);  // Larger particles (0.1 instead of 0.06)
      const particleMat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.9,  // High opacity for visibility
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);

      // For bidirectional, particles flow from both ends to middle
      // For unidirectional, particles flow from start to end
      const particleDirection = isBidirectional ? (i % 2 === 0 ? 1 : -1) : 1;

      flowParticles.push({
        mesh: particle,
        speed: 0.5 + Math.random() * 0.3,  // Faster speed
        offset: i / particleCount,
        direction: particleDirection,
      });

      group.add(particle);
    }

    // Save original data
    group.userData = {
      relation,
      from: from.position.clone(),
      to: to.position.clone(),
      pipe,
      startPoint,
      endPoint,
      direction,
      flowParticles,
      isBidirectional,
    };

    // Add relationship type icon
    this.addRelationTypeIcon(group, relation.relationType, color, startPoint, endPoint);

    return group;
  }

  /**
   * Check if relationship is bidirectional
   */
  private isBidirectionalRelation(
    from: string,
    to: string,
    relations: DependencyRelation[]
  ): boolean {
    // Check if there's a reverse relationship
    return relations.some(r => r.from === to && r.to === from);
  }

  /**
   * Add relationship type icon and label to pipe group
   */
  private addRelationTypeIcon(
    group: THREE.Group,
    relationType: string,
    color: number,
    startPoint: THREE.Vector3,
    endPoint: THREE.Vector3
  ): void {
    let iconText = '•';
    let labelText = relationType;

    switch (relationType) {
      case 'best_friend':
        iconText = '❤️';
        labelText = 'best_friend';
        break;
      case 'unrequited':
        iconText = '💔';
        labelText = 'unrequited';
        break;
      case 'toxic':
        iconText = '⚠️';
        labelText = 'toxic';
        break;
      case 'secret':
        iconText = '🤫';
        labelText = 'secret';
        break;
      case 'fan':
        iconText = '⭐';
        labelText = 'fan';
        break;
      case 'contract':
        iconText = '📋';
        labelText = 'contract';
        break;
    }

    const midX = (startPoint.x + endPoint.x) / 2;
    const midY = (startPoint.y + endPoint.y) / 2 + 0.5;
    const midZ = (startPoint.z + endPoint.z) / 2;

    // Create canvas for icon
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 64;
    canvas.height = 64;

    // Draw icon
    ctx.font = 'bold 48px Arial';
    ctx.fillStyle = '#' + color.toString(16).padStart(6, '0');
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconText, 32, 32);

    // Create texture and sprite for icon
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.8, 0.8, 1);
    sprite.position.set(midX, midY, midZ);
    sprite.userData.isRelationIcon = true;
    group.add(sprite);

    // Create canvas for label
    const labelCanvas = document.createElement('canvas');
    const labelCtx = labelCanvas.getContext('2d')!;
    labelCanvas.width = 256;
    labelCanvas.height = 64;

    // Draw label background
    labelCtx.fillStyle = 'rgba(26, 26, 46, 0.8)';
    labelCtx.beginPath();
    labelCtx.roundRect(0, 0, 256, 64, [8]);
    labelCtx.fill();

    // Draw label text
    labelCtx.font = 'bold 24px Arial';
    labelCtx.fillStyle = '#FFFFFF';
    labelCtx.textAlign = 'center';
    labelCtx.textBaseline = 'middle';
    labelCtx.fillText(labelText, 128, 32);

    // Create texture and sprite for label
    const labelTexture = new THREE.CanvasTexture(labelCanvas);
    const labelSpriteMat = new THREE.SpriteMaterial({ map: labelTexture, transparent: true });
    const labelSprite = new THREE.Sprite(labelSpriteMat);
    labelSprite.scale.set(2, 0.5, 1);
    labelSprite.position.set(midX, midY - 0.4, midZ);
    labelSprite.userData.isRelationLabel = true;
    group.add(labelSprite);
  }

  /**
   * Clear scene
   */
  private clearScene(): void {
    // Clear characters
    for (const char of this.characters.values()) {
      this.scene.remove(char);
    }
    this.characters.clear();

    // Clear relation groups
    for (const group of this.relations) {
      this.scene.remove(group);
      group.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          }
        }
      });
    }
    this.relations = [];

    // Reset interaction manager
    this.interactionManager.clear();
  }

  /**
   * Mount to DOM
   */
  mount(container: HTMLElement): void {
    this.container = container;
    container.appendChild(this.renderer.domElement);

    // Listen for window size changes
    window.addEventListener('resize', this.onWindowResize.bind(this));

    // Setup interaction events
    this.interactionManager.setupEvents(container);

    // Start rendering loop
    this.animate();
  }

  /**
   * Handle window size change
   */
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Rendering loop
   */
  private animate(): void {
    requestAnimationFrame(this.animate.bind(this));

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Update controls
    this.controls.update();

    // Update animations
    this.animationManager.update(delta, time);

    // Update ambient particles
    this.scene.traverse((obj) => {
      if ((obj as THREE.Points).userData?.isParticles) {
        const positions = (obj as THREE.Points).geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(time + positions[i]) * 0.01;
        }
        (obj as THREE.Points).geometry.attributes.position.needsUpdate = true;
      }
    });

    // Update flow particles in relation pipes
    this.scene.traverse((obj) => {
      if (obj.userData?.flowParticles) {
        const group = obj as THREE.Group;
        const flowParticles = group.userData.flowParticles;
        const startPoint = group.userData.startPoint as THREE.Vector3;
        const endPoint = group.userData.endPoint as THREE.Vector3;

        for (const particle of flowParticles) {
          // Update offset
          particle.offset += particle.speed * particle.direction * delta;

          // Loop particles
          if (particle.offset > 1) {
            particle.offset = 0;
          } else if (particle.offset < 0) {
            particle.offset = 1;
          }

          // Calculate position along pipe
          const t = particle.offset;
          const position = new THREE.Vector3().copy(startPoint).lerp(endPoint, t);

          particle.mesh.position.copy(position);
        }
      }
    });

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Dispose
   */
  dispose(): void {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.clearScene();
    this.renderer.dispose();
    this.interactionManager.dispose();
  }

  /**
   * Get scene
   */
  getScene(): THREE.Scene {
    return this.scene;
  }

  /**
   * Get camera
   */
  getCamera(): THREE.Camera {
    return this.camera;
  }
}
