// Loading Animation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        initParticles();
    }, 2000);
});

// ========== GLASSMORPHISM HEADER EFFECTS ==========

// Particle Animation System
let particleCanvas, particleCtx, particles = [];

function initParticles() {
    particleCanvas = document.getElementById('particleCanvas');
    if (!particleCanvas) return;
    
    particleCtx = particleCanvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        particleCanvas.width = particleCanvas.offsetWidth;
        particleCanvas.height = particleCanvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Create particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * particleCanvas.width,
            y: Math.random() * particleCanvas.height,
            radius: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
    
    animateParticles();
}

function animateParticles() {
    if (!particleCtx) return;
    
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    
    particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > particleCanvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > particleCanvas.height) particle.vy *= -1;
        
        // Draw particle
        particleCtx.beginPath();
        particleCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleCtx.fillStyle = `rgba(43, 57, 144, ${particle.opacity})`;
        particleCtx.fill();
        
        // Connect particles with lines
        particles.forEach((otherParticle, otherIndex) => {
            if (index !== otherIndex) {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    particleCtx.beginPath();
                    particleCtx.strokeStyle = `rgba(43, 57, 144, ${0.1 * (1 - distance / 100)})`;
                    particleCtx.lineWidth = 0.5;
                    particleCtx.moveTo(particle.x, particle.y);
                    particleCtx.lineTo(otherParticle.x, otherParticle.y);
                    particleCtx.stroke();
                }
            }
        });
    });
    
    requestAnimationFrame(animateParticles);
}

// Magnetic Hover Effect for Nav Items
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const moveX = deltaX * 8;
        const moveY = deltaY * 8;
        
        link.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translate(0, 0)';
    });
});

// Active State Indicator Animation
const activeIndicator = document.getElementById('activeIndicator');
const navMenu = document.getElementById('navMenu');

function updateActiveIndicator() {
    const activeLink = document.querySelector('.nav-link.active');
    if (activeLink && activeIndicator) {
        const linkRect = activeLink.getBoundingClientRect();
        const menuRect = navMenu.getBoundingClientRect();
        
        const left = linkRect.left - menuRect.left;
        const width = linkRect.width;
        
        activeIndicator.style.width = `${width}px`;
        activeIndicator.style.left = `${left}px`;
    }
}

// Update indicator on page load
setTimeout(() => {
    updateActiveIndicator();
}, 2500);

// Update indicator when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        updateActiveIndicator();
    });
});

// Update indicator on window resize
window.addEventListener('resize', updateActiveIndicator);

// Testimonial Slider - Tech Stack
const testimonials = [
    { name: 'React.js', role: 'Frontend Framework' },
    { name: 'Node.js', role: 'Backend Runtime' },
    { name: 'Python', role: 'Automation & AI' }
];

let currentTestimonial = 0;
const dots = document.querySelectorAll('.dot');
const testimonialName = document.querySelector('.testimonial-name');
const testimonialRole = document.querySelector('.testimonial-role');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

function updateTestimonial() {
    // Fade out
    testimonialName.style.opacity = '0';
    testimonialRole.style.opacity = '0';
    
    setTimeout(() => {
        testimonialName.textContent = testimonials[currentTestimonial].name;
        testimonialRole.textContent = testimonials[currentTestimonial].role;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
        
        // Fade in
        testimonialName.style.opacity = '1';
        testimonialRole.style.opacity = '1';
    }, 300);
}

prevBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    updateTestimonial();
});

nextBtn.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
});

// Auto-slide testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    updateTestimonial();
}, 5000);

// Add smooth transition to testimonial text
testimonialName.style.transition = 'opacity 0.3s ease';
testimonialRole.style.transition = 'opacity 0.3s ease';

