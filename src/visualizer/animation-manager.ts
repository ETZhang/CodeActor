import * as THREE from 'three';

/**
 * Animation Manager - Handle character animations, relationship flow animations, etc.
 */
export class AnimationManager {
  private characters: Map<string, THREE.Group> = new Map();
  private relations: THREE.Line[] = [];

  // Particle system - for relationship flow animations
  private flowParticles: Map<THREE.Line, FlowParticle[]> = new Map();

  // Character animation states
  private characterAnimations: Map<string, CharacterAnimationState> = new Map();

  constructor() {}

  /**
   * Set characters
   */
  setCharacters(characters: Map<string, THREE.Group>): void {
    this.characters = characters;

    // Initialize animation states
    for (const [id, char] of characters) {
      const health = char.userData?.character?.health;
      this.characterAnimations.set(id, {
        baseY: char.position.y,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.5 + Math.random() * 0.5,
        breathOffset: Math.random() * Math.PI * 2,
        isSick: health !== 'excellent' && health !== 'good',
        healthLevel: health,
      });
    }
  }

  /**
   * Set relationships
   */
  setRelations(relations: THREE.Line[]): void {
    this.relations = relations;

    // Create flow particles for each relationship line
    for (const line of relations) {
      this.createFlowParticles(line);
    }
  }

  /**
   * Check if character needs special handling (non-healthy state)
   */
  private isCharacterSick(char: THREE.Group): boolean {
    const health = char.userData?.character?.health;
    return health !== 'excellent' && health !== 'good';
  }

  /**
   * Check if character is in critical state
   */
  private isCharacterCritical(char: THREE.Group): boolean {
    return char.userData?.character?.health === 'critical';
  }

