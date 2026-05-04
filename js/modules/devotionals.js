import { auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut, collection, getDocs, doc, setDoc, deleteDoc, appId } from '../firebase-config.js';

export function initDevotionals() {
    const inputFechaBuscar = document.getElementById('buscar-fecha');
    const display = document.getElementById('devocional-display');
    
    const btnAdmin = document.getElementById('btn-admin');
    const adminPanel = document.getElementById('admin-panel');
    const btnCerrarAdmin = document.getElementById('btn-cerrar-admin');
    const btnGuardarDev = document.getElementById('btn-guardar-dev');
    
    // Modal
    const modalPassword = document.getElementById('modal-password');
    const inputEmail = document.getElementById('admin-email-input');
    const inputPassword = document.getElementById('admin-pass-input');
    const btnModalSubmit = document.getElementById('btn-modal-submit');
    const btnModalCancel = document.getElementById('btn-modal-cancel');
    const passError = document.getElementById('admin-pass-error');
    const btnLogout = document.getElementById('btn-logout-admin');
    
    let cacheDevocionales = {};

    const showCustomAlert = (message, title = "Aviso") => {
        return new Promise((resolve) => {
            const modal = document.getElementById('modal-alert');
            if (!modal) { alert(message); return resolve(true); }
            
            document.getElementById('modal-alert-title').textContent = title;
            document.getElementById('modal-alert-message').textContent = message;
            
            const btnOk = document.getElementById('btn-alert-ok');
            const btnCancel = document.getElementById('btn-alert-cancel');
            btnCancel.style.display = 'none';
            btnOk.textContent = 'Aceptar';

            modal.classList.add('active');

            const onOk = () => {
                modal.classList.remove('active');
                btnOk.removeEventListener('click', onOk);
                resolve(true);
            };
            btnOk.addEventListener('click', onOk);
        });
    };

    const showCustomConfirm = (message, title = "Confirmación") => {
        return new Promise((resolve) => {
            const modal = document.getElementById('modal-alert');
            if (!modal) return resolve(confirm(message));

            document.getElementById('modal-alert-title').textContent = title;
            document.getElementById('modal-alert-message').textContent = message;
            
            const btnOk = document.getElementById('btn-alert-ok');
            const btnCancel = document.getElementById('btn-alert-cancel');
            btnCancel.style.display = 'block';
            btnOk.textContent = 'Sí, continuar';

            modal.classList.add('active');

            const cleanup = () => {
                modal.classList.remove('active');
                btnOk.removeEventListener('click', onOk);
                btnCancel.removeEventListener('click', onCancel);
            };

            const onOk = () => { cleanup(); resolve(true); };
            const onCancel = () => { cleanup(); resolve(false); };

            btnOk.addEventListener('click', onOk);
            btnCancel.addEventListener('click', onCancel);
        });
    };

    const renderDevocional = (fechaBusqueda) => {
        const fechasOrdenadas = Object.keys(cacheDevocionales).sort((a, b) => b.localeCompare(a));
        display.innerHTML = '';
        
        let renderedCount = 0;
        const maxAMostrar = 5;
        
        // Render searched date
        if (fechaBusqueda) {
            const devBusqueda = cacheDevocionales[fechaBusqueda];
            if (devBusqueda) {
                display.innerHTML += crearHTMLDevocional(devBusqueda, fechaBusqueda);
            } else {
                display.innerHTML += `
                    <div class="devocional-view" style="text-align:center; margin-bottom: 2.5rem;">
                        <h3 style="color: var(--texto-secundario);">No hay lectura para esta fecha</h3>
                        <p style="font-size:1.15rem; color:var(--texto-secundario);">Aún no se ha publicado el devocional para la fecha: <b>${fechaBusqueda}</b>.</p>
                    </div>
                `;
            }
            renderedCount++;
        }
        
        // Render previous dates up to maxAMostrar
        let startIndex = 0;
        if (fechaBusqueda) {
            startIndex = fechasOrdenadas.findIndex(f => f < fechaBusqueda);
            if (startIndex === -1) startIndex = fechasOrdenadas.length;
        }
        
        for (let i = startIndex; i < fechasOrdenadas.length && renderedCount < maxAMostrar; i++) {
            const fechaIter = fechasOrdenadas[i];
            const devIter = cacheDevocionales[fechaIter];
            display.innerHTML += crearHTMLDevocional(devIter, fechaIter);
            renderedCount++;
        }
        
        if (renderedCount === 0) {
            display.innerHTML = `
                <div class="devocional-view" style="text-align:center;">
                    <h3 style="color: var(--texto-secundario);">No hay lecturas disponibles</h3>
                    <p style="font-size:1.15rem; color:var(--texto-secundario);">Aún no hay devocionales publicados en la base de datos.</p>
                </div>
            `;
        }
        
        attachAdminEvents();
    };

    const crearHTMLDevocional = (dev, fecha) => {
        let adminButtons = '';
        if (auth && auth.currentUser && !auth.currentUser.isAnonymous) {
            adminButtons = `
                <div style="margin-top: 2rem; display: flex; gap: 10px; justify-content: center;">
                    <button class="btn-rojo btn-edit-dev" data-fecha="${fecha}" style="background-color: #2B2B2B; padding: 0.8rem 1.5rem; font-size: 0.9rem;">Editar</button>
                    <button class="btn-rojo btn-delete-dev" data-fecha="${fecha}" style="background-color: #C5292D; padding: 0.8rem 1.5rem; font-size: 0.9rem;">Eliminar</button>
                </div>
            `;
        }
        return `
            <div class="devocional-view reveal active" style="margin-bottom: 2.5rem;">
                <h3>${dev.titulo}</h3>
                <span class="dev-meta">📖 ${dev.cita} | 📅 ${fecha}</span>
                <p style="font-size:1.15rem; line-height: 1.8; text-align: justify; white-space: pre-line;">${dev.texto}</p>
                ${adminButtons}
            </div>
        `;
    };

    const attachAdminEvents = () => {
        document.querySelectorAll('.btn-edit-dev').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const fecha = e.target.getAttribute('data-fecha');
                const dev = cacheDevocionales[fecha];
                if(dev) {
                    document.getElementById('dev-admin-fecha').value = fecha;
                    document.getElementById('dev-admin-titulo').value = dev.titulo;
                    document.getElementById('dev-admin-cita').value = dev.cita;
                    document.getElementById('dev-admin-texto').value = dev.texto;
                    adminPanel.style.display = 'block';
                    setTimeout(() => adminPanel.scrollIntoView({ behavior: 'smooth' }), 300);
                }
            });
        });

        document.querySelectorAll('.btn-delete-dev').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const fecha = e.target.getAttribute('data-fecha');
                const confirmado = await showCustomConfirm(`¿Estás seguro de que deseas eliminar el devocional del ${fecha}?`, "Eliminar Devocional");
                if(confirmado) {
                    if(db && auth && auth.currentUser && !auth.currentUser.isAnonymous) {
                        try {
                            const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'devocionales', fecha);
                            await deleteDoc(docRef);
                            delete cacheDevocionales[fecha];
                            await showCustomAlert("Devocional eliminado con éxito.", "¡Éxito!");
                            renderDevocional(inputFechaBuscar ? inputFechaBuscar.value : null);
                        } catch(err) {
                            console.error("Error eliminando devocional", err);
                            await showCustomAlert("Hubo un error eliminando en la Nube.", "Error");
                        }
                    } else {
                        delete cacheDevocionales[fecha];
                        await showCustomAlert("Eliminado localmente.", "¡Éxito!");
                        renderDevocional(inputFechaBuscar ? inputFechaBuscar.value : null);
                    }
                }
            });
        });
    };

    const descargarDeLaNube = async () => {
        if(!db) return;
        try {
            const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'devocionales');
            const snapshot = await getDocs(colRef);
            snapshot.forEach(doc => {
                cacheDevocionales[doc.id] = doc.data(); 
            });
            if(inputFechaBuscar) renderDevocional(inputFechaBuscar.value);
        } catch(e) {
            console.error("Error obteniendo datos de la nube", e);
        }
    };

    // Llamar inmediatamente para cargar datos para usuarios comunes
    descargarDeLaNube();

    if(auth) {
        onAuthStateChanged(auth, (user) => {
            if(user) {
                // Si el usuario no es anónimo, es el admin logueado
                if(!user.isAnonymous && btnLogout) {
                    btnLogout.style.display = 'block';
                }
                renderDevocional(inputFechaBuscar ? inputFechaBuscar.value : null); // Re-render for admin buttons
            } else {
                if(btnLogout) btnLogout.style.display = 'none';
                renderDevocional(inputFechaBuscar ? inputFechaBuscar.value : null); // Re-render without admin buttons
            }
        });
    }

    if(btnAdmin) {
        btnAdmin.addEventListener('click', () => {
            if (auth && auth.currentUser && !auth.currentUser.isAnonymous) {
                // Ya logueado como admin
                adminPanel.style.display = 'block';
                document.getElementById('dev-admin-fecha').value = new Date().toISOString().split('T')[0];
                window.location.hash = '#devocionales';
                setTimeout(() => adminPanel.scrollIntoView({ behavior: 'smooth' }), 300);
            } else if (adminPanel.style.display === 'none' || adminPanel.style.display === '') {
                // Mostrar modal para login
                modalPassword.classList.add('active');
                if(inputEmail) inputEmail.value = '';
                if(inputPassword) inputPassword.value = '';
                passError.style.display = 'none';
                if(inputEmail) inputEmail.focus();
            } else {
                adminPanel.style.display = 'none';
            }
        });
    }

    const verificarAuthFirebase = async () => {
        if(!auth) {
            passError.textContent = "Firebase no configurado.";
            passError.style.display = 'block';
            return;
        }
        try {
            btnModalSubmit.textContent = "Cargando...";
            btnModalSubmit.disabled = true;
            await signInWithEmailAndPassword(auth, inputEmail.value, inputPassword.value);
            modalPassword.classList.remove('active');
            adminPanel.style.display = 'block';
            document.getElementById('dev-admin-fecha').value = new Date().toISOString().split('T')[0];
            window.location.hash = '#devocionales';
            setTimeout(() => adminPanel.scrollIntoView({ behavior: 'smooth' }), 300);
        } catch(error) {
            console.error(error);
            passError.textContent = "Correo o contraseña incorrectos.";
            passError.style.display = 'block';
        } finally {
            btnModalSubmit.textContent = "Entrar";
            btnModalSubmit.disabled = false;
        }
    };

    if(btnModalSubmit) {
        btnModalSubmit.addEventListener('click', verificarAuthFirebase);
    }
    
    if(inputPassword) {
        inputPassword.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') verificarAuthFirebase();
        });
    }

    if(btnModalCancel) {
        btnModalCancel.addEventListener('click', () => {
            modalPassword.classList.remove('active');
        });
    }

    if(btnCerrarAdmin) {
        btnCerrarAdmin.addEventListener('click', () => { adminPanel.style.display = 'none'; });
    }

    if(btnLogout) {
        btnLogout.addEventListener('click', async () => {
            if(auth) {
                await signOut(auth);
                adminPanel.style.display = 'none';
                await showCustomAlert("Sesión cerrada correctamente.", "Cerrar Sesión");
                if(inputFechaBuscar) renderDevocional(inputFechaBuscar.value);
                // Volver a loguear anónimamente para leer datos
                import('https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js').then(({signInAnonymously}) => {
                    signInAnonymously(auth);
                });
            }
        });
    }

    if(btnGuardarDev) {
        btnGuardarDev.addEventListener('click', async () => {
            const fecha = document.getElementById('dev-admin-fecha').value;
            const titulo = document.getElementById('dev-admin-titulo').value;
            const cita = document.getElementById('dev-admin-cita').value;
            const texto = document.getElementById('dev-admin-texto').value;

            if(!fecha || !titulo || !cita || !texto) {
                await showCustomAlert("Por favor, llena todos los campos del devocional.", "Campos incompletos");
                return;
            }

            const datos = { titulo, cita, texto };
            cacheDevocionales[fecha] = datos;

            if(db && auth && auth.currentUser && !auth.currentUser.isAnonymous) {
                try {
                    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'devocionales', fecha);
                    await setDoc(docRef, datos);
                    await showCustomAlert("¡Éxito! El devocional ha sido publicado y guardado en la Nube.", "Publicado");
                } catch(e) {
                    console.error("Error subiendo devocional", e);
                    await showCustomAlert("No tienes permisos o hubo un error guardando en la Nube.", "Error");
                }
            } else {
                await showCustomAlert("Se ha guardado localmente para esta sesión. (No tienes sesión de admin iniciada).", "Guardado Local");
            }

            adminPanel.style.display = 'none';
            inputFechaBuscar.value = fecha;
            renderDevocional(fecha);
            
            document.getElementById('dev-admin-titulo').value = '';
            document.getElementById('dev-admin-cita').value = '';
            document.getElementById('dev-admin-texto').value = '';
        });
    }

    if(inputFechaBuscar) {
        inputFechaBuscar.addEventListener('change', (e) => renderDevocional(e.target.value));
        const hoyStr = new Date().toISOString().split('T')[0];
        inputFechaBuscar.value = hoyStr;
        renderDevocional(hoyStr); 
    }
}
