document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("customOrderForm");

    if (form) {
        form.addEventListener("submit", async function (e) {

            e.preventDefault();

            const flavor = document.getElementById("flavor").value;
            const size = document.getElementById("size").value;
            const shape = document.getElementById("shape").value;
            const custom_message = document.getElementById("message").value;

            // ✅ validation FIX
            if (!flavor || !size || !shape) {
                alert("Please fill all required fields ❗");
                return;
            }

            if (custom_message.trim() === "") {
                alert("Please enter message on cake 🎂");
                return;
            }

            const user = JSON.parse(localStorage.getItem("moonUser"));
            const customer_name = user?.name || "Guest";

            try {
                const response = await fetch("http://127.0.0.1:5000/api/custom-order", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        flavor,
                        size,
                        shape,
                        custom_message,
                        reference_image: "",
                        customer_name
                    })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("🎂 Custom Order Placed Successfully!");
                    form.reset();
                } else {
                    alert(data.error || "Something went wrong");
                }

            } catch (error) {
                console.error(error);
                alert("Server error");
            }

        });
    }

});