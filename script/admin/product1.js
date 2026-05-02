console.log("JS LOADED ✅");

document.addEventListener("DOMContentLoaded", loadProducts);



function loadProducts(){

    fetch("http://127.0.0.1:5000/api/admin/products")
    .then(res => res.json())
    .then(data => {

        let table = document.getElementById("productTable");
        table.innerHTML = "";

        if(!data.products) return;  // 🔥 safe check

        data.products.forEach(p => {

            let row = `
                <tr>
                    <td>${p.id}</td>
                    <td>${p.name}</td>
                    <td>₹${p.price}</td>
                    <td>${p.weight || ""}</td>
                    <td>${p.category || ""}</td>
                    <td>${p.type || ""}</td>
                    <td>
                        <button onclick="deleteProduct(${p.id}, this)">Delete</button>
                    </td>
                </tr>
            `;

            table.innerHTML += row;
        });

    })
    .catch(err => {
        console.log("LOAD ERROR:", err); // 🔥 important
    });
}



function addProduct(){

    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let weight = document.getElementById("productWeight").value;
    let category = document.getElementById("productCategory").value;
    let type = document.getElementById("productType").value;

    
    fetch("http://127.0.0.1:5000/api/admin/add-product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            price,
            weight,
            category,
            type
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        location.reload();
    });
}






function deleteProduct(id, btn){

    if(confirm("Delete product?")){

        fetch(`http://127.0.0.1:5000/api/admin/products/${id}`, {
            method: "DELETE"
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            btn.parentElement.parentElement.remove();
        });
    }
}