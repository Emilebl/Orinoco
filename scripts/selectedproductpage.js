// 1 - Déclaration de l'objet CART pour le panier avec ses fonctionnalités + création de son reflet dans le localStorage
const CART = {
    KEY: 'rfrgrdg45dg15drg1dr',
    contents: [],
    // Fonction pour initialiser le panier
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
    // Trouve un item dans le panier en fonction de son id
    find(myId){
        let match = CART.contents.filter(item =>{
            if(item.id == myId)
            return true;
        });
        if(match && match[0])
        return match[0];
    },
// Ajout d'un produit dans le panier
    add(myId, camera){
        // Vérifie si l'id du panier à ajouter n'est pas déjà présente dans l'array, avec la fonction find
        if (CART.find(myId)){
            // Si oui, on execute la fonction increase (pour augmenter la quantité)
            CART.increase(myId, 1);
        } else { 
            // Sinon, création d'un nouvel objet pour le produit à ajouter
            let obj = {
                id: myId,
                title: camera.name,
                image: camera.imageUrl,
                qty: 1,
                itemPrice: camera.price/100,
            };
            // Ajout de l'objet dans l'array CART.contents
            CART.contents.push(obj);
            // Mise à jour du localStorage avec sync
            CART.sync();
        }
    },
    // Fonction pour augmenter de 1 la quantité d'un produit
    increase(myId, qty=1){
        CART.contents = CART.contents.map(item=>{
            if(item.id === myId)
            item.qty = item.qty + qty;
            return item
        });
        // Mise à jour du localStorage avec sync
        CART.sync();
    },
    // Fonction pour vider le panier
    empty(){
        CART.contents = [];
        // Mise à jour du localStorage avec sync
        CART.sync();
    }
};


// 2 - Recupération des éléments du DOM afin de les modifier ensuite
const productTemplate = document.getElementById("productTemplate");
const specification = document.getElementById("specification");
const imageDisplay = document.getElementById("image"); 
const nameDisplay = document.getElementById("name");
const priceDisplay = document.getElementById("price");
const descriptionDisplay = document.getElementById("description");
const personalisationName = document.getElementById("personalisationName");
const personalisationDisplay = document.getElementById("lenses");
const addToCartButton = document.createElement("button");
addToCartButton.setAttribute("id", "addToCart");

// 3 - Recupération de l'id du produit selectionné, depuis l'url de la page actuelle

// Récupération de l'url
function getURL() {
    return window.location.href;
}
// Récupération de l'id
function getElement() {
    var url = new URL(getURL());
    var urlId = url.searchParams.get('id');
    console.log(urlId + "getElement");
    return urlId;
}

// On place la valeur de l'id dans une variable myId
var myId = getElement();

// 4 - Récupération du produit correspondant à l'id récupéré + affichage des propriétés spécifiques au produit

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
        request.open("GET", url);
        request.send();
    });
};

// On déclare l'url avec l'id du produit selectionné dans une variable myLocalHost
var myLocalHost = "http://localhost:3000/api/cameras/" + myId;

// On définie ce que vont executer les call backs "Resolve" et "Reject" de notre promesse
promiseJax(myLocalHost).then(function (product) {
    // Pour le "Resolve" on récupère la réponse de notre API, qui est objet produit
    var camera = JSON.parse(product);
    // On affiche dans le DOM les différentes caractéristiques du produits qui sont indiquée dans l'objet
    imageDisplay.src = camera.imageUrl;
    nameDisplay.innerHTML = camera.name;
    priceDisplay.innerHTML = camera.price/100 + " €";
    descriptionDisplay.innerHTML = "<span>Description:</span><br>" + camera.description;
    addToCartButton.innerHTML = "Ajouter au panier";
    specification.appendChild(addToCartButton);
    var cameraLenses = camera.lenses;
    cameraLenses.forEach((lense) => {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode('New Option Text'));
        personalisationName.innerHTML = "Choix de la lentille:";
        personalisationDisplay.appendChild(option);
        option.value = lense;
        option.innerHTML = lense;
    });
    // Initialisation du panier avec CART.init
    CART.init();
    console.log(CART.contents);
    // Ecoute d'evenement qui va ajouter le produit de la page au panier à chaque clic sur le bouton
    addToCartButton.addEventListener("click", function() {
        CART.add(myId, camera);
        console.log(CART.contents);
    });
}).catch(function (err){
    // Pour le "Reject" on affiche dans le DOM le message d'erreur qui a été généré, selon l'erreur rencontrée
    console.error(err);
    productTemplate.innerHTML = `<div class="errorMessage"><p>${err}</p></div>`;
});




































// Création de la fonctionnalité d'ajout au panier (nombre d'item dans le panier + prix total du panier)
// const itemCounter = document.getElementById("itemCounter");

// var cartItems = [];

// console.log(cartItems);

// addToCartButton.addEventListener("click", function addToCart(item) {
//     cartItems.push(item);
//     itemCounter.innerHTML = cartItems.length;
//     var nbItems = cartItems.length;
//     console.log(nbItems);

//     //Appel d'une fonction externe pour passer le paramètre
//     cartLink.addEventListener("click", addIdToUrl(nbItems));
    
// });

// const cartLink = document.getElementById("cartLink");



// function addIdToUrl(nbItems) {
//     var myId = getElement();
//     var attribute = cartLink.setAttribute("href","cart.html?nb="+nbItems+"&id="+myId);
//     console.log(attribute);
//     console.log(myId + "cartLink");
// }


    



