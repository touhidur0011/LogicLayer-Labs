import './style.css';
import { SceneManager } from './js/SceneManager.js';
import { SpiralController } from './js/SpiralController.js';
import { CardManager } from './js/CardManager.js';
import { AnimationEngine } from './js/AnimationEngine.js';
import { InteractionHandler } from './js/InteractionHandler.js';
import { ParticleSystem } from './js/ParticleSystem.js';

// Import shaders as strings
import vertexShaderSource from './shaders/vertex.glsl?raw';
import fragmentShaderSource from './shaders/fragment.glsl?raw';

class SpiralGalleryApp {
    constructor() {
        this.canvas = null;
        this.sceneManager = null;
        this.spiralController = null;
        this.cardManager = null;
        this.animationEngine = null;
        this.interactionHandler = null;
        this.particleSystem = null;
        
        this.isInitialized = false;
        this.loadingProgress = 0;
        
        this.init();
    }

    async init() {
        console.log('🚀 Initializing Spiral Gallery...');
        
        try {
            // Check WebGL support
            if (!this.checkWebGLSupport()) {
                this.showNoWebGLMessage();
                return;
            }

            // Get canvas
            this.canvas = document.getElementById('spiral-canvas');
            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            // Show loading
            this.updateLoadingProgress(10);

            // Initialize SceneManager
            this.sceneManager = new SceneManager(this.canvas);
            this.updateLoadingProgress(20);

            // Initialize SpiralController
            this.spiralController = new SpiralController({
                radius: 300,
                verticalSpacing: 80,
                rotations: 2,
                segments: 50
            });
            this.updateLoadingProgress(30);

            // Optionally show debug line (comment out in production)
            // this.spiralController.createDebugLine(this.sceneManager.scene);

            // Initialize CardManager with shaders
            this.cardManager = new CardManager(
                this.sceneManager.scene,
                this.spiralController,
                vertexShaderSource,
                fragmentShaderSource
            );
            
            // Wait for cards to be created
            await this.waitForCardsInit();
            this.updateLoadingProgress(60);

            // Initialize ParticleSystem
            this.particleSystem = new ParticleSystem(
                this.sceneManager.scene,
                this.spiralController
            );
            this.updateLoadingProgress(70);

            // Initialize AnimationEngine
            this.animationEngine = new AnimationEngine(
                this.spiralController,
                this.cardManager
            );
            this.updateLoadingProgress(80);

            // Initialize InteractionHandler
            this.interactionHandler = new InteractionHandler(
                this.sceneManager.camera,
                this.sceneManager.scene,
                this.cardManager,
                this.animationEngine
            );
            this.updateLoadingProgress(90);

            // Entrance animation for cards
            setTimeout(() => {
                this.animationEngine.staggerCardsIn();
            }, 500);

            // Start render loop
            this.startRenderLoop();
            this.updateLoadingProgress(100);

            // Hide loading screen
            setTimeout(() => {
                this.hideLoadingScreen();
            }, 800);

            this.isInitialized = true;
            console.log('✅ Spiral Gallery initialized successfully!');

        } catch (error) {
            console.error('❌ Failed to initialize Spiral Gallery:', error);
            this.showErrorMessage(error.message);
        }
    }

    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    showNoWebGLMessage() {
        const noWebGL = document.getElementById('no-webgl');
        if (noWebGL) {
            noWebGL.style.display = 'block';
        }
        
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    showErrorMessage(message) {
        const loadingText = document.querySelector('.loading-text');
        if (loadingText) {
            loadingText.textContent = `ERROR: ${message}`;
            loadingText.style.color = '#f97316';
        }
    }

    waitForCardsInit() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (this.cardManager && this.cardManager.cards.length > 0) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 5000);
        });
    }

    updateLoadingProgress(progress) {
        this.loadingProgress = progress;
        
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    hideLoadingScreen() {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('hidden');
        }
    }

    startRenderLoop() {
        this.sceneManager.render((elapsed, deltaTime) => {
            this.update(elapsed, deltaTime);
        });
    }

    update(elapsed, deltaTime) {
        if (!this.isInitialized) return;

        try {
            // Update animation engine
            if (this.animationEngine) {
                this.animationEngine.update(deltaTime);
            }

            // Update card manager
            if (this.cardManager) {
                this.cardManager.update(
                    elapsed,
                    deltaTime,
                    this.sceneManager.camera
                );
            }

            // Update particle system
            if (this.particleSystem) {
                this.particleSystem.update(
                    elapsed,
                    deltaTime,
                    this.animationEngine ? this.animationEngine.velocity : 0
                );
            }

            // Update interaction handler
            if (this.interactionHandler) {
                this.interactionHandler.update(deltaTime);
            }

        } catch (error) {
            console.error('Error in update loop:', error);
        }
    }

    dispose() {
        if (this.interactionHandler) {
            this.interactionHandler.dispose();
        }

        if (this.animationEngine) {
            this.animationEngine.dispose();
        }

        if (this.particleSystem) {
            this.particleSystem.dispose();
        }

        if (this.cardManager) {
            this.cardManager.dispose();
        }

        if (this.spiralController) {
            this.spiralController.dispose();
        }

        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.spiralGallery = new SpiralGalleryApp();
    });
} else {
    window.spiralGallery = new SpiralGalleryApp();
}

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.spiralGallery) {
        window.spiralGallery.dispose();
    }
});

// Handle visibility change (pause when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (window.spiralGallery && window.spiralGallery.animationEngine) {
        if (document.hidden) {
            window.spiralGallery.animationEngine.setEnabled(false);
        } else {
            window.spiralGallery.animationEngine.setEnabled(true);
        }
    }
});

// Export for debugging
export default SpiralGalleryApp;
