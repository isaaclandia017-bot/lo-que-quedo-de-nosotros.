
/* ==========================================
   CARTA IV — CUANDO EL TIEMPO NOS CAMBIÓ
   SISTEMA DE LLAVE GLITCH
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // CONFIGURACIÓN
    // ======================================

    const CLAVE_PROGRESO = "sami_estado_historia";

    // La llave de esta página abre la Carta V.
    const NUMERO_LLAVE = 5;

    // ======================================
    // ELEMENTOS DEL HTML
    // ======================================

    const botonVolver =
        document.getElementById("botonVolver");

    const llaveCinco =
        document.getElementById("llaveCinco");

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
    // ACTUALIZAR ESTADO DE LA LLAVE
    // ======================================

    function actualizarLlave() {

        const progreso = obtenerProgreso();

        const guardada =
            progreso.llaves.includes(NUMERO_LLAVE);

        const utilizada =
            progreso.desbloqueadas.includes(NUMERO_LLAVE);

        if (utilizada) {

            llaveCinco.disabled = true;
            llaveCinco.style.opacity = "0.35";

            estadoLlave.textContent =
                "La Carta V ya está desbloqueada.";

        } else if (guardada) {

            llaveCinco.disabled = true;
            llaveCinco.style.opacity = "0.35";

            estadoLlave.textContent =
                "La llave glitch ya está en tu inventario.";

        } else {

            llaveCinco.disabled = false;
            llaveCinco.style.opacity = "1";

            estadoLlave.textContent =
                "Toca la llave para guardarla.";
        }
    }

    // ======================================
    // RECOGER LLAVE GLITCH
    // ======================================

    llaveCinco.addEventListener("click", () => {

        const progreso = obtenerProgreso();

        // Evitar duplicar la llave.
        if (
            progreso.llaves.includes(NUMERO_LLAVE) ||
            progreso.desbloqueadas.includes(NUMERO_LLAVE)
        ) {
            actualizarLlave();
            return;
        }

        // Guardar llave número 5.
        progreso.llaves.push(NUMERO_LLAVE);

        guardarProgreso(progreso);

        // Evitar recogerla varias veces.
        llaveCinco.disabled = true;

        estadoLlave.textContent =
            "¡Encontraste la llave glitch! " +
            "Se ha guardado en tu inventario.";

        // Animación de recogida.
        llaveCinco.animate(
            [
                {
                    transform: "scale(1)",
                    opacity: 1,
                    filter: "brightness(1)"
                },
                {
                    transform: "scale(1.2) rotate(7deg)",
                    opacity: 1,
                    filter: "brightness(1.8)",
                    offset: 0.4
                },
                {
                    transform: "scale(0.3) translateY(-50px)",
                    opacity: 0,
                    filter: "brightness(2)"
                }
            ],
            {
                duration: 850,
                easing: "ease-in-out"
            }
        );

        setTimeout(() => {

            actualizarLlave();

        }, 850);

    });

    // ======================================
    // BOTÓN VOLVER
    // ======================================

    botonVolver.addEventListener("click", () => {

        navegar("principal.html");

    });

    // ======================================
    // INICIAR
    // ======================================

    actualizarLlave();

    console.log(
        "Carta IV funcionando. Llave glitch preparada."
    );

});
