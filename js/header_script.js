
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
// ============================
// LOG OUT
// ============================
const logoutBtn = document.getElementById("logotBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

// logout ფუნქცია - token-ს შლის და login გვერდზე გადადის
function logout() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    alert("Successfully logged out!");
    window.location.href = "logIn_index.html";
}

// desktop logout ღილაკი
if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
}

// მობილური logout ღილაკი
if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", logout);
}

// Header Live Search - ყველა გვერდზე მუშაობს
// ✅ აქ ვწერთ რადგან searchInput ყველა გვერდის
// header-შია - unsigned და signed ორივეში
// ============================
const searchInputHeader = document.getElementById("searchInput");
const searchList = document.getElementById("searchList");

if (searchInputHeader && searchList) {

    // ტექსტის აკრეფისას ძებნა
    searchInputHeader.addEventListener("input", async (e) => {
        const keyword = e.target.value.trim();

        // 2 სიმბოლოზე ნაკლებია - სია დაიმალოს
        if (keyword.length < 2) {
            searchList.innerHTML = "";
            searchList.style.display = "none";
            return;
        }

        try {
            const res = await fetch(
                `https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`
            );
            const data = await res.json();

            searchList.innerHTML = "";

            if (!data.products || data.products.length === 0) {
                searchList.innerHTML = "<p style='padding:10px'>პროდუქტი ვერ მოიძებნა</p>";
                searchList.style.display = "block";
                return;
            }

            data.products.forEach(product => {
                const item = document.createElement("div");
                item.classList.add("search-item");

                item.innerHTML = `
                    <img src="${product.thumbnail}" width="50">
                    <span>${product.title}</span>
                `;

                // ✅ კლიკზე პროდუქტის გვერდზე გადადის
                // signed თუ unsigned გვერდი ავტომატურად განისაზღვრება
                item.addEventListener("click", () => {
                    searchList.innerHTML = "";
                    searchList.style.display = "none";

                    // token არსებობს? signed გვერდზე გადადი, არა? unsigned-ზე
                    const token = sessionStorage.getItem("accessToken");
                    if (token) {
                        window.location.href = `product-id-Signed.html?id=${product._id}`;
                    } else {
                        window.location.href = `product-Id.html?id=${product._id}`;
                    }
                });

                searchList.appendChild(item);
            });

            searchList.style.display = "block";

        } catch (err) {
            console.log("Search error:", err);
        }
    });

    // ✅ გარეთ კლიკზე სია დაიმალოს
    document.addEventListener("click", (e) => {
        if (!searchInputHeader.contains(e.target) && !searchList.contains(e.target)) {
            searchList.innerHTML = "";
            searchList.style.display = "none";
        }
    });
}