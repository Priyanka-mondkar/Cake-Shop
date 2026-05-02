const userId = localStorage.getItem("userId");
console.log("USER ID:", userId);   // 🔥 add this

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("accountForm");
    const successMsg = document.getElementById("successMsg");

    const avatarInput = document.getElementById("avatarInput");
    const avatarPreview = document.getElementById("avatarPreview");
    

    const userId = localStorage.getItem("userId");
    /* ================= LOAD USER PROFILE ================= */
    if (!userId) {
    console.log("User not logged in");
    return;
    }
    loadProfile();

    async function loadProfile() {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
            headers: {
                "User-Id": userId
            }
});

            const data = await response.json();

            if (response.ok) {

                const user = data.user;

                document.getElementById("name").value = user.name || "";
                document.getElementById("email").value = user.email || "";
                document.getElementById("phone").value = user.phone || "";

                document.getElementById("flat").value = user.flat || "";
                document.getElementById("area").value = user.area || "";
                document.getElementById("city").value = user.city || "";
                document.getElementById("state").value = user.state || "";
                document.getElementById("pincode").value = user.pincode || "";

                // 🔥 Cloudinary URL or fallback image
                avatarPreview.src = user.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
            }

        } catch (error) {
            console.log("Error loading profile:", error);
        }
    }

    /* ================= AVATAR PREVIEW ================= */

    avatarInput.addEventListener("change", function () {
        const file = this.files[0];

        if (file) {
            avatarPreview.src = URL.createObjectURL(file); // ✅ simple preview
        }
    });

    /* ================= SAVE PROFILE ================= */
form.addEventListener("submit", async function (e) {
    e.preventDefault();

    console.log("SENDING USER ID:", userId);

    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("flat", document.getElementById("flat").value);
    formData.append("area", document.getElementById("area").value);
    formData.append("city", document.getElementById("city").value);
    formData.append("state", document.getElementById("state").value);
    formData.append("pincode", document.getElementById("pincode").value);


    const file = avatarInput.files[0];
    if (file) {
        formData.append("avatar", file);
    }

    try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/profile", {
            method: "PUT",
            headers: {
                    "User-Id": userId
            },
            body: formData
        });

        const data = await response.json();
        console.log("RESPONSE:", data);

        if (response.ok) {

            successMsg.innerHTML =
                "<i class='fa-solid fa-circle-check'></i> Changes saved successfully.";

            if (data.user.avatar) {
                avatarPreview.src = data.user.avatar;
            }

            localStorage.setItem("moonUser", JSON.stringify(data.user));

        } else {
            successMsg.innerHTML =
                "<i class='fa-solid fa-circle-xmark'></i> " + (data.error || "Failed to update profile");
        }

    } catch (error) {
        console.error("ERROR:", error);
    }
});
});


/* ================= BACK BUTTON ================= */

function goBack() {
    window.location.href = "home.html";
}