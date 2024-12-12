// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    offset: 50,
    once: true
});

// Loading Screen
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.classList.add('fade-out');
    }, 1000);
});

// Mobile Menu
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');
const bars = document.querySelectorAll('.bar');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    bars.forEach((bar, index) => {
        if (navLinks.classList.contains('active')) {
            bar.style.transform = index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                                 index === 1 ? 'opacity: 0' :
                                 'rotate(-45deg) translate(7px, -7px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    }

    if (currentScroll > lastScroll && currentScroll > 500) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounter = () => {
    counters.forEach(counter => {
        const target = +counter.dataset.target;
        const count = +counter.innerText;
        const increment = target / speed;

        if (count < target) {
            counter.innerText = Math.ceil(count + increment);
            setTimeout(animateCounter, 1);
        } else {
            counter.innerText = target;
        }
    });
};

// Trigger counter animation when about section is in view
const aboutSection = document.querySelector('.about');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter();
        }
    });
}, { threshold: 0.5 });

observer.observe(aboutSection);

// Circular Progress Animation
const progressCircles = document.querySelectorAll('.progress-circle');

const animateProgress = (circle) => {
    const progressBar = circle.querySelector('.progress-bar');
    const progressText = circle.querySelector('.progress-text');
    const percentage = circle.dataset.progress;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (percentage / 100) * circumference;
    
    progressBar.style.strokeDasharray = circumference;
    progressBar.style.strokeDashoffset = circumference;
    
    setTimeout(() => {
        progressBar.style.strokeDashoffset = offset;
    }, 100);
};

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateProgress(entry.target);
        }
    });
}, { threshold: 0.5 });

progressCircles.forEach(circle => progressObserver.observe(circle));

// Form Animation
const formGroups = document.querySelectorAll('.form-group');

formGroups.forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');

    input.addEventListener('focus', () => {
        label.classList.add('active');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            label.classList.remove('active');
        }
    });
});

// EmailJS Configuration
const EMAIL_JS_PUBLIC_KEY = "VyQXySrD0-bG-64lz";
const EMAIL_JS_SERVICE_ID = "service_b6606fj";
const EMAIL_JS_AUTO_REPLY_TEMPLATE_ID = "template_pjrlmkj";
const EMAIL_JS_ADMIN_TEMPLATE_ID = "template_admin_notify";

// Contact Form Submission
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init(EMAIL_JS_PUBLIC_KEY);

    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Validate form
            if (!name || !email || !message) {
                return;
            }

            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return;
            }

            // Disable submit button and show loading state
            const submitButton = contactForm.querySelector('.submit-button');
            submitButton.disabled = true;
            submitButton.style.background = 'var(--gradient-primary)';
            submitButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

            // Prepare email data matching template variables
            const emailData = {
                to_name: name,
                from_name: "EcoSanit",
                from_email: email,
                to_email: email,
                subject: 'Thank you for contacting EcoSanit',
                message: message,
                reply_message: getAutoReplyMessage(name)
            };

            // Prepare admin notification data
            const adminData = {
                user_name: name,        // User's actual name
                user_email: email,      // User's email
                user_message: message,  // User's message
                timestamp: new Date().toLocaleString(),
                subject: 'New Contact Form Submission - EcoSanit'
            };

            // Send auto-reply email
            emailjs.send(EMAIL_JS_SERVICE_ID, EMAIL_JS_AUTO_REPLY_TEMPLATE_ID, emailData)
                .then(() => {
                    // Send notification to admin with the correct data
                    return emailjs.send(EMAIL_JS_SERVICE_ID, EMAIL_JS_ADMIN_TEMPLATE_ID, adminData);
                });

            // Show sent message after 2 seconds
            setTimeout(() => {
                submitButton.style.background = 'var(--secondary-color)';
                submitButton.innerHTML = '<span>Sent</span><i class="fas fa-check"></i>';
                
                // Clear form inputs and their states
                const inputs = contactForm.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    input.value = '';
                    const label = input.parentElement.querySelector('label');
                    if (label) {
                        label.classList.remove('active');
                    }
                });
            }, 2000); // 2 seconds
        });
    }
});

// Get auto-reply message based on device type
function getAutoReplyMessage(name) {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        return `Dear ${name},

Thanks for contacting EcoSanit! We've received your message and will respond shortly.

Best regards,
The EcoSanit Team`;
    } else {
        return `Dear ${name},

Thank you for reaching out to EcoSanit. We have received your message and will get back to you as soon as possible.

Our team is committed to providing the best sanitation solutions and we appreciate your interest.

Best regards,
The EcoSanit Team`;
    }
}

// Newsletter Form
const newsletterForm = document.querySelector('.newsletter-form');
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    const button = newsletterForm.querySelector('button');
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    button.disabled = true;
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = 'var(--secondary-color)';
        input.value = '';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-arrow-right"></i>';
            button.disabled = false;
            button.style.background = '';
        }, 2000);
    }, 1500);
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const offset = 100;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            mobileMenu.click();
        }
    });
});

// Gallery Lightbox Functionality
document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    const lightboxImg = document.createElement('img');

    lightbox.classList.add('lightbox');
    lightboxImg.classList.add('lightbox-image');

    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.querySelector('img').src;
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'flex';
        });
    });

    lightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
    });
});
