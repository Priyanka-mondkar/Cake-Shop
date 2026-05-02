//  product info start 
document.getElementById("productName").innerText =
localStorage.getItem("productName");

document.getElementById("productImage").src =
localStorage.getItem("productImage");

document.getElementById("productPrice").innerText =
" " + localStorage.getItem("productPrice");

document.getElementById("productDescription").innerText =
localStorage.getItem("productDescription");

document.getElementById("productType").innerText =
localStorage.getItem("productType");

document.getElementById("productWeight").innerText =
localStorage.getItem("productWeight");

// 🔥 ADD THIS (IMPORTANT)
const productId = localStorage.getItem("productId");

//  product info end 


// Quantity Selector start
function increaseQty(inputId){
let qty = document.getElementById(inputId);
if(qty){
qty.value = parseInt(qty.value) + 1;
}
}

function decreaseQty(inputId){
let qty = document.getElementById(inputId);
if(qty && qty.value > 1){
qty.value = parseInt(qty.value) - 1;
}
}
// Quantity Selector end


// tabs Selector start
function openTab(tabName){

let tabs = document.querySelectorAll(".tab-content");
tabs.forEach(tab=>{
tab.classList.remove("active");
});

const tab = document.getElementById(tabName);
if(tab){
tab.classList.add("active");
}

let buttons = document.querySelectorAll(".tab-btn");
buttons.forEach(btn=>{
btn.classList.remove("active");
});

if(event && event.target){
event.target.classList.add("active");
}

}
// tabs Selector end


// ==========================
// 🔥 BUY NOW (UPDATED)
// ==========================
const buyNowBtn = document.getElementById("buyNowBtn");

if (buyNowBtn) {
buyNowBtn.addEventListener("click", function () {

    const product = {
        id: productId, // 🔥 IMPORTANT
        name: document.getElementById("productName").innerText,
        price: parseInt(document.getElementById("productPrice").innerText),
        image: document.getElementById("productImage").src,
        quantity: parseInt(document.getElementById("qtyChocolateBox").value)
    };

    console.log("BUY NOW:", product); // debug

    localStorage.setItem("buyNow", JSON.stringify(product));

    window.location.href = "order.html";
});
}


// ==========================
// 🔥 ADD TO CART (UPDATED)
// ==========================
document.addEventListener("DOMContentLoaded", function () {

    const addToCartBtn = document.getElementById("addToCartBtn");

    if (addToCartBtn) {
    addToCartBtn.addEventListener("click", function () {

        const product = {
            id: productId, // 🔥 IMPORTANT
            name: document.getElementById("productName").innerText,
            price: parseInt(document.getElementById("productPrice").innerText),
            image: document.getElementById("productImage").src,
            quantity: parseInt(document.getElementById("qtyChocolateBox").value)
        };

        let cart = JSON.parse(localStorage.getItem("cart")) || [];

        let existing = cart.find(item => item.id == product.id);

        if (existing) {
            existing.quantity += product.quantity;
        } else {
            cart.push(product);
        }

        const user = JSON.parse(localStorage.getItem("moonUser"));

            fetch("http://localhost:5000/api/cart", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                user_id: user.id,
                product_id: product.id,
                quantity: product.quantity
            })
        })
                .then(res => res.json())
                .then(data => {
            alert(data.message);
        })
                .catch(err => {
            console.log(err);
            alert("Cart error ❌");
        });

        alert("Product added to cart 🛒");
    });
    }

});


// ==========================
// 🔥 WISHLIST
// ==========================
function addToWishlist(icon) {

    const product = {
        name: document.getElementById("productName").innerText,
        image: document.getElementById("productImage").src
    };

    fetch("http://127.0.0.1:5000/api/wishlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(product)
    })
    .then(res => res.json())
    .then(data => {
        if(icon){
            icon.classList.toggle("active");
        }
        updateWishlistCount();
        alert(data.message);
    })
    .catch(err => {
        console.log(err);
        alert("Something went wrong ❌");
    });
}