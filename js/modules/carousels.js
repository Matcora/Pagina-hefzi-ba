export function initCarousels() {
    const setupCarousel = (id) => {
        const container = document.getElementById(id);
        if(!container) return;
        const slides = container.querySelectorAll('.carousel-slide');
        if(slides.length === 0) return;
        
        let current = 0;
        setInterval(() => {
            slides[current].classList.remove('active');
            current = (current + 1) % slides.length;
            slides[current].classList.add('active');
        }, 5000);
    };

    setupCarousel('carousel-historia');
    setupCarousel('carousel-fe');
}
