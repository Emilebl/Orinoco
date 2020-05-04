// Déclaration de l'objet CART pour le panier avec ses fonctionnalités + création de son reflet dans le localStorage
const CART = {
    KEY: 'rfrgrdg45dg15drg1dr',
    contents: [],
    init(){ 
        // check le contenu du localStorage et initialise le contenu de CART.contents
        let _contents = localStorage.getItem(CART.KEY);
        if(_contents) {
            // Si il y a déjà des données: on les récupère pour mettre à jour CART.contents
            CART.contents = JSON.parse(_contents);
        } else {
            // Sinon on crée un array vide, et on synchronise notre objet JS avec le localStorage grace a la fonction sync
            CART.contents = [];
            CART.sync();
        }
    },
    // Fonction pour synchroniser "CART.contents" qui est un array et l'équivalent "string" dans le localStorage
    async sync() {
        let _cart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, _cart);
    },
    // Fonction pour vider le panier
    empty(){
        CART.contents = [];
        // Mise à jour du localStorage avec sync
        CART.sync();
        console.log(CART.contents);
    }
};
// Initialisation du panier avec CART.init dès le chargement de la page
CART.init();
console.log(CART.contents);

// Recupération des éléments du DOM afin de les modifier ensuite
const emptyCartButton = document.getElementById("emptyCartButton");
const cartContainer = document.getElementById("cartContainer");
const totalOrder = document.getElementById("total-order");

// Déclaration de CART.contents dans une variable cartResume
let cartResume = CART.contents;

// Initialisation de la valeur du prix total du panier à 0
let totalOrderValue = 0;

// Si le Panier est vide dans le localStorage et donc correspond à un array vide, 
// on affiche dans le DOM un message indiquant cela
if (localStorage.getItem(CART.KEY) === "[]") {
    cartContainer.innerHTML = `<p id="empty-cart">Votre panier est vide !</p>`; 
}

// Sinon on affiche dans le DOM chaque produit du panier
// Avec à chaque fois son prix à l'unité, sa quantité et son prix total déduit de la quantité
// On ajoute également le prix total du panier
cartResume.forEach((item) => {
    let prixTotalItem = item.itemPrice * item.qty;
    const afficherItems = `<div class="cart-items"><img class="cart-images" src="${item.image}"><h3 class="cart-names">${item.title}</h3><p class="cart-prices">Prix à l'unité: ${item.itemPrice} €</p><p class="cart-qty">Quantité: ${item.qty}</p><p class="cart-total-prices">Prix total: ${prixTotalItem} €</p>`;
    cartContainer.innerHTML += afficherItems;
    totalOrderValue += item.itemPrice * item.qty;
    totalOrder.innerHTML = `Prix total du panier: ${totalOrderValue} €`;
});

console.log(totalOrderValue);

// Récupération des information à envoyer à l'API lors de la commande.
// On enverra ici ces information dans le localStorage et la requete vers API se fera sur la page de confirmation

// Récupération de la liste d'id des produits placés dans le panier
let products = cartResume.map(function(item){
    return item.id
});
console.log(products);

// Récupération des informations du formulaire + Envoi du formulaire

let submitButton = document.getElementById("submit");
let form = document.getElementById("form");

// Ecoute de l'evenement "submit" sur l'élément <form>, qui va envoyer vers le localStorage l'objet "order"
// contenant lui meme les objets "contact" et "products"
document.getElementById("form").addEventListener('submit', function(){
    let contact = {
        firstName: document.getElementById("fname").value,
        lastName: document.getElementById("lname").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value
    }
    console.log(contact);
    console.log(products);
    let order = {
        contact,
        products
    };
    console.log(order);

    // envoi de "order" au local storage
    localStorage.setItem("commande", JSON.stringify(order));
    // envoi de du prix total de la commande au local storage
    localStorage.setItem("totalorder", JSON.stringify(totalOrderValue));
    
});

// Ecoute de l'evenement "clic" sur le boutton "vider le panier", qui va vider le panier et afficher un message
emptyCartButton.addEventListener('click', function() {
    CART.empty()
    cartContainer.innerHTML = `<p id="empty-cart">Votre panier est vide !</p>`
    totalOrderValue = 0;
    totalOrder.innerHTML = `Prix total du panier: ${totalOrderValue} €`;
});
