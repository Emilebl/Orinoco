// Déclaration de l'objet CART pour le panier, avec ses fonctionnalités.
const CART = {
    KEY: 'rfrgrdg45dg15drg1dr',
    contents: [],
    // Fonction pour initialiser le panier
    init(){ 
        // check le contenu du localStorage et initialise le contenu de CART.contents
        let _contents = localStorage.getItem(CART.KEY);
        if(_contents) {
            // Si il y a déjà des données: on les récupère
            CART.contents = JSON.parse(_contents);
        } else {
            // Sinon on crée un array vide, et on synchronise notre objet JS avec le localStorage
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
    // reduce(myId, qty=1){
    //     // increase the quantity of an item in the cart
    //     CART.contents = CART.contents.map(item=>{
    //         if(item.id === myId)
    //         item.qty = item.qty - qty;
    //         return item
    //     });
    //     // remove item from cart if the qty is 0
    //     CART.contents.forEach(async items => {
    //         if(item.id === myId && item.qty === 0)
    //         CART.remove(myId);
    //     });
    //     // update localStorage
    //     CART.sync();
    // },
    // remove(myId){
    //     CART.contents = CART.contents.filter(item =>{
    //         if(item.id !== myId)
    //         return true;
    //     });
    //     // update localStorage
    //     CART.sync();
    // },
    // Fonction pour vider le panier
    empty(){
        CART.contents = [];
        // Mise à jour du localStorage avec sync
        CART.sync();
    }
};


// Recupération des éléments du DOM afin de les modifier ensuite
const specification = document.getElementById("specification");
const imageDisplay = document.getElementById("image"); 
const nameDisplay = document.getElementById("name");
const priceDisplay = document.getElementById("price");
const descriptionDisplay = document.getElementById("description");
const personalisationName = document.getElementById("personalisation-name");
const personalisationDisplay = document.getElementById("lenses");
const addToCartButton = document.createElement("button");

// Recupération de l'id du produit selectionné, depuis l'url de la page actuelle
function getURL() {
    return window.location.href;
}

function getElement() {
    var url = new URL(getURL());
    var urlId = url.searchParams.get('id');
    console.log(urlId + "getElement");
    return urlId;
}

var myId = getElement();

// Récupération du produit correspondant à l'id récupéré + affichage des propriétés spécifiques au produit

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
        request.open("GET", url);
        request.send();
    });
};

var myLocalHost = "http://localhost:3000/api/cameras/" + myId;

// 2 - On définie ce que vont executer les call backs "Resolve" et "Reject" de notre promesse
promiseJax(myLocalHost).then(function (product) {
    var camera = JSON.parse(product);
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
    CART.init();
    console.log(CART.contents);
    addToCartButton.addEventListener("click", function() {
        CART.add(myId, camera);
        console.log(CART.contents);
    });
}).catch(function (err){
    console.error(err);
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


    



