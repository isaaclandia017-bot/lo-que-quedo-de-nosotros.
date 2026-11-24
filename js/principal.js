
/* ==========================================
   LO QUE QUEDÓ DE NOSOTROS
   SISTEMA COMPLETO DE CARTAS E INVENTARIO
   VERSIÓN CORREGIDA
========================================== */

// ==========================================
// CONFIGURACIÓN GENERAL
// ==========================================

const CLAVE_PROGRESO = "sami_estado_historia";
const CLAVE_LUNA = "sami_luna_descubierta";

const ESTADO_INICIAL = {
    desbloqueadas: [1],
    abiertas: [],
    llaves: [],
    finalizado: false
};

// ==========================================
// IMÁGENES DE LAS LLAVES
// ==========================================

const IMAGENES_LLAVES = {
    2: "assets/llavero-tacones.png",
    3: "assets/kitty.png",
    4: "assets/llave-rosa.png",
    5: "assets/llave-glitch.png",
    6: "assets/llave-antigua.png"
};

// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const sobres = document.querySelectorAll(".sobre");

const listaLlaves =
    document.getElementById("listaLlaves");

const contadorLlaves =
    document.getElementById("contadorLlaves");

const mensajeSistema =
    document.getElementById("mensajeSistema");

// Llave seleccionada para usar con clic.
let llaveSeleccionada = null;

// ==========================================
// RECUPERAR PROGRESO
// ==========================================

function obtenerProgreso() {

    try {

        const datos = localStorage.getItem(
            CLAVE_PROGRESO
        );

        if (!datos) {
            return {
                desbloqueadas: [1],
                abiertas: [],
                llaves: [],
                finalizado: false
            };
        }

        const guardado = JSON.parse(datos);

        // Convertir valores a números.
        const numeros = valores =>
            Array.isArray(valores)
                ? valores.map(Number).filter(Number.isInteger)
                : [];

        const progreso = {
            desbloqueadas:
                numeros(guardado.desbloqueadas),

            abiertas:
                numeros(guardado.abiertas),

            llaves:
                numeros(guardado.llaves),

            finalizado:
                guardado.finalizado === true
        };

        // La primera carta siempre está disponible
        // mientras no se haya activado el final.
        if (!progreso.finalizado &&
            !progreso.desbloqueadas.includes(1)) {

            progreso.desbloqueadas.unshift(1);
        }

        // Cuando termina la historia,
        // únicamente queda disponible la sexta.
        if (progreso.finalizado) {

            progreso.desbloqueadas = [6];
            progreso.llaves = [];
        }

        return progreso;

    } catch (error) {

        console.error(
            "Error al recuperar el progreso:",
            error
        );

        return {
            desbloqueadas: [1],
            abiertas: [],
            llaves: [],
            finalizado: false
        };
    }
}

// ==========================================
// GUARDAR PROGRESO
// ==========================================

function guardarProgreso(progreso) {

    localStorage.setItem(
        CLAVE_PROGRESO,
        JSON.stringify(progreso)
    );
}

// ==========================================
// MOSTRAR MENSAJES
// ==========================================

function mostrarMensaje(texto) {

    if (mensajeSistema) {
        mensajeSistema.textContent = texto;
    }
}

// ==========================================
// NAVEGACIÓN
// ==========================================

function navegar(pagina) {

    if (window.parent !== window) {

        window.parent.postMessage(
            {
                tipo: "NAVEGAR",
                pagina: pagina
            },
            window.location.origin
        );

    } else {

        window.location.href = pagina;
    }
}

// ==========================================
// ACTUALIZAR LOS SEIS SOBRES
// ==========================================

function actualizarCartas() {

    const progreso = obtenerProgreso();

    sobres.forEach(sobre => {

        const numero = Number(
            sobre.dataset.carta
        );

        const desbloqueada =
            progreso.desbloqueadas.includes(numero);

        const abierta =
            progreso.abiertas.includes(numero);

        const estadoVisual =
            sobre.querySelector(".estado-carta");

        // Limpiar estilos anteriores.
        sobre.classList.remove(
            "bloqueado",
            "disponible",
            "abierto",
            "gris-final",
            "cerrado-definitivo",
            "desbloqueando"
        );

        sobre.removeAttribute("aria-disabled");

        // Mantener los sobres como zonas
        // que pueden recibir llaves.
        sobre.disabled = false;

        // ==================================
        // FINAL DE LA HISTORIA
        // ==================================

        if (progreso.finalizado && numero < 6) {

            sobre.classList.add(
                "bloqueado",
                "gris-final",
                "cerrado-definitivo"
            );

            sobre.setAttribute(
                "aria-disabled",
                "true"
            );

            if (estadoVisual) {
                estadoVisual.textContent = "Cerrada";
            }

            return;
        }

        // ==================================
        // CARTA DISPONIBLE
        // ==================================

        if (desbloqueada) {

            sobre.classList.add("disponible");

            if (abierta) {
                sobre.classList.add("abierto");
            }

            if (estadoVisual) {

                estadoVisual.textContent =
                    abierta
                        ? "Abierta"
                        : "Disponible";
            }

        } else {

            // ==================================
            // CARTA BLOQUEADA NORMAL
            // ==================================

            sobre.classList.add("bloqueado");

            if (estadoVisual) {
                estadoVisual.textContent = "Bloqueada";
            }
        }
    });
}

