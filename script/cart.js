let cartDataGlobal = []; // 🔥 GLOBAL (सगळ्यात वर)

document.addEventListener("DOMContentLoaded", async function () {

    const cartContainer = document.getElementById("cartContainer");
    const totalPriceEl = document.getElementById("totalPrice");

    const user = JSON.parse(localStorage.getItem("moonUser"));

    if (!user) {
        cartContainer.innerHTML = "<p>Please login first</p>";
        return;
    }

    const res = await fetch(`http://localhost:5000/api/cart/${user.id}`);
    cart = await res.json(); // 🔥 assign global

    cartDataGlobal = cart; // 🔥 VERY IMPORTANT

    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty 😢</p>";
        return;
    }

    cart.forEach(item => {

        total += item.price * item.quantity;

        cartContainer.innerHTML += `
            <div>
                <img src="${item.image}" width="100">
                <h3>${item.name}</h3>
                <p>Price: ₹ ${item.price}</p>
                <p>Qty: ${item.quantity}</p>
                <button onclick="removeItem(${item.cart_id})">Remove</button>
                <hr>
            </div>
        `;
    });

    totalPriceEl.innerText = "Total: ₹ " + total;
});

function goToCheckout() {

    localStorage.setItem("cartCheckout", JSON.stringify(cartDataGlobal));

    window.location.href = "order.html";
}



async function removeItem(cart_id) {

    try {
        const res = await fetch(`http://localhost:5000/api/cart/${cart_id}`, {
            method: "DELETE"
        });

        const result = await res.json();
        console.log(result);

        // 🔥 page reload (simple)
        location.reload();

    } catch (err) {
        console.error("Remove error:", err);
        alert("Failed to remove item");
    }
}