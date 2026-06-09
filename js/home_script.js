let products = document.querySelector(".products__container")
const track = document.querySelector(".products__track");
const nextBtn = document.querySelector(".products__btn--next");
const prevBtn = document.querySelector(".products__btn--prev");

let currentSlide = 0;
const visibleCards = 5;
const cardWidth = 270; 

async function getProducts() {
    try {
        const response = await fetch(
            "https://api.everrest.educata.dev/shop/products/all?page_index=1&page_size=20"
        );

        const data = await response.json();

        renderProducts(data.products);

        initCarousel(); // პროდუქტების დახატვის შემდეგ

    } catch (error) {
        console.log(error);
    }
}

function renderProducts(products) {

    // 1. ვიყენებთ .map()-ს, რომელიც ქმნის ახალ მასივს და .join('')-ით ვაქცევთ ერთ დიდ ტექსტად
    track.innerHTML = products.map(product => {
        
        
        const hasNoDiscount = product.price.discountPercentage === 0;
        const hideClass = hasNoDiscount ? 'hidden' : '';

        // 1. ვამოწმებთ, არის თუ არა მარაგი 0
        const isOutOfStock = product.stock <= 0;

        // 2. ტექსტის ლოგიკა: თუ მარაგი 0-ია, დაიწეროს "Out of stock", თუ არა - აჩვენოს რაოდენობა
        const stockText = isOutOfStock ? 'Out of stock' : `In Stock: ${product.stock}`;

        // 3. სტილის კლასი: თუ მარაგი 0-ია, დავამატოთ კლასი 'no-stock' (მაგალითად, წითლად შესაღებად)
        const stockClass = isOutOfStock ? 'no-stock' : 'in-stock';

        // 4. ღილაკის გათიშვის ლოგიკა: თუ მარაგი 0-ია, ღილაკს დაემატება ატრიბუტი 'disabled'
        const isButtonDisabled = isOutOfStock ? 'disabled' : '';
        return `
            <div class="products__card"> 
                <img src="${product.thumbnail}" class="products__image"> 
                <h3>${product.title}</h3> 
                <p class="products__card-brand">${product.brand.toUpperCase()}</p> 
                <p>${product.category.name}</p> 
                <p class="products__stock ${stockClass}">${stockText}</p> 
                <p>${"⭐".repeat(Math.round(product.rating))}</p> 
                
                <div class="products__price"> 
                    <!-- თუ ფასდაკლება 0-ია, ამ ელემენტებს დაემატება კლასი hidden -->
                    <span class="products__price-old ${hideClass}"> 
                        ${product.price.beforeDiscount} ${product.price.currency} 
                    </span> 
                    
                    <span class="products__price-current"> 
                        ${product.price.current} ${product.price.currency} 
                    </span> 
                    
                    <span class="discount ${hideClass}"> 
                        -${product.price.discountPercentage}% 
                    </span> 
                </div> 
                
                <button class="products__cart"  ${isButtonDisabled}>
                   ${isOutOfStock ? 'Unavailable' : 'Add To Cart'}
                 </button> 
            </div> 
        `;
    }).join(''); // აერთიანებს მასივს ერთ სტრუქტურად
}
    
 


function initCarousel() {

    const totalCards =
        document.querySelectorAll(".products__card").length;

    const maxSlide =
        totalCards - visibleCards;

    nextBtn.addEventListener("click", () => {

        if (currentSlide >= maxSlide) {
            currentSlide = 0;
        } else {
            currentSlide++;
        }

        track.style.transform =
            `translateX(-${currentSlide * cardWidth}px)`;
    });

    prevBtn.addEventListener("click", () => {

        if (currentSlide <= 0) {
            currentSlide = maxSlide;
        } else {
            currentSlide--;
        }

        track.style.transform =
            `translateX(-${currentSlide * cardWidth}px)`;
    });
}

getProducts();

// search

const searchInput=document.getElementById("searchInput");
const searchBtn=document.getElementById("searchBtn");
const searchList=document.getElementById("searchList");

async function searchProducts(){

    try {

        const keyword=searchInput.value;

        const url=`https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`;

        const response=await fetch(url);

        const data=await response.json();

        renderProducts(data.products);

    } catch(error){

        alert("დაფიქსირდა შეცდომა ძებნისას");
        console.log("შეცდომაა ძებნისას",error);

    }
}

searchBtn.addEventListener("click",()=>{

    searchProducts();

});


// // dropdown  ით ძებნის შედეგების გამოტანა 
// searchInput.addEventListener("input",async()=>{

//     const keyword=searchInput.value;

//     if(keyword.length<2){return} ;

//     const response=await fetch(
//         `https://api.everrest.educata.dev/shop/products/search?keywords=${keyword}`
//     );

//     const data=await response.json();

//     searchList.innerHTML="";

//     data.products.forEach(product=>{
//    const item=document.createElement("div");

//    item.classList.add("search-item");
//    item.innerHTML=`
//    <img src="${product.thumbnail}" width="50">
//     <span>${product.title}</span>
   
//    `;
//    searchList.appendChild(item);
    

//     });

// });


