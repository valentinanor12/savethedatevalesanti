// script.js
const cardContainer = document.getElementById("card");
const cardEl = cardContainer.querySelector(".card");
const hintEl = document.getElementById("hint");
let audioPrimed = false;
let audioStarted = false;

function flipCard() {
  cardEl.classList.toggle("flip");
  if (hintEl) hintEl.classList.add("hidden");
  // En el primer gesto, asegúrate de desmutear y reproducir
  ensureAudioStarted();
}

cardContainer.addEventListener("click", flipCard);

cardContainer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    flipCard();
  }
});

// === Audio: intentar reproducir al cargar y mantener loop ===
function ensureAudioStarted() {
  if (audioStarted) return;
  const audio = document.getElementById("bgm");
  if (!audio) return;

  const start = () => {
    audio.muted = false;
    // Si aún no hay datos suficientes, espera canplay y reintenta
    const playNow = () => audio.play().catch(() => {});
    if (audio.readyState >= 2) {
      playNow();
    } else {
      audio.addEventListener("canplay", playNow, { once: true });
      try { audio.load(); } catch (_) {}
    }
    audioStarted = true;
    localStorage.setItem("bgmAllowed", "1");
  };

  start();
}

document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgm");
  if (!audio) return;

  // Volumen inicial suave y bucle
  const savedVol = parseFloat(localStorage.getItem("bgmVolume"));
  audio.volume = Number.isFinite(savedVol) ? Math.max(0, Math.min(savedVol, 1)) : 0.35;
  audio.loop = true;

  const hadConsent = localStorage.getItem("bgmAllowed") === "1";
  if (hadConsent) {
    // Intento directo con sonido
    audio.muted = false;
    audio.play().catch(() => {});
  } else {
    // Prime en silencio para forzar buffering; así el primer gesto suena al instante
    audio.muted = true;
    if (!audioPrimed) {
      audio.play().catch(() => {});
      audioPrimed = true;
    }
    // Siempre prepara el desmuteo en el primer gesto, aunque el autoplay haya funcionado en silencio
    const start = () => {
      ensureAudioStarted();
      window.removeEventListener("pointerdown", start, true);
      window.removeEventListener("keydown", start, true);
      window.removeEventListener("touchstart", start, true);
    };
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("keydown", start, { once: true, capture: true });
    window.addEventListener("touchstart", start, { once: true, capture: true });
  }
});
