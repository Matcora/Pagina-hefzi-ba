export function initAccessibility() {
    const htmlTag = document.documentElement;
    let fontSize = 16;

    const btnTheme = document.getElementById('btn-theme');
    const btnPlus = document.getElementById('btn-text-plus');
    const btnMinus = document.getElementById('btn-text-minus');

    if(btnTheme) {
        btnTheme.addEventListener('click', () => {
            htmlTag.setAttribute('data-theme', htmlTag.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    }
    
    if(btnPlus) {
        btnPlus.addEventListener('click', () => {
            if(fontSize < 24) { fontSize += 2; htmlTag.style.fontSize = `${fontSize}px`; }
        });
    }

    if(btnMinus) {
        btnMinus.addEventListener('click', () => {
            if(fontSize > 12) { fontSize -= 2; htmlTag.style.fontSize = `${fontSize}px`; }
        });
    }
}
