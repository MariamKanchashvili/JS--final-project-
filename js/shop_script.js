
// პროდუქტების კონტეინერი
let products = document.querySelector(".products-container")

// Pagination ღილაკები
let prevBtn = document.querySelector("#prev")
let nextBtn = document.querySelector("#next")
let pageButtons=document.querySelectorAll(".btn1")

// კატეგორიების კონტეინერი
let categoryContainer = document.querySelector(".store-category")

// მიმდინარე გვერდი
let currentPage = 1

// თითო გვერდზე რამდენი პროდუქტი გამოჩნდეს
let pageSize =8

// მიმდინარე არჩეული კატეგორია
// null ში შემდგომ  ყველა პროდუქტი უნდა გამოჩნდეს
let currentCategory = null



// პროდუქტების წამოღება


async function getProducts(page){

    try {

        // ამ ცვლადში შევინახე ლინკი 
        let url

        // თუ მომხმარებელმა კატეგორია აირჩია
        if(currentCategory){

            // წამოიღოს მხოლოდ ამ კატეგორიის პროდუქტები
            url = `https://api.everrest.educata.dev/shop/products/category/${currentCategory}?page_index=${page}&page_size=${pageSize}`

        }else{

            // თუ კატეგორია არ არის არჩეული
            // წამოიღოს ყველა პროდუქტი
            url = `https://api.everrest.educata.dev/shop/products/all?page_index=${page}&page_size=${pageSize}`

        }

        const response = await fetch(url)

        const data = await response.json()

        console.log(data)

        // ძველი პროდუქტების გასუფთავება
        products.innerHTML = ""

        // პროდუქტების გამოტანა
        data.products.forEach(item => {

            products.innerHTML += productsPrint(item)

        })

    } catch (error) {

        console.log("შეცდომა:", error)

    }
}


// პროდუქტის HTML

function productsPrint(product){

    // თუ ფასდაკლება არ აქვს, დავამატებთ hidden კლასს
    const hasNoDiscount =
    product.price.discountPercentage === 0;

    const hideClass =
    hasNoDiscount ? "hidden" : "";

    // ვამოწმებთ არის თუ არა პროდუქტი მარაგში
    const isOutOfStock =
    product.stock <= 0;

    // თუ მარაგი არ არის
    // გამოჩნდება Out of stock
    // წინააღმდეგ შემთხვევაში რაოდენობა
    const stockText =
    isOutOfStock
        ? "Out of stock"
        : `In Stock: ${product.stock}`;

    // სხვადასხვა კლასი სხვადასხვა ფერისთვის
    const stockClass =
    isOutOfStock
        ? "no-stock"
        : "in-stock";

    // თუ მარაგი არ არის
    // ღილაკი გაითიშება
    const isButtonDisabled =
    isOutOfStock
        ? "disabled"
        : "";

    return `

    <div class="card">

        <!-- პროდუქტის სურათი -->
        <img
            src="${product.thumbnail}"
            class="card-img-top"
        >

        <div class="card-body">

            <!-- პროდუქტის სახელი -->
            <h5 class="card-title">
                ${product.title}
            </h5>

            <!-- ბრენდი -->
            <p class="card-text">
                ${product.brand.toUpperCase()}
            </p>

            <!-- კატეგორია -->
            <p>
                ${product.category.name}
            </p>

            <!-- მარაგის სტატუსი -->
            <p class="${stockClass}">
                ${stockText}
            </p>

            <!-- რეიტინგი -->
            <p>
                ${"⭐".repeat(
                    Math.round(product.rating)
                )}
            </p>

            <!-- ფასების ბლოკი -->
            <div class="products__price">

                <!-- ძველი ფასი -->
                <span class="products__price-old ${hideClass}">
                    ${product.price.beforeDiscount}
                    ${product.price.currency}
                </span>

                <!-- მიმდინარე ფასი -->
                <span class="products__price-current">
                    ${product.price.current}
                    ${product.price.currency}
                </span>

                <!-- ფასდაკლება -->
                <span class="discount ${hideClass}">
                    -${product.price.discountPercentage}%
                </span>

            </div>

            <!-- კალათის ღილაკი -->
          <button
    class="cart"
    ${isButtonDisabled}
    onclick="addToCart('${product._id}')"
>

                ${
                    isOutOfStock
                    ? "Unavailable"
                    : "Add To Cart"
                }

            </button>
            

        </div>

    </div>

    `;
}


