
/* ======================================
   CARTA VI — ÚLTIMO RECUERDO
====================================== */

const botonVolver = document.getElementById("volver");
const video = document.getElementById("videoRecuerdos");

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

botonVolver.addEventListener("click", () => {
    navegar("principal.html");
});

// Pausar música de fondo si hay un reproductor
// accesible en el contenedor.

video.addEventListener("play", () => {

    try {
        if (window.parent !== window) {

            const audios =
                window.parent.document.querySelectorAll("audio");

            audios.forEach(audio => {
                if (!audio.paused) {
                    audio.pause();
                }
            });
        }
    } catch (error) {
        console.log("El video se reproduce independientemente.");
    }
});