// ========== DYNAMIC CODE ANIMATION ==========
// Different code snippets for rotation showcasing different technologies
const codeSnippets = [
    {
        language: 'JavaScript',
        html: `
            <div class="code-line"><span class="comment">// 💛 JavaScript - Modern ES6+</span></div>
            <div class="code-line"><span class="keyword">const</span> <span class="variable">innovate</span> <span class="function">= () =&gt; {</span></div>
            <div class="code-line indent"><span class="keyword">return</span> <span class="string">'excellence'</span><span class="function">;</span></div>
            <div class="code-line"><span class="function">}</span></div>
            <div class="code-line"></div>
            <div class="code-line"><span class="keyword">class</span> <span class="class-name">LogicLayer</span> <span class="function">{</span></div>
            <div class="code-line indent"><span class="function">build</span><span class="paren">()</span> <span class="function">{</span></div>
            <div class="code-line indent2"><span class="comment">// Creating magic ✨</span></div>
            <div class="code-line indent"><span class="function">}</span></div>
            <div class="code-line"><span class="function">}</span></div>
        `
    },
    {
        language: 'Python',
        html: `
            <div class="code-line"><span class="comment"># 🐍 Python - AI & Automation</span></div>
            <div class="code-line"><span class="keyword">class</span> <span class="class-name">LogicLayerAI</span><span class="function">:</span></div>
            <div class="code-line indent"><span class="keyword">def</span> <span class="function">__init__</span><span class="paren">(self)</span><span class="function">:</span></div>
            <div class="code-line indent2"><span class="variable">self.power</span> <span class="function">=</span> <span class="string">"AI"</span></div>
            <div class="code-line"></div>
            <div class="code-line indent"><span class="keyword">def</span> <span class="function">automate</span><span class="paren">(self)</span><span class="function">:</span></div>
            <div class="code-line indent2"><span class="comment"># Smart automation 🤖</span></div>
            <div class="code-line indent2"><span class="keyword">return</span> <span class="string">"Success"</span></div>
            <div class="code-line"></div>
            <div class="code-line"><span class="variable">ai</span> <span class="function">=</span> <span class="class-name">LogicLayerAI</span><span class="paren">()</span></div>
        `
    },
    {
        language: 'React',
        html: `
            <div class="code-line"><span class="comment">// ⚛️ React - Modern UI Components</span></div>
            <div class="code-line"><span class="keyword">const</span> <span class="class-name">App</span> <span class="function">= () =&gt; {</span></div>
            <div class="code-line indent"><span class="keyword">const</span> <span class="paren">[</span><span class="variable">state</span><span class="paren">,</span> <span class="variable">setState</span><span class="paren">]</span> <span class="function">=</span></div>
            <div class="code-line indent2"><span class="function">useState</span><span class="paren">(</span><span class="string">'amazing'</span><span class="paren">)</span><span class="function">;</span></div>
            <div class="code-line"></div>
            <div class="code-line indent"><span class="keyword">return</span> <span class="paren">(</span></div>
            <div class="code-line indent2"><span class="function">&lt;</span><span class="class-name">LogicLayer</span> <span class="variable">power</span><span class="function">={</span><span class="variable">state</span><span class="function">}</span> <span class="function">/&gt;</span></div>
            <div class="code-line indent"><span class="paren">)</span><span class="function">;</span></div>
            <div class="code-line"><span class="function">}</span></div>
        `
    },
    {
        language: 'Node.js',
        html: `
            <div class="code-line"><span class="comment">// 🟢 Node.js - Backend APIs</span></div>
            <div class="code-line"><span class="keyword">const</span> <span class="variable">express</span> <span class="function">=</span> <span class="function">require</span><span class="paren">(</span><span class="string">'express'</span><span class="paren">)</span><span class="function">;</span></div>
            <div class="code-line"><span class="keyword">const</span> <span class="variable">app</span> <span class="function">=</span> <span class="function">express</span><span class="paren">()</span><span class="function">;</span></div>
            <div class="code-line"></div>
            <div class="code-line"><span class="variable">app</span><span class="function">.</span><span class="function">get</span><span class="paren">(</span><span class="string">'/api'</span><span class="paren">,</span> <span class="paren">(</span><span class="variable">req, res</span><span class="paren">)</span> <span class="function">=&gt; {</span></div>
            <div class="code-line indent"><span class="variable">res</span><span class="function">.</span><span class="function">json</span><span class="paren">({</span></div>
            <div class="code-line indent2"><span class="variable">status</span><span class="function">:</span> <span class="string">'powerful'</span> <span class="comment">// 🚀</span></div>
            <div class="code-line indent"><span class="paren">})</span><span class="function">;</span></div>
            <div class="code-line"><span class="function">})</span><span class="function">;</span></div>
        `
    },
    {
        language: 'TypeScript',
        html: `
            <div class="code-line"><span class="comment">// 📘 TypeScript - Type-Safe Development</span></div>
            <div class="code-line"><span class="keyword">interface</span> <span class="class-name">Solution</span> <span class="function">{</span></div>
            <div class="code-line indent"><span class="variable">name</span><span class="function">:</span> <span class="keyword">string</span><span class="function">;</span></div>
            <div class="code-line indent"><span class="variable">power</span><span class="function">:</span> <span class="keyword">number</span><span class="function">;</span></div>
            <div class="code-line"><span class="function">}</span></div>
            <div class="code-line"></div>
            <div class="code-line"><span class="keyword">const</span> <span class="variable">create</span><span class="function">:</span> <span class="class-name">Solution</span> <span class="function">= {</span></div>
            <div class="code-line indent"><span class="variable">name</span><span class="function">:</span> <span class="string">'LogicLayer'</span><span class="function">,</span></div>
            <div class="code-line indent"><span class="variable">power</span><span class="function">:</span> <span class="string">9999</span> <span class="comment">// 💪</span></div>
            <div class="code-line"><span class="function">}</span><span class="function">;</span></div>
        `
    },
    {
        language: 'SQL',
        html: `
            <div class="code-line"><span class="comment">-- 🗄️ SQL - Database Management</span></div>
            <div class="code-line"><span class="keyword">SELECT</span> <span class="variable">solution_name</span><span class="function">,</span></div>
            <div class="code-line indent"><span class="variable">client_satisfaction</span></div>
            <div class="code-line"><span class="keyword">FROM</span> <span class="class-name">logiclayer_projects</span></div>
            <div class="code-line"><span class="keyword">WHERE</span> <span class="variable">quality</span> <span class="function">=</span> <span class="string">'exceptional'</span></div>
            <div class="code-line indent"><span class="keyword">AND</span> <span class="variable">innovation</span> <span class="function">&gt;</span> <span class="string">95</span></div>
            <div class="code-line"><span class="keyword">ORDER BY</span> <span class="variable">impact</span> <span class="keyword">DESC</span></div>
            <div class="code-line"><span class="keyword">LIMIT</span> <span class="string">100</span><span class="function">;</span></div>
            <div class="code-line"></div>
            <div class="code-line"><span class="comment">-- Excellence delivered ✨</span></div>
        `
    }
];

