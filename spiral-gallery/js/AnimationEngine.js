import { gsap } from 'gsap';

export class AnimationEngine {
    constructor(spiralController, cardManager) {
        this.spiralController = spiralController;
        this.cardManager = cardManager;
        
        this.scrollPosition = 0;
        this.targetScrollPosition = 0;
        this.velocity = 0;
        this.damping = 0.95;
        this.sensitivity = 0.001;
        this.maxVelocity = 0.5;
        
        this.isAutoRotating = false;
        this.autoRotateSpeed = 0.001;
        this.idleTime = 0;
        this.idleThreshold = 3000; // 3 seconds
        this.lastInteractionTime = Date.now();
        
        this.rotation = 0;
        this.targetRotation = 0;
        
        this.isEnabled = true;
        
        this.init();
    }

    init() {
        // Wheel event for scroll
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // Touch events for mobile
        this.touchStartY = 0;
        this.touchVelocity = 0;
        
        window.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        console.log('✓ AnimationEngine initialized');
    }

    handleWheel(e) {
        if (!this.isEnabled) return;
        
        e.preventDefault();
        
        // Reset idle timer
        this.lastInteractionTime = Date.now();
        this.isAutoRotating = false;
        
        // Normalize delta across browsers
        let deltaY = e.deltaY;
        
        if (e.deltaMode === 1) { // DOM_DELTA_LINE
            deltaY *= 33.33;
        } else if (e.deltaMode === 2) { // DOM_DELTA_PAGE
            deltaY *= 100;
        }
        
        // Add to velocity
        this.velocity += deltaY * this.sensitivity;
        this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));
        
        // Pass to card manager
        this.cardManager.addScrollVelocity(deltaY * this.sensitivity * 10);
    }

    handleTouchStart(e) {
        if (!this.isEnabled || e.touches.length === 0) return;
        
        this.touchStartY = e.touches[0].clientY;
        this.touchVelocity = 0;
        this.lastInteractionTime = Date.now();
        this.isAutoRotating = false;
    }

    handleTouchMove(e) {
        if (!this.isEnabled || e.touches.length === 0) return;
        
        e.preventDefault();
        
        const touchY = e.touches[0].clientY;
        const deltaY = this.touchStartY - touchY;
        
        this.touchVelocity = deltaY * 0.02;
        this.velocity += this.touchVelocity * this.sensitivity;
        this.velocity = Math.max(-this.maxVelocity, Math.min(this.maxVelocity, this.velocity));
        
        this.touchStartY = touchY;
        
        // Pass to card manager
        this.cardManager.addScrollVelocity(deltaY * 0.02);
    }

    handleTouchEnd(e) {
        // Velocity will naturally decay
    }

    update(deltaTime) {
        if (!this.isEnabled) return;
        
        // Check for idle state
        const currentTime = Date.now();
        this.idleTime = currentTime - this.lastInteractionTime;
        
        if (this.idleTime > this.idleThreshold && !this.isAutoRotating) {
            this.isAutoRotating = true;
        }
        
        // Auto-rotate when idle
        if (this.isAutoRotating) {
            this.velocity += this.autoRotateSpeed;
        }
        
        // Apply velocity to scroll position
        this.scrollPosition += this.velocity;
        
        // Apply damping
        this.velocity *= this.damping;
        
        // Stop if velocity is very small
        if (Math.abs(this.velocity) < 0.0001) {
            this.velocity = 0;
        }
        
        // Update spiral rotation
        this.updateSpiralRotation();
    }

    updateSpiralRotation() {
        // Calculate rotation based on scroll position
        const rotationAmount = this.scrollPosition * 2;
        
        // Update card positions along spiral
        const cards = this.cardManager.getCards();
        const totalCards = cards.length;
        
        cards.forEach((card, index) => {
            // Calculate progress along spiral with scroll offset
            let progress = (index / totalCards) + rotationAmount;
            
            // Wrap around for infinite scroll
            progress = progress % 1;
            if (progress < 0) progress += 1;
            
            // Get position from spiral
            const pointData = this.spiralController.getPointAt(progress);
            
            // Update card target position and rotation
            card.targetPosition.copy(pointData.position);
            card.targetRotation.copy(pointData.rotation);
            
            // Fade based on distance from center view
            const centerProgress = 0.5;
            const distanceFromCenter = Math.abs(progress - centerProgress);
            card.targetOpacity = 1 - Math.min(distanceFromCenter * 2, 0.7);
        });
    }

    animateToCard(cardIndex, duration = 1200) {
        // Animate scroll to specific card
        const cards = this.cardManager.getCards();
        const totalCards = cards.length;
        
        const targetProgress = cardIndex / totalCards;
        const currentProgress = this.scrollPosition % 1;
        
        const targetScroll = this.scrollPosition + (targetProgress - currentProgress);
        
        gsap.to(this, {
            scrollPosition: targetScroll,
            duration: duration / 1000,
            ease: 'power3.out',
            onUpdate: () => {
                this.updateSpiralRotation();
            }
        });
        
        this.lastInteractionTime = Date.now();
        this.isAutoRotating = false;
    }

    staggerCardsIn() {
        // Entrance animation for cards
        const cards = this.cardManager.getCards();
        
        cards.forEach((card, index) => {
            card.opacity = 0;
            card.targetOpacity = 0;
            card.scale.set(0.5, 0.5, 0.5);
            
            gsap.to(card, {
                targetOpacity: 1,
                duration: 0.8,
                delay: index * 0.05,
                ease: 'power3.out'
            });
            
            gsap.to(card.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.8,
                delay: index * 0.05,
                ease: 'back.out(1.7)'
            });
        });
    }

    reset() {
        this.scrollPosition = 0;
        this.targetScrollPosition = 0;
        this.velocity = 0;
        this.rotation = 0;
        this.targetRotation = 0;
        this.updateSpiralRotation();
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.velocity = 0;
        }
    }

    dispose() {
        window.removeEventListener('wheel', (e) => this.handleWheel(e));
        window.removeEventListener('touchstart', (e) => this.handleTouchStart(e));
        window.removeEventListener('touchmove', (e) => this.handleTouchMove(e));
        window.removeEventListener('touchend', (e) => this.handleTouchEnd(e));
    }
}
