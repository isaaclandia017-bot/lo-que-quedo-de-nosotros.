
/* ==========================================
   CARTA I — SISTEMA DE LLAVES
   LO QUE QUEDÓ DE NOSOTROS
========================================== */

// Clave común para guardar el progreso.
const CLAVE_PROGRESO = "sami_estado_historia";

// Estado inicial del recorrido.
const ESTADO_INICIAL = {
    desbloqueadas: [1],
    abiertas: [],
    llaves: [],
    finalizado: false
};

// ==========================================
// GUARDAR Y RECUPERAR PROGRESO
// ==========================================

function obtenerProgreso() {
    try {
        const datos = localStorage.getItem(CLAVE_PROGRESO);

        if (!datos) {
            return structuredClone(ESTADO_INICIAL);
        }

        const guardado = JSON.parse(datos);

        return {
            ...structuredClone(ESTADO_INICIAL),
            ...guardado
        };

    } catch (error) {
        console.error("Error al leer el progreso:", error);
        return structuredClone(ESTADO_INICIAL);
    }
}

function guardarProgreso(progreso) {
    localStorage.setItem(
        CLAVE_PROGRESO,
        JSON.stringify(progreso)
    );
}

// ==========================================
// REGISTRAR LA PRIMERA CARTA
// ==========================================

function registrarCartaAbierta() {
    const progreso = obtenerProgreso();

    if (!progreso.abiertas.includes(1)) {
        progreso.abiertas.push(1);
    }

    if (!progreso.desbloqueadas.includes(1)) {
        progreso.desbloqueadas.push(1);
    }

    guardarProgreso(progreso);
}

registrarCartaAbierta();

// ==========================================
// ELEMENTOS HTML
// ==========================================

const llaveDos = document.getElementById("llaveDos");

const estadoLlave = document.getElementById("estadoLlave");

const botonAyuda = document.getElementById("botonAyuda");

const modalAyuda = document.getElementById("modalAyuda");

const cerrarAyuda = document.getElementById("cerrarAyuda");

const botonRegresar = document.getElementById("botonRegresar");

// ==========================================
// ACTUALIZAR APARIENCIA DE LA LLAVE
// ==========================================

function actualizarLlave() {
    const progreso = obtenerProgreso();

    const llaveGuardada =
        progreso.llaves.includes(2);

    const cartaDesbloqueada =
        progreso.desbloqueadas.includes(2);

    if (llaveGuardada || cartaDesbloqueada) {

        llaveDos.disabled = true;

        llaveDos.style.opacity = "0.45";

        llaveDos.style.cursor = "default";

        estadoLlave.textContent =
            cartaDesbloqueada
                ? "La carta II ya está desbloqueada."
                : "¡Llave guardada en el inventario!";

    } else {

        llaveDos.disabled = false;

        llaveDos.style.opacity = "1";

        estadoLlave.textContent =
            "Toca la llave para guardarla.";
    }
}

// ==========================================
// RECOGER LA LLAVE
// ==========================================

llaveDos.addEventListener("click", () => {

    const progreso = obtenerProgreso();

    if (
        progreso.llaves.includes(2) ||
        progreso.desbloqueadas.includes(2)
    ) {
        return;
    }

    // Guardar la llave número 2.
    progreso.llaves.push(2);

    guardarProgreso(progreso);

    // Animación visual.
    llaveDos.animate(
        [
            {
                transform: "scale(1)",
                opacity: 1
            },
            {
                transform: "scale(1.35) rotate(12deg)",
                opacity: 1,
                offset: 0.45
            },
            {
                transform: "scale(0.4) translateY(-30px)",
                opacity: 0
            }
        ],
        {
            duration: 800,
            easing: "ease-in-out"
        }
    );

    estadoLlave.textContent =
        "¡Has conseguido la llave de la Carta II!";

    // Esperar al final de la animación.
    setTimeout(() => {
        actualizarLlave();
    }, 850);

});

// ==========================================
// VENTANA DE AYUDA
// ==========================================

function abrirAyuda() {
    modalAyuda.hidden = false;
}

function cerrarVentanaAyuda() {
    modalAyuda.hidden = true;
}

botonAyuda.addEventListener("click", abrirAyuda);

cerrarAyuda.addEventListener(
    "click",
    cerrarVentanaAyuda
);

// Cerrar al pulsar fuera del cuadro.
modalAyuda.addEventListener("click", (evento) => {

    if (evento.target === modalAyuda) {
        cerrarVentanaAyuda();
    }

});

// Cerrar con la tecla Escape.
document.addEventListener("keydown", (evento) => {

    if (
        evento.key === "Escape" &&
        !modalAyuda.hidden
    ) {
        cerrarVentanaAyuda();
    }

});

// ==========================================
// REGRESAR A LA PÁGINA PRINCIPAL
// ==========================================

botonRegresar.addEventListener("click", () => {

    // Navegación dentro del reproductor permanente.
    if (window.parent !== window) {

        window.parent.postMessage(
            {
                tipo: "NAVEGAR",
                pagina: "principal.html"
            },
            window.location.origin
        );

    } else {

        // Alternativa cuando se abre la carta directamente.
        window.location.href = "principal.html";

    }

});

// ==========================================
// INICIALIZACIÓN
// ==========================================

actualizarLlave();

console.log("Carta I preparada correctamente.");
