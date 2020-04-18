
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
        });
        const CART = {
            KEY: 'rfrgrdg45dg15drg1dr',
            contents: [],
            init(){ 
                // check localStorage and initialize the contents of CART.contents
                let _contents = localStorage.getItem(CART.KEY);
                if(_contents) {
                    CART.contents = JSON.parse(_contents);
                } else {
                    // possible to use dummy data in the array
                    CART.contents = [];
                    CART.sync();
                }
            },
            async sync() {
                let _cart = JSON.stringify(CART.contents);
                await localStorage.setItem(CART.KEY, _cart);
            },
            find(myId){
                // find an item in the cart by its id (some"id" might be changed according to its key in the back end or here (myId ?))
                let match = CART.contents.filter(item =>{
                    if(item.id == myId)
                    return true;
                });
                if(match && match[0])
                return match[0];
            },
            add(myId){
                // add a new item in the cart
                // check if the item is not already in the cart
                if (CART.find(myId)){
                    CART.increase(myId, 1);
                } else {
                    // in the exemple it looks for which item we want with a filter method looking all the products from the database searching for a matching id, 
                    // but in our case it is only the product that is currently displayed on the page
                    let obj = {
                        id: myId,
                        title: camera.name,
                        qty: 1,
                        itemPrice: camera.price,
                    };
                    // push the object to the contents of CART
                    CART.contents.push(obj);
                    // update localStorage
                    CART.sync();
                }
            },
            increase(myId, qty=1){
                // increase the quantity of an item in the cart
                CART.contents = CART.contents.map(item=>{
                    if(item.id === myId)
                    item.qty = item.qty + qty;
                    return item
                });
                // update localStorage
                CART.sync();
            },
            reduce(myId, qty=1){
                // increase the quantity of an item in the cart
                CART.contents = CART.contents.map(item=>{
                    if(item.id === myId)
                    item.qty = item.qty - qty;
                    return item
                });
                // remove item from cart if the qty is 0
                CART.contents.forEach(async items => {
                    if(item.id === myId && item.qty === 0)
                    CART.remove(myId);
                });
                // update localStorage
                CART.sync();
            },
            remove(myId){
                CART.contents = CART.contents.filter(item =>{
                    if(item.id !== myId)
                    return true;
                });
                // update localStorage
                CART.sync();
            },
            empty(){
                // empty whole cart
                CART.contents = [];
                // update localStorage
                CART.sync();
            }
        };
        CART.init();
        console.log(CART.contents);
        addToCartButton.addEventListener("click", function() {
            CART.add(myId);
            console.log(CART.contents);
        });

    }    
};
var myLocalHost = "http://localhost:3000/api/cameras/" + myId;
request.open("GET", myLocalHost);
request.send();

// Création du panier avec un objet "CART", ainsi que toutes ses fonctionnalités

// const CART = {
//     KEY: 'rfrgrdg45dg15drg1dr',
//     contents: [],
//     init(){ 
//         // check localStorage and initialize the contents of CART.contents
//         let _contents = localStorage.getItem(CART.KEY);
//         if(_contents) {
//             CART.contents = JSON.parse(_contents);
//         } else {
//             // possible to use dummy data in the array
//             CART.contents = [];
//             CART.sync();
//         }
//     },
//     async sync() {
//         let _cart = JSON.stringify(CART.contents);
//         await localStorage.setItem(CART.KEY, _cart);
//     },
//     find(myId){
//         // find an item in the cart by its id (some"id" might be changed according to its key in the back end or here (myId ?))
//         let match = CART.contents.filter(item =>{
//             if(item.id == myId)
//             return true;
//         });
//         if(match && match[0])
//         return match[0];
//     },
//     add(myId){
//         // add a new item in the cart
//         // check if the item is not already in the cart
//         if (CART.find(myId)){
//             CART.increase(myId, 1);
//         } else {
//             // in the exemple it looks for which item we want with a filter method looking all the products from the database searching for a matching id, 
//             // but in our case it is only the product that is currently displayed on the page
//             let obj = {
//                 id: myId,
//                 title: camera.name,
//                 qty: 1,
//                 itemPrice: camera.price,
//             };
//             // push the object to the contents of CART
//             CART.contents.push(obj);
//             // update localStorage
//             CART.sync();
//         }
//     },
//     increase(myId, qty=1){
//         // increase the quantity of an item in the cart
//         CART.contents = CART.contents.map(item=>{
//             if(item.id === myId)
//             item.qty = item.qty + qty;
//             return item
//         });
//         // update localStorage
//         CART.sync();
//     },
//     reduce(myId, qty=1){
//         // increase the quantity of an item in the cart
//         CART.contents = CART.contents.map(item=>{
//             if(item.id === myId)
//             item.qty = item.qty - qty;
//             return item
//         });
//         // remove item from cart if the qty is 0
//         CART.contents.forEach(async items => {
//             if(item.id === myId && item.qty === 0)
//             CART.remove(myId);
//         });
//         // update localStorage
//         CART.sync();
//     },
//     remove(myId){
//         CART.contents = CART.contents.filter(item =>{
//             if(item.id !== myId)
//             return true;
//         });
//         // update localStorage
//         CART.sync();
//     },
//     empty(){
//         // empty whole cart
//         CART.contents = [];
//         // update localStorage
//         CART.sync();
//     }
// }
// initialisation du panier au chargement de la page
document.addEventListener("load", function(){
    CART.init();
    console.log(CART.contents);
})

// Ajout d'un item au panier lors du click sur le bouton "ajouter au panier"
// addToCartButton.addEventListener("click", function() {
//     CART.add(myId);
//     console.log(CART.contents);
// });




























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


    



