    import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
    import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

    const auth = getAuth();
    const db = getFirestore();

    const urlParams = new URLSearchParams(window.location.search);
    const setId = urlParams.get("setId");

    let cards = [];
    let currentIndex = 0;
    let showingFront = true;

    async function loadSet() {
      const user = auth.currentUser;
      if (!user) return alert("Debes iniciar sesión");

      // Nombre del conjunto
      const setDoc = await getDoc(doc(db, "users", user.uid, "sets", setId));
      if (setDoc.exists()) {
        document.getElementById("set-title").textContent = setDoc.data().name;
      }

      // Cartas del conjunto
      const cardsSnap = await getDocs(collection(db, "users", user.uid, "sets", setId, "cards"));
      cards = [];
      cardsSnap.forEach((docSnap) => {
        cards.push(docSnap.data());
      });

      // Mezclar cartas aleatoriamente
      cards = shuffle(cards);

      if (cards.length > 0) {
        currentIndex = 0;
        showCard();
      } else {
        document.getElementById("card").textContent = "Este conjunto no tiene cartas.";
      }
    }

    function shuffle(array) {
      return array.sort(() => Math.random() - 0.5);
    }

    function showCard() {
      if (currentIndex >= cards.length) {
        document.getElementById("card").textContent = "¡Has terminado todas las cartas! 🎉";
        document.getElementById("next-card").style.display = "none";
        return;
      }

      const card = cards[currentIndex];
      const cardElement = document.getElementById("card");
      cardElement.textContent = card.front;
      showingFront = true;

      // Toggle frente ↔ reverso
      cardElement.onclick = () => {
        cardElement.textContent = showingFront ? card.back : card.front;
        showingFront = !showingFront;
      };
    }

    document.getElementById("next-card").addEventListener("click", () => {
      currentIndex++;
      showCard();
    });

    loadSet();