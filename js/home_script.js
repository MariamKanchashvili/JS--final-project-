// ==========================
// CAROUSEL
// ==========================
const track = document.querySelector(".products__track");

let currentSlide = 0;
const visibleCards = 5;
const cardWidth = 270;
let autoSlideInterval;

// ==========================
// GET PRODUCTS
// ==========================
async function getProducts() {
    try {
        const response = await fetch(
            "https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=20"
        );

        const data = await response.json();

        renderProducts(data.products);

        initAutoCarousel();

    } catch (error) {
        console.log("შეცდომაა", error);
    }
}

// ==========================
// RENDER PRODUCTS
// ==========================
function renderProducts(products) {

    track.innerHTML = products.map(product => {

        const hasNoDiscount = product.price.discountPercentage === 0;
        const hideClass = hasNoDiscount ? "hidden" : "";

        const isOutOfStock = product.stock <= 0;
        const stockText = isOutOfStock ? "Out of stock" : `In Stock: ${product.stock}`;
        const stockClass = isOutOfStock ? "no-stock" : "in-stock";
        const isButtonDisabled = isOutOfStock ? "disabled" : "";

        return `
        <div class="products__card">
            <img src="${product.thumbnail}" class="products__image" referrerpolicy="no-referrer">
            <h3>${product.title}</h3>
            <p class="products__card-brand">${product.brand.toUpperCase()}</p>
            <p>${product.category.name}</p>
            <p class="products__stock ${stockClass}">${stockText}</p>
            <p>${"⭐".repeat(Math.round(product.rating))}</p>

            <div class="products__price">
                <span class="products__price-old ${hideClass}">
                    ${product.price.beforeDiscount} ${product.price.currency}
                </span>
                <span class="products__price-current">
                    ${product.price.current} ${product.price.currency}
                </span>
                <span class="discount ${hideClass}">
                    -${product.price.discountPercentage}%
                </span>
            </div>

            <button class="products__cart" ${isButtonDisabled}
                onclick="addToCart('${product._id}')">
                ${isOutOfStock ? "Unavailable" : "Add To Cart"}
            </button>

            <button class="viewDetailsBtn"
                onclick="window.location.href='product-Id.html?id=${product._id}'">
                View Details
            </button>
        </div>
        `;

    }).join("");
}

// ==========================
// AUTO CAROUSEL
// ==========================
function initAutoCarousel() {

    const totalCards = document.querySelectorAll(".products__card").length;
    const maxSlide = Math.max(totalCards - visibleCards, 0);

    currentSlide = 0;
    track.style.transform = "translateX(0px)";

    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }

    autoSlideInterval = setInterval(() => {
        if (currentSlide >= maxSlide) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    }, 2500);
}

// ==========================
// START
// ==========================
getProducts();

