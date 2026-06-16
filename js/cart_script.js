const cartProducts = document.getElementById("cartProducts");
const cartSummary = document.getElementById("cartSummary");
const token = sessionStorage.getItem("accessToken");
if (!token) {
    console.log("User not logged in");
}
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
    } else {
      cartProducts.innerHTML = "<p >Cart is empty</p>";
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function renderCart(data) {
  cartSummary.innerHTML = `
        <h3>Total: ${data.total.price.current} USD</h3>
        <p>Products: ${data.total.products}</p>
        <p>Quantity: ${data.total.quantity}</p>
    `;

  cartProducts.innerHTML = "";

data.products.forEach((product) => {
  cartProducts.innerHTML += `
    <div class="cart-item" id="item-${product.productId}">

        <!-- ACTION -->
        <div class="cart-actions">
            <button onclick="deleteItem('${product.productId}')">❌</button>
            <button>✏️</button>
        </div>

        <!-- PRODUCT -->
        <p class="product-name">${product.title || product.productId}</p>

        <!-- QTY -->
        <div class="cart-item__quantity">
            <button class="cartBtn"
                onclick="updateQuantity('${product.productId}', ${product.quantity - 1})">-</button>

            <span>${product.quantity}</span>

            <button class="cartBtn"
                onclick="updateQuantity('${product.productId}', ${product.quantity + 1})">+</button>
        </div>

        <!-- PRICE -->
        <p>${product.pricePerQuantity}
        <span class="value">USD</span>
        </p>

        <!-- TOTAL -->
        <p>${product.quantity * product.pricePerQuantity} 
           <span class="value">USD</span>
           </p>

    </div>
  `;
});
}

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
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert("Product added to cart");
    } else {
      alert("Failed to add product");
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
async function getCartData() {
  try {
    const response = await fetch("https://api.everrest.educata.dev/shop/cart", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}

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
      },
    );

    const data = await response.json();

    if (response.ok) {
      renderCart(data);
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

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
      },
    );

    const data = await response.json();

    if (response.ok) {
      renderCart(data);
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

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
      cartProducts.innerHTML = "<p>Cart is empty</p>";
      cartSummary.innerHTML = "";
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

async function checkout() {
  try {
    const response = await fetch(
      "https://api.everrest.educata.dev/shop/cart/checkout",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
      cartProducts.innerHTML = "<p>Cart is empty</p>";
      cartSummary.innerHTML = "";
    } else {
      alert("Checkout failed");
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

document.getElementById("checkoutBtn").addEventListener("click", checkout);
document.getElementById("clearCartBtn").addEventListener("click", clearCart);

if (token && cartProducts && cartSummary) {
    getCart();
}