// კატეგორიების წამოღება


async function getCategory(){

    try {

        const response = await fetch(
            "https://api.everrest.educata.dev/shop/products/categories"
        )

        const data = await response.json()

        console.log(data)

    
         categoryContainer.innerHTML = `
            <button
                class="categoryBtn"
                onclick="showAllProducts()"
            >
                All
            </button>
        `

        // თითოეული კატეგორიის გამოტანა
        data.forEach(item => {

            categoryContainer.innerHTML += categoryPrint(item)

        })

    } catch(error){

        console.log("შეცდომა:", error)

    }
}



// კატეგორიის ღილაკი


function categoryPrint(category){

    return `
      
        
        <button
            class="categoryBtn"
            onclick="filterCategory('${category.id}')"
        >
            ${category.name}
        </button>

    `
}



// კატეგორიის ფილტრაცია


function filterCategory(categoryId){

    // ცვლადში შევინახე  არჩეული კატეგორია
    currentCategory = categoryId

    // ახალ კატეგორიაზე გადასვლისას
    // პირველი გვერდიდან იწყება
    currentPage = 1

    // თავიდან ვიძახებ პროდუქტებს
    getProducts(currentPage)

}



// ყველა პროდუქტის ჩვენება


function showAllProducts(){

    currentCategory = null

    currentPage = 1

    getProducts(currentPage)

}



// გვერდის ჩატვირთვისას


getProducts(currentPage)

getCategory()

//გვერდების ღილაკები 

pageButtons.forEach(button=>{
    button.addEventListener("click", ()=>{

        currentPage=Number(button.textContent)
         getProducts(currentPage)
    })
})

// NEXT BUTTON


nextBtn.addEventListener("click", () => {

    currentPage++

    getProducts(currentPage)

})



// PREV BUTTON


prevBtn.addEventListener("click", () => {

    if(currentPage > 1){

        currentPage--

        getProducts(currentPage)

    }

})


// ბრენდების სახელების გამოტანა

const brands=document.getElementById("aside-menu")

async function brandList() {
    try {
    const response=await fetch("https://api.everrest.educata.dev/shop/products/brands")
    const data= await response.json()
     console.log(data)


     data.forEach(item => {

            brands.innerHTML+= brandsPrint(item)

        })


    function brandsPrint(brandsList){
        return `
       
     <option value="${brandsList}">
      ${brandsList.toUpperCase()}
     </option>
  
        
        `
    }


    } catch (error) {
        console.log("შეცდომაა" , error)
    }
}
brandList()


function brandChanged(brandName) {
    currentPage = 1
    getBrandProducts(brandName)
}



// BRAND PRODUCTS


async function getBrandProducts(brandName) {

    try {

        const response = await fetch(
            `https://api.everrest.educata.dev/shop/products/brand/${brandName}?page_index=${currentPage}&page_size=${pageSize}`
        )

        const data = await response.json()

        products.innerHTML = ""

        data.products.forEach(item => {
            products.innerHTML += productsPrint(item)
        })

    } catch (error) {
        console.log(error)
    }}

    const searchInputAside=document.getElementById("searchInputAside")
const searchBtnAside=document.getElementById("searchBtnAside")
const brandSelect=document.getElementById("aside-menu")
// async function searchProducts() {

