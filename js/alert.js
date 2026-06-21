// ==========================
// CUSTOM ALERT
// alert()-ის ნაცვლად გამოიყენე showAlert()
//
// გამოყენება:
// showAlert("ტექსტი")                    ← მწვანე (default)
// showAlert("ტექსტი", "success")         ← მწვანე
// showAlert("ტექსტი", "error")           ← წითელი
// showAlert("ტექსტი", "info")            ← ლურჯი
// showAlert("ტექსტი", "success", 2000)   ← 2 წამში გაქრება
// ==========================

// banner ელემენტი ერთხელ შეიქმნება და ყველა alert გამოიყენებს
let alertElement = null;
let alertTimeout = null;

function showAlert(message, type = "success", duration = 2500) {

    // თუ ელემენტი ჯერ არ არსებობს - შევქმნათ
    if (!alertElement) {
        alertElement = document.createElement("div");
        alertElement.id = "custom-alert";
        document.body.appendChild(alertElement);
    }

    // წინა timeout გავასუფთავოთ
    // (თუ ორი alert სწრაფად გამოიძახეს)
    if (alertTimeout) {
        clearTimeout(alertTimeout);
    }

    // ძველი ტიპის კლასები წავშალოთ
    alertElement.classList.remove("alert-success", "alert-error", "alert-info", "alert-show");

    // ტექსტი და ტიპი დავაყენოთ
    alertElement.textContent = message;
    alertElement.classList.add(`alert-${type}`);

    // მცირე დაყოვნება რომ CSS transition-მა იმუშაოს
    setTimeout(() => {
        alertElement.classList.add("alert-show"); // ← ზევიდან ჩამოდის
    }, 10);

    // duration წამის შემდეგ გაქრება
    alertTimeout = setTimeout(() => {
        alertElement.classList.remove("alert-show"); // ← ზევით ბრუნდება
    }, duration);
}