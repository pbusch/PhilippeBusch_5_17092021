import { Article } from "./article.js";
import { Cart } from "./article.js";
import { Contact } from "./article.js";

const cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");


function newTotals() {
    let cartJSON3 = JSON.parse(localStorage.getItem("cart") || "[]");
    let newQuantity = 0;
    let newTotal = 0;
    for (let jsonArticle3 of cartJSON3) {
        let cartArticle3 = new Cart(jsonArticle3.id, jsonArticle3.color, jsonArticle3.quantity, jsonArticle3.cartPrice);
        newQuantity = newQuantity + parseInt(cartArticle3.quantity);
        newTotal = (parseInt(cartArticle3.cartPrice) * parseInt(cartArticle3.quantity)) + newTotal;
    }

    document.getElementById("totalQuantity").textContent = newQuantity;
    document.getElementById("totalPrice").textContent = newTotal;
};



// on supprime l'affichage de l'article du panier et on le supprime du local storage

function deleteItem() {

    //var delID = element.dataset.id;
    //var delColor = element.dataset.color;
    var attribute = this.closest(".cart__item");
    var delID = attribute.dataset.id;
    var delColor = attribute.dataset.color;
    let cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");
    var index = 0;
    for (let jsonArticle of cartJSON) {
        let cartArticle = new Cart(jsonArticle.id, jsonArticle.color, jsonArticle.quantity);
        if (cartArticle.id == delID && cartArticle.color == delColor) {
            cartJSON.splice(index, 1);
        }
        index++;
    }

    localStorage.setItem("cart", JSON.stringify(cartJSON));

    const removeArticle = this.closest(".cart__item");
    console.log(removeArticle);
    removeArticle.innerHTML = "";

    newTotals();

};

//changements de quantités

function changeQuantity() {
    var attribute = this.closest(".cart__item");
    var changeID = attribute.dataset.id;
    var changeColor = attribute.dataset.color;
    let cartJSON2 = JSON.parse(localStorage.getItem("cart") || "[]");
    var index = 0;
    for (let jsonArticle2 of cartJSON2) {
        let cartArticle2 = new Cart(jsonArticle2.id, jsonArticle2.color, jsonArticle2.quantity);
        if (cartArticle2.id == changeID && cartArticle2.color == changeColor) {
            jsonArticle2.quantity = this.value;
        }
        index++;
    }
    localStorage.setItem("cart", JSON.stringify(cartJSON2));
    //var newQuantity = this.value;
    //var quantityChanged = this.closest(".cart__item__content__settings__quantity--txt");
    //quantityChanged.innerHTML = `Qté : ${this.value}`
    newTotals();

}

async function initProduct() {
    for (let a of cartJSON) {
        let cartArticle = new Cart(a.id, a.color, a.quantity);
        let cartElement = [cartArticle.id, cartArticle.color, cartArticle.quantity]
        const response = await fetch("http://localhost:3000/api/products/" + cartElement[0]);
        const jsonArticle = await response.json();


        const article = new Article(jsonArticle);
        document.getElementById("cart__items").innerHTML += `
            <article class="cart__item" data-id="${cartElement[0]}" data-color="${cartElement[1]}">
            <div class="cart__item__img">
            <img src="${article.imageUrl}" alt="${article.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__titlePrice">
                <h2>${article.name}</h2>
                <h2>${cartElement[1]}<h2> 
                <p>${article.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : ${cartElement[2]}</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartElement[2]}">
                </div>
                <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
                </div>
            </div>
            </div>
            </article>`;

    }
}

initProduct().then(() => {


    // listeners "supprimer"
    const del = document.querySelectorAll(".deleteItem");
    for (var i = 0; i < del.length; i++) {
        del[i].addEventListener("click", deleteItem);
        //=> {
        //deleteItem(event.target.closest(".cart__item"));
        //newTotals();
        //});
    };

    //listeners "changer les quantités"
    const change = document.querySelectorAll(".itemQuantity");
    for (var i = 0; i < del.length; i++) {
        change[i].addEventListener("change", changeQuantity);
    };


    newTotals();

});






document.getElementById("order").addEventListener("click", function (event) {
    event.preventDefault();
    const contact = new Contact(document.getElementById("firstName").value, document.getElementById("lastName").value, document.getElementById("address").value, document.getElementById("city").value, document.getElementById("email").value);
    console.log(contact);

    const products = JSON.parse(localStorage.getItem("cart") || "[]").map(product => product.id);



    fetch("http://localhost:3000/api/products/order/", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ contact, products })
    })
        .then(res => {
            if (res.ok) {
                return res.json();
            }
            console.log(res);
        })

})


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





















