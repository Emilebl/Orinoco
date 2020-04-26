// Récupération de du conteneur de la liste de produit dans le DOM pour modifier ensuite son contenu
const productGrid = document.getElementById("product-grid");

// Récupération de la liste de produits de la catégorie "Camera" + affichage de la liste des produits
var request = new XMLHttpRequest();
    request.onload = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var productsData = JSON.parse(this.responseText);
            console.log(productsData);
            productsData.forEach((product) => {
                const afficherProduit = `<div class="products"><a href="products.html?id=${product._id}"><img src="${product.imageUrl}"><div class="products-text"><h3>${product.name}</h3><p>${product.price/100} €</p><p>${product.description}</p></div>`;
                productGrid.innerHTML += afficherProduit;
                console.log(product._id);
            }
        )};
    };
    request.open("GET", "http://localhost:3000/api/cameras");
    request.send();