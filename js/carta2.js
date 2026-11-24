
/* ==========================================
   CARTA II — DONDE COMENZÓ TODO
   SISTEMA INTERACTIVO COMPLETO
========================================== */

// ==========================================
// CONFIGURACIÓN DEL PROGRESO
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
// OBTENER Y GUARDAR DATOS
// ==========================================

function obtenerProgreso() {

    try {

        const guardado = JSON.parse(
            localStorage.getItem(CLAVE_PROGRESO) || "null"
        );

        return {
            desbloqueadas:
                Array.isArray(guardado?.desbloqueadas)
                    ? guardado.desbloqueadas
                    : [1],

            abiertas:
                Array.isArray(guardado?.abiertas)
                    ? guardado.abiertas
                    : [],

            llaves:
                Array.isArray(guardado?.llaves)
                    ? guardado.llaves
                    : [],

            finalizado:
                guardado?.finalizado === true
        };

    } catch (error) {

        console.error("Error al leer progreso:", error);

        return {
            ...ESTADO_INICIAL,
            desbloqueadas: [1],
            abiertas: [],
            llaves: []
        };
    }
}

function guardarProgreso(progreso) {

    localStorage.setItem(
        CLAVE_PROGRESO,
        JSON.stringify(progreso)
    );
}


// ==========================================
// ELEMENTOS DEL HTML
// ==========================================

const botonVolver =
    document.getElementById("botonVolver");

const botonPista =
    document.getElementById("botonPista");

const mensajePista =
    document.getElementById("mensajePista");

const lunaMovil =
    document.getElementById("lunaMovil");

const llaveTres =
    document.getElementById("llaveTres");

const mensajeLunar =
    document.getElementById("mensajeLunar");

const abrirAlbum =
    document.getElementById("abrirAlbum");

const cerrarAlbum =
    document.getElementById("cerrarAlbum");

const albumFondo =
    document.getElementById("albumFondo");

const imagenActual =
    document.getElementById("imagenActual");

const fotoAnterior =
    document.getElementById("fotoAnterior");

const fotoSiguiente =
    document.getElementById("fotoSiguiente");

const contadorFotos =
    document.getElementById("contadorFotos");


// ==========================================
// NAVEGACIÓN
// ==========================================

function navegar(pagina) {

    // Si estamos dentro del iframe
    if (window.parent !== window) {

        window.parent.postMessage(
            {
                tipo: "NAVEGAR",
                pagina: pagina
            },
            window.location.origin
        );

    } else {

        // Si se abrió directamente con Live Server
        window.location.href = pagina;

    }
}

botonVolver.addEventListener("click", () => {

    navegar("principal.html");

});


// ==========================================
// REGISTRAR CARTA II ABIERTA
// ==========================================

function registrarCartaDos() {

    const progreso = obtenerProgreso();

    if (!progreso.desbloqueadas.includes(2)) {

        progreso.desbloqueadas.push(2);

    }

    if (!progreso.abiertas.includes(2)) {

        progreso.abiertas.push(2);

    }

    guardarProgreso(progreso);
}

// La carta se registra al entrar solamente
// si ya se desbloqueó desde la principal.
// Evita que abrir carta2.html directamente
// desbloquee la carta sin usar una llave.

const progresoEntrada = obtenerProgreso();

if (progresoEntrada.desbloqueadas.includes(2)) {
    registrarCartaDos();
}


// ==========================================
// PISTA DE LA LUNA ROJA
// ==========================================

botonPista.addEventListener("click", () => {

    const estaOculta = mensajePista.hidden;

    mensajePista.hidden = !estaOculta;

    botonPista.textContent = estaOculta
        ? "✦ Ocultar pista"
        : "✦ Una pista...";

});


// ==========================================
// LUNA ROJA INTERACTIVA
// ==========================================

let lunaDescubierta =
    localStorage.getItem(CLAVE_LUNA) === "true";

let arrastrando = false;

let posicionInicialX = 0;
let posicionInicialY = 0;

let desplazamientoX = 0;
let desplazamientoY = 0;

let inicioPunteroX = 0;
let inicioPunteroY = 0;

let huboArrastre = false;

// Actualizar posición de la luna

