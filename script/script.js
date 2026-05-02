// ======== CHECK LOGIN =========
function checkLogin(){
    const user = localStorage.getItem("user");

    if(user){
        window.location.href = "menu.html";
    } else {
        window.location.href = "login.html";
    }
}



/* ================= logout ================= */
function logout(){
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");

    alert("Logout Successful ✅");
    window.location.href = "login.html";
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
        const response = await fetch("http://127.0.0.1:5000/signup",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ name, email, password })
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



// ======== LOGIN =========
const loginForm = document.getElementById("loginForm");

if(loginForm){
loginForm.addEventListener("submit", async function(e){

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try{
        const response = await fetch("http://127.0.0.1:5000/signin",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        console.log("LOGIN DATA:", data);

        if(response.ok){

            localStorage.setItem("user", JSON.stringify(data.user));
            localStorage.setItem("role", data.role);

            if(data.role === "admin"){
                alert("Admin Login 👑");
                window.location.href = "./admin/dashboard.html";
            } else {
                alert("User Login 😊");
                window.location.href = "home.html";
            }

        } else {
            alert(data.error || "Login Failed");
        }

    } catch(error){
        console.error(error);
        alert("Server error");
    }

});
}



// ======== INTERSECTION OBSERVER (FIXED) =========
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', function() {

  document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right')
    .forEach(el => scrollObserver.observe(el));

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



/* ================= dropdown ================= */
const loginIcon = document.getElementById("loginIcon");
const dropdownMenu = document.getElementById("dropdownMenu");

// Toggle dropdown
loginIcon.addEventListener("click", () => {
    dropdownMenu.classList.toggle("show");
});

// Click outside → close dropdown
window.addEventListener("click", (e) => {
    if (!e.target.closest(".user-menu")) {
        dropdownMenu.classList.remove("show");
    }
});