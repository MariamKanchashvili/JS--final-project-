
// ============================
// Burger menu
// ============================
console.log("HEADER JS LOADED");

const burgerBtn = document.querySelector(".header__burger");
const burgerIcon = document.querySelector("#burgerIcon");
const mobileMenu = document.querySelector(".header__mobile-menu");

const burgerImage = "../assets/icons/hamburger-menu-more-svgrepo-com.svg";
const closeImage = "../assets/icons/cross-mark-svgrepo-com.svg";

if (burgerBtn && mobileMenu && burgerIcon) {
    burgerBtn.addEventListener("click", (event) => {
        // 1. Diagnostics: If this doesn't print on the 2nd click, CSS is blocking the button!
        console.log("Button clicked! Current target:", event.currentTarget);

        // 2. Toggle the active class
        const isOpen = mobileMenu.classList.toggle("mobile-menu-active");
        
        // 3. Change the icon image safely
        if (isOpen) {
            burgerIcon.src = closeImage;
        } else {
            burgerIcon.src = burgerImage;
        }

        console.log("Menu state changed. Is open?", isOpen);
        console.log(burgerIcon.src);
    });
} else {
    console.error("Error: One or more elements were not found in the DOM.", {
        burgerBtn,
        burgerIcon,
        mobileMenu
    });
    
}