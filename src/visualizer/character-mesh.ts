import * as THREE from 'three';
import { PersonalityType, CharacterPersona } from '../analyzer/types.js';

/**
 * 3D Character Mesh Generator - Procedurally generate cartoon characters
 */
export class CharacterMeshGenerator {
  private materials: Map<PersonalityType, THREE.Material> = new Map();

  /**
   * Generate 3D mesh for character
   */
  generateCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();
    group.name = character.name;
    group.userData = {
      character,
      isSelected: false,
      isDraggable: true,
    };

    // Calculate scale based on code size (with upper limit)
    const codeScale = this.calculateScaleFromCodeSize(character.stats.linesOfCode);
    group.userData.codeScale = codeScale;

    // Generate different styled 3D characters based on personality type
    switch (character.personality) {
      case PersonalityType.HEROIC:
        group.add(this.createHeroicCharacter(character));
        break;
      case PersonalityType.RELIABLE:
        group.add(this.createReliableCharacter(character));
        break;
      case PersonalityType.HELPFUL:
        group.add(this.createHelpfulCharacter(character));
        break;
      case PersonalityType.QUIRKY:
        group.add(this.createQuirkyCharacter(character));
        break;
      case PersonalityType.MYSTERIOUS:
        group.add(this.createMysteriousCharacter(character));
        break;
      case PersonalityType.FRAGILE:
        group.add(this.createFragileCharacter(character));
        break;
      case PersonalityType.BUSY:
        group.add(this.createBusyCharacter(character));
        break;
      case PersonalityType.LONELY:
        group.add(this.createLonelyCharacter(character));
        break;
    }

    // Add health status effects
    if (character.health !== 'excellent' && character.health !== 'good') {
      this.addHealthAura(group, character);
    }

    // Add floating label
    this.addNameLabel(group, character);

    // Apply code size scaling (after all components added)
    this.applyScaleToGroup(group, group.userData.codeScale || 1);

