document.addEventListener("DOMContentLoaded", loadOrders);

async function loadOrders() {

    const tbody = document.querySelector("tbody");

    try {
        const res = await fetch("http://localhost:5000/api/orders/admin");
        const data = await res.json();

        tbody.innerHTML = "";

        data.forEach(order => {

            const row = `
                <tr>
                    <td>${order.order_id}</td>
                    <td>${order.name}</td>
                    <td>${order.total_amount}</td>
                    <td>${order.delivery_type}</td>
                    <td>${order.payment_method}</td>

                    <td>
                        <span class="status ${order.status.toLowerCase()}">
                            ${order.status}
                        </span>
                    </td>

                    <td>
                        <select class="status-select">
                            <option ${order.status==="Placed"?"selected":""}>Placed</option>
                            <option ${order.status==="Delivered"?"selected":""}>Delivered</option>
                            <option ${order.status==="Cancelled"?"selected":""}>Cancelled</option>
                        </select>

                        <button onclick="updateStatus(${order.order_id}, this)">
                            Update
                        </button>
                    </td>
                </tr>
            `;

            tbody.innerHTML += row;
        });

    } catch (err) {
        console.error(err);
    }
}



async function updateStatus(orderId, btn){

    const row = btn.parentElement.parentElement;
    const select = row.querySelector(".status-select");
    const status = select.value;

    try {

        const res = await fetch(`http://localhost:5000/api/orders/status/${orderId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: status })
        });

        const result = await res.json();

        if(result.status === "success"){

            const statusBox = row.querySelector(".status");
            statusBox.innerText = status;
            statusBox.className = "status " + status.toLowerCase();

            alert("Status Updated ✅");

        } else {
            alert("Error updating status");
        }

    } catch(err){
        console.error(err);
    }
}