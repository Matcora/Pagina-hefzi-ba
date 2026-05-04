export function initNavigation() {
    const vistas = document.querySelectorAll('.page-view');
    const enlaces = document.querySelectorAll('.nav-menu a');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('main-menu');

    if (!menuBtn) return;

    menuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    const cambiarVista = () => {
        let hash = window.location.hash || '#inicio';
        vistas.forEach(v => v.classList.remove('active'));
        enlaces.forEach(e => e.classList.remove('active-link'));

        const vistaActiva = document.querySelector(hash);
        if (vistaActiva) vistaActiva.classList.add('active');

        const enlaceActivo = document.querySelector(`.nav-menu a[href="${hash}"]`);
        if (enlaceActivo) enlaceActivo.classList.add('active-link');
        
        navMenu.classList.remove('active');
        window.scrollTo(0, 0);
        animarElementos();
    };

    window.addEventListener('hashchange', cambiarVista);
    
    const animarElementos = () => {
        const reveals = document.querySelectorAll('.reveal');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('active');
            });
        }, { threshold: 0.1 });
        reveals.forEach(r => observer.observe(r));
    };

    cambiarVista();
}
