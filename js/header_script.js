let searchInput=document.getElementById("searchInput")

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

