/* ================= BACK BUTTON ================= */
function goBack() {
    window.location.href = "menu.html";
}


/* ================= wishlist ================= */
const wishlistContainer = document.getElementById("wishlistContainer");

document.addEventListener("DOMContentLoaded", () => {
    displayWishlist();
});

async function displayWishlist() {
    const res = await fetch("http://127.0.0.1:5000/api/wishlist");
    const wishlistItems = await res.json();

    wishlistContainer.innerHTML = "";

    wishlistItems.forEach((item) => {
        wishlistContainer.innerHTML += `
            <div class="wishlist-card">
                <img src="${item.image}" alt="${item.product_name}">
                <h3>${item.product_name}</h3>
                <button onclick="removeItem(${item.id})">Remove</button>
            </div>
        `;
    });
}

async function removeItem(id) {
    await fetch(`http://127.0.0.1:5000/api/wishlist/${id}`, {
        method: "DELETE"
    });

    displayWishlist();
    updateWishlistCount();
}