function colocarLuna() {

    lunaMovil.style.transform =
        `translate(${desplazamientoX}px, ${desplazamientoY}px)`;
}


// Mostrar la llave si se descubre

function revelarLlave() {

    if (lunaDescubierta) {
        return;
    }

    lunaDescubierta = true;

    localStorage.setItem(
        CLAVE_LUNA,
        "true"
    );

    // Mover la luna hacia un lado
    desplazamientoX = -210;
    desplazamientoY = 20;

    lunaMovil.style.transition =
        "transform 0.8s cubic-bezier(.2,.8,.2,1)";

    colocarLuna();

    // Comprobar el progreso
    const progreso = obtenerProgreso();

    if (
        !progreso.llaves.includes(3) &&
        !progreso.desbloqueadas.includes(3)
    ) {

        llaveTres.hidden = false;

        mensajeLunar.textContent =
            "¡Encontraste un secreto! Recoge la llave.";

        // Animación de aparición
        llaveTres.animate(
            [
                {
                    opacity: 0,
                    transform: "scale(0.5)"
                },
                {
                    opacity: 1,
                    transform: "scale(1.12)"
                },
                {
                    opacity: 1,
                    transform: "scale(1)"
                }
            ],
            {
                duration: 800,
                easing: "ease-out"
            }
        );

    } else {

        mensajeLunar.textContent =
            "Ya descubriste el secreto de la Luna Roja.";

    }

}


// COMENZAR A ARRASTRAR

lunaMovil.addEventListener("pointerdown", evento => {

    if (lunaDescubierta) return;

    arrastrando = true;
    huboArrastre = false;

    inicioPunteroX = evento.clientX;
    inicioPunteroY = evento.clientY;

    posicionInicialX = desplazamientoX;
    posicionInicialY = desplazamientoY;

    lunaMovil.setPointerCapture(evento.pointerId);

    lunaMovil.style.transition = "none";

});


// MOVER LA LUNA

lunaMovil.addEventListener("pointermove", evento => {

    if (!arrastrando || lunaDescubierta) return;

    const movimientoX =
        evento.clientX - inicioPunteroX;

    const movimientoY =
        evento.clientY - inicioPunteroY;

    if (
        Math.abs(movimientoX) > 5 ||
        Math.abs(movimientoY) > 5
    ) {
        huboArrastre = true;
    }

    desplazamientoX = Math.max(
        -240,
        Math.min(
            100,
            posicionInicialX + movimientoX
        )
    );

    desplazamientoY = Math.max(
        -80,
        Math.min(
            100,
            posicionInicialY + movimientoY
        )
    );

    colocarLuna();

});


// TERMINAR EL MOVIMIENTO

function terminarArrastre() {

    if (!arrastrando) return;

    arrastrando = false;

    const distancia = Math.hypot(
        desplazamientoX,
        desplazamientoY
    );

    if (distancia > 85) {

        revelarLlave();

    } else {

        // Si no movió lo suficiente,
        // la luna vuelve a su posición.

        desplazamientoX = 0;
        desplazamientoY = 0;

        lunaMovil.style.transition =
            "transform 0.5s ease";

        colocarLuna();

    }
}

lunaMovil.addEventListener(
    "pointerup",
    terminarArrastre
);

lunaMovil.addEventListener(
    "pointercancel",
    terminarArrastre
);


// También se puede descubrir con teclado.
// Esto facilita el acceso en celulares
// y dispositivos sin arrastre.

lunaMovil.addEventListener("click", evento => {

    if (lunaDescubierta || huboArrastre) return;

    revelarLlave();

});


// ==========================================
// RECOGER LA LLAVE DE HELLO KITTY
// ==========================================

function actualizarLlaveKitty() {

    const progreso = obtenerProgreso();

    const yaGuardada =
        progreso.llaves.includes(3);

    const yaUsada =
        progreso.desbloqueadas.includes(3);

    if (yaGuardada || yaUsada) {

        llaveTres.hidden = true;

        if (lunaDescubierta) {

            mensajeLunar.textContent = yaUsada
                ? "La Carta III ya está desbloqueada."
                : "La llave está guardada en tu inventario.";

        }

    } else if (lunaDescubierta) {

        llaveTres.hidden = false;

    } else {

        llaveTres.hidden = true;

    }

}


