import { Article } from "./article.js";

/**
 * récupération de la liste des produits depuis l'API et affichage sur la page
 */
async function initListProduct() {
  try {
    const response = await fetch("http://localhost:3000/api/products");
    const jsonListArticle = await response.json();
    for (let jsonArticle of jsonListArticle) {
      let article = new Article(jsonArticle);
      document.querySelector(".items").innerHTML += `
      <a href="./product.html?id=${article._id}">
            <article>
              <img src="${article.imageUrl}" alt="${article.altTxt}">
              <h3 class="productName">${article.name}</h3>
              <p class="productDescription">${article.description}</p>
            </article>
          </a>
      `
    }
  } catch (error) {
    alert("Nous connaissons une difficulté technique. Merci de re-essayer plus tard.");
  }
}
initListProduct();

