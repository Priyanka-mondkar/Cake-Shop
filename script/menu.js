document.addEventListener("DOMContentLoaded", function () {

    const section = document.getElementById("cakesSection");
    const title = document.getElementById("categoryTitle");
    const priceRange = document.getElementById('priceRange');
    const maxPriceLabel = document.getElementById('maxPriceLabel');

    let allCategories = [];
    let currentCategoryId = null;

    if (section) {
        section.style.display = "none";
    }

    // =========================
    // 🔥 FETCH ALL CATEGORIES
    // =========================
    fetch("http://127.0.0.1:5000/api/categories")
    .then(res => res.json())
    .then(data => {
        allCategories = data;
        console.log("Categories:", data);
    })
    .catch(err => console.log("Category Error:", err));


    // =========================
    // 🔥 CATEGORY CLICK FUNCTION
    // =========================
    window.openMenu = function(categoryName) {

        if (!section) return;

        section.style.display = "block";

        // 🔹 find category object by name (case-insensitive)
        const categoryObj = allCategories.find(cat => 
            cat.name.toLowerCase() === categoryName.toLowerCase()
        );

        if (!categoryObj) {
            console.log("Category not found:", categoryName);
            section.innerHTML = "<h2 style='text-align:center;'>No Products Found 😢</h2>";
            return;
        }

        currentCategoryId = categoryObj.id;
        title.innerText = categoryObj.name;

        // 🔹 fetch products by category
        fetch(`http://127.0.0.1:5000/api/products/category/${currentCategoryId}`)
        .then(res => res.json())
        .then(data => {
            renderProducts(data);
        })
        .catch(err => console.log("Category Product Error:", err));

        setTimeout(() => {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };


    // =========================
    // 🔥 RENDER PRODUCTS
    // =========================
    function renderProducts(products) {

    // 🔹 target the menu grid instead of the whole section
    const menuGrid = document.getElementById("menuGrid");
    menuGrid.innerHTML = "";

    let filtered = products;

    // 🔹 price filter
    if (priceRange) {
        const maxPrice = parseInt(priceRange.value);
        filtered = filtered.filter(item => parseInt(item.price) <= maxPrice);
    }

    if(filtered.length === 0){
        menuGrid.innerHTML = "<h2 style='text-align:center;'>No Products Found 😢</h2>";
        return;
    }

    filtered.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("menu-item");
        //egg/eggless logic 
        const typeClass = item.type === 'Eggless' ? 'eggless' : 'egg';
        const typeLabel = item.type || "Eggless";

        div.innerHTML = 
        `
        <span class="tag ${typeClass}">${typeLabel}</span>
            <div class="wishlist" onclick="toggleWishlist(this)" 
                data-name="${item.name}" 
                data-image="${item.image}" 
                data-price="${item.price}">
                <i class="fa-regular fa-heart"></i>
            </div>

            <img src="${item.image}" width="200">
            <h3>${item.name}</h3>
            <p>₹ ${item.price}</p>

            <button onclick="goToProduct(this)"
                data-id="${item.id}"
                data-name="${item.name}"
                data-image="${item.image}"
                data-price="${item.price}"
                data-description="${item.description}">
                View
            </button>

            
        `;

        menuGrid.appendChild(div);
    });
}


    // =========================
    // 🔥 PRICE FILTER LIVE
    // =========================
    if (priceRange) {
        priceRange.addEventListener('input', (e) => {

            const selectedValue = parseInt(e.target.value);

            if (maxPriceLabel) {
                maxPriceLabel.value = `₹ ${selectedValue}`;
            }

            if(currentCategoryId){
                fetch(`http://127.0.0.1:5000/api/products/category/${currentCategoryId}`)
                .then(res => res.json())
                .then(data => {
                    renderProducts(data);
                });
            }
        });
    }

});


// =========================
// 🔥 PRODUCT PAGE FUNCTION
// =========================
function goToProduct(btn){

    const name = btn.getAttribute("data-name");
    const image = btn.getAttribute("data-image");
    const price = btn.getAttribute("data-price");
    const description = btn.getAttribute("data-description");

    // 🔥 IMPORTANT ADD
    const productId = btn.getAttribute("data-id");

    localStorage.setItem("productId", productId); // ✅ FIX
    localStorage.setItem("productName", name);
    localStorage.setItem("productImage", image);
    localStorage.setItem("productPrice", price);
    localStorage.setItem("productDescription", description);

    window.location.href = "product.html";
}


// =========================
// 🔥 WISHLIST FUNCTION
// =========================
function toggleWishlist(el){

    const name = el.getAttribute("data-name");
    const image = el.getAttribute("data-image");
    const price = el.getAttribute("data-price");
    const description = el.getAttribute("data-description");

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    // 🔹 check duplicate
    if(!wishlist.some(p => p.name === name)){
        wishlist.push({name, image, price, description});
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        el.innerHTML = "❤️";
    } else {
        // 🔹 toggle off
        wishlist = wishlist.filter(p => p.name !== name);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        el.innerHTML = "🤍";
    }
}