
import { Article } from "./article.js";

class Cart {
  constructor(id, color, quantity) {
    this.id = id;
    this.color = color;
    this.quantity = quantity;
  }
}

var str = window.location.href;
var url = new URL(str);
var id = url.searchParams.get("id");
console.log(id);



fetch("http://localhost:3000/api/products/" + id)

  //récupération du produit

  .then(data => data.json())

  // affichage du produit

  .then(jsonArticle => {

    console.log(jsonArticle);

    let article = new Article(jsonArticle);

    document.querySelector(".item__img").innerHTML += `<img src="${article.imageUrl}" alt="${article.altTxt}""></img>`;
    document.getElementById("title").textContent = article.name;
    document.getElementById("price").textContent = article.price;
    document.getElementById("description").textContent = article.description;
    let colors = article.colors;
    for (let val of colors) {
      document.getElementById("colors").innerHTML += `<option value>${val}</option>`;
    }
  })

// ajout dans le localStorage

function addToCart() {
  if (document.getElementById("colors").options[document.getElementById("colors").selectedIndex].text == "--SVP, choisissez une couleur --") {
    alert("Veuillez choisir une couleur");
  }
  else if (document.getElementById("quantity").value < 1 || document.getElementById("quantity").value > 100) {
    alert("Veuillez entrer une quantité comprise entre 1 et 100");
  }
  else {
    const cartJSON = JSON.parse(localStorage.getItem("cart") || "[]");
    //const cartElement = [id, document.getElementById("colors").options[document.getElementById("colors").selectedIndex].text, document.getElementById("quantity").value];
    let cartElement = new Cart(id, document.getElementById("colors").options[document.getElementById("colors").selectedIndex].text, parseInt(document.getElementById("quantity").value));
    for (let jsonArticle of cartJSON) {
      if (cartElement.id == jsonArticle.id && cartElement.color == jsonArticle.color) {
        console.log("doublon trouvé");
        jsonArticle.quantity = jsonArticle.quantity + cartElement.quantity;
        localStorage.setItem("cart", JSON.stringify(cartJSON));
        var doublon = 2;
        window.location.href = "cart.html";
      }

    }

    if (doublon != 2) {
      cartJSON.push(cartElement);
      console.log(cartJSON);
      localStorage.setItem("cart", JSON.stringify(cartJSON));
      window.location.href = "cart.html";
    }

  }
}

document.getElementById("addToCart").addEventListener("click", addToCart);



