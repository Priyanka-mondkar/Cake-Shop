document.addEventListener("DOMContentLoaded", function(){

    fetch("http://127.0.0.1:5000/api/admin/users")
    .then(res => res.json())
    .then(data => {

        const tbody = document.getElementById("userTable");
        tbody.innerHTML = "";

        data.users.forEach(user => {

            const row = `
            <tr>
                <td>U${user.user_id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '-'}</td>
                <td>
                    <span class="active-status">
                        ${user.role}
                    </span>
                </td>
                <td>
                    <button class="delete-btn" onclick="deleteUser(${user.user_id})">
                        Delete
                    </button>
                </td>
            </tr>
            `;

            tbody.innerHTML += row;
        });

    });
});



function deleteUser(id){

    if(!confirm("Are you sure you want to delete this user?")){
        return;
    }

    fetch(`http://127.0.0.1:5000/api/admin/user/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        alert("User deleted");
        location.reload();
    });
}