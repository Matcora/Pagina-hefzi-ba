export async function initBible() {
    const selLibro = document.getElementById('sel-libro');
    const selCapInicio = document.getElementById('sel-cap-inicio');
    const selCapFin = document.getElementById('sel-cap-fin');
    const btnReproducir = document.getElementById('btn-reproducir-rango');
    
    const audioPlayer = document.getElementById('reproductor-biblia');
    const audioTitulo = document.getElementById('audio-titulo');
    const displayTexto = document.getElementById('texto-biblia-display');

    const btnModoUnico = document.getElementById('btn-modo-unico');
    const btnModoRango = document.getElementById('btn-modo-rango');
    const grupoCapFin = document.getElementById('grupo-cap-fin');
    const lblCapInicio = document.getElementById('lbl-cap-inicio');

    if(!selLibro) return;

    let modoLectura = 'unico'; 
    let bibliaData = {};

    try {
        const response = await fetch('data/biblia.json');
        bibliaData = await response.json();
    } catch(e) {
        console.error("No se pudo cargar data/biblia.json", e);
        selLibro.innerHTML = '<option value="">Error cargando datos</option>';
        return;
    }

    const cambiarModoLectura = (modo) => {
        modoLectura = modo;
        if (modo === 'unico') {
            btnModoUnico.className = 'btn-modo activo';
            btnModoRango.className = 'btn-modo inactivo';
            grupoCapFin.style.display = 'none';
            lblCapInicio.textContent = 'Capítulo:';
            btnReproducir.textContent = 'Escuchar Capítulo';
        } else {
            btnModoUnico.className = 'btn-modo inactivo';
            btnModoRango.className = 'btn-modo activo';
            grupoCapFin.style.display = 'block';
            lblCapInicio.textContent = 'Desde el Capítulo:';
            btnReproducir.textContent = 'Escuchar Rango';
        }
    };

    btnModoUnico.addEventListener('click', () => cambiarModoLectura('unico'));
    btnModoRango.addEventListener('click', () => cambiarModoLectura('rango'));

    let capitulosEnRango = [];
    let indiceActual = 0;
    let libroActual = "";

    selLibro.innerHTML = '<option value="">Selecciona libro</option>';
    Object.keys(bibliaData).forEach(libro => {
        selLibro.innerHTML += `<option value="${libro}">${libro}</option>`;
    });

    selLibro.addEventListener('change', (e) => {
        const lib = e.target.value;
        selCapInicio.innerHTML = '<option value="">Inicio</option>';
        selCapFin.innerHTML = '<option value="">Fin</option>';
        
        if(lib) {
            selCapInicio.disabled = false;
            selCapFin.disabled = false;
            Object.keys(bibliaData[lib]).forEach(cap => {
                selCapInicio.innerHTML += `<option value="${cap}">${cap}</option>`;
                selCapFin.innerHTML += `<option value="${cap}">${cap}</option>`;
            });
        } else {
            selCapInicio.disabled = true;
            selCapFin.disabled = true;
        }
    });

    btnReproducir.addEventListener('click', () => {
        libroActual = selLibro.value;
        let capInit = parseInt(selCapInicio.value);
        let capFin = modoLectura === 'rango' ? parseInt(selCapFin.value) : capInit;

        if(!libroActual || isNaN(capInit) || isNaN(capFin)) return alert("Selecciona el libro y el capítulo adecuadamente.");
        if(modoLectura === 'rango' && capInit > capFin) return alert("El capítulo de inicio no puede ser mayor al final.");

        capitulosEnRango = [];
        for(let i = capInit; i <= capFin; i++) {
            if(bibliaData[libroActual][i.toString()]) {
                capitulosEnRango.push(i.toString());
            }
        }

        if(capitulosEnRango.length === 0) return;

        indiceActual = 0;
        reproducirCapituloActual();
    });

    const reproducirCapituloActual = () => {
        if(indiceActual >= capitulosEnRango.length) {
            audioTitulo.innerText = "Lectura finalizada.";
            return; 
        }

        let cap = capitulosEnRango[indiceActual];
        let libNormalizado = libroActual.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        
        // Carga desde assets/audios/
        let audioUrl = `assets/audios/${libNormalizado}_${cap}.mp3`;
        
        audioTitulo.innerText = `Reproduciendo: ${libroActual} Capítulo ${cap}`;
        audioPlayer.src = audioUrl;
        audioPlayer.play().catch(e => {
            console.log("Audio no encontrado en la ruta local.", audioUrl);
            audioTitulo.innerText = `Audio no encontrado para: ${libroActual} ${cap}`;
        });
        
        displayTexto.innerHTML = `
            <h3 style="color:var(--rojo-principal); font-size:clamp(1.8rem, 5vw, 2.5rem); margin-bottom:1.5rem;">${libroActual} ${cap}</h3>
            <p>${bibliaData[libroActual][cap]}</p>
        `;
    };

    audioPlayer.addEventListener('ended', () => {
        indiceActual++;
        reproducirCapituloActual();
    });
}
