// Import statements will be handled by script type="module"
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

// Vertex Shader
const vertexShader = `
precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDistanceFromCamera;

uniform float time;
uniform vec2 mousePosition;
uniform float scrollVelocity;
uniform float hoverProgress;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Active Theory style: subtle tilt on hover
    float tiltAmount = hoverProgress * 0.05;
    float tiltX = sin(time * 1.5) * tiltAmount;
    float tiltY = cos(time * 1.5) * tiltAmount;
    
    // Apply subtle rotation
    mat3 rotX = mat3(
        1.0, 0.0, 0.0,
        0.0, cos(tiltX), -sin(tiltX),
        0.0, sin(tiltX), cos(tiltX)
    );
    
    mat3 rotY = mat3(
        cos(tiltY), 0.0, sin(tiltY),
        0.0, 1.0, 0.0,
        -sin(tiltY), 0.0, cos(tiltY)
    );
    
    pos = rotX * rotY * pos;
    
    // Gentle lift on hover
    pos.z = pos.z + hoverProgress * 15.0;
    
    // Very subtle floating
    float floatOffset = sin(time * 1.2) * hoverProgress * 1.5;
    pos.y = pos.y + floatOffset;
    
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDistanceFromCamera = -mvPosition.z;
    
    gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment Shader
const fragmentShader = `
precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDistanceFromCamera;

uniform sampler2D map;
uniform float time;
uniform float opacity;
uniform float hoverProgress;
uniform vec3 glowColor;
uniform vec3 camPos;

