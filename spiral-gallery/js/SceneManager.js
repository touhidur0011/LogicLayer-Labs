import * as THREE from 'three';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.fps = 60;
        this.frameTime = 1000 / this.fps;
        this.lastFrameTime = 0;
        this.performanceMonitor = {
            fps: 60,
            frameCount: 0,
            lastCheck: 0,
            quality: 'high' // high, medium, low
        };

        this.init();
    }

    init() {
        // Create Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 100, 2000);

        // Setup Camera (responsive)
        this.setupCamera();

        // Setup Renderer
        this.setupRenderer();

        // Setup Lights
        this.setupLights();

        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        console.log('✓ SceneManager initialized');
    }

    setupCamera() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            // Orthographic camera for mobile
            const aspect = window.innerWidth / window.innerHeight;
            const frustumSize = 800;
            this.camera = new THREE.OrthographicCamera(
                frustumSize * aspect / -2,
                frustumSize * aspect / 2,
                frustumSize / 2,
                frustumSize / -2,
                1,
                3000
            );
            this.camera.position.set(0, 0, 800);
        } else {
            // Perspective camera for desktop
            this.camera = new THREE.PerspectiveCamera(
                65,
                window.innerWidth / window.innerHeight,
                1,
                3000
            );
            this.camera.position.set(0, 0, 600);
        }

        this.camera.lookAt(0, 0, 0);
    }

    setupRenderer() {
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
    }

    setupLights() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional Light (key light)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);

        // Point Light (accent)
        const pointLight1 = new THREE.PointLight(0x10b981, 1, 500);
        pointLight1.position.set(-200, 100, 200);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x6366f1, 1, 500);
        pointLight2.position.set(200, -100, 200);
        this.scene.add(pointLight2);

        // Hemisphere Light
        const hemisphereLight = new THREE.HemisphereLight(0x6366f1, 0x10b981, 0.3);
        this.scene.add(hemisphereLight);
    }

    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;

        if (this.camera.isPerspectiveCamera) {
            this.camera.aspect = aspect;
        } else {
            const frustumSize = 800;
            this.camera.left = frustumSize * aspect / -2;
            this.camera.right = frustumSize * aspect / 2;
            this.camera.top = frustumSize / 2;
            this.camera.bottom = frustumSize / -2;
        }

        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    monitorPerformance(currentTime) {
        this.performanceMonitor.frameCount++;

        if (currentTime - this.performanceMonitor.lastCheck >= 1000) {
            this.performanceMonitor.fps = this.performanceMonitor.frameCount;
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastCheck = currentTime;

            // Adjust quality based on FPS
            if (this.performanceMonitor.fps < 30 && this.performanceMonitor.quality === 'high') {
                this.performanceMonitor.quality = 'medium';
                console.warn('⚠ Performance: Switching to medium quality');
            } else if (this.performanceMonitor.fps < 20 && this.performanceMonitor.quality === 'medium') {
                this.performanceMonitor.quality = 'low';
                console.warn('⚠ Performance: Switching to low quality');
            } else if (this.performanceMonitor.fps > 50 && this.performanceMonitor.quality === 'medium') {
                this.performanceMonitor.quality = 'high';
                console.log('✓ Performance: Switching to high quality');
            }
        }
    }

    render(callback) {
        const currentTime = performance.now();
        const deltaTime = currentTime - this.lastFrameTime;

        // Target 60fps
        if (deltaTime >= this.frameTime) {
            this.lastFrameTime = currentTime - (deltaTime % this.frameTime);

            // Monitor performance
            this.monitorPerformance(currentTime);

            // Call user callback
            if (callback) {
                const elapsed = this.clock.getElapsedTime();
                callback(elapsed, deltaTime / 1000);
            }

            // Render scene
            this.renderer.render(this.scene, this.camera);
        }

        requestAnimationFrame(() => this.render(callback));
    }

    getQuality() {
        return this.performanceMonitor.quality;
    }

    getFPS() {
        return this.performanceMonitor.fps;
    }

    dispose() {
        this.renderer.dispose();
        window.removeEventListener('resize', () => this.handleResize());
    }
}
