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
        slides[i].style.display = "none";
        dotsContainer.children[i].className = "dot";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].style.display = "block";
    dotsContainer.children[slideIndex - 1].className = "dot active";
    setTimeout(showSlides, 8000); // 8 seconds
}

createDots();
showSlides();