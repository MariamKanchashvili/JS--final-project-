let searchInput=document.getElementById("searchInput")

async function searchProducts(){
    try {
 const keyword=searchInput.value.trim()
 const url=`https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`
  
 const response=await fetch(url)
 const data=await response.json()

 products.innerHtml=""
 data.forEach(item=>{
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
