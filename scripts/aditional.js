// Autoimport CSS if not already included
(function loadCustomAlertCSS() {
  const existing = document.querySelector('link[href$="customAlert.css"]');
  if (!existing) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "customAlert.css";
    document.head.appendChild(link);
  }
})();

//Custom Alert
export function customAlert(message, type = "info") {
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "notification-container";
    document.body.appendChild(container);
  }

  const notif = document.createElement("div");
  notif.className = `notification ${type}`;
  notif.textContent = message;

  container.appendChild(notif);

  setTimeout(() => {
    notif.classList.add("hide");
    setTimeout(() => notif.remove(), 300);
  }, 5000);
}

//Custom Confirm
export async function customConfirm(message, action = null) {
  return new Promise((resolve) => {
    let container = document.getElementById("confirm-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "confirm-container";
      container.innerHTML = `
        <div class="confirm-box">
          <p id="confirm-message"></p>
          <div class="confirm-buttons">
            <button id="confirm-yes">Yes</button>
            <button id="confirm-no">Cancel</button>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    }

    const msg = container.querySelector("#confirm-message");
    const yesBtn = container.querySelector("#confirm-yes");
    const noBtn = container.querySelector("#confirm-no");

    msg.textContent = message;
    container.classList.add("visible");

    yesBtn.onclick = async () => {
      container.classList.remove("visible");

      //Validates: only executes if confirmed
      if (typeof action === "function") {
        try {
          await action(); //Executes the callback if it exists
          resolve(true);
        } catch (err) {
          console.error("Error in confirmed action:", err);
          resolve(false);
        }
      } else {
        resolve(true);
      }
    };

    noBtn.onclick = () => {
      container.classList.remove("visible");
      resolve(false);
    };
  });
}

