// const e = require("express");

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
                image: camera.imageUrl,
                qty: 1,
                itemPrice: camera.price/100,
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
        console.log(CART.contents);
    }
};
CART.init();
console.log(CART.contents);

const emptyCartButton = document.getElementById("emptyCartButton");
const cartContainer = document.getElementById("cartContainer");

let cartResume = CART.contents;

cartResume.forEach((item) => {
    let prixTotalItem = item.itemPrice * item.qty;
    const afficherItems = `<div class="cart-items"><img class="cart-images" src="${item.image}"><h3 class="cart-names">${item.title}</h3><p class="cart-prices">Prix à l'unité: ${item.itemPrice} €</p><p class="cart-qty">Quantité: ${item.qty}</p><p class="cart-total-prices">Prix total: ${prixTotalItem} €</p>`;
    cartContainer.innerHTML += afficherItems;
});

// Récupération de la liste des id des produits placés dans le panier
let products = cartResume.map(function(item){
    return item.id
});
console.log(products);

// Récupération des information du formulaire

// let firstNameValue = document.getElementById("fname").value;
// let lastNameValue = document.getElementById("lname").value;
// let addressValue = document.getElementById("address").value;
// let cityValue = document.getElementById("city").value;
// let emailValue = document.getElementById("email").value;



// Envoi du formulaire

let submitButton = document.getElementById("submit");
let form = document.getElementById("form");

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
    
});

// document.getElementById('theformtest').onsubmit = function() { 
// 	console.log(document.getElementById('searchTerm').value);
//   return false;
// };

emptyCartButton.addEventListener('click', function() {
    CART.empty()
    cartContainer.innerHTML = "<p>Votre panié est vide !</p>"
});

// FOR ORDER
/**
*
* Expects request to contain:
* contact: {
*   firstName: string,
*   lastName: string,
*   address: string,
*   city: string,
*   email: string
* }
* products: [string] <-- array of product _id
*
*/