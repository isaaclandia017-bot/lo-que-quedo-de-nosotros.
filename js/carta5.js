
/* ==========================================
   CARTA V — EL DÍA QUE FALTASTE
   SISTEMA DE CARTA Y LLAVE ANTIGUA
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // CONFIGURACIÓN
    // ======================================

    const CLAVE_PROGRESO = "sami_estado_historia";

    // Esta llave desbloquea la Carta VI.
    const NUMERO_LLAVE = 6;

    // ======================================
    // ELEMENTOS DEL HTML
    // ======================================

    const botonVolver =
        document.getElementById("botonVolver");

    const abrirCarta =
        document.getElementById("abrirCarta");

    const cerrarCarta =
        document.getElementById("cerrarCarta");

    const modalCarta =
        document.getElementById("modalCarta");

    const revelarLlave =
        document.getElementById("revelarLlave");

    const seccionLlave =
        document.getElementById("seccionLlave");

    const llaveSeis =
        document.getElementById("llaveSeis");

    const estadoLlave =
        document.getElementById("estadoLlave");

    // ======================================
    // OBTENER PROGRESO
    // ======================================

    function obtenerProgreso() {

        try {

            const datos = JSON.parse(
                localStorage.getItem(CLAVE_PROGRESO)
                || "null"
            );

            return {
                desbloqueadas:
                    Array.isArray(datos?.desbloqueadas)
                        ? datos.desbloqueadas
                        : [1],

                abiertas:
                    Array.isArray(datos?.abiertas)
                        ? datos.abiertas
                        : [],

                llaves:
                    Array.isArray(datos?.llaves)
                        ? datos.llaves
                        : [],

                finalizado:
                    datos?.finalizado === true
            };

        } catch (error) {

            console.error(
                "Error al recuperar progreso:",
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

    // ======================================
    // GUARDAR PROGRESO
    // ======================================

    function guardarProgreso(progreso) {

        localStorage.setItem(
            CLAVE_PROGRESO,
            JSON.stringify(progreso)
        );
    }

    // ======================================
    // NAVEGACIÓN
    // ======================================

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

    // ======================================
    // BOTÓN PARA VOLVER
    // ======================================

    botonVolver.addEventListener("click", () => {

        navegar("principal.html");

    });

    // ======================================
    // ABRIR LA CARTA
    // ======================================

    abrirCarta.addEventListener("click", () => {

        modalCarta.hidden = false;

        document.body.style.overflow = "hidden";

        cerrarCarta.focus();

    });

    // ======================================
    // CERRAR LA CARTA
    // ======================================

    function cerrarVentana() {

        if (modalCarta.hidden) return;

        modalCarta.hidden = true;

        document.body.style.overflow = "";

        abrirCarta.focus();
    }

    cerrarCarta.addEventListener(
        "click",
        cerrarVentana
    );

    // Cerrar al pulsar fuera del pergamino.
    modalCarta.addEventListener("click", evento => {

        if (evento.target === modalCarta) {
            cerrarVentana();
        }
    });

    // Cerrar presionando Escape.
    document.addEventListener("keydown", evento => {

        if (
            evento.key === "Escape" &&
            !modalCarta.hidden
        ) {
            cerrarVentana();
        }
    });

    // ======================================
    // REVELAR LA LLAVE
    // ======================================

    revelarLlave.addEventListener("click", () => {

        seccionLlave.hidden = false;

        revelarLlave.hidden = true;

        actualizarLlave();

        seccionLlave.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    });

    // ======================================
    // ACTUALIZAR LLAVE
    // ======================================

    function actualizarLlave() {

        const progreso = obtenerProgreso();

        const guardada =
            progreso.llaves.includes(NUMERO_LLAVE);

        const utilizada =
            progreso.desbloqueadas.includes(NUMERO_LLAVE);

        if (utilizada) {

            llaveSeis.disabled = true;

            estadoLlave.textContent =
                "La Carta VI ya está desbloqueada.";

        } else if (guardada) {

            llaveSeis.disabled = true;

            estadoLlave.textContent =
                "Esta llave ya está en tu inventario.";

        } else {

            llaveSeis.disabled = false;

            estadoLlave.textContent =
                "Toca la llave para guardarla.";
        }
    }

    // ======================================
    // RECOGER LA LLAVE ANTIGUA
    // ======================================

    llaveSeis.addEventListener("click", () => {

        const progreso = obtenerProgreso();

        // Evitar llaves duplicadas.
        if (
            progreso.llaves.includes(NUMERO_LLAVE) ||
            progreso.desbloqueadas.includes(NUMERO_LLAVE)
        ) {

            actualizarLlave();
            return;
        }

        // Guardar la llave VI.
        progreso.llaves.push(NUMERO_LLAVE);

        guardarProgreso(progreso);

        // Desactivar la llave recogida.
        llaveSeis.disabled = true;

        // Animación de recogida.
        if (
            !window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
        ) {

            llaveSeis.animate(
                [
                    {
                        opacity: 1,
                        transform: "scale(1)"
                    },
                    {
                        opacity: 1,
                        transform: "scale(1.15)",
                        offset: 0.5
                    },
                    {
                        opacity: 0.35,
                        transform: "scale(.85)"
                    }
                ],
                {
                    duration: 650,
                    easing: "ease-in-out"
                }
            );
        }

        estadoLlave.textContent =
            "¡Has guardado la última llave! " +
            "Regresa al salón para abrir la Carta VI.";

        console.log(
            "Llave VI guardada correctamente."
        );

    });

    // ======================================
    // ACTUALIZAR AL REGRESAR
    // ======================================

    window.addEventListener("pageshow", () => {

        if (!seccionLlave.hidden) {
            actualizarLlave();
        }

    });

    // ======================================
    // INICIAR
    // ======================================

    actualizarLlave();

    console.log(
        "Carta V preparada: carta, llave y navegación."
    );

});
