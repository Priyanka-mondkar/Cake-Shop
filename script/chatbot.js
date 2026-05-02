function toggleChat(){

let bot=document.getElementById("chatbot");

if(bot.style.display==="flex"){
bot.style.display="none";
}else{
bot.style.display="flex";
}

}


async function sendMessage(){

let input=document.getElementById("userInput");
let msg=input.value.toLowerCase();

if(msg==="") return;

let chat=document.getElementById("chatBody");

chat.innerHTML += `<div class="user-msg">${msg}</div>`;

input.value="";

let reply="";
let image="";

/* Cake Images */

if(msg.includes("chocolate")){

reply="Here is our Chocolate Cake 🎂";
image="./images/chocolate cake.jpg";

}

else if(msg.includes("red velvet")){

reply="This is our Red Velvet Cake ❤️";
image="./images/red velvet birthday cake.jpg";

}

else if(msg.includes("birthday")){

reply="Perfect Birthday Cake 🎉";
image="./images/Floral Birthday Cake.jpg";

}

/* Cake info */

else if(msg.includes("flavour")){

reply="We offer Chocolate, Red Velvet, Black Forest, Vanilla and Fruit cakes 🍰";

}

/* Price */

else if(msg.includes("price")){

reply="Our cakes start from ₹500 depending on size 💰";

}

/* Order */

else if(msg.includes("order")){

reply="You can order cakes from Menu page or Custom Order page 🛒";

}

/* Delivery */

else if(msg.includes("delivery")){

reply="We provide same day delivery within the city 🚚";

}

/* Payment */

else if(msg.includes("payment")){

reply="We accept UPI, Card and Cash on Delivery 💳";

}

/* Contact */

else if(msg.includes("contact")){

reply="Contact us at +91 XXXXXXXX 📞";

}

else{

reply="Please ask cake or order related questions 🎂";

}

/* Show message */

chat.innerHTML += `
<div class="bot-msg">
${reply}
${image ? `<br><img src="${image}" class="cake-img">` : ""}
</div>
`;

chat.scrollTop=chat.scrollHeight;

}

// chat.innerHTML += `
// <div class="bot-msg">
// ${image ? `<div class="cake-title">${reply}</div>` : `${reply}`}
// ${image ? `<img src="${image}" class="cake-img">` : ""}
// </div>
// `;