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
