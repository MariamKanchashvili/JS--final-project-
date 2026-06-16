const burgerButton = document.getElementById("burger-button");

const navList = document.querySelector(".header__auth");

const closeButton = document.getElementById("close-button");

burgerButton.addEventListener("click", () => {

    navList.classList.add("active");

    closeButton.classList.add("active");
});

closeButton.addEventListener("click", () => {

    navList.classList.remove("active");

    closeButton.classList.remove("active");
});