// ==========================================
// ACTUALIZAR INVENTARIO
// ==========================================

function actualizarInventario() {

    if (!listaLlaves || !contadorLlaves) {
        return;
    }

    const progreso = obtenerProgreso();

    listaLlaves.innerHTML = "";

    const cantidad = progreso.llaves.length;

    contadorLlaves.textContent =
        cantidad === 1
            ? "1 llave"
            : `${cantidad} llaves`;

    // ======================================
    // INVENTARIO VACÍO
    // ======================================

    if (cantidad === 0) {

        const mensaje = document.createElement("p");

        mensaje.className = "inventario-vacio";

        mensaje.textContent =
            progreso.finalizado
                ? "El recorrido ha llegado a su final."
                : "Todavía no has encontrado ninguna llave.";

        listaLlaves.appendChild(mensaje);

        return;
    }

    // ======================================
    // CREAR CADA LLAVE
    // ======================================

    progreso.llaves.forEach(numero => {

        const llave = document.createElement("button");

        llave.type = "button";
        llave.className = "llave";
        llave.draggable = true;

        llave.dataset.llave = String(numero);

        llave.title =
            `Llave de la Carta ${numero}`;

        llave.setAttribute(
            "aria-label",
            `Seleccionar llave de la Carta ${numero}`
        );

        // ==================================
        // IMÁGENES PERSONALIZADAS
        // ==================================

        if (IMAGENES_LLAVES[numero]) {

            const imagen = document.createElement("img");

            imagen.src = IMAGENES_LLAVES[numero];

            imagen.alt =
                `Llave de la Carta ${numero}`;

            imagen.draggable = false;

            imagen.style.width = "100%";
            imagen.style.height = "100%";
            imagen.style.objectFit = "contain";
            imagen.style.pointerEvents = "none";

            llave.appendChild(imagen);

        } else {

            llave.textContent = "🗝️";
        }

        // ==================================
        // ARRASTRAR CON MOUSE
        // ==================================

        llave.addEventListener("dragstart", evento => {

            if (obtenerProgreso().finalizado) {
                evento.preventDefault();
                return;
            }

            evento.dataTransfer.setData(
                "text/plain",
                String(numero)
            );

            evento.dataTransfer.effectAllowed = "move";
        });

        // ==================================
        // SELECCIONAR CON CLIC
        // ==================================

        llave.addEventListener("click", () => {

            if (llaveSeleccionada === numero) {

                llaveSeleccionada = null;

                actualizarInventario();

                mostrarMensaje(
                    "Selección de llave cancelada."
                );

                return;
            }

            llaveSeleccionada = numero;

            // Quitar selección anterior.
            document.querySelectorAll(".llave")
                .forEach(elemento => {

                    elemento.style.outline = "none";
                });

            llave.style.outline =
                "3px solid #fff1ad";

            mostrarMensaje(
                `Llave ${numero} seleccionada. ` +
                `Ahora toca la Carta ${numero}.`
            );
        });

        listaLlaves.appendChild(llave);

    });
}

// ==========================================
// DESBLOQUEAR CARTA
// ==========================================

function desbloquearCarta(numeroCarta) {

    const progreso = obtenerProgreso();

    // Después del final no pueden
    // desbloquearse cartas anteriores.
    if (progreso.finalizado) {

        mostrarMensaje(
            "El recorrido ya ha terminado."
        );

        return;
    }

    // Comprobar si ya está disponible.
    if (progreso.desbloqueadas.includes(numeroCarta)) {

        mostrarMensaje(
            `La Carta ${numeroCarta} ya está desbloqueada.`
        );

        return;
    }

    // Comprobar que tiene su llave.
    if (!progreso.llaves.includes(numeroCarta)) {

        mostrarMensaje(
            `Necesitas encontrar la llave ` +
            `de la Carta ${numeroCarta}.`
        );

        return;
    }

    // ======================================
    // UTILIZAR LA LLAVE
    // ======================================

    progreso.llaves = progreso.llaves.filter(
        numero => numero !== numeroCarta
    );

    progreso.desbloqueadas.push(numeroCarta);

    guardarProgreso(progreso);

    llaveSeleccionada = null;

    // Actualizar el salón.
    actualizarCartas();
    actualizarInventario();

    // ======================================
    // ANIMACIÓN DE DESBLOQUEO
    // ======================================

    const sobre = document.getElementById(
        `carta${numeroCarta}`
    );

    if (sobre) {

        sobre.classList.add("desbloqueando");

        setTimeout(() => {

            sobre.classList.remove(
                "desbloqueando"
            );

        }, 950);
    }

    mostrarMensaje(
        `¡Has desbloqueado la Carta ${numeroCarta}! ` +
        `Ahora puedes abrirla.`
    );
}

// ==========================================
// ABRIR CARTA
// ==========================================

