let order = JSON.parse(localStorage.getItem("commande"));
let totalOrderValue = JSON.parse(localStorage.getItem("totalorder"));
let orderConfirmation = document.getElementById("orderConfirmation");

// Envoi de la commande à la base de donnée

// 1 - On imbrique notre requete AJAX dans une promesse
function promiseJax (url) {
    return new Promise(function (resolve, reject){
        var request = new XMLHttpRequest();
        request.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                resolve(this.responseText);
            } else {
                reject(new Error ("Oups! Une erreur est survenue !"));
            };
        };
        request.onerror = function () {
            reject(new Error ("Erreur Réseau"));
        };
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(order));
        
    });
}

// 2 - On définie ce que vont executer les call backs "Resolve" et "Reject" de notre promesse
promiseJax("http://localhost:3000/api/cameras/order").then(function (_orderRecap) {
    var orderRecap = JSON.parse(_orderRecap);
    console.log(orderRecap);
    orderConfirmation.innerHTML = `<h2>Merci pour votre commande !</h2><p>Pour un prix total de <span id="prixCommande">${totalOrderValue} €</span></p><p>Votre numéro de commande est le <span id="numeroCommande">N°${orderRecap.orderId}</span></p>`
    
}).catch(function (err){
    console.error(err);
    orderConfirmation.innerHTML = `<div class="error-message"><p>${err}</p></div>`;
});





    