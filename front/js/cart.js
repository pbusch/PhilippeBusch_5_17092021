class Article {
    constructor(jsonArticle) {
        jsonArticle && Object.assign(this, jsonArticle);
    }
}

class Cart {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
}

const cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");
console.log(cartJSON);

var totalPrice = 0;
var totalQuantity = 0;

for (let jsonArticle of cartJSON) {
    let cartArticle = new Cart(jsonArticle.id, jsonArticle.color, jsonArticle.quantity);
    console.log(cartArticle);
    let cartElement = [cartArticle.id, cartArticle.color, cartArticle.quantity]
    console.log(cartElement);
    fetch("http://localhost:3000/api/products/" + cartElement[0])
        .then(data => data.json())
        .then(jsonArticle => {
            console.log(jsonArticle);

            const article = new Article(jsonArticle);
            document.getElementById("cart__items").innerHTML += `
            <article class="cart__item" data-id="${cartElement[0]}">
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


            var quantity = parseInt(cartElement[2]);
            totalQuantity = quantity + totalQuantity;
            totalPrice = (article.price * quantity) + totalPrice;
            document.getElementById("totalQuantity").textContent = totalQuantity;
            document.getElementById("totalPrice").textContent = totalPrice;

            function deleteItem() {
                var attribute = this.closest(".cart__item");
                var delID = attribute.dataset.id;
                console.log(delID);
                let cartJSON2 = JSON.parse(localStorage.getItem("cart") || "[]");
                var index = 0;
                for (let jsonArticle2 of cartJSON2) {
                    let cartArticle2 = new Cart(jsonArticle2.id, jsonArticle2.color, jsonArticle2.quantity);
                    if (cartArticle2.id == delID) {
                        cartJSON2.splice(index, 1);
                        console.log("sup sup");
                    }
                    index++;
                }

                localStorage.setItem("cart", JSON.stringify(cartJSON2));
                window.location.href = "cart.html";


            };

            const del = document.querySelectorAll(".deleteItem");
            console.log(del);

            for (var i = 0; i < del.length; i++) {
                del[i].addEventListener("click", deleteItem);
            };

        })

}















