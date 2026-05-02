document.addEventListener("DOMContentLoaded", function () {

    fetch("http://127.0.0.1:5000/api/custom-orders")
    .then(res => res.json())
    .then(data => {

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        data.orders.forEach(order => {

            
            const row = `
                <tr>
                    <td>CO${order.id}</td>
                    <td>${order.customer_name || "-"}</td>
                    <td>Custom Cake</td>
                    <td>${order.flavor}</td>
                    <td>${order.size}</td>
                    <td>${order.custom_message}</td>
                <td>
                    <span class="${order.status?.toLowerCase() || 'pending'}">
                    ${order.status || 'Pending'}
                </span>
            </td>
        <td>
                    <button onclick="updateStatus(${order.id}, 'Approved')">Approve</button>
                    <button onclick="updateStatus(${order.id}, 'Rejected')">Reject</button>
                </td>
            </tr>
        `;

            tbody.innerHTML += row;
        });

    })
    .catch(err => console.log(err));

});



function updateStatus(id, status){

    fetch(`http://127.0.0.1:5000/api/custom-order/status/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
    })
    .then(res => res.json())
    .then(() => {
        alert("Status updated");
        location.reload();
    });
}