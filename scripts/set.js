    import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";
    import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

    const auth = getAuth();
    const db = getFirestore();

    document.getElementById("back-menu").addEventListener("click", () => {
    window.location.href = "menu.html";
  });

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
        // Ir a cards.html pasando el ID del conjunto por URL
        li.addEventListener("click", () => {
          window.location.href = `cards.html?setId=${setDoc.id}`;
        });
        setsList.appendChild(li);
      });
    }

    loadSets();