llaveTres.addEventListener("click", () => {

    const progreso = obtenerProgreso();

    if (
        progreso.llaves.includes(3) ||
        progreso.desbloqueadas.includes(3)
    ) {
        return;
    }

    // Guardar llave 3
    progreso.llaves.push(3);

    guardarProgreso(progreso);

    // Animación al recoger
    llaveTres.animate(
        [
            {
                opacity: 1,
                transform: "scale(1)"
            },
            {
                opacity: 1,
                transform: "scale(1.25)",
                offset: 0.45
            },
            {
                opacity: 0,
                transform: "scale(0.3) translateY(-50px)"
            }
        ],
        {
            duration: 700,
            easing: "ease-in-out"
        }
    );

    mensajeLunar.textContent =
        "¡Llave de Hello Kitty guardada! " +
        "Regresa a las cartas para usarla.";

    llaveTres.disabled = true;

    setTimeout(() => {

        actualizarLlaveKitty();

    }, 750);

});


// ==========================================
// RECUPERAR EL SECRETO DE LA LUNA
// ==========================================

if (lunaDescubierta) {

    desplazamientoX = -210;
    desplazamientoY = 20;

    colocarLuna();

}

actualizarLlaveKitty();


// ==========================================
// ÁLBUM DE RECUERDOS
// ==========================================

// Fotografías que tienes en assets

const fotografias = [
    {
        archivo: "assets/salida1.png",
        nombre: "Recuerdo 1"
    },
    {
        archivo: "assets/salida2.png",
        nombre: "Recuerdo 2"
    },
    {
        archivo: "assets/encuentro.png",
        nombre: "Recuerdo 3"
    },
    {
        archivo: "assets/DGC.png",
        nombre: "Recuerdo 4"
    },
    {
        archivo: "assets/salida3.png",
        nombre: "Recuerdo 5"
    }
];

let fotoActual = 0;


// CAMBIAR FOTOGRAFÍA

function mostrarFotografia() {

    const fotografia = fotografias[fotoActual];

    imagenActual.src = fotografia.archivo;

    imagenActual.alt = fotografia.nombre;

    contadorFotos.textContent =
        `${fotografia.nombre} de ${fotografias.length}`;

    imagenActual.animate(
        [
            {
                opacity: 0,
                transform: "scale(0.96)"
            },
            {
                opacity: 1,
                transform: "scale(1)"
            }
        ],
        {
            duration: 350,
            easing: "ease-out"
        }
    );

}


// ABRIR EL ÁLBUM

abrirAlbum.addEventListener("click", () => {

    albumFondo.hidden = false;

    fotoActual = 0;

    mostrarFotografia();

    document.body.style.overflow = "hidden";

    cerrarAlbum.focus();

});


// CERRAR EL ÁLBUM

function cerrarVentanaAlbum() {

    albumFondo.hidden = true;

    document.body.style.overflow = "";

    abrirAlbum.focus();

}

cerrarAlbum.addEventListener(
    "click",
    cerrarVentanaAlbum
);


// CERRAR AL PULSAR FUERA

albumFondo.addEventListener("click", evento => {

    if (evento.target === albumFondo) {

        cerrarVentanaAlbum();

    }

});


// SIGUIENTE FOTOGRAFÍA

fotoSiguiente.addEventListener("click", () => {

    fotoActual =
        (fotoActual + 1) % fotografias.length;

    mostrarFotografia();

});


// FOTOGRAFÍA ANTERIOR

fotoAnterior.addEventListener("click", () => {

    fotoActual =
        (fotoActual - 1 + fotografias.length)
        % fotografias.length;

    mostrarFotografia();

});


// CONTROLES CON TECLADO

document.addEventListener("keydown", evento => {

    if (albumFondo.hidden) return;

    if (evento.key === "Escape") {

        cerrarVentanaAlbum();

    }

    if (evento.key === "ArrowRight") {

        fotoSiguiente.click();

    }

    if (evento.key === "ArrowLeft") {

        fotoAnterior.click();

    }

});


// ==========================================
// INICIO
// ==========================================

console.log(
    "Carta II: Luna Roja, llave y álbum preparados."
);
