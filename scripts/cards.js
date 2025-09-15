import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

async function loadSets() {
  const user = auth.currentUser;
  if (!user) return alert("Debes iniciar sesión");

  const setsSnap = await getDocs(collection(db, "users", user.uid, "sets"));
  
  const setsList = document.getElementById("sets-list");
  setsList.innerHTML = "";

  setsSnap.forEach((setDoc) => {
    const data = setDoc.data();
    const li = document.createElement("li");
    li.textContent = data.name;
    li.addEventListener("click", () => loadCards(user.uid, setDoc.id));
    setsList.appendChild(li);
  });
}

async function loadCards(uid, setId) {
  const cardsSnap = await getDocs(collection(db, "users", uid, "sets", setId, "cards"));
  let cards = [];
  
  cardsSnap.forEach((cardDoc) => {
    cards.push(cardDoc.data());
  });

  // Mostrar una carta aleatoria
  if (cards.length > 0) {
    showCard(cards[0]);
  }
}

function showCard(card) {
  const cardElement = document.getElementById("card");
  cardElement.textContent = card.front;
  cardElement.onclick = () => {
    cardElement.textContent = cardElement.textContent === card.front ? card.back : card.front;
  };
}

loadSets();
