// Récupération de du conteneur de la liste de produit dans le DOM pour modifier ensuite son contenu
const productGrid = document.getElementById("product-grid");

// Récupération de la liste de produits de la catégorie "Camera" + affichage de la liste des produits

// 1 - On imbrique notre requete AJAX dans une promesse
function promiseJax (url) {
    return new Promise(function (resolve, reject){
        var request = new XMLHttpRequest();
        request.onload = function() {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                resolve(this.responseText);
            };
        };
        request.onerror = function () {
            reject(new Error ("Erreur Réseau"));
        };
        request.open("GET", url );
        request.send();
    });
}

// 2 - On définie ce que vont executer les call backs "Resolve" et "Reject" de notre promesse
promiseJax("http://localhost:3000/api/cameras").then(function (listeCams) {
    var productsData = JSON.parse(listeCams);
    console.log(productsData);
    productsData.forEach((product) => {
        const afficherProduit = `<div class="products"><a href="products.html?id=${product._id}"><img src="${product.imageUrl}"><div class="products-text"><h3>${product.name}</h3><p>${product.price/100} €</p><p>${product.description}</p></div>`;
        productGrid.innerHTML += afficherProduit;
        console.log(product._id);
    });
}).catch(function (err){
    console.error(err);
});


    

    