  /**
   * Create flow particles
   */
  private createFlowParticles(line: THREE.Line): void {
    const particles: FlowParticle[] = [];
    const relation = line.userData.relation;

    // Determine particle count and speed based on relationship type
    const particleCount = relation?.relationType === 'best_friend' ? 5 : 3;
    const speed = relation?.strength || 0.5;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        t: i / particleCount,
        speed: speed * (0.3 + Math.random() * 0.2),
        size: 0.08 + Math.random() * 0.05,
      });
    }

    this.flowParticles.set(line, particles);
  }

  /**
   * Update animations
   */
  update(delta: number, time: number): void {
    this.updateCharacterAnimations(time);
    this.updateRelationAnimations(time);
    this.updateFlowParticles(delta);
  }

  /**
   * Update character animations
   */
  private updateCharacterAnimations(time: number): void {
    for (const [id, char] of this.characters) {
      const animState = this.characterAnimations.get(id);
      if (!animState) continue;

      // Floating animation
      const floatY = Math.sin(time * animState.floatSpeed + animState.floatOffset) * 0.15;
      char.position.y = animState.baseY + floatY;

      // Breathing animation - slight scaling
      const breathScale = 1 + Math.sin(time * 2 + animState.breathOffset) * 0.02;
      char.scale.set(breathScale, breathScale, breathScale);

      // Rotation animation - occasional turns
      char.rotation.y = Math.sin(time * 0.3 + animState.floatOffset) * 0.1;

      // Update health aura rotation
      this.updateHealthAura(char, time);

      // Special animations for sick characters
      if (animState.isSick) {
        // Shaking effect
        const shakeAmount = 0.02;
        char.position.x += (Math.random() - 0.5) * shakeAmount;
        char.position.z += (Math.random() - 0.5) * shakeAmount;

        // Facial color red/pale animation achieved through material emissive
        this.updateUnwellCharacterAppearance(char, time);
      }

      // Update particle animations within character
      this.updateCharacterParticles(char, time);
    }
  }

  /**
   * Update health aura rotation animation
   */
  private updateHealthAura(char: THREE.Group, time: number): void {
    const healthConfig = char.userData?.healthConfig;
    if (!healthConfig) return;

    // Find halo mesh and rotate
    char.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
        // Halo rotation
        child.rotation.z = time * 0.5;
        // Halo up/down floating
        child.position.y = 0.5 + Math.sin(time * 2) * 0.1;
      }
    });

    // Critical state halo flashing
    if (char.userData.isCritical && char.userData.healthConfig?.auraColor === 0xFF0000) {
      char.traverse((child) => {
        if (child instanceof THREE.Mesh && child.geometry instanceof THREE.TorusGeometry) {
          const flash = Math.sin(time * 8) > 0 ? 1 : 0.3;
          if (child.material instanceof THREE.MeshBasicMaterial) {
            child.material.opacity = flash * 0.6;
          }
        }
      });
    }
  }

  /**
   * Update unhealthy character appearance
   */
  private updateUnwellCharacterAppearance(char: THREE.Group, time: number): void {
    const health = char.userData?.character?.health;
    const config = char.userData?.healthConfig;

    if (!config) return;

    if (health === 'fair') {
      // Fair health - slight yellow
      char.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshToonMaterial) {
          const pulse = (Math.sin(time * 2) + 1) * 0.5;
          child.material.emissive = new THREE.Color(config.emissiveColor);
          child.material.emissiveIntensity = pulse * config.emissiveIntensity;
        }
      });
    } else if (health === 'poor') {
      // Poor health - orange glow
      char.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshToonMaterial) {
          const pulse = (Math.sin(time * 1.5) + 1) * 0.5;
          child.material.emissive = new THREE.Color(config.emissiveColor);
          child.material.emissiveIntensity = pulse * config.emissiveIntensity;
        }
      });
    } else if (health === 'critical') {
      // Critical - flashing red light
      char.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshToonMaterial) {
          const flash = Math.sin(time * 5) > 0 ? 1 : 0.2;
          child.material.emissive = new THREE.Color(0xFF0000);
          child.material.emissiveIntensity = flash * 0.5;
        }
      });
    }
  }

  /**
   * Update particle animations within characters
   */
  private updateCharacterParticles(char: THREE.Group, time: number): void {
    char.traverse((child) => {
      if (child.userData?.isParticle) {
        // Star particle orbiting rotation
        const originalY = child.userData.originalY || child.position.y;
        const angle = time + child.position.x;
        const radius = 0.8;

        child.position.x = char.position.x + Math.cos(angle) * radius;
        child.position.z = char.position.z + Math.sin(angle) * radius;
        child.position.y = originalY + Math.sin(time * 2 + angle) * 0.2;
      }
    });
  }

  /**
   * Update relationship line animations
   */
  private updateRelationAnimations(time: number): void {
    for (const line of this.relations) {
      const relation = line.userData.relation;

      if (!relation) continue;

      // Add different animation effects based on relationship type
      switch (relation.relationType) {
        case 'toxic':
          // Toxic relationship - unstable flashing
          if (line.material instanceof THREE.LineBasicMaterial) {
            const flash = Math.sin(time * 8) > 0 ? 1 : 0.3;
            line.material.opacity = flash * relation.strength * 0.6;
          }
          break;

        case 'secret':
          // Secret admirer - pulsing effect
          if (line.material instanceof THREE.LineBasicMaterial) {
            const pulse = (Math.sin(time * 3) + 1) * 0.5;
            line.material.opacity = (0.3 + pulse * 0.3) * relation.strength;
          }
          break;

        case 'best_friend':
          // Best friends - stable bright line
          if (line.material instanceof THREE.LineBasicMaterial) {
            line.material.opacity = 0.8;
          }
          break;
      }
    }
  }

  /**
   * Update flow particles
   */
  private updateFlowParticles(delta: number): void {
    for (const [line, particles] of this.flowParticles) {
      const geometry = line.geometry;
      const positions = geometry.attributes.position.array as Float32Array;

      if (positions.length < 6) continue;

      const startPoint = new THREE.Vector3(positions[0], positions[1], positions[2]);
      const endPoint = new THREE.Vector3(positions[3], positions[4], positions[5]);

      // Update each particle
      for (const particle of particles) {
        particle.t += particle.speed * delta;

        // Loop particles
        if (particle.t > 1) {
          particle.t = 0;
        }

        // Calculate particle position (Bezier curve effect)
        const t = particle.t;
        const midPoint = new THREE.Vector3()
          .addVectors(startPoint, endPoint)
          .multiplyScalar(0.5);
        midPoint.y += Math.sin(t * Math.PI) * 2; // Arc effect

        // Quadratic Bezier curve
        const invT = 1 - t;
        const x = invT * invT * startPoint.x + 2 * invT * t * midPoint.x + t * t * endPoint.x;
        const y = invT * invT * startPoint.y + 2 * invT * t * midPoint.y + t * t * endPoint.y;
        const z = invT * invT * startPoint.z + 2 * invT * t * midPoint.z + t * t * endPoint.z;

        // Particles rendered via getFlowParticlePositions()
      }
    }
  }

  /**
   * Get flow particle positions (for rendering)
   */
  getFlowParticlePositions(): Array<{ position: THREE.Vector3; color: number; size: number }> {
    const result: Array<{ position: THREE.Vector3; color: number; size: number }> = [];

    for (const [line, particles] of this.flowParticles) {
      const geometry = line.geometry;
      const positions = geometry.attributes.position.array as Float32Array;
      const relation = line.userData.relation;

      if (positions.length < 6) continue;

      const startPoint = new THREE.Vector3(positions[0], positions[1], positions[2]);
      const endPoint = new THREE.Vector3(positions[3], positions[4], positions[5]);

      for (const particle of particles) {
        const t = particle.t;
        const midPoint = new THREE.Vector3()
          .addVectors(startPoint, endPoint)
          .multiplyScalar(0.5);
        midPoint.y += Math.sin(t * Math.PI) * 1.5;

        const invT = 1 - t;
        const position = new THREE.Vector3(
          invT * invT * startPoint.x + 2 * invT * t * midPoint.x + t * t * endPoint.x,
          invT * invT * startPoint.y + 2 * invT * t * midPoint.y + t * t * endPoint.y,
          invT * invT * startPoint.z + 2 * invT * t * midPoint.z + t * t * endPoint.z
        );

        // Determine color based on relationship type
        const colorMap: Record<string, number> = {
          best_friend: 0xFF6B6B,
          unrequited: 0x9B59B6,
          toxic: 0xFF4500,
          secret: 0x3498DB,
          fan: 0x2ECC71,
          contract: 0x95A5A6,
        };

        result.push({
          position,
          color: colorMap[relation?.relationType] || 0xFFFFFF,
          size: particle.size,
        });
      }
    }

    return result;
  }
}

/**
 * 角色动画状态
 */
interface CharacterAnimationState {
  baseY: number;
  floatOffset: number;
  floatSpeed: number;
  breathOffset: number;
  isSick: boolean;
  healthLevel: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' | undefined;
}

/**
 * 流动粒子
 */
interface FlowParticle {
  t: number;
  speed: number;
  size: number;
}
