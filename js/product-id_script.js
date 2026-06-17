// ვიღებთ კონტეინერს სადაც პროდუქტი უნდა ჩაიხატოს
const pageItems = document.getElementById("productDetails");

// URL-დან ვიღებთ id-ს
// მაგალითად:
// productById.html?id=64edc5b96ad1cbae75d3025a

const params = new URLSearchParams(window.location.search);

const id = params.get("id");

console.log("PRODUCT ID:", id);

// თუ id არ არსებობს
if (!id) {
    pageItems.innerHTML = "<h2>Product ID not found</h2>";
} else {
    getPageId(id);
}


// პროდუქტის წამოღება API-დან
async function getPageId(id) {

    try {

        const response = await fetch(
            `https://api.everrest.educata.dev/shop/products/id/${id}`
        );

        const data = await response.json();

        console.log("PRODUCT DATA:", data);

        // პროდუქტის დახატვა
        pageItems.innerHTML = printPageId(data);
      const stars = document.querySelectorAll(".star");

stars.forEach((star) => {

    star.addEventListener("click", () => {

        const rate = Number(star.dataset.rate);

        rateProduct(data._id, rate);

        stars.forEach((s, index) => {

            if (index < rate) {
                s.textContent = "★";
            } else {
                s.textContent = "☆";
            }

        });

    });

});  

    } catch (error) {

        console.log("დაფიქსირდა შეცდომა ID", error);

        pageItems.innerHTML = `
            <h2>Something went wrong</h2>
        `;
    }
}


// პროდუქტის HTML
function printPageId(productPage) {

    // ფასდაკლების დამალვა თუ 0-ია
    const hideDiscount =productPage.price.discountPercentage === 0? "display:none": "";

    // ვარსკვლავები
    const stars = "⭐".repeat(Math.round(productPage.rating));
    //მარაგი 
 const isOutOfStock = productPage.stock <= 0
const stockText = isOutOfStock? "Out of stock": `In Stock: ${productPage.stock}`
const stockClass = isOutOfStock? "no-stock": "in-stock"

    return `
<div class="currentProduct">
    <a href=" http://127.0.0.1:5500/html/shop_index.html">All products  </a>

    <span><img src="../assets/icons/arrow-right-svgrepo-com (1).svg" alt=""> </span>
    <a href=" ">${productPage.title}</a>
 </div>
    <div class="productDetails">
     <div class="first-side">
        <!-- დიდი სურათი -->
        <img
            src="${productPage.thumbnail}"
            alt="${productPage.title}"
            class="productDetails_category-image"
        >
        </div>
        <div class="second-side" >
        <!-- სათაური -->
        <h1 class="productDetails_category-title">
            ${productPage.title}
        </h1>

        <!-- აღწერა -->
        <p class="productDetails_category-description">
            ${productPage.description}
        </p>

        <!-- ბრენდი -->
        <p class="productDetails_category-brand">
            Brand: ${productPage.brand}
        </p>

        <!-- კატეგორია -->
        <p class="productDetails_category-name">
            Category: ${productPage.category.name}
        </p>

        <!-- გარანტია -->
        <p class="productDetails_category-warranty">
            Warranty: ${productPage.warranty} Months
        </p>

        <!-- მარაგი -->
        <p class="${stockClass}">
          ${stockText}
        </p>

   
         <!-- რეიტინგის დაწერა  -->
         <p class="productDetails_category-rating">
    ${stars}
    (${productPage.rating})
</p>
<div class="ratingBox">
    <h3>Rate this product</h3>

    <div class="rating">
        <span class="star" data-rate="1">☆</span>
        <span class="star" data-rate="2">☆</span>
        <span class="star" data-rate="3">☆</span>
        <span class="star" data-rate="4">☆</span>
        <span class="star" data-rate="5">☆</span>
    </div>
</div>

        <!-- ფასი -->
        <div class="productDetails_price">


         <p class="productDetails_price-beforeDiscount"style="${hideDiscount}">
                ${productPage.price.beforeDiscount}
                ${productPage.price.currency}
            </p>
            <p class="productDetails_price-current">
                ${productPage.price.current}
                ${productPage.price.currency}
            </p>

           

            <p class="productDetails_price-discountPercentage" style="${hideDiscount}">
                -${productPage.price.discountPercentage}%
            </p>

        </div>

        <!-- დამატება კალათაში -->
        <button
            class="productDetails_cart"
            onclick="addToCart('${productPage._id}')"
           ${isOutOfStock ? "disabled" : ""}>

                ${isOutOfStock ? "Unavailable" : "Add To Cart"}
                
        </button>

    </div>
</div>
    `;
}
// რეიტინგი 
async function rateProduct(productId, rate) {

    try {

        const token = sessionStorage.getItem("accessToken");

        if (!token) {
            alert("Please login first");
              window.location.href = "logIn_index.html";
            return;
        }

        const response = await fetch(
            "https://api.everrest.educata.dev/shop/products/rate",
            {
                method: "POST",
                headers: {
                    accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    rate
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            throw new Error(data.message);
        }

        alert("Rating submitted!");

    } catch (error) {

        console.log("Rate Error:", error);
        alert("Rating failed");

    }

}