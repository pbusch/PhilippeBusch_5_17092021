import { Article } from "./article.js";
import { Cart } from "./article.js";
import { Contact } from "./article.js";


//récupération du panier et tri par id

const cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");
cartJSON.sort(function (x, y) {
    let a = x.id,
        b = y.id;
    return a == b ? 0 : a > b ? 1 : -1;
});


/**
*calcul des totaux quantités / prix
*/

function newTotals() {
    let cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");
    let newQuantity = 0;
    let newTotal = 0;
    for (let jsonArticle of cartJSON) {
        let cartArticle = new Cart(jsonArticle.id, jsonArticle.color, jsonArticle.quantity, jsonArticle.cartPrice);
        newQuantity = newQuantity + parseInt(cartArticle.quantity);
        newTotal = (parseInt(cartArticle.cartPrice) * parseInt(cartArticle.quantity)) + newTotal;
    }
    document.getElementById("totalQuantity").textContent = newQuantity;
    document.getElementById("totalPrice").textContent = newTotal;
};


/**
*Supression d'un article de la page et du localstorage
*/

function deleteItem() {
    const attribute = this.closest(".cart__item");
    const delID = attribute.dataset.id;
    const delColor = attribute.dataset.color;
    let cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");
    let index = 0;
    for (let jsonArticle of cartJSON) {
        let cartArticle = new Cart(jsonArticle.id, jsonArticle.color, jsonArticle.quantity);
        if (cartArticle.id == delID && cartArticle.color == delColor) {
            cartJSON.splice(index, 1);
        }
        index++;
    }
    localStorage.setItem("cart", JSON.stringify(cartJSON));
    attribute.remove();
    newTotals();
};

/**
 * changement de quantités
 */

function changeQuantity() {
    if (this.value < 1 || this.value > 100) {
        alert("veuillez entrer une quantité entre 1 et 100");
        return;
    }
    const attribute = this.closest(".cart__item");
    const changeID = attribute.dataset.id;
    const changeColor = attribute.dataset.color;
    let cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");

    for (let jsonArticle of cartJSON) {
        let cartArticle = new Cart(jsonArticle.id, jsonArticle.color, jsonArticle.quantity);
        if (cartArticle.id == changeID && cartArticle.color == changeColor) {
            jsonArticle.quantity = this.value;
            this.previousElementSibling.innerHTML = `Qté : ${this.value}`;
        }

    }
    localStorage.setItem("cart", JSON.stringify(cartJSON));
    newTotals();

}

/**
 * validation de nom / prenom
 */

function checkAlpha(letters) {
    let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
    if (regex.test(letters.value) == false) {
        letters.nextElementSibling.innerHTML = '* Entrée non valide';
        return false;
    }
    letters.nextElementSibling.innerHTML = "";
    return true;
}

/**
 * validation email
 */

function checkEmail(email) {
    //let regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    //let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (regex.test(email.value) == false) {
        email.nextElementSibling.innerHTML = '* Veuillez entrer une adresse email valide';
        return false;
    }
    email.nextElementSibling.innerHTML = "";
    return true;
}

/**
 * validation adresse / ville - minimum de 2 caractères 
 */

function checkAdress(chars) {
    let regex = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð0-9\s,.'-]{2,}$/;
    if (regex.test(chars.value) == false) {
        chars.nextElementSibling.innerHTML = '* Entrée non valide';
        return false;
    }
    chars.nextElementSibling.innerHTML = "";
    return true;
}

/**
 * déclenchement de toutes les validations 
 */

function checkAll() {
    let clickEvent = new Event('change');
    document.getElementById("firstName").dispatchEvent(clickEvent);
    document.getElementById("lastName").dispatchEvent(clickEvent);
    document.getElementById("address").dispatchEvent(clickEvent);
    document.getElementById("city").dispatchEvent(clickEvent);
    document.getElementById("email").dispatchEvent(clickEvent);
}

// Boulce de récupération des données (localstorage + api) et affichage dans la page

async function initCart() {
    try {
        for (let couch of cartJSON) {
            let cartArticle = new Cart(couch.id, couch.color, couch.quantity);
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
    } catch {
        alert("Nous connaissons une difficulté technique. Merci de re-essayer plus tard.");
    }
}

initCart().then(() => {

    //event listeners sur formulaire
    const input = document.querySelector(".cart__order__form");
    input.firstName.addEventListener('change', function () {
        checkAlpha(this);
    });
    input.lastName.addEventListener('change', function () {
        checkAlpha(this);
    });
    input.address.addEventListener('change', function () {
        checkAdress(this);
    });
    input.city.addEventListener('change', function () {
        checkAdress(this);
    });
    input.email.addEventListener('change', function () {
        checkEmail(this);
    });

    // listeners "supprimer"
    const del = document.querySelectorAll(".deleteItem");
    for (let i = 0; i < del.length; i++) {
        del[i].addEventListener("click", deleteItem);
    };

    //listeners "changer les quantités"
    const change = document.querySelectorAll(".itemQuantity");
    for (let i = 0; i < del.length; i++) {
        change[i].addEventListener("change", changeQuantity);
    };

    //listener sur bouton "commander"
    document.getElementById("order").addEventListener("click", function (event) {
        event.preventDefault();
        //vérification du formulaire - lancement automatique des fonctions de vérification
        checkAll();
        //si formulaire validé et si panier non vide : envoie des données à l'API
        if (document.getElementById("firstNameErrorMsg").innerHTML == "" && document.getElementById("lastNameErrorMsg").innerHTML == "" && document.getElementById("addressErrorMsg").innerHTML == "" && document.getElementById("cityErrorMsg").innerHTML == "" && document.getElementById("emailErrorMsg").innerHTML == "") {

            const contact = new Contact(document.getElementById("firstName").value, document.getElementById("lastName").value, document.getElementById("address").value, document.getElementById("city").value, document.getElementById("email").value);
            const products = JSON.parse(localStorage.getItem("cart") || "[]").map(product => product.id);
            if (products.length > 0) {

                fetch("http://localhost:3000/api/products/order/", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ contact, products })
                })
                    //Traitement de la réponse de l'api et redirection sur page de confirmation avec orderId
                    .then(response => response.json())
                    .then(jsonResult => {
                        localStorage.removeItem("cart");
                        window.location.href = "confirmation.html?orderId=" + jsonResult.orderId;
                    })

            }
            else {
                alert("Votre panier est vide !");
            }
        }
    });
    newTotals();
});
