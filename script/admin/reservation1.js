document.addEventListener("DOMContentLoaded", function () {

    fetch("http://127.0.0.1:5000/api/reservations")
    .then(res => res.json())
    .then(data => {

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        data.reservations.forEach(res => {



            const row = `
                <tr>
                    <td>RS${res.reservation_id}</td>
                    <td>${res.name}</td>
                    <td>${res.email}</td>
                    <td>${res.phone}</td>
                    <td>${res.reservation_date}</td>
                    <td>${res.reservation_time}</td>
                    <td>${res.guests}</td>

                    <td>${res.occasion || '-'}</td>   
                    <td>${res.message || '-'}</td>    

                <td>
                    <span class="${res.status?.toLowerCase() || 'pending'}">
                    ${res.status || 'Pending'}
                </span>
            </td>
                <td>
                    <button onclick="updateStatus(${res.reservation_id}, 'Approved')">Approve</button>
                    <button onclick="updateStatus(${res.reservation_id}, 'Rejected')">Reject</button>
                    <button onclick="deleteReservation(${res.reservation_id})" style="background:red;color:white;">
                    Delete
                    </button>
                </td>
            </tr>
        `;

            tbody.innerHTML += row;
        });

    })
    .catch(err => console.log(err));

});




function updateStatus(id, status){

    fetch(`http://127.0.0.1:5000/api/reservation/status/${id}`, {
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


function deleteReservation(id){

    if(!confirm("Are you sure you want to delete this reservation?")){
        return;
    }

    fetch(`http://127.0.0.1:5000/api/reservation/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        alert("Reservation deleted successfully");
        location.reload();
    })
    .catch(err => console.log(err));
}