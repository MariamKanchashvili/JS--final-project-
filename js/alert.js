// ==========================
// CUSTOM ALERT
// ==========================


let alertElement = null;
let alertTimeout = null;

function showAlert(message, type = "success", duration = 2500) {

  
    if (!alertElement) {
        alertElement = document.createElement("div");
        alertElement.id = "custom-alert";
        document.body.appendChild(alertElement);
    }

    // წინა timeout გასუფთავება
    // (თუ ორი alert სწრაფად გამოიძახეს)
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }

    // ძველი ტიპის კლასების წაშლა
    alertElement.classList.remove("alert-success", "alert-error", "alert-info", "alert-show");

    // ტექსტის და ტიპის დაყენება
    alertElement.textContent = message;
    alertElement.classList.add(`alert-${type}`);

    // მცირე დაყოვნება რომ CSS transition-მა იმუშაოს
    setTimeout(() => {
        alertElement.classList.add("alert-show"); //  ზევიდან ჩამოდის
    }, 10);

    // duration წამის შემდეგ გაქრება
    alertTimeout = setTimeout(() => {
        alertElement.classList.remove("alert-show"); //  ზევით ბრუნდება
    }, duration);
}