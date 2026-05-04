export function initContactForm() {
    const formContacto = document.getElementById('formulario-contacto');
    const btnEnviar = document.getElementById('btn-enviar-contacto');
    const msgExito = document.getElementById('mensaje-exito');
    
    if(formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nombre = document.getElementById('contacto-nombre').value.trim();
            const correo = document.getElementById('contacto-correo').value.trim();
            const mensaje = document.getElementById('contacto-mensaje').value.trim();

            const textoOriginal = btnEnviar.textContent;
            btnEnviar.textContent = "Enviando...";
            btnEnviar.disabled = true;

            fetch("https://formsubmit.co/ajax/i.c.Hefziba624@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `Nuevo mensaje de la web Hefzi-bà de: ${nombre}`,
                    Nombre: nombre,
                    Email: correo,
                    Mensaje: mensaje,
                    _captcha: "false",
                    _template: "table"
                })
            })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    formContacto.reset();
                    msgExito.style.display = "block";
                    setTimeout(() => {
                        msgExito.style.display = "none";
                    }, 6000);
                } else {
                    alert("Hubo un pequeño error al enviar el correo. Por favor inténtalo más tarde.");
                }
            })
            .catch(error => {
                console.error(error);
                alert("No se pudo conectar con el servidor de correo. Verifica tu conexión.");
            })
            .finally(() => {
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
            });
        });
    }
}
