import * as THREE from 'three';
import { gsap } from 'gsap';

export class InteractionHandler {
    constructor(camera, scene, cardManager, animationEngine) {
        this.camera = camera;
        this.scene = scene;
        this.cardManager = cardManager;
        this.animationEngine = animationEngine;
        
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-999, -999);
        this.mouseWorld = new THREE.Vector2(0, 0);
        
        this.hoveredCard = null;
        this.selectedCard = null;
        this.focusedCardIndex = -1;
        
        this.isDetailViewOpen = false;
        
        this.throttleDelay = 33; // ~30fps for raycasting
        this.lastRaycastTime = 0;
        
        this.init();
    }

    init() {
        // Mouse/Touch move
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e), { passive: true });
        window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: true });
        
        // Click/Tap
        window.addEventListener('click', (e) => this.handleClick(e));
        window.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Keyboard
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        // Detail view close button
        const closeBtn = document.getElementById('close-detail');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDetailView());
        }
        
        // Close on overlay click
        const overlay = document.getElementById('card-detail-overlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.closeDetailView();
                }
            });
        }
        
        console.log('✓ InteractionHandler initialized');
    }

    handleMouseMove(e) {
        const currentTime = performance.now();
        
        // Update mouse position for shaders
        const x = (e.clientX / window.innerWidth) * 2 - 1;
        const y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        this.mouse.set(x, y);
        
        // Convert to world space for shaders
        this.mouseWorld.set(
            (e.clientX - window.innerWidth / 2),
            -(e.clientY - window.innerHeight / 2)
        );
        
        this.cardManager.setMousePosition(this.mouseWorld.x, this.mouseWorld.y);
        
        // Throttled raycasting
        if (currentTime - this.lastRaycastTime > this.throttleDelay) {
            this.performRaycast();
            this.lastRaycastTime = currentTime;
        }
    }

    handleTouchMove(e) {
        if (e.touches.length === 0) return;
        
        const touch = e.touches[0];
        const x = (touch.clientX / window.innerWidth) * 2 - 1;
        const y = -(touch.clientY / window.innerHeight) * 2 + 1;
        
        this.mouse.set(x, y);
        
        this.mouseWorld.set(
            (touch.clientX - window.innerWidth / 2),
            -(touch.clientY - window.innerHeight / 2)
        );
        
        this.cardManager.setMousePosition(this.mouseWorld.x, this.mouseWorld.y);
    }

    performRaycast() {
        if (this.isDetailViewOpen) return;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get all card meshes
        const cardMeshes = this.cardManager.getCards()
            .filter(card => card.meshObject && card.meshObject.visible)
            .map(card => card.meshObject);
        
        const intersects = this.raycaster.intersectObjects(cardMeshes, false);
        
        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const card = this.cardManager.getCards().find(c => c.meshObject === intersectedMesh);
            
            if (card && card !== this.hoveredCard) {
                // Unhover previous card
                if (this.hoveredCard) {
                    this.hoveredCard.setHovered(false);
                }
                
                // Hover new card
                this.hoveredCard = card;
                this.hoveredCard.setHovered(true);
                
                // Change cursor
                document.body.style.cursor = 'pointer';
                
                // Announce to screen readers
                this.announceToScreenReader(`Hovering ${card.data.title}`);
            }
        } else {
            // Unhover
            if (this.hoveredCard) {
                this.hoveredCard.setHovered(false);
                this.hoveredCard = null;
                document.body.style.cursor = 'default';
            }
        }
    }

    handleClick(e) {
        if (this.isDetailViewOpen) return;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const cardMeshes = this.cardManager.getCards()
            .filter(card => card.meshObject && card.meshObject.visible)
            .map(card => card.meshObject);
        
        const intersects = this.raycaster.intersectObjects(cardMeshes, false);
        
        if (intersects.length > 0) {
            const intersectedMesh = intersects[0].object;
            const card = this.cardManager.getCards().find(c => c.meshObject === intersectedMesh);
            
            if (card) {
                this.selectCard(card);
            }
        }
    }

    handleTouchEnd(e) {
        // Use last known mouse position for tap detection
        setTimeout(() => {
            this.handleClick(e);
        }, 10);
    }

    selectCard(card) {
        this.selectedCard = card;
        this.focusedCardIndex = card.index;
        
        // Open detail view
        this.openDetailView(card.data);
        
        // Disable animation engine
        this.animationEngine.setEnabled(false);
        
        // Announce to screen readers
        this.announceToScreenReader(`Selected ${card.data.title}. Press Escape to close.`);
    }

    openDetailView(data) {
        this.isDetailViewOpen = true;
        
        const overlay = document.getElementById('card-detail-overlay');
        const icon = document.getElementById('detail-icon');
        const title = document.getElementById('detail-title');
        const category = document.getElementById('detail-category');
        const itemsList = document.getElementById('detail-items');
        
        if (overlay && icon && title && category && itemsList) {
            icon.textContent = data.icon;
            title.textContent = data.title;
            category.textContent = data.category;
            category.style.color = data.color;
            
            // Clear and populate items
            itemsList.innerHTML = '';
            data.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                itemsList.appendChild(li);
            });
            
            // Show overlay
            overlay.classList.add('active');
            
            // Hide instructions
            const instructions = document.getElementById('instructions');
            if (instructions) {
                instructions.classList.add('hidden');
            }
            
            // Blur other cards
            this.blurOtherCards(this.selectedCard);
        }
    }

    closeDetailView() {
        this.isDetailViewOpen = false;
        
        const overlay = document.getElementById('card-detail-overlay');
        if (overlay) {
            overlay.classList.remove('active');
        }
        
        // Show instructions
        const instructions = document.getElementById('instructions');
        if (instructions) {
            instructions.classList.remove('hidden');
        }
        
        // Unblur cards
        this.unblurCards();
        
        // Re-enable animation engine
        this.animationEngine.setEnabled(true);
        
        this.selectedCard = null;
        
        // Announce to screen readers
        this.announceToScreenReader('Detail view closed');
    }

    blurOtherCards(selectedCard) {
        const cards = this.cardManager.getCards();
        
        cards.forEach(card => {
            if (card !== selectedCard) {
                gsap.to(card, {
                    targetOpacity: 0.2,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(card, {
                    targetOpacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        });
    }

    unblurCards() {
        const cards = this.cardManager.getCards();
        
        cards.forEach(card => {
            gsap.to(card, {
                targetOpacity: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    }

    handleKeyDown(e) {
        switch(e.key) {
            case 'Escape':
                if (this.isDetailViewOpen) {
                    this.closeDetailView();
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                this.animationEngine.velocity += 0.01;
                this.animationEngine.lastInteractionTime = Date.now();
                this.animationEngine.isAutoRotating = false;
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                this.animationEngine.velocity -= 0.01;
                this.animationEngine.lastInteractionTime = Date.now();
                this.animationEngine.isAutoRotating = false;
                break;
                
            case 'Tab':
                e.preventDefault();
                this.cycleCardFocus(e.shiftKey ? -1 : 1);
                break;
                
            case 'Enter':
                if (this.focusedCardIndex >= 0 && !this.isDetailViewOpen) {
                    const cards = this.cardManager.getCards();
                    const card = cards[this.focusedCardIndex];
                    if (card) {
                        this.selectCard(card);
                    }
                }
                break;
        }
    }

    cycleCardFocus(direction) {
        const cards = this.cardManager.getCards();
        
        if (this.focusedCardIndex < 0) {
            this.focusedCardIndex = 0;
        } else {
            this.focusedCardIndex += direction;
            
            if (this.focusedCardIndex < 0) {
                this.focusedCardIndex = cards.length - 1;
            } else if (this.focusedCardIndex >= cards.length) {
                this.focusedCardIndex = 0;
            }
        }
        
        // Animate to focused card
        this.animationEngine.animateToCard(this.focusedCardIndex, 800);
        
        const card = cards[this.focusedCardIndex];
        if (card) {
            this.announceToScreenReader(`Focused on ${card.data.title}`);
        }
    }

    announceToScreenReader(message) {
        const announcer = document.getElementById('sr-announcements');
        if (announcer) {
            announcer.textContent = message;
        }
    }

    update(deltaTime) {
        // Update logic if needed
    }

    dispose() {
        window.removeEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.removeEventListener('touchmove', (e) => this.handleTouchMove(e));
        window.removeEventListener('click', (e) => this.handleClick(e));
        window.removeEventListener('touchend', (e) => this.handleTouchEnd(e));
        window.removeEventListener('keydown', (e) => this.handleKeyDown(e));
    }
}
