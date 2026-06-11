// // create cart

// const cartBox = document.getElementById("cartBox")

// async function createCart(productId) {

//     const token =sessionStorage.getItem("accessToken")

//     if (!token) {
//         alert("Please sign in first")
//         return
//     }

//     try {

//         const response = await fetch(
//             "https://api.everrest.educata.dev/shop/cart/product",
//             {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     id: productId,
//                     quantity: 1
//                 })
//             }
//         )

//         const data = await response.json()

//         if (response.ok) {

//             console.log(data)

//             alert("Product added to cart")

//         } else {

//             console.log(data)

//             alert("Failed to add product")

//         }

//     } catch (error) {

//         console.log(
//             "შეცდომა კალათის შექმნისას",
//             error
//         )

//         alert("Server Error")

//     }

// }

// // get cart

// const cartProducts=document.getElementById("cartProducts")

// async function getCartProducts() {
//     const token=sessionStorage.getItem("accessToken")
//     try {
//      const response=await fetch("https://api.everrest.educata.dev/shop/cart",{
//         headers:{
//            "Content-type": "application/json",
//            "Accept":"*/*",
//            "Authorization": `Bearer ${token}`,

//         }

//      })
//      const data= await response.json()

//      if(response.ok){
//     console.log(data)
//     cartProducts.innerHTML=""

//     data.products.forEach(product => {

//     cartProducts.innerHTML += `
//         <div>

//             <p>
//                 Product ID:
//                 ${product.productId}
//             </p>

//             <p>
//                 Quantity:
//                 ${product.quantity}
//             </p>

//             <p>
//                 Price:
//                 ${product.pricePerQuantity}
//             </p>

//         </div>
//     `

// })
//      }else{
//     console.log(data)}

//     } catch (error) {

//         console.log("შეცდომა კალათის პროდუქტების გამოტანისას",error)
//         alert("Server Error")
//     }
//     console.log("TOKEN:", token)

// console.log("STATUS:", response.status)

// console.log("DATA:", data)

// }
// getCartProducts()

const cartProducts = document.getElementById("cartProducts");
const cartSummary = document.getElementById("cartSummary");
const token = sessionStorage.getItem("accessToken");

async function getCart() {
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
      cartProducts.innerHTML = "<p>Cart is empty</p>";
    }

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

function renderCart(data) {
  cartSummary.innerHTML = `
        <h3>Total: ${data.total.price.current} ₾</h3>
        <p>Products: ${data.total.products}</p>
        <p>Quantity: ${data.total.quantity}</p>
    `;

  cartProducts.innerHTML = "";

  data.products.forEach((product) => {
    cartProducts.innerHTML += `
            <div class="cart-item" id="item-${product.productId}">
                <p>ID: ${product.productId}</p>
                <p>Price: ${product.pricePerQuantity}</p>
                <div class="cart-item__quantity">
                    <button onclick="updateQuantity('${product.productId}', ${product.quantity - 1})">-</button>
                    <span>${product.quantity}</span>
                    <button onclick="updateQuantity('${product.productId}', ${product.quantity + 1})">+</button>
                </div>
                <button onclick="deleteItem('${product.productId}')">Remove</button>
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

getCart();
