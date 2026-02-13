# CodeActor Character Design Reference

## Character Types Explained

### Heroic Protagonist (Hot-Blooded)
- **Corresponding Files**: main.ts, app.js, index.ts, server.js
- **Personality**: Full of enthusiasm but prone to crashes, always at the forefront, carrying the hopes of the entire project
- **Visual Design**:
  - Slightly taller body (CapsuleGeometry, height 1.2)
  - Bright, spirited eyes (angled eyebrows)
  - Red cape (PlaneGeometry)
  - Heroic stance

### Reliable Pillar (Reliable)
- **Corresponding Files**: model/, schema/, database/, store/, repository/
- **Personality**: Steady and dependable, excellent memory but slow-moving
- **Visual Design**:
  - Sturdy cylindrical body (CylinderGeometry)
  - Round head
  - Glasses (TorusGeometry)
  - Beard (ConeGeometry)
  - Book in hand

### Silent Helper (Helpful)
- **Corresponding Files**: util/, helper/, common/, shared/
- **Personality**: Low-profile invisible assistant, always available when called
- **Visual Design**:
  - Small, agile body
  - Large eyes
  - Smiling mouth
  - Angel halo (TorusGeometry)
  - Small wings

### Quirky Character (Quirky)
- **Corresponding Files**: middleware/, interceptor/, guard/
- **Personality**: Eccentric and hard to understand, likes to set up checkpoints
- **Visual Design**:
  - Polyhedral body (DodecahedronGeometry)
  - Question mark hat
  - Mismatched eye sizes
  - Walking cane

### Mysterious Figure (Mysterious)
- **Corresponding Files**: config/, constant/, env/
- **Personality**: Hidden expert, possesses unknown secrets
- **Visual Design**:
  - Transparent robe material
  - Glowing eyes
  - Surrounded by star particles

### Busy Bee (Busy)
- **Corresponding Files**: High-frequency utility modules
- **Personality**: Always busy and bustling, the worker of the team
- **Visual Design**:
  - Square body
  - Tie
  - Briefcase
  - Sweat drops

### Fragile Soul (Fragile)
- **Corresponding Files**: High complexity, high cyclomatic complexity modules
- **Personality**: Sensitive and fragile, easily hurt
- **Visual Design**:
  - Slender body
  - Teardrops
  - Band-aids

### Lonely Wanderer (Lonely)
- **Corresponding Files**: Modules with almost no calls
- **Personality**: Always alone, possibly waiting to be deleted
- **Visual Design**:
  - Semi-transparent material
  - Dull eyes
  - Fading halo

## Health Status Effects

### Healthy
- Normal rendering
- No additional effects

### Sick
- Thermometer (CylinderGeometry)
- Red forehead (CircleGeometry, red semi-transparent)
- Trembling animation

### Critical
- Skull标志 (SphereGeometry)
- Warning halo (TorusGeometry, red)
- Dizzy spiral animation
- Blinking effect
