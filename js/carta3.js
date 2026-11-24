
/* ==========================================
   CARTA III — PLANES
   MINIJUEGO, FOTOS, MÚSICA Y LLAVE IV
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // CONFIGURACIÓN
    // ======================================

    const CLAVE_PROGRESO = "sami_estado_historia";

    const CAJITA_CORRECTA = 2;

    
const FOTOS = [
    "assets/corazon.png",
    "assets/piscina.png",
    "assets/teamo.png",
    "assets/tren.png"
];


    const ESTADO_INICIAL = {
        desbloqueadas: [1],
        abiertas: [],
        llaves: [],
        finalizado: false
    };

    // ======================================
    // ELEMENTOS HTML
    // ======================================

    const botonVolver =
        document.getElementById("botonVolver");

    const botonJugar =
        document.getElementById("botonJugar");

    const modalJuego =
        document.getElementById("modalJuego");

    const cerrarJuego =
        document.getElementById("cerrarJuego");

    const cajitas =
        document.querySelectorAll(".cajita");

    const resultadoJuego =
        document.getElementById("resultadoJuego");

    const premioJuego =
        document.getElementById("premioJuego");

    const llaveCuatro =
        document.getElementById("llaveCuatro");

    const estadoLlave =
        document.getElementById("estadoLlave");

    const cinta =
        document.getElementById("cintaFotografica");

    const fotoAnterior =
        document.getElementById("fotoAnterior");

    const fotoSiguiente =
        document.getElementById("fotoSiguiente");

    const contadorFotos =
        document.getElementById("contadorFotografias");

    // ======================================
    // AUDIO DEL MINIJUEGO
    // ======================================

    let musicaJuego =
        document.getElementById("musicaJuego");

    // Crear reproductor si no existe.
    if (!musicaJuego) {

        musicaJuego = document.createElement("audio");

        musicaJuego.id = "musicaJuego";
        musicaJuego.src = "assets/Heartache.mp3";

        document.body.appendChild(musicaJuego);
    }

    musicaJuego.loop = true;
    musicaJuego.volume = 0.45;
    musicaJuego.preload = "auto";

    let musicaPrincipalPausada = false;

    // ======================================
    // GUARDAR Y RECUPERAR PROGRESO
    // ======================================

    function obtenerProgreso() {

        try {

            const datos = JSON.parse(
                localStorage.getItem(CLAVE_PROGRESO)
                || "null"
            );

            if (!datos) {
                return {
                    ...ESTADO_INICIAL,
                    desbloqueadas: [1],
                    abiertas: [],
                    llaves: []
                };
            }

            return {
                desbloqueadas:
                    Array.isArray(datos.desbloqueadas)
                        ? datos.desbloqueadas
                        : [1],

                abiertas:
                    Array.isArray(datos.abiertas)
                        ? datos.abiertas
                        : [],

                llaves:
                    Array.isArray(datos.llaves)
                        ? datos.llaves
                        : [],

                finalizado:
                    datos.finalizado === true
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

    function guardarProgreso(progreso) {

        localStorage.setItem(
            CLAVE_PROGRESO,
            JSON.stringify(progreso)
        );
    }

    // ======================================
    // COMUNICACIÓN CON LA PORTADA
    // ======================================

    function enviarMensaje(tipo, datos = {}) {

        if (window.parent !== window) {

            window.parent.postMessage(
                {
                    tipo: tipo,
                    ...datos
                },
                window.location.origin
            );
        }
    }

    // ======================================
    // PAUSAR MÚSICA PRINCIPAL
    // ======================================

    function pausarMusicaPrincipal() {

        if (musicaPrincipalPausada) return;

        musicaPrincipalPausada = true;

        enviarMensaje("PAUSAR_MUSICA");
    }

    // ======================================
    // REANUDAR MÚSICA PRINCIPAL
    // ======================================

    function reanudarMusicaPrincipal() {

        if (!musicaPrincipalPausada) return;

        musicaPrincipalPausada = false;

        enviarMensaje("REANUDAR_MUSICA");
    }

    // ======================================
    // REPRODUCIR HEARTACHE
    // ======================================

    async function iniciarMusicaJuego() {

        pausarMusicaPrincipal();

        musicaJuego.currentTime = 0;

        try {

            await musicaJuego.play();

            console.log(
                "Heartache está reproduciéndose."
            );

        } catch (error) {

            console.warn(
                "No se pudo reproducir Heartache:",
                error
            );
        }
    }

    // ======================================
    // DETENER HEARTACHE
    // ======================================

    function detenerMusicaJuego() {

        musicaJuego.pause();
        musicaJuego.currentTime = 0;

        reanudarMusicaPrincipal();
    }

    // ======================================
    // NAVEGACIÓN
    // ======================================

    function navegar(pagina) {

        if (window.parent !== window) {

            enviarMensaje(
                "NAVEGAR",
                { pagina: pagina }
            );

        } else {

            window.location.href = pagina;
        }
    }

    // ======================================
    // ESTADO DEL MINIJUEGO
    // ======================================

    let juegoGanado = false;
    let temporizadorVictoria = null;

    function tienePremio() {

        const progreso = obtenerProgreso();

        return (
            progreso.llaves.includes(4) ||
            progreso.desbloqueadas.includes(4)
        );
    }

    // ======================================
    // ABRIR MINIJUEGO
    // ======================================

    function abrirMinijuego() {

        if (!modalJuego.hidden) return;

        modalJuego.hidden = false;

        document.body.style.overflow = "hidden";

        cajitas.forEach(cajita => {

            cajita.classList.remove(
                "correcta",
                "incorrecta"
            );

            const regalo =
                cajita.querySelector(".regalo");

            if (regalo) {
                regalo.textContent = "🎁";
            }
        });

        // Revisar si ya encontró el tesoro.
        if (juegoGanado || tienePremio()) {

            mostrarVictoria();

        } else {

            juegoGanado = false;
            premioJuego.hidden = true;

            resultadoJuego.textContent =
                "Elige una cajita para descubrir su secreto.";

            cajitas.forEach(cajita => {
                cajita.disabled = false;
            });
        }

        iniciarMusicaJuego();

        cerrarJuego.focus();
    }

    botonJugar.addEventListener(
        "click",
        abrirMinijuego
    );

    // ======================================
    // CERRAR MINIJUEGO
    // ======================================

    function cerrarMinijuego(
        devolverFoco = true
    ) {

        if (modalJuego.hidden) return;

        modalJuego.hidden = true;

        document.body.style.overflow = "";

        // Detener música especial.
        detenerMusicaJuego();

        if (devolverFoco) {
            botonJugar.focus();
        }
    }

    cerrarJuego.addEventListener("click", () => {

        cerrarMinijuego();
    });

    modalJuego.addEventListener("click", evento => {

        if (evento.target === modalJuego) {

            cerrarMinijuego();
        }
    });

    document.addEventListener("keydown", evento => {

        if (
            evento.key === "Escape" &&
            !modalJuego.hidden
        ) {

            cerrarMinijuego();
        }
    });

    // ======================================
    // VOLVER AL SALÓN
    // ======================================

    botonVolver.addEventListener("click", () => {

        cerrarMinijuego(false);

        detenerMusicaJuego();

        navegar("principal.html");
    });

    // ======================================
    // JUEGO DE LAS TRES CAJITAS
    // ======================================

    cajitas.forEach(cajita => {

        cajita.addEventListener("click", () => {

            if (juegoGanado) return;

            const numero =
                Number(cajita.dataset.cajita);

            // CAJITA CORRECTA
            if (numero === CAJITA_CORRECTA) {

                juegoGanado = true;

                cajita.classList.add("correcta");

                const regalo =
                    cajita.querySelector(".regalo");

                if (regalo) {
                    regalo.textContent = "💝";
                }

                resultadoJuego.textContent =
                    "¡La encontraste! El verdadero " +
                    "tesoro estaba en los recuerdos.";

                cajitas.forEach(otra => {
                    otra.disabled = true;
                });

                clearTimeout(temporizadorVictoria);

                temporizadorVictoria = setTimeout(() => {

                    if (!modalJuego.hidden) {
                        mostrarVictoria();
                    }

                }, 750);

            } else {

                // CAJITA INCORRECTA

                cajita.classList.remove("incorrecta");

                void cajita.offsetWidth;

                cajita.classList.add("incorrecta");

                resultadoJuego.textContent =
                    "¡Casi, JSJS! Aquí no estaba. " +
                    "Intenta con otra cajita.";

                setTimeout(() => {

                    cajita.classList.remove(
                        "incorrecta"
                    );

                }, 450);
            }
        });
    });

    // ======================================
    // MOSTRAR VICTORIA
    // ======================================

    function mostrarVictoria() {

        juegoGanado = true;

        premioJuego.hidden = false;

        cajitas.forEach(cajita => {
            cajita.disabled = true;
        });

        resultadoJuego.textContent =
            "¡Has encontrado la cajita correcta!";

        const progreso = obtenerProgreso();

        if (progreso.desbloqueadas.includes(4)) {

            llaveCuatro.disabled = true;

            estadoLlave.textContent =
                "La Carta IV ya está desbloqueada.";

        } else if (progreso.llaves.includes(4)) {

            llaveCuatro.disabled = true;

            estadoLlave.textContent =
                "La llave ya está en tu inventario.";

        } else {

            llaveCuatro.disabled = false;

            estadoLlave.textContent =
                "¡Toca la llave para guardarla!";
        }

        llaveCuatro.style.opacity =
            llaveCuatro.disabled ? "0.45" : "1";
    }

    // ======================================
    // GUARDAR LLAVE IV
    // ======================================

    llaveCuatro.addEventListener("click", () => {

        if (!juegoGanado) return;

        const progreso = obtenerProgreso();

        if (
            progreso.llaves.includes(4) ||
            progreso.desbloqueadas.includes(4)
        ) {
            return;
        }

        progreso.llaves.push(4);

        guardarProgreso(progreso);

        llaveCuatro.disabled = true;

        // Animación de recompensa.
        llaveCuatro.animate(
            [
                {
                    transform: "scale(1)",
                    opacity: 1
                },
                {
                    transform: "scale(1.25) rotate(10deg)",
                    opacity: 1,
                    offset: 0.5
                },
                {
                    transform:
                        "scale(0.4) translateY(-35px)",
                    opacity: 0
                }
            ],
            {
                duration: 850,
                easing: "ease-in-out"
            }
        );

        estadoLlave.textContent =
            "¡Llave de la Carta IV guardada! " +
            "Vuelve al salón para utilizarla.";

        setTimeout(() => {

            llaveCuatro.style.opacity = "0.45";

        }, 850);
    });

    // ======================================
    // CINTA DE CUATRO FOTOGRAFÍAS
    // ======================================

    const fotogramas = Array.from(
        cinta.querySelectorAll(".fotograma")
    );

    let fotoActual = 0;

    function actualizarContador() {

        contadorFotos.textContent =
            `Recuerdo ${fotoActual + 1} ` +
            `de ${fotogramas.length}`;
    }

    // ======================================
    // DESPLAZAR CINTA
    // ======================================

    function irAFoto(indice) {

        if (fotogramas.length === 0) return;

        fotoActual = Math.max(
            0,
            Math.min(
                indice,
                fotogramas.length - 1
            )
        );

        const fotograma =
            fotogramas[fotoActual];

        const destino =
            fotograma.offsetLeft -
            cinta.offsetLeft -
            (cinta.clientWidth - fotograma.clientWidth) / 2;

        cinta.scrollTo({
            left: Math.max(0, destino),
            behavior: "smooth"
        });

        actualizarContador();
    }

    fotoSiguiente.addEventListener("click", () => {

        irAFoto(fotoActual + 1);
    });

    fotoAnterior.addEventListener("click", () => {

        irAFoto(fotoActual - 1);
    });

    // ======================================
    // ARRASTRAR CINTA CON MOUSE
    // ======================================

    let arrastrando = false;
    let inicioX = 0;
    let scrollInicial = 0;

    cinta.addEventListener("pointerdown", evento => {

        if (evento.pointerType !== "mouse") return;

        arrastrando = true;

        inicioX = evento.clientX;

        scrollInicial = cinta.scrollLeft;

        cinta.setPointerCapture(evento.pointerId);

        cinta.style.scrollBehavior = "auto";

        cinta.style.scrollSnapType = "none";
    });

    cinta.addEventListener("pointermove", evento => {

        if (!arrastrando) return;

        const desplazamiento =
            evento.clientX - inicioX;

        cinta.scrollLeft =
            scrollInicial - desplazamiento;
    });

    function terminarArrastre() {

        if (!arrastrando) return;

        arrastrando = false;

        cinta.style.scrollBehavior = "";

        cinta.style.scrollSnapType = "";

        actualizarFotoVisible();
    }

    cinta.addEventListener(
        "pointerup",
        terminarArrastre
    );

    cinta.addEventListener(
        "pointercancel",
        terminarArrastre
    );

    // ======================================
    // DETECTAR FOTO VISIBLE
    // ======================================

    function actualizarFotoVisible() {

        const centro =
            cinta.getBoundingClientRect().left +
            cinta.clientWidth / 2;

        let distanciaMenor = Infinity;
        let indiceVisible = 0;

        fotogramas.forEach((fotograma, indice) => {

            const rect =
                fotograma.getBoundingClientRect();

            const centroFoto =
                rect.left + rect.width / 2;

            const distancia =
                Math.abs(centroFoto - centro);

            if (distancia < distanciaMenor) {

                distanciaMenor = distancia;
                indiceVisible = indice;
            }
        });

        fotoActual = indiceVisible;

        actualizarContador();
    }

    let actualizacionPendiente = false;

    cinta.addEventListener("scroll", () => {

        if (actualizacionPendiente) return;

        actualizacionPendiente = true;

        requestAnimationFrame(() => {

            actualizarFotoVisible();

            actualizacionPendiente = false;
        });
    });

    // ======================================
    // CARGAR FOTOGRAFÍAS
    // ======================================

    fotogramas.forEach((fotograma, indice) => {

        const imagen =
            fotograma.querySelector("img");

        if (!imagen) return;

        imagen.src = FOTOS[indice];

        imagen.draggable = false;

        imagen.addEventListener("error", () => {

            imagen.style.display = "none";

            if (
                !fotograma.querySelector(".foto-pendiente")
            ) {

                const aviso =
                    document.createElement("p");

                aviso.className = "foto-pendiente";

                aviso.textContent =
                    "Aquí irá uno de nuestros recuerdos ♡";

                aviso.style.cssText = `
                    color: #f1d7b7;
                    text-align: center;
                    font-size: 18px;
                    padding: 45px 10px;
                `;

                fotograma.appendChild(aviso);
            }
        });

        // Si hay imagen válida, ocultar aviso.
        imagen.addEventListener("load", () => {

            imagen.style.display = "";

            const aviso =
                fotograma.querySelector(".foto-pendiente");

            if (aviso) aviso.remove();
        });
    });

    // ======================================
    // LLAVE IV PROVISIONAL
    // ======================================

    const imagenPremio =
        llaveCuatro.querySelector("img");

    if (imagenPremio) {

        imagenPremio.addEventListener("error", () => {

            imagenPremio.style.display = "none";

            if (
                !llaveCuatro.querySelector(".llave-temporal")
            ) {

                const simbolo =
                    document.createElement("span");

                simbolo.className = "llave-temporal";

                simbolo.textContent = "🗝️";

                simbolo.style.fontSize = "80px";

                llaveCuatro.appendChild(simbolo);
            }
        });
    }

    // ======================================
    // AL ABANDONAR LA PÁGINA
    // ======================================

    window.addEventListener("pagehide", () => {

        musicaJuego.pause();

        if (musicaPrincipalPausada) {
            reanudarMusicaPrincipal();
        }
    });

    // ======================================
    // INICIAR
    // ======================================

    actualizarContador();

    console.log(
        "Carta III funcionando: " +
        "minijuego, Heartache, fotos y llave IV."
    );

});