void main() {
    vec4 texColor = texture2D(map, vUv);
    
    // Active Theory style: strong fresnel effect
    vec3 viewDirection = normalize(camPos - vWorldPosition);
    float fresnel = 1.0 - max(0.0, dot(viewDirection, normalize(vNormal)));
    
    // Multiple rim intensities for layered glow
    float rim1 = pow(fresnel, 1.5);
    float rim2 = pow(fresnel, 2.5);
    float rim3 = pow(fresnel, 4.0);
    
    // Smooth pulsing glow
    float pulse = sin(time * 1.5) * 0.2 + 0.8;
    float hoverIntensity = hoverProgress * pulse;
    
    // Active Theory style chromatic aberration - stronger effect
    vec3 finalTexColor = texColor.rgb;
    if (hoverProgress > 0.1) {
        float aberration = hoverProgress * 0.008;
        float r = texture2D(map, vUv + vec2(aberration, 0.0)).r;
        float g = texture2D(map, vUv).g;
        float b = texture2D(map, vUv - vec2(aberration, 0.0)).b;
        finalTexColor = vec3(r, g, b);
    }
    
    // Base color
    vec3 finalColor = finalTexColor;
    
    // Layered rim glow (Active Theory signature effect)
    vec3 rimColor1 = glowColor * rim1 * hoverIntensity * 2.0;
    vec3 rimColor2 = glowColor * rim2 * hoverIntensity * 3.5;
    vec3 rimColor3 = glowColor * rim3 * hoverIntensity * 1.5;
    
    finalColor = finalColor + rimColor1 + rimColor2 + rimColor3;
    
    // Active Theory style: strong edge highlight
    float edgeStrength = smoothstep(0.7, 1.0, fresnel);
    vec3 edgeGlow = glowColor * edgeStrength * hoverProgress * 4.0;
    finalColor = finalColor + edgeGlow;
    
    // Gradient overlay on hover
    float gradientMask = smoothstep(0.0, 1.0, vUv.y);
    vec3 gradientColor = mix(glowColor * 0.3, glowColor * 0.1, gradientMask);
    finalColor = finalColor + gradientColor * hoverProgress;
    
    // Overall brightness and saturation boost
    float brightness = 1.0 + (hoverProgress * 0.4);
    finalColor = finalColor * brightness;
    
    // Color temperature shift on hover (warmer/cooler based on glowColor)
    vec3 colorShift = mix(vec3(1.0), glowColor * 1.2, hoverProgress * 0.3);
    finalColor = finalColor * colorShift;
    
    // Subtle vignette effect
    float vignette = smoothstep(0.8, 0.3, length(vUv - vec2(0.5)));
    finalColor = mix(finalColor * 0.7, finalColor, vignette);
    
    // Distance fade
    float distanceFade = smoothstep(1000.0, 300.0, vDistanceFromCamera);
    float finalOpacity = opacity * distanceFade;
    
    gl_FragColor = vec4(finalColor, texColor.a * finalOpacity);
}
`;

// Card Data
const CARD_DATA = [
    {
        title: 'Custom Development',
        category: 'Development',
        color: '#2B3990',
        items: ['CMS Development', 'Web Applications', 'Mobile Apps'],
        icon: '💻'
    },
    {
        title: 'Cloud & DevOps',
        category: 'Infrastructure',
        color: '#4a5fc1',
        items: ['Performance Optimization', '24/7 Monitoring', 'Cloud Migration'],
        icon: '☁️'
    },
    {
        title: 'AI & Data Solutions',
        category: 'AI/ML',
        color: '#6b7ed8',
        items: ['NLP Solutions', 'Machine Learning Models', 'Data Analytics'],
        icon: '🤖'
    }
];

class SpiralGallery {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, this.container.clientWidth / this.container.clientHeight, 1, 3000);
        this.camera.position.set(0, 0, 400); // Better viewing distance
        
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.cards = [];
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.time = 0;
        // Start with first card visible immediately
        this.scrollY = 0;
        this.targetScrollY = 0;
        this.scrollVelocity = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.hoveredCard = null;

        this.init();
    }

    init() {
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x10b981, 1, 500);
        pointLight.position.set(100, 100, 200);
        this.scene.add(pointLight);

        // Create cards
        this.createCards();

        // Events
        window.addEventListener('resize', () => this.onResize());
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('wheel', (e) => this.onWheel(e));

        // Animate
        this.animate();
    }

    createCardTexture(data) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 288;
        const ctx = canvas.getContext('2d');

        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : { r: 16, g: 185, b: 129 };
        };

        const rgb = hexToRgb(data.color);
        
        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`);
        gradient.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle border with glow
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6)`;
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        // Inner glow effect
        ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

        // Icon - smaller
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(data.icon, canvas.width / 2, 80);

        // Title with shadow - smaller
        ctx.shadowColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 3;
        
        ctx.font = 'bold 32px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(data.title, canvas.width / 2, 160);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;

        // Category badge - smaller
        const badgeWidth = 140;
        const badgeHeight = 30;
        const badgeX = (canvas.width - badgeWidth) / 2;
        const badgeY = 210;
        
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`;
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 15);
        ctx.fill();
        
        ctx.strokeStyle = data.color;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = data.color;
        ctx.fillText(data.category, canvas.width / 2, badgeY + badgeHeight / 2);

        // Services count - smaller
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#aaaaaa';
        ctx.fillText(`${data.items.length} Services`, canvas.width / 2, 260);

        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        return texture;
    }

    createCards() {
        const count = 18;
        const radius = 280;
        const verticalGap = 70;

        for (let i = 0; i < count; i++) {
            const dataIndex = i % CARD_DATA.length;
            const data = CARD_DATA[dataIndex];
            
            const texture = this.createCardTexture(data);
            
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

            const material = new THREE.ShaderMaterial({
                uniforms: {
                    map: { value: texture },
                    time: { value: 0 },
                    mousePosition: { value: new THREE.Vector2(0, 0) },
                    scrollVelocity: { value: 0 },
                    hoverProgress: { value: 0 },
                    opacity: { value: 1 },
                    glowColor: { value: hexToVec3(data.color) },
                    camPos: { value: new THREE.Vector3() }
                },
                vertexShader,
                fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                depthWrite: false
            });

            // Smaller, more compact cards - 100x60
            const geometry = new THREE.PlaneGeometry(100, 60, 64, 64);
            const mesh = new THREE.Mesh(geometry, material);

            // Initial positioning - cards arranged in spiral
            const angle = (i / count) * Math.PI * 2 * 2.5;
            mesh.position.x = Math.cos(angle) * radius;
            mesh.position.y = i * verticalGap - (count * verticalGap) / 2;
            mesh.position.z = Math.sin(angle) * radius;

            // Face camera (not center) so text appears correctly
            mesh.lookAt(this.camera.position);

            this.scene.add(mesh);
            this.cards.push({ 
                mesh, 
                data, 
                hoverProgress: 0, 
                targetHover: 0,
                index: i,
                baseAngle: angle,
                originalPosition: mesh.position.clone(),
                targetPosition: mesh.position.clone()
            });
        }
    }

    onMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.cards.map(c => c.mesh));

        // Reset all cards
        this.cards.forEach(card => {
            card.targetHover = 0;
        });

        // Handle hovered card - Active Theory style (no position change, just visual effects)
        if (intersects.length > 0) {
            const intersected = this.cards.find(c => c.mesh === intersects[0].object);
            if (intersected) {
                intersected.targetHover = 1;
                this.hoveredCard = intersected;
            }
        } else {
            this.hoveredCard = null;
        }
    }

    onWheel(event) {
        // Balanced scroll boundaries - centered at 0 for immediate visibility
        const minScroll = -4.0; // Can scroll up
        const maxScroll = 4.0;  // Can scroll down through all cards
        const delta = event.deltaY > 0 ? 1 : -1;
        const nextScroll = this.targetScrollY + delta * 0.08; // Slower scroll - reduced from 0.2
        
        // Check if at boundaries
        const atTopBoundary = delta < 0 && this.targetScrollY <= minScroll;
        const atBottomBoundary = delta > 0 && this.targetScrollY >= maxScroll;
        
        // Only capture scroll if within boundaries
        if (!atTopBoundary && !atBottomBoundary) {
            event.preventDefault();
            event.stopPropagation();
            
            // Apply scroll with boundaries
            this.targetScrollY = Math.max(minScroll, Math.min(maxScroll, nextScroll));
            
            // Track scrolling state
            this.isScrolling = true;
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 100); // Faster response
        }
        // At boundary: allow native page scroll (no preventDefault)
    }

    onResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.time += 0.016;
        
        // Smooth scroll interpolation - slower and smoother
        const scrollDiff = this.targetScrollY - this.scrollY;
        this.scrollY += scrollDiff * 0.08; // Slower, smoother response (reduced from 0.12)
        this.scrollVelocity = scrollDiff;

        const radius = 280;
        const verticalGap = 60; // Perfect spacing for one card focus
        const totalCards = this.cards.length;

        // Update cards with spiral motion - slower movement
        this.cards.forEach((card, i) => {
            // Calculate spiral position - slower scroll multiplier
            const scrollOffset = this.scrollY * 2.5; // Reduced from 3.0 for slower movement
            const adjustedIndex = i + scrollOffset;
            
            // Spiral angle - maintains perfect spiral up and down
            const angle = (adjustedIndex / totalCards) * Math.PI * 2 * 2.5;
            
            // Target position in spiral (always maintains spiral shape)
            const targetX = Math.cos(angle) * radius;
            const targetY = (adjustedIndex * verticalGap) - (totalCards * verticalGap) / 2;
            const targetZ = Math.sin(angle) * radius;
            
            // Smooth interpolation for spiral movement (both directions)
            card.mesh.position.x += (targetX - card.mesh.position.x) * 0.18;
            card.mesh.position.y += (targetY - card.mesh.position.y) * 0.18;
            card.mesh.position.z += (targetZ - card.mesh.position.z) * 0.18;
            
            // Always face camera so text is readable (not mirrored)
            card.mesh.lookAt(this.camera.position);

            // Active Theory style: very smooth hover transition
            const hoverSpeed = card.targetHover > card.hoverProgress ? 0.12 : 0.08;
            card.hoverProgress += (card.targetHover - card.hoverProgress) * hoverSpeed;
            
            // Update shader uniforms
            card.mesh.material.uniforms.time.value = this.time;
            card.mesh.material.uniforms.hoverProgress.value = card.hoverProgress;
            card.mesh.material.uniforms.camPos.value.copy(this.camera.position);

            // Active Theory style: Show one card clearly at a time
            const distFromCenter = Math.abs(card.mesh.position.y);
            const distFromCamera = card.mesh.position.distanceTo(this.camera.position);
            
            // Sharp focus on center card, fade others quickly
            let targetOpacity = 1.0;
            if (distFromCenter > 100) {
                // Sharp falloff - only center card visible
                targetOpacity = Math.max(0.05, 1 - (distFromCenter - 100) / 200);
            }
            if (distFromCamera > 450) {
                targetOpacity *= Math.max(0.02, 1 - (distFromCamera - 450) / 250);
            }
            
            // Smooth opacity transition
            const currentOpacity = card.mesh.material.uniforms.opacity.value;
            card.mesh.material.uniforms.opacity.value += (targetOpacity - currentOpacity) * 0.15;
            
            // Completely fixed scale - NO hover changes at all
            const baseScale = 1.0; // Fixed size always
            card.mesh.scale.setScalar(baseScale);
        });

        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new SpiralGallery('spiral-gallery-container');
    });
} else {
    new SpiralGallery('spiral-gallery-container');
}
