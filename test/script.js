let slideIndex = 0;
const slides = document.getElementsByClassName("slide");
showSlides();

function showSlides() {
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 10000); // 10 seconds
}

// Manual controls
document.querySelector('.prev').addEventListener('click', () => {
    slideIndex -= 2;
    if (slideIndex < 0) { slideIndex = slides.length - 1; }
    showSlides();
});

document.querySelector('.next').addEventListener('click', () => {
    showSlides();
});

// Custom cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.pageX + 'px';
    cursor.style.top = e.pageY + 'px';
});

document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseover', () => cursor.style.transform = 'scale(1.5)');
    el.addEventListener('mouseout', () => cursor.style.transform = 'scale(1)');
});