let currentCodeIndex = 0;
const dynamicCodeElement = document.getElementById('dynamicCode');
const languageBadge = document.getElementById('languageBadge');

function updateCodeSnippet() {
    if (!dynamicCodeElement || !languageBadge) return;
    
    // Fade out
    dynamicCodeElement.style.opacity = '0';
    languageBadge.style.opacity = '0';
    
    setTimeout(() => {
        // Update code and language badge
        const snippet = codeSnippets[currentCodeIndex];
        dynamicCodeElement.innerHTML = snippet.html;
        languageBadge.textContent = snippet.language;
        
        // Fade in
        dynamicCodeElement.style.opacity = '1';
        languageBadge.style.opacity = '1';
        
        // Move to next snippet
        currentCodeIndex = (currentCodeIndex + 1) % codeSnippets.length;
    }, 500);
}

// Initialize code rotation
if (dynamicCodeElement && languageBadge) {
    // Add transition styles
    dynamicCodeElement.style.transition = 'opacity 0.5s ease';
    languageBadge.style.transition = 'opacity 0.3s ease';
    
    // Start rotation after initial load animation
    setTimeout(() => {
        setInterval(updateCodeSnippet, 5000); // Change every 5 seconds
    }, 4000); // Wait 4 seconds before starting rotation
}

// Parallax effect for shapes
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// Floating animation for tags
const tags = document.querySelectorAll('.tag');
tags.forEach((tag, index) => {
    setInterval(() => {
        tag.style.transform = `translateY(${Math.sin(Date.now() / 1000 + index) * 10}px)`;
    }, 50);
});

// Email input focus animation
const emailInput = document.querySelector('.email-input');
emailInput.addEventListener('focus', () => {
    emailInput.parentElement.style.transform = 'scale(1.02)';
});

