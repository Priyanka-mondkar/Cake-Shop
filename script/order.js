document.addEventListener("DOMContentLoaded", function () {

    const cartContainer = document.querySelector(".cart-items");
    const subtotalElem = document.querySelector('.summary-row span:nth-child(2)');
    const deliveryFeeElem = document.querySelector('.summary-row:nth-child(2) span:last-child');
    const totalElem = document.querySelector('.summary-row.total span:last-child');

    const deliveryOptions = document.querySelectorAll('.delivery-option');
    const placeOrderBtn = document.getElementById('place-order-btn');
    const modal = document.getElementById('confirmation-modal');
    const modalOkBtn = document.getElementById('modal-ok-btn');

    const deliveryFeeValue = 50;

    // =========================
    // 🔥 LOAD PRODUCT (BUY NOW)
    // =========================

    let products = []; // 🔥 GLOBAL

function loadCart() {

    const buyNow = JSON.parse(localStorage.getItem("buyNow"));
    const cartData = JSON.parse(localStorage.getItem("cartCheckout"));

    if (buyNow) {
        products = [buyNow];
    } else if (cartData) {
        products = cartData;
    } else {
        products = [];
    }

    cartContainer.innerHTML = "";

    if (products.length === 0) {
        cartContainer.innerHTML = "<h3>No product selected 😢</h3>";
        updateTotal();
        return;
    }

    products.forEach(product => {

        const div = document.createElement("div");
        div.classList.add("cart-item");

        div.innerHTML = `
            <div class="cart-item-img">
                <img src="${product.image}" width="80">
            </div>

            <div class="cart-item-details">
                <div class="cart-item-title">${product.name}</div>
                <div class="cart-item-price">${product.price}</div>
            </div>

            <div class="cart-item-controls">
                <span class="quantity-display">${product.quantity}</span>
            </div>
        `;

        cartContainer.appendChild(div);
    });

    updateTotal();
}
    // =========================
    // 🔥 CALCULATE TOTAL
    // =========================

function calculateSubtotal() {
    let total = 0;

    products.forEach(p => {
        total += p.price * p.quantity;
    });

    return total;
}

/* ================= update total ================= */
    function updateTotal() {

        const subtotal = calculateSubtotal();
        subtotalElem.innerText = subtotal;

        const selected = document.querySelector('.delivery-option.selected span');
        const deliveryType = selected ? selected.innerText.trim() : "Delivery";

        const deliveryFee = deliveryType === "Pickup" ? 0 : deliveryFeeValue;

        deliveryFeeElem.innerText = deliveryFee;
        totalElem.innerText = subtotal + deliveryFee;
    }

    // =========================
    // 🔥 QUANTITY UPDATE
    // =========================
    cartContainer.addEventListener("click", function (e) {

        let product = JSON.parse(localStorage.getItem("buyNow"));
        if (!product) return;

        if (e.target.classList.contains("quantity-btn")) {

            const action = e.target.getAttribute("data-action");

            if (action === "increase") {
                product.quantity += 1;
            } 
            else if (action === "decrease" && product.quantity > 1) {
                product.quantity -= 1;
            }

            localStorage.setItem("buyNow", JSON.stringify(product));
            loadCart();
        }
    });

    // =========================
    // 🔥 DELIVERY OPTION
    // =========================
    deliveryOptions.forEach(option => {
        option.addEventListener("click", function () {
            deliveryOptions.forEach(o => o.classList.remove("selected"));
            this.classList.add("selected");

            updateSteps("delivery");
            updateTotal();
        });
    });

    // =========================
    // 🔥 PAYMENT STEP
    // =========================
    const paymentMethods = document.querySelectorAll(".payment-method");
    const cardDetails = document.getElementById("card-details");
const scannerDetails = document.getElementById("scanner-details");

paymentMethods.forEach(method => {
    method.addEventListener("click", function () {

        paymentMethods.forEach(m => m.classList.remove("selected"));
        this.classList.add("selected");

        const selectedMethod = this.getAttribute("data-method");

        console.log("Selected:", selectedMethod);


        if (selectedMethod === "cash") {
            cardDetails.classList.add("hidden");
            scannerDetails.classList.add("hidden");
        } 
            else if (selectedMethod === "scanner") {
                cardDetails.classList.add("hidden");
                scannerDetails.classList.remove("hidden");

                generateQRCode(); // 🔥 IMPORTANT

            setTimeout(() => {
            const total = document.querySelector('.summary-row.total span:last-child').innerText;

            document.getElementById("scan-result").innerText =
            "Payment Received: ₹" + total + " ✅";
    }, 2000);
}

            else { // card
                cardDetails.classList.remove("hidden");
                scannerDetails.classList.add("hidden");
            }
        });
    });
    

    // =========================
    // 🔥 PLACE ORDER (FIXED)
    // =========================
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener("click", async function () {

            const firstName = document.getElementById('fname').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();

            if (!firstName || !email || !phone) {
                alert("Fill all details!");
                return;
            }

            const product = JSON.parse(localStorage.getItem("buyNow"));
            if (products.length === 0) {
            alert("No products!");
            return;
        }

            
                const totalAmount = totalElem.innerText;

            // 🔥 NEW FULL DATA
                const selectedDelivery = document.querySelector('.delivery-option.selected span').innerText;
                const selectedPayment = document.querySelector('.payment-method.selected').getAttribute("data-method");
                
                const user = JSON.parse(localStorage.getItem("moonUser"));

                if (!user) {
                    alert("Please login first!");
                    return;
                }


                const orderData = {
                    user_id: user.id, 
                
                    name: firstName,
                    email: email,
                    phone: phone,

                    address: document.getElementById('address')?.value || "",
                    city: document.getElementById('city')?.value || "",
                    zip: document.getElementById('zip')?.value || "",

                    delivery_type: selectedDelivery,
                    payment_method: selectedPayment,

                    total_amount: parseFloat(totalAmount),

                items: products.map(p => ({
                    product_id: p.product_id || p.id, // 🔥 IMPORTANT
                    quantity: p.quantity,
                    price: p.price
                }))
            
        };

            try {
                placeOrderBtn.innerText = "Processing...";
                placeOrderBtn.disabled = true;
                
                console.log("FINAL ORDER DATA:", orderData);
                
                const response = await fetch('http://127.0.0.1:5000/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

if (result.status === "success") {

    // 🔥 LOCAL STORAGE CLEAN
    localStorage.removeItem("buyNow");
    localStorage.removeItem("cartCheckout");

    // 🔥 BACKEND CART CLEAR (VERY IMPORTANT)
    await fetch(`http://localhost:5000/api/cart/clear/${user.id}`, {
        method: "DELETE"
    });

    updateSteps("confirm");
    modal.style.display = "flex";

} else {
    alert("Error: " + result.message);
}

            } catch (err) {
                alert("Server error!");
                console.error(err);
            } finally {
                placeOrderBtn.innerText = "Place Your Order";
                placeOrderBtn.disabled = false;
            }
        });
    }

    // =========================
    // 🔥 MODAL OK
    // =========================
    if (modalOkBtn) {
        modalOkBtn.addEventListener("click", function () {
            window.location.href = "home.html";
        });
    }

    // =========================
    // 🔥 CONTINUE SHOPPING
    // =========================
    document.querySelectorAll(".continue-shopping").forEach(btn => {
        btn.addEventListener("click", function () {
            window.location.href = "menu.html";
        });
    });

    updateSteps("order");
    loadCart();
});


// =========================
// 🔥 FINAL STEP FUNCTION (ONLY ONE)
// =========================
function updateSteps(step) {
    const steps = ["order", "delivery", "payment", "confirm"];
    let currentIdx = steps.indexOf(step);

    steps.forEach((s, index) => {
        const el = document.getElementById("step-" + s);
        if (el) {
            if (index <= currentIdx) {
                el.classList.add("active");
            } else {
                el.classList.remove("active");
            }
        }
    });
}


function fakeScan() {

    const total = document.querySelector('.summary-row.total span:last-child').innerText;

    document.getElementById("scan-result").innerText =
        "Payment Received: ₹" + total + " ✅";

}


function generateQRCode() {
    const total = document.querySelector('.summary-row.total span:last-child').innerText;

    document.getElementById("qrCode").src =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PAYMENT:${total}`;
}