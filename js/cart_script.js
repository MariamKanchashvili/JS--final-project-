// ====================================================
// CART SCRIPT
// ====================================================

const cartProducts = document.getElementById("cartProducts");
const cartSummary = document.getElementById("cartSummary");
const token = sessionStorage.getItem("accessToken");

if (!token) {
  console.log("User not logged in");
}

// ====================================================
// პროდუქტის სრული ინფოს წამოღება ID-ით
// სვაგერი: GET /shop/products/id/{id}
// კალათა აბრუნებს მხოლოდ productId-ს,
// ამიტომ სათაური და ფოტო ცალკე უნდა მოვიტანოთ
// ====================================================
async function getProductById(productId) {
  try {
    const res = await fetch(
      `https://api.everrest.educata.dev/shop/products/id/${productId}`
    );
    const data = await res.json();
    if (res.ok) return data;
    return null;
  } catch (err) {
    console.log("getProductById error:", err);
    return null;
  }
}

// ====================================================
// კალათის ჩამოტვირთვა
// ====================================================
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
      await renderCart(data);
      updateGlobalBadge(data.total.quantity);
    } else {
      if (cartProducts) cartProducts.innerHTML = "<p>Cart is empty</p>";
      updateGlobalBadge(0);
    }
  } catch (error) {
    console.log(error);
  }
}

// ====================================================
// კალათის დახატვა
// async-ია რადგან getProductById-ს ელოდება
// Promise.all - ყველა პროდუქტის ინფო პარალელურად მოაქვს 
// ====================================================
async function renderCart(data) {
  if (!cartSummary || !cartProducts) return;

  cartSummary.innerHTML = `
    <h3>Total: ${data.total.price.current} USD</h3>
    <p>Products: ${data.total.products}</p>
    <p>Quantity: ${data.total.quantity}</p>
  `;

  cartProducts.innerHTML = "<p>იტვირთება...</p>";

  // Promise.all - ყველა ID-სთვის პარალელურად ვიძახებთ API-ს
  const productDetails = await Promise.all(
    data.products.map(item => getProductById(item.productId))
  );

  cartProducts.innerHTML = "";

  // data.products[i] = კალათის ელემენტი (qty, price)
  // productDetails[i] = სრული ინფო (title, thumbnail)
  // index-ით ვუთავსებთ
  data.products.forEach((item, index) => {
    const details = productDetails[index];

    // თუ API-მ ვერ დააბრუნა - fallback
    const title = details?.title || item.productId;
    const thumbnail = details?.thumbnail || "";

    cartProducts.innerHTML += `
      <div class="cart-item" id="item-${item.productId}">
   <div class="cart-actions">
          <button onclick="deleteItem('${item.productId}')">❌</button>
        </div>

        ${thumbnail
          ? `<img src="${thumbnail}" alt="${title} class="cartImage"
               style="width:150px;height:150px;object-fit:contain;border-radius:8px;">`
          : ""
        }

     
        <p class="product-name">${title}</p>

        <div class="cart-item__quantity">
    
          <button class="cartBtn"
            onclick="updateQuantity('${item.productId}', ${item.quantity - 1})">-</button>
          <span>${item.quantity}</span>
          <button class="cartBtn"
            onclick="updateQuantity('${item.productId}', ${item.quantity + 1})">+</button>
        </div>
        <div class="perPrice"> 
        <p class="cartPrice" >Unit price</p> 
        <p>${item.pricePerQuantity} <span class="value">USD</span></p>
        </div>
        <div class = "totalPrice"> 
        <p class="cartPrice"> Total price </p>
        <p>${item.quantity * item.pricePerQuantity} <span class="value">USD</span></p>
        </div>
      </div>
    `;
  });
}

// ====================================================
// კალათაში დამატება
// ====================================================
async function addToCart(productId) {
  const token = sessionStorage.getItem("accessToken");

  if (!token) {
    showAlert("Please sign in first");
    window.location.href = "logIn_index.html";
    return;
  }

  const cart = await getCartData();

  if (!cart || !cart.products) {
    await sendCartRequest("POST", productId, 1);
    return;
  }

  const existingProduct = cart.products.find((p) => p.productId === productId);

  if (existingProduct) {
    await sendCartRequest("PATCH", productId, existingProduct.quantity + 1);
  } else if (cart.products.length > 0) {
    await sendCartRequest("PATCH", productId, 1);
  } else {
    await sendCartRequest("POST", productId, 1);
  }
}

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
      showAlert("Product added to cart ✅");
      if (data.total) {
        updateGlobalBadge(data.total.quantity);
      } else {
        getCart();
      }
    } else {
     showAlert("Failed to add product ❌,please sign in ");
    }
  } catch (error) {
    console.log(error);
  }
}


async function getCartData() {
  const token = sessionStorage.getItem("accessToken");

  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) return data;
    return null;
  } catch {
    return null;
  }
}

// ====================================================
// რაოდენობის განახლება
// ====================================================
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
      await renderCart(data);
      updateGlobalBadge(data.total.quantity);
    }
  } catch (error) {
    console.log(error);
  }
}

// ====================================================
// წაშლა
// ====================================================
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
      await renderCart(data);
      updateGlobalBadge(data.total.quantity);
    }
  } catch (error) {
    console.log(error);
  }
}

// ====================================================
// გასუფთავება
// ====================================================
async function clearCart() {
  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
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

// ====================================================
// Checkout
// ====================================================
async function checkout() {
  try {
    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart/checkout",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await response.json();

    if (response.ok) {
      showAlert(data.message);
      if (cartProducts) cartProducts.innerHTML = "<p>Cart is empty</p>";
      if (cartSummary) cartSummary.innerHTML = "";
      updateGlobalBadge(0);
    } else {
      showAlert("Checkout failed");
    }
  } catch (error) {
    console.log(error);
  }
}

// ====================================================
// BADGE
// querySelectorAll - desktop და mobile ორივეს ანახლებს
// ====================================================
function updateGlobalBadge(quantity) {
  const badges = document.querySelectorAll(".global-cart-count");
  badges.forEach(badge => {
    badge.textContent = quantity;
  });
}

async function loadCartBadge() {
  const token = sessionStorage.getItem("accessToken");
  if (!token) return;

  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (response.ok) updateGlobalBadge(data.total.quantity);
  } catch (error) {
    console.log(error);
  }
}

// ====================================================
// Event Listeners
// ====================================================
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const applyBtn = document.querySelector(".applyBtn");
const applyInput = document.querySelector(".applyInput");

if (checkoutBtn) checkoutBtn.addEventListener("click", checkout);
if (clearCartBtn) clearCartBtn.addEventListener("click", clearCart);
if (applyBtn) {
  applyBtn.addEventListener("click", () => {
    const code = applyInput?.value.trim();
    if (code) {
      showAlert("Code applied successfully! ✅");
    } else {
      showAlert("გთხოვთ შეიყვანოთ პრომო კოდი");
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  loadCartBadge();
  if (token && cartProducts && cartSummary) {
    getCart();
  }
});