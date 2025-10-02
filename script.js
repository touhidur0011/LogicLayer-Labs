// Loading Animation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2000);
});

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
