// ==================== FOOTER JAVASCRIPT (SEPARATE FILE) ====================

// Load Footer HTML
document.addEventListener('DOMContentLoaded', () => {
    const footerHTML = `
    <footer class="footer">
        <div class="footer-container">
            <div class="footer-top">
                <div class="footer-brand">
                    <div class="footer-logo">
                        <div class="logo-icon-footer"></div>
                        <span class="footer-logo-text">LOGICLAYER LABS</span>
                    </div>
                    <p class="footer-tagline">Building innovative solutions for tomorrow's challenges</p>
                    <div class="footer-social">
                        <a href="#" class="social-link" data-platform="github">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" data-platform="linkedin">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" data-platform="twitter">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" data-platform="facebook">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" data-platform="instagram">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                        </a>
                        <a href="#" class="social-link" data-platform="youtube">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                            </svg>
                        </a>
                    </div>
                </div>

                <div class="footer-links">
                    <div class="footer-column">
                        <h4 class="footer-heading">Company</h4>
                        <ul class="footer-list">
                            <li><a href="#" class="footer-link">About Us</a></li>
                            <li><a href="#" class="footer-link">Careers</a></li>
                            <li><a href="#" class="footer-link">Blog</a></li>
                            <li><a href="#" class="footer-link">Press Kit</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4 class="footer-heading">Services</h4>
                        <ul class="footer-list">
                            <li><a href="#" class="footer-link">Web Development</a></li>
                            <li><a href="#" class="footer-link">Mobile Apps</a></li>
                            <li><a href="#" class="footer-link">Cloud Solutions</a></li>
                            <li><a href="#" class="footer-link">Consulting</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4 class="footer-heading">Resources</h4>
                        <ul class="footer-list">
                            <li><a href="#" class="footer-link">Documentation</a></li>
                            <li><a href="#" class="footer-link">API Reference</a></li>
                            <li><a href="#" class="footer-link">Community</a></li>
                            <li><a href="#" class="footer-link">Support</a></li>
                        </ul>
                    </div>

                    <div class="footer-column">
                        <h4 class="footer-heading">Legal</h4>
                        <ul class="footer-list">
                            <li><a href="#" class="footer-link">Privacy Policy</a></li>
                            <li><a href="#" class="footer-link">Terms of Service</a></li>
                            <li><a href="#" class="footer-link">Cookie Policy</a></li>
                            <li><a href="#" class="footer-link">GDPR</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="footer-bottom-content">
                    <p class="footer-copyright">
                        © 2025 <span class="copyright-brand">LogicLayer Labs</span>. All rights reserved.
                    </p>
                    <div class="footer-badges">
                        <span class="badge-item">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M12 0L9.19 8.63H0l7.39 5.38L4.58 23 12 17.62 19.42 23l-2.81-8.99L24 8.63h-9.19L12 0z"/>
                            </svg>
                            Top Rated
                        </span>
                        <span class="badge-item">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                            Certified
                        </span>
                        <span class="badge-item">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                            5.0 Rating
                        </span>
                    </div>
                </div>
            </div>

            <div class="footer-bg-animation">
                <div class="footer-circle footer-circle-1"></div>
                <div class="footer-circle footer-circle-2"></div>
                <div class="footer-circle footer-circle-3"></div>
            </div>
        </div>
    </footer>
    `;

    // Insert footer HTML
    document.getElementById('footer-placeholder').innerHTML = footerHTML;

    // Initialize footer animations after a brief delay
    setTimeout(() => {
        initFooterAnimations();
    }, 100);
});

// Footer Animation Functions
function initFooterAnimations() {
    // Scroll reveal animation
    const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    const footerElements = document.querySelectorAll('.footer-brand, .footer-column');
    footerElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease';
        footerObserver.observe(element);
    });

    // Social links particle burst
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            for (let i = 0; i < 6; i++) {
                createParticleBurst(e.currentTarget);
            }
        });
    });

    // Footer links ripple effect
    const footerLinks = document.querySelectorAll('.footer-link');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: rgba(255, 215, 0, 0.5);
                border-radius: 50%;
                transform: scale(0);
                animation: footerRipple 0.6s ease-out;
                pointer-events: none;
            `;
            const rect = this.getBoundingClientRect();
            ripple.style.left = (e.clientX - rect.left) + 'px';
            ripple.style.top = (e.clientY - rect.top) + 'px';
            this.style.position = 'relative';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Magnetic badges
    const badges = document.querySelectorAll('.badge-item');
    badges.forEach(badge => {
        badge.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
        });
        badge.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // Add ripple keyframe
    if (!document.getElementById('footer-ripple-style')) {
        const style = document.createElement('style');
        style.id = 'footer-ripple-style';
        style.textContent = `
            @keyframes footerRipple {
                to {
                    transform: scale(10);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Particle burst effect
function createParticleBurst(element) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: #FFD700;
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
    `;
    
    const rect = element.getBoundingClientRect();
    particle.style.left = rect.left + rect.width / 2 + 'px';
    particle.style.top = rect.top + rect.height / 2 + 'px';
    
    document.body.appendChild(particle);
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = 2 + Math.random() * 2;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    let x = 0, y = 0, opacity = 1;
    
    function animate() {
        x += vx;
        y += vy;
        opacity -= 0.02;
        
        particle.style.transform = `translate(${x}px, ${y}px)`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
            requestAnimationFrame(animate);
        } else {
            particle.remove();
        }
    }
    
    animate();
}
