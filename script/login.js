// ======== CHECK LOGIN =========
function checkLogin(){
    const user = localStorage.getItem("user");

    if(user){
        const role = localStorage.getItem("role");

        if(role === "admin"){
            window.location.href = "admin/dashboard.html";
        } else {
            window.location.href = "menu.html";
        }

    } else {
        window.location.href = "login.html";
    }
}



// ======== SIGNUP =========
const signupForm = document.getElementById("signupForm");

if(signupForm){
signupForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const name = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if(password !== confirmPassword){
        alert("Passwords do not match");
        return;
    }

    try{
        const response = await fetch("http://127.0.0.1:5000/api/signup", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
   body: JSON.stringify({
    name: name,
    email: email,
    password: password
})
});

        const data = await response.json();

        if(response.ok){
            alert("Signup Successful 🎉");
            window.location.href="login.html";
        } else {
            alert(data.error);
        }

    } catch(error){
        console.error(error);
        alert("Server error");
    }
});
}


/* ================= login form ================= */
document.getElementById("loginForm")?.addEventListener("submit", async function(e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://127.0.0.1:5000/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {

            // ✅ SAVE DATA (IMPORTANT)
            
            localStorage.setItem("moonUser", JSON.stringify(data.user));
            localStorage.setItem("role", data.role);
            localStorage.setItem("userId", data.user.id);   // 🔥 HE ADD KARAYCHA HOTA

            alert("Login Successful ✅");

            // ✅ REDIRECT
            if (data.role === "admin") {
                window.location.href = "admin/dashboard.html";
            } else {
                window.location.href = "menu.html";
            }

        } else {
            alert(data.error || "Login failed ❌");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Server error ❌");
    }
});



/* ================= logout ================= */
async function logout(){

    try{
        await fetch("http://127.0.0.1:5000/api/logout", {
            method: "POST"
        });

        // 🔥 HECH BEST LINE
        localStorage.clear();

        alert("Logout Successful ✅");

        window.location.href = "login.html";

    } catch(error){
        console.error("Logout Error:", error);
        alert("Logout failed ❌");
    }
}



// ======== INTERSECTION OBSERVER =========
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', function() {

  // Animation
  document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right')
    .forEach(el => observer.observe(el));

  // Back to top
  const backToTopButton = document.getElementById('backToTop');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      backToTopButton.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
    });

    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});




// ======== SECTION CONTROL =========
function showSection(sectionId) {
    const sections = document.querySelectorAll("section");

    if (sectionId === "home") {
        sections.forEach(section => section.style.display = "block");
    } else {
        sections.forEach(section => section.style.display = "none");
        const activeSection = document.getElementById(sectionId);
        if (activeSection) activeSection.style.display = "block";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {
    showSection("home");
});



// ======== MENU TOGGLE =========
function toggleMenu() {
    const menu = document.getElementById("dropdownMenu");
    if(menu){
        menu.style.display = menu.style.display === "block" ? "none" : "block";
    }
}

window.onclick = function(event) {
    if (!event.target.matches('.fa-user')) {
        const menu = document.getElementById("dropdownMenu");
        if(menu) menu.style.display = "none";
    }
}


/* ================= logout button ================= */
document.addEventListener("DOMContentLoaded", function(){

    const logoutBtn = document.getElementById("logoutBtn");

    if(logoutBtn){
        logoutBtn.addEventListener("click", function(e){
            e.preventDefault();
            logout();
        });
    }

});