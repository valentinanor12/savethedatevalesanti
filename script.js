// script.js
const cardContainer = document.getElementById("card");
const cardEl = cardContainer.querySelector(".card");
const hintEl = document.getElementById("hint");

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
  const audio = document.getElementById("bgm");
  if (!audio) return;
  audio.muted = false;
  audio.play().catch(() => {});
  localStorage.setItem("bgmAllowed", "1");
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
    // Reproduce en silencio si lo permite el navegador
    audio.muted = true;
    audio.play().catch(() => {});
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
