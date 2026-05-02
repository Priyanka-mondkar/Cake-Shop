function deleteFeedback(btn){

    let row = btn.parentElement.parentElement
    let id = row.children[0].innerText   // ID column

    if(confirm("Delete this feedback?")){

        fetch(`http://127.0.0.1:5000/api/admin/feedback/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message)
            row.remove()
        })
        .catch(err => {
            console.error(err)
        })

    }
}



document.addEventListener("DOMContentLoaded", function(){

    fetch("http://127.0.0.1:5000/api/admin/feedback")
    .then(res => res.json())
    .then(data => {

        let tbody = document.querySelector("tbody")
        tbody.innerHTML = ""

        data.feedbacks.forEach(f => {

            let stars = "⭐".repeat(f.rating)

            let row = `
                <tr>
                    <td>${f.review_id}</td>
                    <td>${f.name}</td>
                    <td>${f.email || "-"}</td>
                    <td>${stars}</td>
                    <td>${f.message}</td>
                    <td>
                        <button class="delete" onclick="deleteFeedback(this)">
                            Delete
                        </button>
                    </td>
                </tr>
            `

            tbody.innerHTML += row
        })

    })

})