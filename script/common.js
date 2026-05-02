async function updateWishlistCount() {
    try {
        const res = await fetch("http://127.0.0.1:5000/api/wishlist");
        const data = await res.json();

        document.getElementById("wishlist-count").innerText = data.length;
    } catch (err) {
        console.log("Error fetching wishlist count", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateWishlistCount();
});





const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){
    logoutBtn.addEventListener("click", function(e){
        e.preventDefault(); // page reload thambavnyasathi
        logout();
    });
}




