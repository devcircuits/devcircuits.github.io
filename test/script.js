let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
const dotsContainer = document.querySelector('.dots');

function createDots() {
    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.addEventListener('click', () => {
            slideIndex = i;
            showSlides();
        });
        dotsContainer.appendChild(dot);
    }
}

function showSlides() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].className = "slide"; // Reset to base class
        dotsContainer.children[i].className = "dot";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].className = "slide active fade"; // Add active class
    dotsContainer.children[slideIndex - 1].className = "dot active";
    setTimeout(showSlides, 3000); // Changed from 8000ms to 3000ms (3 seconds)
}

createDots();
showSlides();