emailInput.addEventListener('blur', () => {
    emailInput.parentElement.style.transform = 'scale(1)';
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// ===============================================
// Service Cards Interactions
// ===============================================

// Auto-scrolling feature items
function startFeatureAutoScroll() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach(card => {
        const featureItems = card.querySelectorAll('.feature-item');
        let currentIndex = 0;
        
        // Initial state - first item active
        featureItems[0].classList.add('active');
        
        setInterval(() => {
            // Remove active class from current item
            featureItems[currentIndex].classList.remove('active');
            
            // Move to next item
            currentIndex = (currentIndex + 1) % featureItems.length;
            
            // Add active class to new item
            featureItems[currentIndex].classList.add('active');
        }, 2000); // Change every 2 seconds
    });
}

// Plus to Arrow animation
function initializeIconAnimations() {
    const cardIcons = document.querySelectorAll('.card-icon');
    
    cardIcons.forEach(icon => {
        const plusIcon = icon.querySelector('.icon-plus');
        let isClicked = false;
        
        icon.addEventListener('click', () => {
            if (!isClicked) {
                // Transform plus to arrow
                plusIcon.style.transform = 'rotate(45deg)';
                setTimeout(() => {
                    plusIcon.textContent = '→';
                    plusIcon.style.transform = 'rotate(0deg)';
                }, 150);
                isClicked = true;
            } else {
                // Transform arrow back to plus
                plusIcon.style.transform = 'rotate(-45deg)';
                setTimeout(() => {
                    plusIcon.textContent = '+';
                    plusIcon.style.transform = 'rotate(0deg)';
                }, 150);
                isClicked = false;
            }
        });
    });
}

// Enhanced card hover effects
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card, index) => {
    // Add staggered entrance animation
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 200 * (index + 1));

    // Interactive hover effects
    card.addEventListener('mouseenter', () => {
        // Subtle card rotation on hover
        card.style.transform = 'translateY(-8px) rotateX(1deg)';
        
        // Animate checkmarks
        const checkmarks = card.querySelectorAll('.checkmark');
        checkmarks.forEach((check, i) => {
            setTimeout(() => {
                check.style.transform = 'scale(1.15) rotate(360deg)';
            }, i * 30);
        });
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0deg)';
        
        // Reset checkmarks
        const checkmarks = card.querySelectorAll('.checkmark');
        checkmarks.forEach(check => {
            check.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Click animation for the entire card
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.card-link') && !e.target.closest('.card-icon')) {
            // Create ripple effect
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.3)';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.animation = 'ripple 0.6s linear';
            ripple.style.pointerEvents = 'none';
            
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        }
    });
});

// Initialize all card features
document.addEventListener('DOMContentLoaded', () => {
    startFeatureAutoScroll();
    initializeIconAnimations();
});

// Feature items individual animations
const featureItems = document.querySelectorAll('.feature-item');
featureItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        if (!item.classList.contains('active')) {
            item.style.transform = 'translateX(5px)';
            item.style.opacity = '0.8';
        }
    });

    item.addEventListener('mouseleave', () => {
        if (!item.classList.contains('active')) {
            item.style.transform = 'translateX(-10px)';
            item.style.opacity = '0.6';
        }
    });
});

// CTA Button enhanced animation
const ctaButton = document.querySelector('.cta-button');
if (ctaButton) {
    ctaButton.addEventListener('mouseenter', () => {
        ctaButton.style.transform = 'translateY(-3px) scale(1.05)';
    });

    ctaButton.addEventListener('mouseleave', () => {
        ctaButton.style.transform = 'translateY(-2px) scale(1)';
    });

    ctaButton.addEventListener('click', (e) => {
        // Button click animation
        ctaButton.style.transform = 'translateY(0) scale(0.98)';
        setTimeout(() => {
            ctaButton.style.transform = 'translateY(-2px) scale(1)';
        }, 150);
        
        // Add your consultation booking logic here
        console.log('Schedule consultation clicked');
    });
}

// Card link hover effects
const cardLinks = document.querySelectorAll('.card-link');
cardLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.transform = 'translateX(5px)';
    });

    link.addEventListener('mouseleave', () => {
        link.style.transform = 'translateX(0)';
    });
});

// Add CSS keyframes for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Intersection Observer for service cards scroll animation
const serviceCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
});

// Observe service cards for scroll animation
serviceCards.forEach(card => {
    serviceCardsObserver.observe(card);
});

// Services header animation
const servicesHeader = document.querySelector('.services-header');
if (servicesHeader) {
    serviceCardsObserver.observe(servicesHeader);
    servicesHeader.style.opacity = '0';
    servicesHeader.style.transform = 'translateY(30px)';
    servicesHeader.style.transition = 'all 0.8s ease';
}

// Services CTA animation
const servicesCta = document.querySelector('.services-cta');
if (servicesCta) {
    serviceCardsObserver.observe(servicesCta);
    servicesCta.style.opacity = '0';
    servicesCta.style.transform = 'translateY(30px)';
    servicesCta.style.transition = 'all 0.8s ease';
}
