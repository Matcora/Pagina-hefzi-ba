
  function toggleMenu() {
    const menu = document.getElementById('menu');
  
    // Si la altura del menú es 0, lo expandimos; de lo contrario, lo colapsamos
    if (menu.style.maxHeight === '0px' || !menu.style.maxHeight) {
      menu.style.maxHeight = menu.scrollHeight + "px";
    } else {
      menu.style.maxHeight = '0px';
    }
  }
  
  // Escucha los clics en los enlaces del menú
  const menuLinks = document.querySelectorAll('#menu li a');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('menu');
      // Cuando se hace clic en un enlace, cerramos el menú
      menu.style.maxHeight = '0px';
    });
  });
  
  // Cerrar el menú si se hace clic fuera de él (o del ícono hamburguesa)
  document.addEventListener('click', (event) => {
    const menu = document.getElementById('menu');
    const menuIcon = document.querySelector('.menu-icon');
  
    // Verificamos si el menú está abierto
    if (menu.style.maxHeight !== '0px' && menu.style.maxHeight !== '') {
      // Si el clic no fue dentro del menú y tampoco fue en el ícono hamburguesa
      if (!menu.contains(event.target) && !menuIcon.contains(event.target)) {
        menu.style.maxHeight = '0px';
      }
    }
  });
  
// Cerrar el menú si se hace scroll
window.addEventListener('scroll', () => {
    const menu = document.getElementById('menu');
    // Verificamos si el menú está abierto
    if (menu.style.maxHeight !== '0px' && menu.style.maxHeight !== '') {
      // Si está abierto, lo cerramos
      menu.style.maxHeight = '0px';
    }
  });
  