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
  <button  class ="currentBtn"><a href="http://127.0.0.1:5500/html/shopSigned.html">All products</a></button>

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
        <div class="second-side">
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

        <!-- რეიტინგი -->
<p class="productDetails_category-rating">
    ${stars}
    (${productPage.rating})
</p>

<!-- რეიტინგის დაწერა -->
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


