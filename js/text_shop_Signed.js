// ==========================
// DOM ELEMENTS
// ==========================
const productsContainer = document.querySelector(".products-container")

const prevBtn = document.querySelector("#prev")
const nextBtn = document.querySelector("#next")
const pageButtons = document.querySelectorAll(".btn1")

const categoryContainer = document.querySelector(".store-category")

const searchInputHeader = document.getElementById("searchInput")
const searchList = document.getElementById("searchList")

const searchInputAside = document.getElementById("searchInputAside")
const searchBtnAside = document.getElementById("searchBtnAside")

const brands = document.getElementById("aside-menu")

const ratingSelect = document.getElementById("rating")
const minPriceInput = document.getElementById("minPrice")
const maxPriceInput = document.getElementById("maxPrice")
const sortBySelect = document.getElementById("sortBy")
const sortDirSelect = document.getElementById("sortDirection")

// ==========================
// STATE
// ==========================
let currentPage = 1
let pageSize = 8
let currentCategory = null

// ==========================
// INIT
// ==========================
getProducts(currentPage)
getCategories()
getBrands()

// ==========================
// PRODUCTS
// ==========================
async function getProducts(page = 1) {
    try {
        let url = currentCategory
            ? `https://api.everrest.educata.dev/shop/products/category/${currentCategory}?page_index=${page}&page_size=${pageSize}`
            : `https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=${pageSize}`

        const res = await fetch(url)
        const data = await res.json()

        renderProducts(data.products)

    } catch (err) {
        console.log("Products error:", err)
    }
}

function renderProducts(products) {
    productsContainer.innerHTML = ""
    let html = ""

    products.forEach(p => {
        html += productCard(p)
    })

    productsContainer.innerHTML = html
}

// ==========================
// PRODUCT CARD (OLD CSS NAMES)
// ==========================
function productCard(product) {

    const hasNoDiscount = product.price.discountPercentage === 0
    const hideClass = hasNoDiscount ? "hidden" : ""

    const isOutOfStock = product.stock <= 0

    const stockText = isOutOfStock
        ? "Out of stock"
        : `In Stock: ${product.stock}`

    const stockClass = isOutOfStock
        ? "no-stock"
        : "in-stock"

    return `
    <div class="card">

        <img src="${product.thumbnail}" class="card-img-top">

        <div class="card-body">

            <h5 class="card-title">${product.title}</h5>

            <p class="card-text">${product.brand.toUpperCase()}</p>

            <p>${product.category.name}</p>

            <p class="${stockClass}">
                ${stockText}
            </p>

            <p>
                ${"⭐".repeat(Math.round(product.rating))}
            </p>

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

            <button class="cart"
                onclick="addToCart('${product._id}')"
                ${isOutOfStock ? "disabled" : ""}>

                ${isOutOfStock ? "Unavailable" : "Add To Cart"}

            </button>
<button class="viewDetailsBtn"
onclick="window.location.href='product-id-Signed.html?id=${product._id}'">
View Details
</button>    

        </div>
    </div>
    `
}

// ==========================
// CATEGORIES
// ==========================
async function getCategories() {
    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/products/categories")
        const data = await res.json()

        categoryContainer.innerHTML = `
            <button class="categoryBtn" onclick="resetCategory()">All</button>
        `

        data.forEach(c => {
            categoryContainer.innerHTML += `
                <button class="categoryBtn" onclick="setCategory('${c.id}')">
                    ${c.name}
                </button>
            `
        })

    } catch (err) {
        console.log(err)
    }
}

function setCategory(id) {
    currentCategory = id
    currentPage = 1
    getProducts(currentPage)
}

function resetCategory() {
    currentCategory = null
    currentPage = 1
    getProducts(currentPage)
}

// ==========================
// PAGINATION
// ==========================
pageButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentPage = Number(btn.textContent)
        getProducts(currentPage)
    })
})

nextBtn.addEventListener("click", () => {
    currentPage++
    getProducts(currentPage)
})

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--
        getProducts(currentPage)
    }
})

// ==========================
// BRANDS
// ==========================
async function getBrands() {
    try {
        const res = await fetch("https://api.everrest.educata.dev/shop/products/brands")
        const data = await res.json()

        data.forEach(b => {
            const option = document.createElement("option")
            option.value = b
            option.textContent = b.toUpperCase()
            brands.appendChild(option)
        })

    } catch (err) {
        console.log(err)
    }
}

// ==========================
// SEARCH (ASIDE FILTER)
// ==========================
searchBtnAside.addEventListener("click", searchProducts)

async function searchProducts() {
    try {
        const keyword = searchInputAside.value
        const brand = brands.value
        const rating = ratingSelect.value
        const minPrice = minPriceInput.value
        const maxPrice = maxPriceInput.value
        const sortBy = sortBySelect.value
        const sortDir = sortDirSelect.value

        let url = `https://api.everrest.educata.dev/shop/products/search?`

        if (keyword) url += `keywords=${keyword}&`
        if (brand) url += `brand=${brand}&`
        if (rating && rating !== "--") url += `rating=${rating}&`
        if (minPrice) url += `price_min=${minPrice}&`
        if (maxPrice) url += `price_max=${maxPrice}&`
        if (sortBy) url += `sort_by=${sortBy}&`
        if (sortDir) url += `sort_direction=${sortDir}&`

        url = url.slice(0, -1)

        const res = await fetch(url)
        const data = await res.json()

        renderProducts(data.products)

    } catch (err) {
        console.log("Search error:", err)
    }
}

// ==========================
// HEADER LIVE SEARCH
// ==========================
searchInputHeader.addEventListener("input", async (e) => {
    const keyword = e.target.value.trim()

    if (keyword.length < 2) {
        searchList.innerHTML = ""
        searchList.style.display = "none"
        return
    }

    const res = await fetch(
        `https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`
    )

    const data = await res.json()

    searchList.innerHTML = ""

    data.products.forEach(product => {
        const item = document.createElement("div")
        item.classList.add("search-item")

        item.innerHTML = `
            <img src="${product.thumbnail}" width="50">
            <span>${product.title}</span>
        `

        searchList.appendChild(item)
    })

    searchList.style.display = "block"
})

// ==========================
// CART (TEMP)
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
// AUTH BUTTON
// ==========================
// window.addEventListener("DOMContentLoaded", () => {
//     const token = sessionStorage.getItem("accessToken")

//     if (token) {
//         const btn = document.createElement("button")
//         btn.textContent = "Go to Cart"
//         btn.onclick = () => window.location.href = "cart_index.html"
//         document.querySelector(".header__auth").appendChild(btn)
//     }
// })

const globalCartCount = document.querySelector(".global-cart-count");

function updateGlobalBadge(quantity) {
  if (globalCartCount) {
    globalCartCount.textContent = quantity;
  }
}

async function loadCartBadge() {
  const token = sessionStorage.getItem("accessToken");

  if (!token) return;

  try {
    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      updateGlobalBadge(data.total.quantity);
    }
  } catch (error) {
    console.log(error);
  }
}

window.addEventListener("DOMContentLoaded", loadCartBadge);