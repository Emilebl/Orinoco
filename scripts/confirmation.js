let contact = JSON.parse(localStorage.getItem(contact));
let products = JSON.parse(localStorage.getItem(products));


var request = new XMLHttpRequest();
    request.onload = function() {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            var orderConfirmation = JSON.parse(this.responseText);
            console.log(orderConfirmation);
        };
    };
    request.open("POST", "http://localhost:3000/api/cameras/order");
    request.send(contact, products);