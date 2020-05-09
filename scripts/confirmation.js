// Recuperation de l'objet "order" depuis le localStorage ainsi que le prix total de la commande
let order = JSON.parse(localStorage.getItem("commande"));
let totalOrderValue = JSON.parse(localStorage.getItem("totalorder"));

// Recuperation des éléments du DOM pour ensuite les modifier
let orderConfirmation = document.getElementById("orderConfirmation");

// Envoi de la commande à la base de donnée

// On imbrique notre requete AJAX dans une promesse
function promiseJax (url) {
    return new Promise(function (resolve, reject){
        var request = new XMLHttpRequest();
        request.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 201) {
                // Ici le status requis est 201 car il y a création de ressource par l'API: l'id de la commande
                // Si le status de la requete = 201, on execute la fonction "resolve" 
                // en lui passant en paramètre la réponse à notre requete
                resolve(this.responseText);
            } else {
                // Si le status est != à 201, on execute la fonction "reject" 
                // en lui passant un paramètre une nouvelle erreur avec un message spécifique
                reject(new Error ("Oups! Une erreur est survenue !"));
            };
        };
        request.onerror = function () {
            // Si la requete ne peux être lancée, on execute également "reject" 
            // mais en passant une autre erreur en parametre, avec un message différent
            reject(new Error ("Erreur Réseau"));
        };
        // Ouverture de la requete de type "POST" à l'url spécifié
        request.open("POST", url);
        // Envoi de l'objet "order" à l'API
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(order));
        
    });
}

// On définie ce que vont executer les call backs "Resolve" et "Reject" de notre promesse
promiseJax("http://localhost:3000/api/cameras/order").then(function (_orderRecap) {
    // Pour le "Resolve" on affiche un message de confirmation de la commande, rappellant son prix total
    // On affiche également le numéro de commande généré par l'API en réponse à la requete
    var orderRecap = JSON.parse(_orderRecap);
    orderConfirmation.innerHTML = `<h2>Merci pour votre commande !</h2><p>Pour un prix total de <span id="prixCommande">${totalOrderValue} €</span></p><p>Votre numéro de commande est le <span id="numeroCommande">N°${orderRecap.orderId}</span></p>`
    
}).catch(function (err){
    // Pour le "Reject" on affiche dans le DOM le message d'erreur qui a été généré, selon l'erreur rencontrée
    console.error(err);
    orderConfirmation.innerHTML = `<div class="errorMessage"><p>${err}</p></div>`;
});





    