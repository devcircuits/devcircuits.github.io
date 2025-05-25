// Constants
const SLIDE_DURATION = 10000; // 10 seconds per slide
const TRANSITION_DURATION = 1000; // 1 second for transition
const SWIPE_THRESHOLD = 50; // Minimum distance for swipe

// State management
const state = {
    slideIndex: 0,
    slideInterval: null,
    touchStartX: 0,
    touchEndX: 0
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
    // You could add error reporting service here
};

// Slideshow functionality
const createDots = () => {
    try {
        for (let i = 0; i < elements.slides.length; i++) {
            const dot = document.createElement('span');
            dot.className = 'dot';
            dot.setAttribute('role', 'button');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => {
                clearInterval(state.slideInterval);
                state.slideIndex = i;
                showSlides();
                startSlideInterval();
            });
            elements.dotsContainer.appendChild(dot);
        }
    } catch (error) {
        handleError(error, 'createDots');
    }
};

const showSlides = () => {
    try {
        // Hide all slides
        Array.from(elements.slides).forEach((slide, index) => {
            slide.classList.remove('active');
            elements.dotsContainer.children[index]?.classList.remove('active');
        });

        // Show current slide
        elements.slides[state.slideIndex]?.classList.add('active');
        elements.dotsContainer.children[state.slideIndex]?.classList.add('active');

        // Move to next slide
        state.slideIndex = (state.slideIndex + 1) % elements.slides.length;
    } catch (error) {
        handleError(error, 'showSlides');
    }
};

const startSlideInterval = () => {
    try {
        state.slideInterval = setInterval(showSlides, SLIDE_DURATION);
    } catch (error) {
        handleError(error, 'startSlideInterval');
    }
};

const handleSwipe = () => {
    try {
        const diff = state.touchStartX - state.touchEndX;

        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                // Swipe left - next slide
                state.slideIndex = (state.slideIndex + 1) % elements.slides.length;
            } else {
                // Swipe right - previous slide
                state.slideIndex = (state.slideIndex - 1 + elements.slides.length) % elements.slides.length;
            }
            showSlides();
        }
    } catch (error) {
        handleError(error, 'handleSwipe');
    }
};

// Event Listeners
const setupEventListeners = () => {
    try {
        elements.slideshowContainer?.addEventListener('mouseenter', () => {
            clearInterval(state.slideInterval);
        });

        elements.slideshowContainer?.addEventListener('mouseleave', () => {
            startSlideInterval();
        });

        elements.slideshowContainer?.addEventListener('touchstart', (e) => {
            state.touchStartX = e.changedTouches[0].screenX;
            clearInterval(state.slideInterval);
        });

        elements.slideshowContainer?.addEventListener('touchend', (e) => {
            state.touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startSlideInterval();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                state.slideIndex = (state.slideIndex - 1 + elements.slides.length) % elements.slides.length;
                showSlides();
            } else if (e.key === 'ArrowRight') {
                state.slideIndex = (state.slideIndex + 1) % elements.slides.length;
                showSlides();
            }
        });
    } catch (error) {
        handleError(error, 'setupEventListeners');
    }
};

// Initialize
const init = () => {
    try {
        createDots();
        showSlides();
        startSlideInterval();
        setupEventListeners();
    } catch (error) {
        handleError(error, 'init');
    }
};

// Start the application
document.addEventListener('DOMContentLoaded', init);
