import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const cardsContainer = document.getElementById("cards-container");
  const addCardBtn = document.getElementById("add-card");
  const saveBtn = document.getElementById("save-set");

  // 🔹 Crear más inputs de cartas
  addCardBtn.addEventListener("click", () => {
    const div = document.createElement("div");
    div.classList.add("card-input");
    div.innerHTML = `
      <input class="front" placeholder="Palabra frente">
      <input class="back" placeholder="Palabra atrás">
    `;
    cardsContainer.appendChild(div);
  });

  // 🔹 Guardar conjunto y todas sus cartas
  saveBtn.addEventListener("click", async () => {
    const user = auth.currentUser;
    if (!user) return alert("Debes iniciar sesión");

    const setName = document.getElementById("set-name").value.trim();
    if (!setName) return alert("El conjunto necesita un nombre");

    try {
      // Crear el conjunto
      const setRef = await addDoc(collection(db, "users", user.uid, "sets"), {
        name: setName,
        createdAt: new Date()
      });

      // Guardar todas las cartas
      const cards = document.querySelectorAll(".card-input");
      for (let card of cards) {
        const front = card.querySelector(".front").value.trim();
        const back = card.querySelector(".back").value.trim();

        if (front && back) { // solo guardar si ambos tienen contenido
          await addDoc(collection(db, "users", user.uid, "sets", setRef.id, "cards"), {
            front,
            back
          });
        }
      }

      alert("Conjunto creado con éxito 🎉");
      window.location.href = "set.html";

    } catch (err) {
      console.error("Error guardando conjunto:", err);
      alert("Hubo un error al guardar. Revisa la consola.");
    }
  });
});
