
import { Article } from "./article.js";
import { Cart } from "./article.js";

//Récupération de l'id dans l'URL

let str = window.location.href;
let url = new URL(str);
const id = url.searchParams.get("id");

//interrogation de l'API pour récupérer les détails du produit

async function initProduct() {
  const response = await fetch("http://localhost:3000/api/products/" + id);
  const jsonArticle = await response.json();
  let article = new Article(jsonArticle);
  document.querySelector(".item__img").innerHTML += `<img src="${article.imageUrl}" alt="${article.altTxt}""></img>`;
  document.getElementById("title").textContent = article.name;
  document.getElementById("price").textContent = article.price;
  document.getElementById("description").textContent = article.description;
  let colors = article.colors;
  for (let val of colors) {
    document.getElementById("colors").innerHTML += `<option value>${val}</option>`;
  }
}

// vérification des quantités / couleurs ajout dans le localStorage avec prise en compte des produits de même couleur
initProduct().then(() => {
  function addToCart() {
    let sameColor = false;
    if (document.getElementById("colors").options[document.getElementById("colors").selectedIndex].text == "--SVP, choisissez une couleur --") {
      alert("Veuillez choisir une couleur");
    }
    else if (document.getElementById("quantity").value < 1 || document.getElementById("quantity").value > 100) {
      alert("Veuillez entrer une quantité comprise entre 1 et 100");
    }
    else {
      const cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");
      let cartElement = new Cart(id, document.getElementById("colors").options[document.getElementById("colors").selectedIndex].text, parseInt(document.getElementById("quantity").value), parseInt(document.getElementById("price").textContent));
      for (let jsonArticle of cartJSON) {
        if (cartElement.id == jsonArticle.id && cartElement.color == jsonArticle.color) {
          jsonArticle.quantity = parseInt(jsonArticle.quantity) + parseInt(cartElement.quantity);
          localStorage.setItem("cart", JSON.stringify(cartJSON));
          sameColor = true;
          window.location.href = "index.html";
        }
      }
      if (!sameColor) {
        cartJSON.push(cartElement);
        localStorage.setItem("cart", JSON.stringify(cartJSON));
        window.location.href = "index.html";
      }
    }
  }
  //listener sur bouton d'ajout
  document.getElementById("addToCart").addEventListener("click", addToCart);
})

