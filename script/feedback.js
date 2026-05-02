/* ================= BACK BUTTON ================= */
function goBack() {
    window.location.href = "home.html";
}


document.addEventListener("DOMContentLoaded", function(){

    const popup = document.getElementById("popup");
    const openBtn = document.getElementById("openPopup");
    const closeBtn = document.getElementById("closePopup");
    const submitBtn = document.getElementById("submitReview");
    const reviewsList = document.getElementById("reviewsList");
    const backBtn = document.getElementById("backBtn");

    let selectedRating = 0;

    const starInputs = document.querySelectorAll(".stars-input i");

    /* ================= BACK BUTTON ================= */
    if(backBtn){
        backBtn.addEventListener("click", function(e){
            e.preventDefault();
            window.location.href = "account.html";
        });
    }

    /* ================= LOAD REVIEWS ================= */
    fetch("http://127.0.0.1:5000/reviews")
    .then(res => res.json())
    .then(data => {

        reviewsList.innerHTML = "";

        data.reviews.forEach(r => {

            let stars = "";
            for(let i=0; i<r.rating; i++){
                stars += `<i class="fa-solid fa-star"></i>`;
            }

            const reviewHTML = `
                <div class="review-card">
                    <div class="review-header">
                        <img src="${r.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}">
                        <h3>${r.name}</h3>
                    </div>
                    <p>${r.message}</p>
                    <div class="stars">${stars}</div>
                </div>
            `;

            reviewsList.innerHTML += reviewHTML;
        });

    });

    /* ================= STAR SELECTION ================= */
    starInputs.forEach(star => {
        star.addEventListener("click", function(){
            selectedRating = this.getAttribute("data-value");

            starInputs.forEach(s => {
                s.classList.remove("fa-solid");
                s.classList.add("fa-regular");
            });

            for(let i=0; i<selectedRating; i++){
                starInputs[i].classList.remove("fa-regular");
                starInputs[i].classList.add("fa-solid");
            }
        });
    });

    /* ================= OPEN POPUP ================= */
    if(openBtn){
        openBtn.addEventListener("click", function(){
            popup.style.display = "flex";
        });
    }

    /* ================= CLOSE POPUP ================= */
    if(closeBtn){
        closeBtn.addEventListener("click", function(){
            popup.style.display = "none";
        });
    }

    /* ================= SUBMIT REVIEW ================= */
    if(submitBtn){
        submitBtn.addEventListener("click", function(){

            const message = document.getElementById("reviewText").value.trim();
            const user = JSON.parse(localStorage.getItem("moonUser"));

            if(!user) return;

            if(message === "" || selectedRating == 0){
                alert("Please write review and select rating!");
                return;
            }

            fetch("http://127.0.0.1:5000/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.id,
                    name: user.name,
                    email: user.email, 
                    message: message,
                    rating: selectedRating,
                    avatar: user.avatar
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);

                popup.style.display = "none";
                document.getElementById("reviewText").value = "";
                selectedRating = 0;

                starInputs.forEach(s => {
                    s.classList.remove("fa-solid");
                    s.classList.add("fa-regular");
                });

                location.reload();
            })
            .catch(err => {
                console.error("ERROR:", err);
            });

        });
    }

});