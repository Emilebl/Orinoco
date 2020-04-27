let order = JSON.parse(localStorage.getItem("commande"));
let orderConfirmation = document.getElementById("orderConfirmation");
// Envoi de la commande à la base de donnée
var request = new XMLHttpRequest();
    request.onload = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
         var orderId = JSON.parse(this.responseText);
            console.log(orderId);
            orderConfirmation.innerHTML = `<h2>Merci pour votre commande !</h2><p>Pour un prix total de</p><p>Votre numéro de commande est le N°${orderId.orderId}</p>`
        };
    };
    request.open("POST", "http://localhost:3000/api/cameras/order");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(order));