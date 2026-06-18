// ====================================================
// CART SCRIPT - კალათის მართვა + AI ჩატი
// ====================================================

// DOM ელემენტები - cartProducts და cartSummary მხოლოდ cart გვერდზე არსებობს
const cartProducts = document.getElementById("cartProducts");
const cartSummary = document.getElementById("cartSummary");

// sessionStorage-იდან token - მომხმარებლის ავტორიზაციისთვის
const token = sessionStorage.getItem("accessToken");

if (!token) {
  console.log("User not logged in");
}

// ====================================================
// კალათის მთავარი ფუნქციები
// ====================================================

// კალათის მონაცემების ჩამოტვირთვა და ჩვენება
async function getCart() {
  if (!token) return;

  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      renderCart(data);
      updateGlobalBadge(data.total.quantity);
    } else {
      if (cartProducts) cartProducts.innerHTML = "<p>Cart is empty</p>";
      updateGlobalBadge(0);
    }
  } catch (error) {
    console.log(error);
  }
}

// კალათის ვიზუალური დახატვა
function renderCart(data) {
  if (!cartSummary || !cartProducts) return;

  cartSummary.innerHTML = `
    <h3>Total: ${data.total.price.current} USD</h3>
    <p>Products: ${data.total.products}</p>
    <p>Quantity: ${data.total.quantity}</p>
  `;

  cartProducts.innerHTML = "";

  data.products.forEach((product) => {
    cartProducts.innerHTML += `
      <div class="cart-item" id="item-${product.productId}">
        <div class="cart-actions">
          <button onclick="deleteItem('${product.productId}')">❌</button>
          <button>✏️</button>
        </div>
        <p class="product-name">${product.title || product.productId}</p>
        <div class="cart-item__quantity">
          <button class="cartBtn"
            onclick="updateQuantity('${product.productId}', ${product.quantity - 1})">-</button>
          <span>${product.quantity}</span>
          <button class="cartBtn"
            onclick="updateQuantity('${product.productId}', ${product.quantity + 1})">+</button>
        </div>
        <p>${product.pricePerQuantity} <span class="value">USD</span></p>
        <p>${product.quantity * product.pricePerQuantity} <span class="value">USD</span></p>
      </div>
    `;
  });
}

// ====================================================
// კალათაში დამატება - გასწორებული ვერსია
// ====================================================

// პროდუქტის კალათაში დამატება ID-ით
async function addToCart(productId) {
  const token = sessionStorage.getItem("accessToken");

  // თუ არ არის logged in - გადამისამართება
  if (!token) {
    alert("Please sign in first");
    window.location.href = "logIn_index.html";
    return;
  }

  // ჯერ ვამოწმებთ კალათის მდგომარეობას
  const cart = await getCartData();

  if (!cart || !cart.products) {
    // კალათა ცარიელია - POST მეთოდი
    await sendCartRequest("POST", productId, 1);
    return;
  }

  // ვეძებთ პროდუქტს კალათაში
  const existingProduct = cart.products.find((p) => p.productId === productId);

  if (existingProduct) {
    // პროდუქტი უკვე კალათაშია - რაოდენობა გავზარდოთ
    await sendCartRequest("PATCH", productId, existingProduct.quantity + 1);
  } else if (cart.products.length > 0) {
    // კალათა არ არის ცარიელი მაგრამ ეს პროდუქტი არ არის - PATCH
    await sendCartRequest("PATCH", productId, 1);
  } else {
    // კალათა სრულიად ცარიელია - POST
    await sendCartRequest("POST", productId, 1);
  }
}

// API-სთვის მოთხოვნის გაგზავნა (POST ან PATCH)
async function sendCartRequest(method, productId, quantity) {
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart/product",
      {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId, quantity: quantity }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert("Product added to cart ✅");
      if (data.total) {
        updateGlobalBadge(data.total.quantity);
      } else {
        getCart();
      }
    } else {
      alert("Failed to add product ❌");
    }
  } catch (error) {
    console.log(error);
  }
}

// კალათის მიმდინარე მდგომარეობის წამოღება
// გასწორება: ადრე ორჯერ იძახდა .json()-ს რაც ანგრევდა ყველაფერს!
async function getCartData() {
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // .json() მხოლოდ ერთხელ გამოვიძახოთ!
    const data = await response.json();

    if (response.ok) {
      return data; // ← გასწორება: ადრე response.json() ორჯერ იძახდა
    }
    return null;
  } catch {
    return null;
  }
}

// რაოდენობის განახლება
async function updateQuantity(productId, newQuantity) {
  if (newQuantity <= 0) {
    deleteItem(productId);
    return;
  }

  try {
    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart/product",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId, quantity: newQuantity }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      renderCart(data);
      updateGlobalBadge(data.total.quantity);
    }
  } catch (error) {
    console.log(error);
  }
}

// პროდუქტის წაშლა კალათიდან
async function deleteItem(productId) {
  try {
    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart/product",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: productId }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      renderCart(data);
      updateGlobalBadge(data.total.quantity);
    }
  } catch (error) {
    console.log(error);
  }
}

// კალათის სრული გასუფთავება
async function clearCart() {
  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      if (cartProducts) cartProducts.innerHTML = "<p>Cart is empty</p>";
      if (cartSummary) cartSummary.innerHTML = "";
      updateGlobalBadge(0);
    }
  } catch (error) {
    console.log(error);
  }
}

// Checkout
async function checkout() {
  try {
    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart/checkout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      if (cartProducts) cartProducts.innerHTML = "<p>Cart is empty</p>";
      if (cartSummary) cartSummary.innerHTML = "";
      updateGlobalBadge(0);
    } else {
      alert("Checkout failed");
    }
  } catch (error) {
    console.log(error);
  }
}

// ====================================================
// BADGE - კალათის რაოდენობის ბეიჯი header-ში
// ====================================================

const globalCartCount = document.querySelector(".global-cart-count");

// badge-ის განახლება ყველა გვერდზე
function updateGlobalBadge(quantity) {
  if (globalCartCount) {
    globalCartCount.textContent = quantity;
  }
}

// გვერდის ჩატვირთვისას badge-ის განახლება
async function loadCartBadge() {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return;

  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (response.ok) {
      updateGlobalBadge(data.total.quantity);
    }
  } catch (error) {
    console.log(error);
  }
}

// ====================================================
// Event Listeners - cart გვერდზე მხოლოდ
// ====================================================

// checkoutBtn და clearCartBtn მხოლოდ cart.html-ზე არსებობს
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const applyBtn = document.querySelector(".applyBtn");
const applyInput=document.querySelector(".applyInput")
if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
if (applyBtn) applyBtn.addEventListener("click", () =>{
 const code = applyInput.value.trim(); // trim() - ცარიელი სფეისების მოსაშორებლად
  if (code) {
    alert("Code applied successfully!");
  } else {
    alert("გთხოვთ შეიყვანოთ პრომო კოდი");
  }
} );

// გვერდის ჩატვირთვისას
window.addEventListener("DOMContentLoaded", () => {
  loadCartBadge();
  // კალათა მხოლოდ cart გვერდზე ჩაიტვირთოს
  if (token && cartProducts && cartSummary) {
    getCart();
  }
});

