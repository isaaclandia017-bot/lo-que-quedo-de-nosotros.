
/* =====================================
   PARA SAMI - SISTEMA DE INICIO
===================================== */

const botonDiamante =
    document.getElementById("botonDiamante");

const paginaInicio =
    document.querySelector(".pagina-inicio");

const pantallaHistoria =
    document.getElementById("pantallaHistoria");

const visorHistoria =
    document.getElementById("visorHistoria");

const musica =
    document.getElementById("musicaFondo");

const controlMusica =
    document.getElementById("controlMusica");

// VOLUMEN INICIAL
musica.volume = 0.30;

// ACTUALIZAR BOTÓN DE SONIDO
function actualizarControl() {
    controlMusica.textContent = musica.paused
        ? "♪"
        : "♫";

    controlMusica.setAttribute(
        "aria-label",
        musica.paused
            ? "Reproducir música"
            : "Pausar música"
    );
}

// ENTRAR A LA HISTORIA
botonDiamante.addEventListener("click", async () => {

    // Iniciar la música con interacción del usuario
    try {
        await musica.play();
    } catch (error) {
        console.log("El audio necesita activación manual.");
    }

    // Ocultar portada
    paginaInicio.style.display = "none";

    // Mostrar contenido
    pantallaHistoria.hidden = false;
    controlMusica.hidden = false;

    // Cargar página principal
    visorHistoria.src = "principal.html";

    actualizarControl();
});

// PAUSAR O REPRODUCIR
controlMusica.addEventListener("click", async () => {

    if (musica.paused) {
        try {
            await musica.play();
        } catch (error) {
            console.log("No se pudo reproducir la música.");
        }
    } else {
        musica.pause();
    }

    actualizarControl();
});

// RECIBIR ÓRDENES DE OTRAS PÁGINAS
window.addEventListener("message", (evento) => {

    if (evento.origin !== window.location.origin) {
        return;
    }

    const mensaje = evento.data;

    if (!mensaje || mensaje.tipo !== "NAVEGAR") {
        return;
    }

    const paginasPermitidas = [
        "principal.html",
        "carta1.html",
        "carta2.html",
        "carta3.html",
        "carta4.html",
        "carta5.html",
        "carta6.html",
        "juego.html"
    ];

    if (!paginasPermitidas.includes(mensaje.pagina)) {
        return;
    }

    // El minijuego no tendrá música
    if (mensaje.pagina === "juego.html") {
        musica.pause();
    } else if (!musica.paused) {
        // La música ya está reproduciéndose
    }

    visorHistoria.src = mensaje.pagina;
});