function abrirCarta(numeroCarta) {

    const progreso = obtenerProgreso();

    // ======================================
    // IMPEDIR ABRIR CARTAS ANTIGUAS
    // DESPUÉS DEL FINAL
    // ======================================

    if (progreso.finalizado && numeroCarta < 6) {

        mostrarMensaje(
            "Estos recuerdos ya forman parte " +
            "del pasado. Solo queda la última carta."
        );

        return;
    }

    // ======================================
    // COMPROBAR SI ESTÁ DESBLOQUEADA
    // ======================================

    if (!progreso.desbloqueadas.includes(numeroCarta)) {

        // Si hay una llave seleccionada,
        // intentar utilizarla.
        if (llaveSeleccionada === numeroCarta) {

            desbloquearCarta(numeroCarta);

        } else {

            mostrarMensaje(
                `La Carta ${numeroCarta} está bloqueada. ` +
                "Necesitas encontrar su llave."
            );
        }

        return;
    }

    // ======================================
    // REGISTRAR CARTA ABIERTA
    // ======================================

    if (!progreso.abiertas.includes(numeroCarta)) {

        progreso.abiertas.push(numeroCarta);
    }

    // ======================================
    // FINAL AL ABRIR LA CARTA VI
    // ======================================

    if (numeroCarta === 6 && !progreso.finalizado) {

        progreso.finalizado = true;

        // El inventario queda vacío.
        progreso.llaves = [];

        // Solamente queda disponible
        // la última carta.
        progreso.desbloqueadas = [6];

        llaveSeleccionada = null;
    }

    guardarProgreso(progreso);

    actualizarCartas();
    actualizarInventario();

    // ======================================
    // NAVEGAR A LA CARTA
    // ======================================

    navegar(`carta${numeroCarta}.html`);
}

// ==========================================
// EVENTOS DE LOS SEIS SOBRES
// ==========================================

sobres.forEach(sobre => {

    const numeroCarta = Number(
        sobre.dataset.carta
    );

    // ======================================
    // ABRIR CON CLIC
    // ======================================

    sobre.addEventListener("click", () => {

        abrirCarta(numeroCarta);
    });

    // ======================================
    // PERMITIR ARRASTRAR LLAVES
    // ======================================

    sobre.addEventListener("dragover", evento => {

        if (obtenerProgreso().finalizado) {
            return;
        }

        evento.preventDefault();

        evento.dataTransfer.dropEffect = "move";
    });

    // ======================================
    // SOLTAR UNA LLAVE
    // ======================================

    sobre.addEventListener("drop", evento => {

        evento.preventDefault();

        const progreso = obtenerProgreso();

        if (progreso.finalizado) {

            mostrarMensaje(
                "El recorrido ya ha terminado."
            );

            return;
        }

        const textoLlave =
            evento.dataTransfer.getData("text/plain");

        const numeroLlave = Number(textoLlave);

        if (
            textoLlave !== "" &&
            numeroLlave === numeroCarta &&
            progreso.llaves.includes(numeroLlave)
        ) {

            desbloquearCarta(numeroCarta);

        } else {

            mostrarMensaje(
                "Esta llave no corresponde a ese sobre."
            );
        }
    });
});

// ==========================================
// REINICIAR HISTORIA — SOLO PARA PRUEBAS
// ==========================================

// Cambia a false cuando publiques la página.
const MODO_PRUEBAS = true;

if (MODO_PRUEBAS) {

    const botonReinicio =
        document.createElement("button");

    botonReinicio.type = "button";

    botonReinicio.textContent =
        "🔄 Reiniciar historia";

    botonReinicio.style.cssText = `
        position: fixed;
        top: 15px;
        right: 15px;
        z-index: 9999;
        padding: 12px 18px;
        background: #8b2332;
        color: white;
        border: 2px solid #e6bb70;
        border-radius: 12px;
        cursor: pointer;
        font-size: 14px;
        font-family: Georgia, serif;
        box-shadow:
            0 5px 15px rgba(0,0,0,.4);
    `;

    document.body.appendChild(botonReinicio);

    botonReinicio.addEventListener("click", () => {

        const confirmar = confirm(
            "¿Quieres reiniciar toda la historia? " +
            "Todas las cartas volverán a estar " +
            "bloqueadas excepto la primera."
        );

        if (!confirmar) return;

        // Borrar progreso.
        localStorage.removeItem(CLAVE_PROGRESO);

        // Reiniciar secreto de Luna Roja.
        localStorage.removeItem(CLAVE_LUNA);

        // Cancelar selección.
        llaveSeleccionada = null;

        // Actualizar sin recargar.
        actualizarCartas();
        actualizarInventario();

        mostrarMensaje(
            "Historia reiniciada. " +
            "La Carta I está disponible."
        );

        console.log(
            "Historia reiniciada correctamente."
        );
    });
}

// ==========================================
// ACTUALIZAR AL VOLVER A LA PÁGINA
// ==========================================

window.addEventListener("pageshow", () => {

    actualizarCartas();
    actualizarInventario();
});

// ==========================================
// INICIAR SISTEMA
// ==========================================

actualizarCartas();
actualizarInventario();

console.log(
    "Sistema de cartas funcionando correctamente."
);
