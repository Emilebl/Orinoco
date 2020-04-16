
// Recupération des éléments du DOM afin de les modifier ensuite
const specification = document.getElementById("specification");
const imageDisplay = document.getElementById("image"); 
const nameDisplay = document.getElementById("name");
const priceDisplay = document.getElementById("price");
const descriptionDisplay = document.getElementById("description");
const personalisationName = document.getElementById("personalisation-name");
const personalisationDisplay = document.getElementById("lenses");
const addToCartButton = document.createElement("button");

// Recupération de l'id du produit selectionné, dans l'url de la page actuelle
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
var request = new XMLHttpRequest();
request.onload = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
        var camera = JSON.parse(this.responseText);
        imageDisplay.src = camera.imageUrl;
        nameDisplay.innerHTML = camera.name;
        priceDisplay.innerHTML = camera.price + " €";
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
        })
    }    
};
var myLocalHost = "http://localhost:3000/api/cameras/" + myId;
request.open("GET", myLocalHost);
request.send();

// Création de la fonctionnalité d'ajout au panier (nombre d'item dans le panier + prix total du panier)
const itemCounter = document.getElementById("itemCounter");

var cartItems = [];

console.log(cartItems);

addToCartButton.addEventListener("click", function addToCart(item) {
    cartItems.push(item);
    itemCounter.innerHTML = cartItems.length;
    var nbItems = cartItems.length;
    console.log(nbItems);

    //Appel d'une fonction externe pour passer le paramètre
    cartLink.addEventListener("click", addIdToUrl(nbItems));
    
});

const cartLink = document.getElementById("cartLink");



function addIdToUrl(nbItems) {
    var myId = getElement();
    var attribute = cartLink.setAttribute("href","cart.html?nb="+nbItems+"&id="+myId);
    console.log(attribute);
    console.log(myId + "cartLink");

}
