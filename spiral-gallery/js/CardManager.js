import * as THREE from 'three';

// Card data matching the existing services
const CARD_DATA = [
    {
        id: 'custom-dev',
        title: 'Custom Development',
        category: 'Development',
        color: '#10b981',
        items: ['CMS Development', 'Web Applications', 'Mobile Apps'],
        icon: '💻',
        bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))'
    },
    {
        id: 'cloud-devops',
        title: 'Cloud & DevOps',
        category: 'Infrastructure',
        color: '#f97316',
        items: ['Performance Optimization', '24/7 Monitoring', 'Cloud Migration'],
        icon: '☁️',
        bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))'
    },
    {
        id: 'ai-data',
        title: 'AI & Data Solutions',
        category: 'AI/ML',
        color: '#6366f1',
        items: ['NLP Solutions', 'Machine Learning Models', 'Data Analytics'],
        icon: '🤖',
        bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))'
    }
];

class Card {
    constructor(index, data, position, rotation) {
        this.index = index;
        this.data = data;
        this.position = position.clone();
        this.targetPosition = position.clone();
        this.rotation = rotation.clone();
        this.targetRotation = rotation.clone();
        this.scale = new THREE.Vector3(1, 1, 1);
        this.targetScale = new THREE.Vector3(1, 1, 1);
        this.opacity = 1;
        this.targetOpacity = 1;
        this.isHovered = false;
        this.hoverProgress = 0;
        this.targetHoverProgress = 0;
        this.meshObject = null;
        this.isVisible = true;
        this.distanceFromCamera = 0;
    }

    update(deltaTime) {
        // Spring physics for smooth animation
        const spring = 0.1;
        const damping = 0.8;

        // Position
        this.position.lerp(this.targetPosition, spring);
        
        // Rotation
        this.rotation.x += (this.targetRotation.x - this.rotation.x) * spring;
        this.rotation.y += (this.targetRotation.y - this.rotation.y) * spring;
        this.rotation.z += (this.targetRotation.z - this.rotation.z) * spring;

        // Scale
        this.scale.lerp(this.targetScale, spring);

        // Opacity
        this.opacity += (this.targetOpacity - this.opacity) * spring;

        // Hover progress
        this.hoverProgress += (this.targetHoverProgress - this.hoverProgress) * 0.15;

        // Apply to mesh
        if (this.meshObject) {
            this.meshObject.position.copy(this.position);
            this.meshObject.rotation.copy(this.rotation);
            this.meshObject.scale.copy(this.scale);
            this.meshObject.material.uniforms.opacity.value = this.opacity;
            this.meshObject.material.uniforms.hoverProgress.value = this.hoverProgress;
        }
    }

    setHovered(hovered) {
        this.isHovered = hovered;
        this.targetHoverProgress = hovered ? 1 : 0;
        
        // Keep size and position exactly the same - no changes at all
        this.targetScale.set(1, 1, 1);
        
        // No z-position change - cards stay in exact same position
        // Only shader effects (glow, chromatic aberration) will activate
    }
}

export class CardManager {
    constructor(scene, spiralController, vertexShader, fragmentShader) {
        this.scene = scene;
        this.spiralController = spiralController;
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
        this.cards = [];
        this.cardCount = window.innerWidth < 768 ? 10 : 20;
        this.textureLoader = new THREE.TextureLoader();
        this.loadedTextures = new Map();
        this.cardPool = [];
        this.time = 0;
        this.mousePosition = new THREE.Vector2(0, 0);
        this.scrollVelocity = 0;

        this.init();
    }

    async init() {
        console.log('Initializing CardManager...');
        
        // Create cards
        await this.createCards();
        
        console.log(`✓ CardManager initialized with ${this.cards.length} cards`);
    }

    createCardTexture(data) {
        // Create a canvas texture for each card
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 288;
        const ctx = canvas.getContext('2d');

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        
        // Parse color from data
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 16, g: 185, b: 129 };
        };

        const rgb = hexToRgb(data.color);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Border
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Icon
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(data.icon, canvas.width / 2, 80);

        // Title
        ctx.font = 'bold 36px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(data.title, canvas.width / 2, 160);

        // Category
        ctx.font = '24px Arial';
        ctx.fillStyle = data.color;
        ctx.fillText(data.category, canvas.width / 2, 210);

        // Items count
        ctx.font = '18px Arial';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText(`${data.items.length} Services`, canvas.width / 2, 250);

        // Create texture
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;

        return texture;
    }

    createCardMaterial(texture, color) {
        const hexToVec3 = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            if (result) {
                return new THREE.Vector3(
                    parseInt(result[1], 16) / 255,
                    parseInt(result[2], 16) / 255,
                    parseInt(result[3], 16) / 255
                );
            }
            return new THREE.Vector3(0.06, 0.73, 0.51);
        };

        return new THREE.ShaderMaterial({
            uniforms: {
                map: { value: texture },
                time: { value: 0 },
                mousePosition: { value: new THREE.Vector2(0, 0) },
                scrollVelocity: { value: 0 },
                hoverProgress: { value: 0 },
                opacity: { value: 1 },
                glowIntensity: { value: 1.5 },
                glowColor: { value: hexToVec3(color) },
                cameraPosition: { value: new THREE.Vector3() }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: true
        });
    }

    async createCards() {
        const positions = this.spiralController.getUniformPoints(this.cardCount);

        for (let i = 0; i < this.cardCount; i++) {
            // Cycle through card data
            const dataIndex = i % CARD_DATA.length;
            const cardData = CARD_DATA[dataIndex];

            // Create texture
            const texture = this.createCardTexture(cardData);
            this.loadedTextures.set(i, texture);

            // Create material with shaders
            const material = this.createCardMaterial(texture, cardData.color);

            // Create geometry
            const geometry = new THREE.PlaneGeometry(160, 90, 32, 32);

            // Create mesh
            const mesh = new THREE.Mesh(geometry, material);

            // Create card instance
            const card = new Card(i, cardData, positions[i].position, positions[i].rotation);
            card.meshObject = mesh;

            // Add to scene
            this.scene.add(mesh);
            this.cards.push(card);
        }
    }

    update(time, deltaTime, camera) {
        this.time = time;

        // Update all cards
        this.cards.forEach((card, index) => {
            card.update(deltaTime);

            // Update shader uniforms
            if (card.meshObject) {
                card.meshObject.material.uniforms.time.value = time;
                card.meshObject.material.uniforms.mousePosition.value.copy(this.mousePosition);
                card.meshObject.material.uniforms.scrollVelocity.value = this.scrollVelocity;
                card.meshObject.material.uniforms.cameraPosition.value.copy(camera.position);

                // Calculate distance from camera for LOD
                card.distanceFromCamera = card.meshObject.position.distanceTo(camera.position);

                // Frustum culling
                card.meshObject.visible = card.distanceFromCamera < 1200;
            }
        });

        // Decay scroll velocity
        this.scrollVelocity *= 0.95;
    }

    setMousePosition(x, y) {
        this.mousePosition.set(x, y);
    }

    addScrollVelocity(velocity) {
        this.scrollVelocity += velocity;
    }

    getCards() {
        return this.cards;
    }

    dispose() {
        this.cards.forEach(card => {
            if (card.meshObject) {
                card.meshObject.geometry.dispose();
                card.meshObject.material.dispose();
                this.scene.remove(card.meshObject);
            }
        });

        this.loadedTextures.forEach(texture => {
            texture.dispose();
        });

        this.cards = [];
        this.loadedTextures.clear();
    }
}

export { CARD_DATA };
