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
        const isOpen = mobileMenu.classList.toggle("mobile-menu-active");
        burgerIcon.src = isOpen ? closeImage : burgerImage;
        console.log("Menu is open?", isOpen);
    });
}

// ============================
// Log Out
// ყველა signed გვერდზე მუშაობს რადგან
// #logotBtn და #mobileLogoutBtn ყველა signed header-შია
// ============================
const logoutBtn = document.getElementById("logotBtn");
const mobileLogoutBtn = document.getElementById("mobileLogoutBtn");

function logout() {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    alert("Successfully logged out!");
    window.location.href = "logIn_index.html";
}

// if-ებია რადგან unsigned გვერდებზე ეს ღილაკები არ არსებობს
if (logoutBtn) logoutBtn.addEventListener("click", logout);
if (mobileLogoutBtn) mobileLogoutBtn.addEventListener("click", logout);

// ============================
// Header Live Search + Search ღილაკი
// ყველა გვერდზე მუშაობს რადგან searchInput
// unsigned და signed ორივე header-შია
// ============================
const searchInputHeader = document.getElementById("searchInput");
const searchList = document.getElementById("searchList");
const searchBtn = document.getElementById("searchBtn");

// საერთო ძებნის ფუნქცია - dropdown-ისთვისაც და ღილაკისთვისაც
async function performSearch(keyword) {
    if (!keyword || keyword.length < 1) {
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

            // კლიკზე პროდუქტის გვერდზე გადადის
            // token არსებობს? signed გვერდი, არა? unsigned
            item.addEventListener("click", () => {
                searchList.innerHTML = "";
                searchList.style.display = "none";
                searchInputHeader.value = "";

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
}

if (searchInputHeader && searchList) {

    // ტექსტის აკრეფისას live dropdown
    searchInputHeader.addEventListener("input", async (e) => {
        const keyword = e.target.value.trim();

        // 2 სიმბოლოზე ნაკლებია - სია დაიმალოს
        if (keyword.length < 2) {
            searchList.innerHTML = "";
            searchList.style.display = "none";
            return;
        }

        await performSearch(keyword);
    });

    // ძებნის ღილაკზე დაჭერა
    if (searchBtn) {
        searchBtn.addEventListener("click", () => {
            const keyword = searchInputHeader.value.trim();
            performSearch(keyword);
        });
    }

    // Enter კლავიშზეც მუშაობს
    searchInputHeader.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const keyword = searchInputHeader.value.trim();
            performSearch(keyword);
        }
    });

    // გარეთ კლიკზე სია დაიმალოს
    document.addEventListener("click", (e) => {
        if (!searchInputHeader.contains(e.target) && !searchList.contains(e.target)) {
            searchList.innerHTML = "";
            searchList.style.display = "none";
        }
    });
}