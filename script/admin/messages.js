document.addEventListener("DOMContentLoaded", function(){

    fetch("http://127.0.0.1:5000/api/admin/messages")
    .then(res => res.json())
    .then(data => {

        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        data.messages.forEach(m => {

            let row = `
                <tr>
                    <td>${m.message_id}</td>
                    <td>${m.name}</td>
                    <td>${m.email}</td>
                    <td>${m.subject}</td>
                    <td>${m.message}</td>
                    <td>
                        <button class="delete-btn" onclick="deleteMessage(${m.message_id}, this)">
                            Delete
                        </button>
                    </td>
                </tr>
            `;

            tbody.innerHTML += row;
        });

    });
});



function deleteMessage(id, btn){

    if(confirm("Delete this message?")){

        fetch(`http://127.0.0.1:5000/api/admin/messages/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            btn.parentElement.parentElement.remove();
        })
        .catch(err => console.error(err));
    }
}