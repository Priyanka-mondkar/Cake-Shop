document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {

            e.preventDefault();

            const name = document.getElementById("fullname").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match");
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:5000/api/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password
                    })
                });

                const data = await response.json();
                console.log("Signup Data:", data);

                if (response.ok) {
                    alert("Signup Successful 🎉");
                    window.location.href = "login.html";
                } else {
                    alert(data.error);
                }

            } catch (error) {
                console.error(error);
                alert("Server error");
            }

        });
    }

});