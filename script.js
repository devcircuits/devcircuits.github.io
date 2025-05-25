// Constants
const SCROLL_THRESHOLD = 50;
const ANIMATION_DELAY = 100;
const TOUCH_THRESHOLD = 50;

// State management
const state = {
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    isScrolled: false,
    isMenuOpen: false,
    currentSlide: 0,
    touchStartX: 0,
    touchEndX: 0
};

// DOM Elements
const elements = {
    header: document.querySelector('header'),
    navToggle: document.getElementById('nav-toggle'),
    navMenu: document.querySelector('nav'),
    slideshow: document.querySelector('.slideshow-container'),
    slides: document.querySelectorAll('.slide'),
    dots: document.querySelectorAll('.dot'),
    contactForm: document.getElementById('contactForm'),
    formMessage: document.getElementById('form-message')
};

// Error handling
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    // You could add error reporting service integration here
};

// Scroll animations
const handleScroll = () => {
    try {
        const scrollPosition = window.scrollY;
        state.isScrolled = scrollPosition > SCROLL_THRESHOLD;
        elements.header.classList.toggle('scrolled', state.isScrolled);

        // Animate elements on scroll
        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    } catch (error) {
        handleError(error, 'scroll handling');
    }
};

// Header scroll effects
const initHeaderEffects = () => {
    try {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
    } catch (error) {
        handleError(error, 'header effects initialization');
    }
};

// Slideshow functionality
const initSlideshow = () => {
    if (!elements.slideshow) return;

    try {
        const showSlide = (index) => {
            elements.slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
            elements.dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            state.currentSlide = index;
        };

        const nextSlide = () => {
            const next = (state.currentSlide + 1) % elements.slides.length;
            showSlide(next);
        };

        const prevSlide = () => {
            const prev = (state.currentSlide - 1 + elements.slides.length) % elements.slides.length;
            showSlide(prev);
        };

        // Auto-advance slides
        let slideInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        elements.slideshow.addEventListener('mouseenter', () => clearInterval(slideInterval));
        elements.slideshow.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Dot navigation
        elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                slideInterval = setInterval(nextSlide, 5000);
            });
        });

        // Initial slide
        showSlide(0);
    } catch (error) {
        handleError(error, 'slideshow initialization');
    }
};

// Touch and swipe handling
const initTouchHandling = () => {
    if (!elements.slideshow) return;

    try {
        elements.slideshow.addEventListener('touchstart', (e) => {
            state.touchStartX = e.touches[0].clientX;
        });

        elements.slideshow.addEventListener('touchend', (e) => {
            state.touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });
    } catch (error) {
        handleError(error, 'touch handling initialization');
    }
};

const handleSwipe = () => {
    const diff = state.touchStartX - state.touchEndX;
    if (Math.abs(diff) > TOUCH_THRESHOLD) {
        if (diff > 0) {
            // Swipe left
            const next = (state.currentSlide + 1) % elements.slides.length;
            showSlide(next);
        } else {
            // Swipe right
            const prev = (state.currentSlide - 1 + elements.slides.length) % elements.slides.length;
            showSlide(prev);
        }
    }
};

// Event listeners
const initEventListeners = () => {
    try {
        // Mobile menu toggle
        if (elements.navToggle) {
            elements.navToggle.addEventListener('change', () => {
                state.isMenuOpen = elements.navToggle.checked;
                elements.navMenu.classList.toggle('active', state.isMenuOpen);
                document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
            });
        }

        // Close menu on link click
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (state.isMenuOpen) {
                    elements.navToggle.checked = false;
                    state.isMenuOpen = false;
                    elements.navMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });

        // Form submission
        if (elements.contactForm) {
            elements.contactForm.addEventListener('submit', handleFormSubmit);
        }
    } catch (error) {
        handleError(error, 'event listeners initialization');
    }
};

// Dark mode handling
const initDarkMode = () => {
    try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleDarkModeChange = (e) => {
            state.darkMode = e.matches;
            document.documentElement.classList.toggle('dark-mode', e.matches);
            document.body.classList.toggle('dark-mode', e.matches);
            
            // Update meta theme-color
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', e.matches ? '#1a120b' : '#ff6200');
            }
        };

        // Initial setup
        handleDarkModeChange(mediaQuery);

        // Listen for changes
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleDarkModeChange);
        } else {
            // For older browsers
            mediaQuery.addListener(handleDarkModeChange);
        }
    } catch (error) {
        handleError(error, 'dark mode initialization');
    }
};

// Form handling
const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Collect form data
        const formData = {
            name: form.querySelector('#name').value,
            email: form.querySelector('#email').value,
            subject: form.querySelector('#subject').value,
            message: form.querySelector('#message').value
        };

        // Send email using EmailJS
        await emailjs.send('service_ujz4617', 'template_qhsiqy9', formData);
        
        // Show success message
        showFormMessage('Your message has been sent successfully!', 'success');
        
        // Reset form
        form.reset();
    } catch (error) {
        handleError(error, 'form submission');
        showFormMessage('Failed to send message. Please try again.', 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
};

const showFormMessage = (message, type) => {
    try {
        let messageElement = elements.formMessage;
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'form-message';
            elements.contactForm.appendChild(messageElement);
        }
        
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        messageElement.style.display = 'block';
        
        // Hide message after 3 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 3000);
    } catch (error) {
        handleError(error, 'form message display');
    }
};

// Initialize everything
const init = () => {
    try {
        // Add theme transition class after initial load
        setTimeout(() => {
            document.body.classList.add('theme-transition');
        }, ANIMATION_DELAY);

        initHeaderEffects();
        initSlideshow();
        initTouchHandling();
        initEventListeners();
        initDarkMode();
    } catch (error) {
        handleError(error, 'initialization');
    }
};

// Start the application
document.addEventListener('DOMContentLoaded', init);
