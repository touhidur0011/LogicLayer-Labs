import * as THREE from 'three';

export class ParticleSystem {
    constructor(scene, spiralController) {
        this.scene = scene;
        this.spiralController = spiralController;
        this.particleCount = window.innerWidth < 768 ? 500 : 2000;
        this.particles = null;
        this.particleData = [];
        this.time = 0;
        this.scrollVelocity = 0;
        
        this.init();
    }

    init() {
        console.log('Initializing ParticleSystem...');
        
        // Create particle geometry
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const alphas = new Float32Array(this.particleCount);
        
        // Initialize particle data
        for (let i = 0; i < this.particleCount; i++) {
            // Random offset along spiral
            const offset = Math.random();
            const speed = 0.1 + Math.random() * 0.2;
            
            this.particleData.push({
                offset: offset,
                speed: speed,
                turbulence: new THREE.Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2
                )
            });
            
            // Initial position (will be updated)
            const idx = i * 3;
            positions[idx] = 0;
            positions[idx + 1] = 0;
            positions[idx + 2] = 0;
            
            // Size
            sizes[i] = 2 + Math.random() * 3;
            
            // Alpha
            alphas[i] = Math.random();
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
        
        // Create particle texture
        const particleTexture = this.createParticleTexture();
        
        // Create particle material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                particleTexture: { value: particleTexture }
            },
            vertexShader: `
                attribute float size;
                attribute float alpha;
                attribute vec3 color;
                
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vColor = color;
                    vAlpha = alpha;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D particleTexture;
                
                varying vec3 vColor;
                varying float vAlpha;
                
                void main() {
                    vec4 texColor = texture2D(particleTexture, gl_PointCoord);
                    
                    vec3 finalColor = vColor;
                    float finalAlpha = texColor.a * vAlpha;
                    
                    gl_FragColor = vec4(finalColor, finalAlpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // Create points
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
        
        console.log(`✓ ParticleSystem initialized with ${this.particleCount} particles`);
    }

    createParticleTexture() {
        // Create circular gradient texture
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    simplexNoise3D(x, y, z) {
        // Simple noise function for turbulence
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
        
        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);
        
        const u = this.fade(x);
        const v = this.fade(y);
        const w = this.fade(z);
        
        return this.lerp(w, 
            this.lerp(v,
                this.lerp(u, Math.sin(X + Y + Z), Math.cos(X + Y + Z + 1)),
                this.lerp(u, Math.sin(X + Y + Z + 1), Math.cos(X + Y + Z + 2))
            ),
            this.lerp(v,
                this.lerp(u, Math.sin(X + Y + Z + 2), Math.cos(X + Y + Z + 3)),
                this.lerp(u, Math.sin(X + Y + Z + 3), Math.cos(X + Y + Z + 4))
            )
        );
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    update(time, deltaTime, scrollVelocity) {
        if (!this.particles) return;
        
        this.time = time;
        this.scrollVelocity = scrollVelocity || 0;
        
        const positions = this.particles.geometry.attributes.position.array;
        const colors = this.particles.geometry.attributes.color.array;
        const alphas = this.particles.geometry.attributes.alpha.array;
        
        for (let i = 0; i < this.particleCount; i++) {
            const data = this.particleData[i];
            
            // Calculate progress along spiral
            let progress = (data.offset + time * data.speed * 0.05 + this.scrollVelocity * 0.1) % 1;
            if (progress < 0) progress += 1;
            
            // Get position on spiral
            const spiralPoint = this.spiralController.getPointAt(progress);
            
            // Add turbulence
            const noiseScale = 0.002;
            const turbulence = new THREE.Vector3(
                this.simplexNoise3D(
                    spiralPoint.position.x * noiseScale,
                    spiralPoint.position.y * noiseScale + time * 0.5,
                    spiralPoint.position.z * noiseScale
                ) * 20,
                this.simplexNoise3D(
                    spiralPoint.position.x * noiseScale + 100,
                    spiralPoint.position.y * noiseScale + time * 0.5,
                    spiralPoint.position.z * noiseScale + 100
                ) * 20,
                this.simplexNoise3D(
                    spiralPoint.position.x * noiseScale + 200,
                    spiralPoint.position.y * noiseScale + time * 0.5,
                    spiralPoint.position.z * noiseScale + 200
                ) * 20
            );
            
            // Update position
            const idx = i * 3;
            positions[idx] = spiralPoint.position.x + turbulence.x;
            positions[idx + 1] = spiralPoint.position.y + turbulence.y;
            positions[idx + 2] = spiralPoint.position.z + turbulence.z;
            
            // Color shift from blue to purple along path
            const colorProgress = progress;
            const r = 0.06 + (0.39 - 0.06) * colorProgress;
            const g = 0.73 - (0.73 - 0.40) * colorProgress;
            const b = 0.51 + (0.95 - 0.51) * colorProgress;
            
            colors[idx] = r;
            colors[idx + 1] = g;
            colors[idx + 2] = b;
            
            // Fade in/out at endpoints
            let alpha = 1.0;
            if (progress < 0.1) {
                alpha = progress / 0.1;
            } else if (progress > 0.9) {
                alpha = (1.0 - progress) / 0.1;
            }
            
            alphas[i] = alpha * (0.3 + Math.sin(time * 2 + i * 0.1) * 0.2);
        }
        
        // Mark attributes as needing update
        this.particles.geometry.attributes.position.needsUpdate = true;
        this.particles.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.alpha.needsUpdate = true;
        
        // Update shader uniforms
        this.particles.material.uniforms.time.value = time;
    }

    setScrollVelocity(velocity) {
        this.scrollVelocity = velocity;
    }

    dispose() {
        if (this.particles) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
            if (this.particles.material.uniforms.particleTexture.value) {
                this.particles.material.uniforms.particleTexture.value.dispose();
            }
            this.scene.remove(this.particles);
        }
        
        this.particleData = [];
    }
}
