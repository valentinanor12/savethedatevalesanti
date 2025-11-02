// script.js
const cardContainer = document.getElementById("card");
const cardEl = cardContainer.querySelector(".card");
const hintEl = document.getElementById("hint");

function flipCard() {
  cardEl.classList.toggle("flip");
  if (hintEl) hintEl.classList.add("hidden");
}

cardContainer.addEventListener("click", flipCard);

cardContainer.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    flipCard();
  }
});

// === Audio: intentar reproducir al cargar y mantener loop ===
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bgm");
  if (!audio) return;

  // Volumen inicial suave y bucle
  const savedVol = parseFloat(localStorage.getItem("bgmVolume"));
  audio.volume = Number.isFinite(savedVol) ? Math.max(0, Math.min(savedVol, 1)) : 0.4;
  audio.loop = true;

  const hadConsent = localStorage.getItem("bgmAllowed") === "1";
  // Para maximizar compatibilidad, si no hay consentimiento previo arrancamos en mute
  audio.muted = !hadConsent;

  const markAllowed = () => localStorage.setItem("bgmAllowed", "1");

  function startOnGestureOnce() {
    const start = () => {
      audio.muted = false;
      audio.play().finally(() => {
        if (!audio.paused) markAllowed();
      });
      window.removeEventListener("pointerdown", start, true);
      window.removeEventListener("keydown", start, true);
      window.removeEventListener("touchstart", start, true);
    };
    window.addEventListener("pointerdown", start, { once: true, capture: true });
    window.addEventListener("keydown", start, { once: true, capture: true });
    window.addEventListener("touchstart", start, { once: true, capture: true });
  }

  async function tryAutoplay() {
    try {
      await audio.play();
      markAllowed();
    } catch (err) {
      // Autoplay bloqueado por políticas del navegador: espera primer gesto
      startOnGestureOnce();
    }
  }

  // Intenta reproducir siempre; si falla, arranca con el primer gesto
  tryAutoplay();
});