    return group;
  }

  /**
   * Create heroic protagonist style character
   */
  private createHeroicCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - slightly taller, more imposing
    const bodyGeo = new THREE.CapsuleGeometry(0.5, 1.2, 8, 16);
    const bodyMat = new THREE.MeshToonMaterial({ color: character.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    group.add(body);

    // Head - slightly larger
    const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const headMat = new THREE.MeshToonMaterial({ color: 0xFFE0BD });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2;
    group.add(head);

    // Eyes - bright and spirited (larger and more visible)
    const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.2, 2.1, 0.5);
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.2, 2.1, 0.5);
    group.add(rightEye);

    // Eyebrows - heroic angled eyebrows
    const browGeo = new THREE.BoxGeometry(0.2, 0.03, 0.03);
    const browMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-0.15, 2.2, 0.45);
    leftBrow.rotation.z = 0.3;
    group.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(0.15, 2.2, 0.45);
    rightBrow.rotation.z = -0.3;
    group.add(rightBrow);

    // Cape - hero's signature
    const capeGeo = new THREE.PlaneGeometry(1.2, 1.5);
    const capeMat = new THREE.MeshToonMaterial({ color: 0xCC0000, side: THREE.DoubleSide });
    const cape = new THREE.Mesh(capeGeo, capeMat);
    cape.position.set(0, 1.2, -0.3);
    cape.rotation.y = Math.PI;
    group.add(cape);

    // Apply code size scaling
    this.applyScaleToGroup(group, group.userData.codeScale || 1);

    return group;
  }

  /**
   * Create reliable style character
   */
  private createReliableCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - solid and steady
    const bodyGeo = new THREE.CylinderGeometry(0.7, 0.8, 1.5, 8);
    const bodyMat = new THREE.MeshToonMaterial({ color: character.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.75;
    group.add(body);

    // Head - round
    const headGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const headMat = new THREE.MeshToonMaterial({ color: 0xFFE0BD });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.75;
    group.add(head);

    // Glasses - knowledgeable
    const glassesGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
    const glassesMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const leftGlass = new THREE.Mesh(glassesGeo, glassesMat);
    leftGlass.position.set(-0.15, 1.8, 0.4);
    group.add(leftGlass);

    const rightGlass = new THREE.Mesh(glassesGeo, glassesMat);
    rightGlass.position.set(0.15, 1.8, 0.4);
    group.add(rightGlass);

    // Eyes - gentle and more visible
    const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);  // Increased to 0.15
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 1.8, 0.45);  // Moved forward to z=0.45
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 1.8, 0.45);  // Moved forward to z=0.45
    group.add(rightEye);

    // Beard - elder demeanor
    const beardGeo = new THREE.ConeGeometry(0.3, 0.4, 8);
    const beardMat = new THREE.MeshToonMaterial({ color: 0xCCCCCC });
    const beard = new THREE.Mesh(beardGeo, beardMat);
    beard.position.set(0, 1.4, 0.2);
    beard.rotation.x = 0.5;
    group.add(beard);

    // Book - symbol of knowledge
    const bookGeo = new THREE.BoxGeometry(0.6, 0.1, 0.8);
    const bookMat = new THREE.MeshToonMaterial({ color: 0x8B4513 });
    const book = new THREE.Mesh(bookGeo, bookMat);
    book.position.set(0.8, 0.8, 0);
    book.rotation.y = -0.3;
    group.add(book);

    return group;
  }

  /**
   * Create helpful style character
   */
  private createHelpfulCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - small and agile
    const bodyGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const bodyMat = new THREE.MeshToonMaterial({ color: character.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.8;
    body.scale.y = 1.5;
    group.add(body);

    // Head - relatively large
    const headGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const headMat = new THREE.MeshToonMaterial({ color: 0xFFE0BD });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.7;
    group.add(head);

    // Big eyes - cute
    const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);  // Increased to 0.15
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.18, 1.75, 0.4);  // Moved forward to z=0.4
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.18, 1.75, 0.4);  // Moved forward to z=0.4
    group.add(rightEye);

    // Mouth - smile
    const mouthGeo = new THREE.TorusGeometry(0.1, 0.02, 8, 16, Math.PI);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0xCC6666 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 1.6, 0.4);
    mouth.rotation.x = Math.PI;
    group.add(mouth);

    // Angel halo
    const haloGeo = new THREE.TorusGeometry(0.5, 0.03, 8, 32);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 2.5, 0);
    halo.rotation.x = Math.PI / 2;
    group.add(halo);

    // Small wings
    const wingGeo = new THREE.SphereGeometry(0.3, 8, 8);
    const wingMat = new THREE.MeshToonMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.7 });
    const leftWing = new THREE.Mesh(wingGeo, wingMat);
    leftWing.position.set(-0.6, 1.3, 0);
    leftWing.scale.set(1, 0.6, 0.3);
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeo, wingMat);
    rightWing.position.set(0.6, 1.3, 0);
    rightWing.scale.set(1, 0.6, 0.3);
    group.add(rightWing);

    return group;
  }

  /**
   * Create quirky style character
   */
  private createQuirkyCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - irregular shape
    const bodyGeo = new THREE.DodecahedronGeometry(0.5);
    const bodyMat = new THREE.MeshToonMaterial({ color: character.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    body.rotation.z = Math.PI / 8;
    group.add(body);

    // Head - also polyhedron
    const headGeo = new THREE.IcosahedronGeometry(0.45);
    const headMat = new THREE.MeshToonMaterial({ color: 0xFFE0BD });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2;
    group.add(head);

    // Eyes - different sizes
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    const leftEye = new THREE.Mesh(new THREE.SphereGeometry(0.15), eyeMat);  // Increased to 0.15
    leftEye.position.set(-0.2, 2.05, 0.42);  // Moved forward
    group.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.SphereGeometry(0.18), eyeMat);  // Increased to 0.18
    rightEye.position.set(0.15, 2.1, 0.4);  // Moved forward
    group.add(rightEye);

    // Question mark hat
    const hatGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.3, 16);
    const hatMat = new THREE.MeshToonMaterial({ color: 0x9B59B6 });
    const hat = new THREE.Mesh(hatGeo, hatMat);
    hat.position.set(0, 2.5, 0);
    group.add(hat);

    // Cane - gatekeeper's signature
    const caneGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    const caneMat = new THREE.MeshToonMaterial({ color: 0x8B4513 });
    const cane = new THREE.Mesh(caneGeo, caneMat);
    cane.position.set(0.5, 0.5, 0);
    cane.rotation.z = -0.3;
    group.add(cane);

    return group;
  }

  /**
   * Create mysterious style character
   */
  private createMysteriousCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - flowing robe
    const bodyGeo = new THREE.ConeGeometry(0.5, 2, 8, 1, true);
    const bodyMat = new THREE.MeshToonMaterial({
      color: character.color,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1;
    group.add(body);

    // Head - transparent
    const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const headMat = new THREE.MeshToonMaterial({
      color: 0xFFE0BD,
      transparent: true,
      opacity: 0.7
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 2.1;
    group.add(head);

    // Eyes - glowing and more visible
    const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);  // Increased to 0.15
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00FFFF });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 2.1, 0.4);  // Moved forward
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 2.1, 0.4);  // Moved forward
    group.add(rightEye);

    // Surrounding star particles
    for (let i = 0; i < 5; i++) {
      const starGeo = new THREE.OctahedronGeometry(0.05);
      const starMat = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
      const star = new THREE.Mesh(starGeo, starMat);
      const angle = (i / 5) * Math.PI * 2;
      star.position.set(
        Math.cos(angle) * 0.8,
        1.5 + Math.random() * 0.5,
        Math.sin(angle) * 0.8
      );
      star.userData.isParticle = true;
      star.userData.originalY = star.position.y;
      group.add(star);
    }

    return group;
  }

  /**
   * Create fragile style character
   */
  private createFragileCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - slender and fragile
    const bodyGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 8);
    const bodyMat = new THREE.MeshToonMaterial({ color: character.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.75;
    group.add(body);

    // Head - slightly larger, appears fragile
    const headGeo = new THREE.SphereGeometry(0.45, 16, 16);
    const headMat = new THREE.MeshToonMaterial({ color: 0xFFE0BD });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.75;
    group.add(head);

    // Eyes - melancholic drooping eyes
    const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);  // Increased to 0.15
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x666666 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 1.78, 0.4);  // Moved forward
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 1.78, 0.4);  // Moved forward
    group.add(rightEye);

    // Teardrop
    const tearGeo = new THREE.ConeGeometry(0.05, 0.15, 8);
    const tearMat = new THREE.MeshBasicMaterial({ color: 0x88CCFF });
    const tear = new THREE.Mesh(tearGeo, tearMat);
    tear.position.set(-0.2, 1.5, 0.45);
    tear.rotation.z = 0.3;
    group.add(tear);

    // Bandage
    const bandageGeo = new THREE.PlaneGeometry(0.3, 0.1);
    const bandageMat = new THREE.MeshToonMaterial({ color: 0xFFE4E1, side: THREE.DoubleSide });
    const bandage = new THREE.Mesh(bandageGeo, bandageMat);
    bandage.position.set(0.3, 1.8, 0.35);
    bandage.rotation.y = 0.5;
    group.add(bandage);

    return group;
  }

  /**
   * Create busy style character
   */
  private createBusyCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - solid
    const bodyGeo = new THREE.BoxGeometry(0.6, 1.2, 0.5);
    const bodyMat = new THREE.MeshToonMaterial({ color: character.color });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.9;
    group.add(body);

    // 头部
    const headGeo = new THREE.SphereGeometry(0.4, 16, 16);
    const headMat = new THREE.MeshToonMaterial({ color: 0xFFE0BD });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.8;
    group.add(head);

    // Eyes - anxious and more visible
    const eyeGeo = new THREE.SphereGeometry(0.15, 8, 8);  // Increased to 0.15
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.15, 1.82, 0.4);  // Moved forward
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.15, 1.82, 0.4);  // Moved forward
    group.add(rightEye);

    // Tie - worker's signature
    const tieGeo = new THREE.PlaneGeometry(0.15, 0.5);
    const tieMat = new THREE.MeshToonMaterial({ color: 0x4169E1, side: THREE.DoubleSide });
    const tie = new THREE.Mesh(tieGeo, tieMat);
    tie.position.set(0, 1.3, 0.26);
    group.add(tie);

    // Briefcase
    const bagGeo = new THREE.BoxGeometry(0.4, 0.3, 0.15);
    const bagMat = new THREE.MeshToonMaterial({ color: 0x8B4513 });
    const bag = new THREE.Mesh(bagGeo, bagMat);
    bag.position.set(0.5, 0.8, 0);
    group.add(bag);

    // Sweat drop - indicates busyness
    const sweatGeo = new THREE.SphereGeometry(0.05);
    const sweatMat = new THREE.MeshBasicMaterial({ color: 0x88CCFF });
    const sweat = new THREE.Mesh(sweatGeo, sweatMat);
    sweat.position.set(0.3, 2.1, 0.3);
    group.add(sweat);

    return group;
  }

  /**
   * Create lonely style character
   */
  private createLonelyCharacter(character: CharacterPersona): THREE.Group {
    const group = new THREE.Group();

    // Body - thin
    const bodyGeo = new THREE.CapsuleGeometry(0.25, 0.8, 8, 16);
    const bodyMat = new THREE.MeshToonMaterial({ color: character.color, transparent: true, opacity: 0.6 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.65;
    group.add(body);

    // 头部
    const headGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const headMat = new THREE.MeshToonMaterial({ color: 0xFFE0BD, transparent: true, opacity: 0.6 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.4;
    group.add(head);

    // Eyes - lifeless
    const eyeGeo = new THREE.SphereGeometry(0.13, 8, 8);  // Increased to 0.13
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x999999 });
    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.12, 1.45, 0.32);  // Moved forward
    group.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.12, 1.45, 0.32);  // Moved forward
    group.add(rightEye);

    // Mouth - straight line
    const mouthGeo = new THREE.BoxGeometry(0.15, 0.02, 0.02);
    const mouthMat = new THREE.MeshBasicMaterial({ color: 0x999999 });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 1.3, 0.32);
    group.add(mouth);

    // Semi-transparent halo - indicates fading away
    const auraGeo = new THREE.TorusGeometry(0.6, 0.02, 8, 32);
    const auraMat = new THREE.MeshBasicMaterial({ color: character.color, transparent: true, opacity: 0.3 });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.position.y = 0.7;
    aura.rotation.x = Math.PI / 2;
    group.add(aura);

    return group;
  }

  /**
   * Add health level aura effects (health status visible at a glance)
   */
  private addHealthAura(group: THREE.Group, character: CharacterPersona): void {
    // Health level configuration
    const healthConfigs: Record<string, { auraColor: number; emissiveColor: number; emissiveIntensity: number; bodyOpacity: number }> = {
      healthy: { auraColor: 0x2ECC71, emissiveColor: 0x004400, emissiveIntensity: 0.1, bodyOpacity: 1 },
      good: { auraColor: 0x00BCD4, emissiveColor: 0x003300, emissiveIntensity: 0.08, bodyOpacity: 0.95 },
      fair: { auraColor: 0xF1C40F, emissiveColor: 0x002200, emissiveIntensity: 0.05, bodyOpacity: 0.85 },
      poor: { auraColor: 0xFF6B00, emissiveColor: 0x001100, emissiveIntensity: 0.02, bodyOpacity: 0.7 },
      critical: { auraColor: 0xFF0000, emissiveColor: 0x000000, emissiveIntensity: 0, bodyOpacity: 0.5 },
    };

    const config = healthConfigs[character.health] || healthConfigs.healthy;

    // Add health aura
    const auraGeo = new THREE.TorusGeometry(0.8, 0.06, 16, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: config.auraColor,
      transparent: true,
      opacity: 0.6,
    });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.position.y = 0.5;
    aura.rotation.x = Math.PI / 2;
    group.add(aura);

    // Apply glow to character body
    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];

        for (const mat of materials) {
          if (mat instanceof THREE.MeshToonMaterial || mat instanceof THREE.MeshStandardMaterial) {
            mat.emissive = new THREE.Color(config.emissiveColor);
            mat.emissiveIntensity = config.emissiveIntensity;
          }
        }
      }
    });

    // Critical state adds flashing animation
    if (character.health === 'critical') {
      // Add skull indicator
      const skullGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const skullMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const skull = new THREE.Mesh(skullGeo, skullMat);
      skull.position.set(0.35, 2.6, 0.4);
      group.add(skull);

      // Add dizzy spiral
      group.add(this.createDizzySpiral(0.5, 2.4, 0));

      // Red flashing aura effect implemented in animation
      group.userData.isCritical = true;
    }

    // Store configuration for animation use
    group.userData.healthConfig = config;
  }

  /**
   * Create dizzy spiral effect
   */
  private createDizzySpiral(x: number, y: number, z: number): THREE.Group {
    const group = new THREE.Group();

    for (let i = 0; i < 3; i++) {
      const spiralGeo = new THREE.TorusGeometry(0.15 + i * 0.05, 0.025, 8, 16, Math.PI * 1.5);
      const spiralMat = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
      const spiral = new THREE.Mesh(spiralGeo, spiralMat);
      spiral.rotation.z = (i * Math.PI) / 3;
      spiral.rotation.x = Math.random() * 0.5;
      group.add(spiral);
    }

    group.position.set(x, y, z);
    return group;
  }

  /**
   * Calculate scale based on code size
   * More code = larger character, with upper limit to avoid affecting viewing
   */
  private calculateScaleFromCodeSize(linesOfCode: number): number {
    // Base scaling: 10% increase per 500 lines of code
    const baseScale = 1 + Math.min((linesOfCode / 500) * 0.1, 0.5);

    // Minimum scale 0.6, maximum scale 1.5
    return Math.max(0.6, Math.min(1.5, baseScale));
  }

  /**
   * Apply scale to character group
   */
  private applyScaleToGroup(group: THREE.Group, scale: number): void {
    group.scale.set(scale, scale, scale);
    // Adjust Y position to keep character on ground
    group.position.y = group.position.y / scale;
  }

  /**
   * Add name label
   */
  private addNameLabel(group: THREE.Group, character: CharacterPersona): void {
    // Create floating label - using Canvas texture
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    canvas.width = 512;
    canvas.height = 128;

    // Background
    ctx.fillStyle = `${character.color}40`;
    ctx.beginPath();
    ctx.roundRect(0, 0, 512, 128, [20]);
    ctx.fill();

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(character.name, 256, 40);

    ctx.font = '32px Arial';
    ctx.fillText(character.role, 256, 85);

    // Create texture
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.y = 3.2;
    sprite.scale.set(2, 0.5, 1);

    group.add(sprite);
  }
}
