let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const dotsContainer = document.querySelector('.dots');
let slideInterval;
const SLIDE_DURATION = 10000; // 10 seconds per slide
const TRANSITION_DURATION = 1000; // 1 second for transition

function createDots() {
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            slideIndex = i;
            showSlides();
            startSlideInterval();
        });
        dotsContainer.appendChild(dot);
    }
}

function showSlides() {
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
        dotsContainer.children[i].classList.remove('active');
    }

    // Show current slide
    slides[slideIndex].classList.add('active');
    dotsContainer.children[slideIndex].classList.add('active');

    // Move to next slide
    slideIndex = (slideIndex + 1) % slides.length;
}

function startSlideInterval() {
    slideInterval = setInterval(showSlides, SLIDE_DURATION);
}

// Initialize slideshow
createDots();
showSlides();
startSlideInterval();

// Pause slideshow when user hovers over it
document.querySelector('.slideshow-container').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Resume slideshow when user stops hovering
document.querySelector('.slideshow-container').addEventListener('mouseleave', () => {
    startSlideInterval();
});

// Touch events for mobile
let touchStartX = 0;
let touchEndX = 0;

document.querySelector('.slideshow-container').addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    clearInterval(slideInterval);
});

document.querySelector('.slideshow-container').addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startSlideInterval();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            slideIndex = (slideIndex + 1) % slides.length;
        } else {
            // Swipe right - previous slide
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        }
        showSlides();
    }
}
