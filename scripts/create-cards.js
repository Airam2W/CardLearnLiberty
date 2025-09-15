import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, doc, collection, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

document.getElementById("save-set").addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión");

  const setName = document.getElementById("set-name").value;

  try {
    // Crear un conjunto vacío
    const setRef = await addDoc(collection(db, "users", user.uid, "sets"), {
      name: setName,
      createdAt: new Date()
    });

    // Crear cartas asociadas
    const cardsContainer = document.querySelectorAll(".card-input");
    for (let card of cardsContainer) {
      const front = card.querySelector(".front").value;
      const back = card.querySelector(".back").value;

      await addDoc(collection(db, "users", user.uid, "sets", setRef.id, "cards"), {
        front,
        back
      });
    }

    alert("Conjunto creado con éxito!");
    window.location.href = "cards.html";

  } catch (err) {
    console.error("Error guardando conjunto:", err);
  }
});
