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

        initAutoCarousel(); // autoplay აქ იწყება

    } catch (error) {
        console.log("შეცდომაა",error);
    }
}

// ==========================
// RENDER PRODUCTS
// ==========================
function renderProducts(products) {

    track.innerHTML = products.map(product => {

        // ფასდაკლება
        const hasNoDiscount =
            product.price.discountPercentage === 0;

        const hideClass =
            hasNoDiscount ? "hidden" : "";

        // მარაგი
        const isOutOfStock =
            product.stock <= 0;

        const stockText =
            isOutOfStock
                ? "Out of stock"
                : `In Stock: ${product.stock}`;

        const stockClass =
            isOutOfStock
                ? "no-stock"
                : "in-stock";

        const isButtonDisabled =
            isOutOfStock
                ? "disabled"
                : "";

        return `
        <div class="products__card">

            <img
                src="${product.thumbnail}"
                class="products__image"
                referrerpolicy="no-referrer"
            >

            <h3>
                ${product.title}
            </h3>

            <p class="products__card-brand">
                ${product.brand.toUpperCase()}
            </p>

            <p>
                ${product.category.name}
            </p>

            <p class="products__stock ${stockClass}">
                ${stockText}
            </p>

            <p>
                ${"⭐".repeat(
                    Math.round(product.rating)
                )}
            </p>

            <div class="products__price">

                <span class="products__price-old ${hideClass}">
                    ${product.price.beforeDiscount}
                    ${product.price.currency}
                </span>

                <span class="products__price-current">
                    ${product.price.current}
                    ${product.price.currency}
                </span>

                <span class="discount ${hideClass}">
                    -${product.price.discountPercentage}%
                </span>

            </div>

            <button
                class="products__cart"
                ${isButtonDisabled}
                onclick="addToCart('${product._id}') "
            >
                ${
                    isOutOfStock
                        ? "Unavailable"
                        : "Add To Cart"
                }
            </button>

        </div>
        `;

    }).join("");
}

// ==========================
// AUTO CAROUSEL 
// ==========================
function initAutoCarousel() {

    const totalCards =
        document.querySelectorAll(".products__card").length;

    const maxSlide =
        Math.max(totalCards - visibleCards, 0);

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

        track.style.transform =
            `translateX(-${currentSlide * cardWidth}px)`;

    }, 2500);
}

// ==========================
// ADD TO CART
// ==========================
async function addToCart(productId) {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    alert("Please sign in first");
    return;
  }

  const cart = await getCartData();

  if (!cart) {
    await sendCartRequest("POST", productId, 1);
    return;
  }

  const existingProduct = cart.products.find((p) => p.productId === productId);
  const newQuantity = existingProduct ? existingProduct.quantity + 1 : 1;
  const method = cart.products.length > 0 ? "PATCH" : "POST";

  await sendCartRequest(method, productId, newQuantity);
}

// ==========================
// START
// ==========================
getProducts();

// search

const searchInput=document.getElementById("searchInput");
const searchBtn=document.getElementById("searchBtn");
const searchList=document.getElementById("searchList");


async function searchProducts(){

    try {

        const keyword=searchInput.value;

        const url=`https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`;

        const response=await fetch(url);

        const data=await response.json();

        renderProducts(data.products);

    } catch(error){

        alert("დაფიქსირდა შეცდომა ძებნისას");
        console.log("შეცდომაა ძებნისას",error);

    }
}

searchBtn.addEventListener("click",()=>{

    searchProducts();

});

console.log("listener-მდე მოვედი");



// dropdown  ით ძებნის შედეგების გამოტანა 
searchInput.addEventListener("input", async () => {

    const keyword = searchInput.value.trim();

    if(keyword.length < 2){
        searchList.innerHTML = "";
        searchList.style.display = "none";
        return;
    }

    const response = await fetch(
        `https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`
    );

    const data = await response.json();

    searchList.innerHTML = "";

    if(data.products.length === 0){
        searchList.innerHTML = "<p>Product not found</p>";
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
 item.addEventListener("click", () => {
    window.location.href = `http://127.0.0.1:5500/html/product-Id.html?id=${product._id}`;
});

        searchList.appendChild(item);
    });

    searchList.style.display = "block";

});


async function addToCart(productId) {
  const token = sessionStorage.getItem("accessToken");
  if (!token) {
    alert("Please sign in first");
    return;
  }

  const cart = await getCartData();

  if (!cart) {
    await sendCartRequest("POST", productId, 1);
    return;
  }

  const existingProduct = cart.products.find((p) => p.productId === productId);
  const newQuantity = existingProduct ? existingProduct.quantity + 1 : 1;
  const method = cart.products.length > 0 ? "PATCH" : "POST";

  await sendCartRequest(method, productId, newQuantity);
}
