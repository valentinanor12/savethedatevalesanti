// script.js
document.getElementById("card").addEventListener("click", function () {
  const card = this.querySelector(".card");
  card.classList.toggle("flip");
});
