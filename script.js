// Constants
const SLIDE_DURATION = 5000;
const TRANSITION_DURATION = 500;
const SWIPE_THRESHOLD = 50;

// State management
const state = {
    currentSlide: 0,
    isAnimating: false,
    touchStartX: 0,
    touchEndX: 0,
    scrollObserver: null
};

// DOM Elements
const elements = {
    slides: document.getElementsByClassName("slide"),
    dotsContainer: document.querySelector('.dots'),
    slideshowContainer: document.querySelector('.slideshow-container')
};

// Error handling
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    // You could add error reporting service integration here
};

// Scroll animations
const initScrollAnimations = () => {
    try {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        state.scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    state.scrollObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(element => {
            state.scrollObserver.observe(element);
        });
    } catch (error) {
        handleError(error, 'initScrollAnimations');
    }
};

// Header scroll effect
const initHeaderScroll = () => {
    try {
        const header = document.querySelector('header');
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            lastScroll = currentScroll;
        });
    } catch (error) {
        handleError(error, 'initHeaderScroll');
    }
};

// Slideshow functionality
const createDots = (slides) => {
    try {
        const dotsContainer = document.querySelector('.dots-container');
        if (!dotsContainer) return;

        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.addEventListener('click', () => showSlides(index));
            dotsContainer.appendChild(dot);
        });
    } catch (error) {
        handleError(error, 'createDots');
    }
};

const showSlides = (index) => {
    try {
        if (state.isAnimating) return;
        state.isAnimating = true;

        const slides = document.querySelectorAll('.slide');
        const dots = document.querySelectorAll('.dot');
        
        if (!slides.length || !dots.length) return;

        slides[state.currentSlide].classList.remove('active');
        dots[state.currentSlide].classList.remove('active');

        state.currentSlide = index;
        if (state.currentSlide >= slides.length) state.currentSlide = 0;
        if (state.currentSlide < 0) state.currentSlide = slides.length - 1;

        slides[state.currentSlide].classList.add('active');
        dots[state.currentSlide].classList.add('active');

        setTimeout(() => {
            state.isAnimating = false;
        }, TRANSITION_DURATION);
    } catch (error) {
        handleError(error, 'showSlides');
    }
};

const startSlideInterval = () => {
    try {
        return setInterval(() => {
            showSlides(state.currentSlide + 1);
        }, SLIDE_DURATION);
    } catch (error) {
        handleError(error, 'startSlideInterval');
    }
};

// Touch and swipe handling
const handleSwipe = () => {
    try {
        const swipeDistance = state.touchEndX - state.touchStartX;
        
        if (Math.abs(swipeDistance) > SWIPE_THRESHOLD) {
            if (swipeDistance > 0) {
                showSlides(state.currentSlide - 1);
            } else {
                showSlides(state.currentSlide + 1);
            }
        }
    } catch (error) {
        handleError(error, 'handleSwipe');
    }
};

// Event Listeners
const initEventListeners = () => {
    try {
        const slideshow = document.querySelector('.slideshow');
        if (!slideshow) return;

        // Touch events
        slideshow.addEventListener('touchstart', (e) => {
            state.touchStartX = e.touches[0].clientX;
        });

        slideshow.addEventListener('touchend', (e) => {
            state.touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                showSlides(state.currentSlide - 1);
            } else if (e.key === 'ArrowRight') {
                showSlides(state.currentSlide + 1);
            }
        });

        // Mobile menu
        const menuToggle = document.querySelector('.nav-toggle');
        const nav = document.querySelector('nav');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('change', () => {
                nav.classList.toggle('active');
            });
        }
    } catch (error) {
        handleError(error, 'initEventListeners');
    }
};

// Initialize everything
const init = () => {
    try {
        const slides = document.querySelectorAll('.slide');
        if (slides.length) {
            createDots(slides);
            showSlides(0);
            startSlideInterval();
        }

        initScrollAnimations();
        initHeaderScroll();
        initEventListeners();
    } catch (error) {
        handleError(error, 'init');
    }
};

// Start when DOM is ready
document.addEventListener('DOMContentLoaded', init);