//     try {
//     const keyword=searchInput.value
//     const brand=brandSelect.value
//     const rating=document.getElementById("rating").value
//     const minPrice=Number(document.getElementById("minPrice").value)
//     const maxPrice=Number(document.getElementById("maxPrice").value)
//     const sortBy=document.getElementById("sortBy").value
//     const sortDirection=document.getElementById("sortDirection").value

//     let url= `https://api.everrest.educata.dev/shop/products/search?`
//     if(keyword){
//         url+=`keywords=$keyword&`
//     }
//     if(brand){
//         url+=`brand=${brand}`
//     }
//      if(rating){
//             url += `rating=${rating}&`
//         }

//         if (minPrice >= 0 && !isNaN(minPrice)) {
//             url += `price_min=${minPrice}&`

//         }

//         if(maxPrice>=0 && !isNaN(maxPrice)){
//             url += `price_max=${maxPrice}&`
//         }

//         if(sortBy){
//             url += `sort_by=${sortBy}&`
//         }

//         if(sortDirection){
//             url += `sort_direction=${sortDirection}&`
//         }
// url=url.slice(0,-1)
//    console.log("FINAL URL:", url)
        

//    const response=await fetch(url)
//    const data=await response.json()
//      products.innerHTML = ""

//         data.products.forEach(item => {
//             products.innerHTML += productsPrint(item)
//         })
//     } catch (error) {
//         console.log("შეცდომაა keyword-ის ძებნისას")
//     }
   
// }
async function searchProducts() {
    try {
        const keyword = searchInputAside.value
        const brand = brandSelect.value
        const rating = document.getElementById("rating").value
        const minPrice = document.getElementById("minPrice").value
        const maxPrice = document.getElementById("maxPrice").value
        const sortBy = document.getElementById("sortBy").value
        const sortDirection = document.getElementById("sortDirection").value

        let url = `https://api.everrest.educata.dev/shop/products/search?`

        if (keyword) url += `keywords=${keyword}&`
        if (brand && brand !== "" && brand !== "Select Brand") url += `brand=${brand}&`
        if (rating && rating !== "--") url += `rating=${rating}&`
        if (minPrice !== "" && Number(minPrice) > 0) url += `price_min=${minPrice}&`
        if (maxPrice !== "" && Number(maxPrice) > 0) url += `price_max=${maxPrice}&`
        if (sortBy) url += `sort_by=${sortBy}&`
        if (sortBy && sortDirection) url += `sort_direction=${sortDirection}&`
      if (Number(minPrice) < 0) {

    alert("Minimum price cannot be less than 0.");

    return;
}

// თუ მაქსიმალური ფასი უარყოფითია
if (Number(maxPrice) < 0) {

    alert("Maximum price cannot be less than 0.");

    return;
}
        url = url.slice(0, -1)
        console.log("FINAL URL:", url)

        const response = await fetch(url)
        const data = await response.json()
        products.innerHTML = ""
        data.products.forEach(item => {
            products.innerHTML += productsPrint(item)
        })
    } catch (error) {
        console.log("შეცდომა:", error)
    }
}

searchBtnAside.addEventListener("click",()=>{
    const keyword=searchInputAside.value
    searchProducts(keyword)
    const brand=brandSelect.value
    const rating=document.getElementById("rating").value
    const minPrice=document.getElementById("minPrice").value
    const maxPrice=document.getElementById("maxPrice").value
    const sortBy=document.getElementById("sortBy").value
    const sortDirection=document.getElementById("sortDirection").value
     console.log(keyword)

    console.log(brand)

    console.log(rating)

    console.log(minPrice)

    console.log(maxPrice)

    console.log(sortBy)

    console.log(sortDirection)
})

window.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("accessToken")
    if (token) {
        const cartBtn = document.createElement("button")
        cartBtn.textContent = "Go to Cart"
        cartBtn.addEventListener("click", () => {
            window.location.href = "cart_index.html"
        })
        document.querySelector(".header__auth").appendChild(cartBtn)
    }
})