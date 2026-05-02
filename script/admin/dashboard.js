// 🔹 Role check (security)
const role = localStorage.getItem("role");

if (role !== "admin") {
    alert("Access Denied ❌");
    window.location.href = "../login.html";
}

// 🔹 Logout
function logout(){
    localStorage.removeItem("role");
    window.location.href = "../login.html";
}

// 🔹 Chart variable (global)
let chart;

// 🔹 Chart function
function loadChart(type){

    const ctx = document.getElementById("barChart");

    if(!ctx){
        console.log("Canvas not found");
        return;
    }

    // 🔥 old chart destroy
    if(chart){
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: type,
        data: {
            labels: ["Jan","Feb","Mar","Apr","May","Jun"],
            datasets: [{
                label: "Revenue",
                data: [12000,19000,30000,25000,40000,55000],
                backgroundColor: [
                    "#ff7b00","#3498db","#2ecc71","#e74c3c","#9b59b6","#f1c40f"
                ]
            }]
        },
        options:{
            responsive:true
        }
    });
}

// 🔥 SINGLE DOMContentLoaded (merge केलेलं)
document.addEventListener("DOMContentLoaded", function(){

    // 🔹 backend stats
    fetch("http://127.0.0.1:5000/admin/stats")
    .then(res => res.json())
    .then(data => {

        document.getElementById("products").innerText = data.products;
        document.getElementById("users").innerText = data.users;
        document.getElementById("orders").innerText = data.orders;
        
        document.getElementById("revenue").innerText = "₹" + data.revenue;
    })
    .catch(err => console.log(err));

    // 🔹 default chart load
    loadChart("bar");

});