/* ================= BACK BUTTON ================= */
function goBack() {
    window.location.href = "home.html";
}


/* ================= LOAD ORDERS ================= */
async function loadOrders() {

    const container = document.getElementById("ordersList");
    const user = JSON.parse(localStorage.getItem("moonUser"));

    // 🔥 FORCE FIX
    let userId = null;

        if (user) {
            userId = user.user_id || user.id;
        }

    // 🔥 fallback (backup)
        if (!userId) {
        userId = localStorage.getItem("userId");
    }
    console.log("FINAL USER ID:", userId);

    try {
        
        container.innerHTML = "<p>Loading orders...</p>";
        const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
        const orders = await res.json();

        container.innerHTML = "";

        // 🔥 FILTER: Cancelled orders remove
        const activeOrders = orders.filter(order => order.order_status !== "Cancelled");

        
        if (activeOrders.length === 0) {
            container.innerHTML = `
        <div style="text-align:center; padding:40px;">
            <h3>No Orders Yet 😢</h3>
            <p>Go order something delicious 🍰</p>
            <button onclick="goBack()">Order Now</button>
        </div>
    `;
    return;
}

        activeOrders.forEach(order => {

        container.innerHTML += `
            <div class="order-card">
                <div class="order-header">
                    <span>Order ID: ${order.order_id}</span>
                    <span>₹${order.total_amount}</span>
                </div>

            <p>📅 ${new Date(order.created_at).toLocaleDateString()}</p>   <!-- 🔥 DATE -->

            <div class="product">
                <img src="${order.image}" onerror="this.src='images/default.png'">

                <p><b>${order.product_name}</b></p>
                <p>Qty: ${order.quantity}</p>
                <p>Price: ₹${order.price}</p>
            </div>

            <div class="status">
        ${
            order.order_status === "Cancelled"
            ? "❌ Cancelled"
            : order.order_status === "Placed"
            ? "📦 Placed"
            : "✔ Paid"
        }
    </div>
</div>

    ${
        !order.order_status.includes("Paid")
        ? `<button class="cancel-btn" onclick="cancelOrder(${order.order_id})">
            ❌ Cancel Order
          </button>`
        : ""
    }

</div>
`;
        });

    } 
    
    catch (error) {
    console.log("Order load error:", error);
    container.innerHTML = `
        <p style="color:red;">Failed to load orders ❌</p>
    `;
}
}



/* ================= CANCEL ORDER ================= */
async function cancelOrder(orderId) {

    const confirmCancel = confirm("Are you sure you want to cancel this order?");

    if (!confirmCancel) return;

    try {

        const res = await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
            method: "PUT"
        });

        const data = await res.json();

        alert(data.message);

        // 🔥 Reload orders → Cancelled order automatically hide
        loadOrders();

    } catch (error) {
        console.log("Cancel Error:", error);
        alert("Cancel failed");
    }
}



/* ================= LOAD ON PAGE ================= */
document.addEventListener("DOMContentLoaded", loadOrders);