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
