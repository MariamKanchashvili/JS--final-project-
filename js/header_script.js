

let searchInput=document.getElementById("searchInput")

async function searchProducts(){
    try {
 const keyword=searchInput.value.trim()
 const url=`https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`
  
 const response=await fetch(url)
 const data=await response.json()

 products.innerHtml=""
 data.products.forEach(item=>{
products.innerHtml+=productsPrint(item)
 })

    } catch (error) {
        alert("დაფიქსირდა შეცდომა ძებნისას ")
        console.log("შეცდომაა ძებნისას",error)
    }
}
searchBtn.addEventListener("click", ()=>{
    const keyword=searchInput.value
    searchProducts(keyword)
})
searchBtn.addEventListener("click", ()=>{
    const keyword=searchInput.value
    searchProducts()
})

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

// ============================
// Burger menu
// ============================
console.log("HEADER JS LOADED");

const burgerBtn = document.querySelector(".header__burger");
const burgerIcon = document.querySelector("#burgerIcon");
const mobileMenu = document.querySelector(".header__mobile-menu");

const burgerImage = "../assets/icons/hamburger-menu-more-svgrepo-com.svg";
const closeImage = "../assets/icons/cross-mark-svgrepo-com.svg";

if (burgerBtn && mobileMenu && burgerIcon) {
    burgerBtn.addEventListener("click", (event) => {
        // 1. Diagnostics: If this doesn't print on the 2nd click, CSS is blocking the button!
        console.log("Button clicked! Current target:", event.currentTarget);

        // 2. Toggle the active class
        const isOpen = mobileMenu.classList.toggle("mobile-menu-active");
        
        // 3. Change the icon image safely
        if (isOpen) {
            burgerIcon.src = closeImage;
        } else {
            burgerIcon.src = burgerImage;
        }

        console.log("Menu state changed. Is open?", isOpen);
    });
} else {
    console.error("Error: One or more elements were not found in the DOM.", {
        burgerBtn,
        burgerIcon,
        mobileMenu
    });
}