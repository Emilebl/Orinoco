// Récupération du conteneur de la liste de produit dans le DOM pour modifier ensuite son contenu
const productGrid = document.getElementById("productGrid");

// Récupération de la liste de produits de la catégorie "Camera" + affichage de la liste des produits

// On imbrique notre requete AJAX dans une promesse
function promiseJax (url) {
    return new Promise(function (resolve, reject){
        var request = new XMLHttpRequest();
        request.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                // Si le status de la requete = 200, on execute la fonction "resolve" 
                // en lui passant en paramètre la réponse à notre requete
                resolve(this.responseText);
            } else {
                // Si le status est != à 200, on execute la fonction "reject" 
                // en lui passant un paramètre une nouvelle erreur avec un message spécifique
                reject(new Error ("Oups! Une erreur est survenue !"));
            };
        };
        request.onerror = function () {
            // Si la requete ne peux être lancée, on execute également "reject" 
            // mais en passant une autre erreur en parametre, avec un message différent
            reject(new Error ("Erreur Réseau"));
        };
        // Ouverture de la requete de type "GET" à l'url spécifié + envoi
        request.open("GET", url );
        request.send();
    });
}

// On définie ce que vont executer les call backs "Resolve" et "Reject" de notre promesse
promiseJax("http://localhost:3000/api/cameras").then(function (listeCams) {
    // Pour le "Resolve" on récupère la réponse de notre API, qui est un array de produits
    var productsData = JSON.parse(listeCams);
    console.log(productsData);
    // Pour chaque élément de l'array, on affiche ses proprietés dans le DOM
    productsData.forEach((product) => {
        const afficherProduit = `<div class="products"><a href="products.html?id=${product._id}"><img src="${product.imageUrl}"><div class="productsText"><h3>${product.name}</h3><p>${product.price/100} €</p><p>${product.description}</p></div>`;
        productGrid.innerHTML += afficherProduit;
        console.log(product._id);
    });
}).catch(function (err){
    // Pour le "Reject" on affiche dans le DOM le message d'erreur qui a été généré, selon l'erreur rencontrée
    console.error(err);
    productGrid.innerHTML = `<div class="errorMessage"><p>${err}</p></div>`;
});


    

    