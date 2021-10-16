export class Article {
    constructor(jsonArticle) {
        jsonArticle && Object.assign(this, jsonArticle);
    }
}
export class Cart {
    constructor(id, color, quantity, cartPrice) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
        this.cartPrice = cartPrice;
    }
}

export class FinalCart {
    constructor(id, quantity, price) {
        this.id = id;
        this.quantity = quantity;
        this.price = price
    }
}

export class Contact {
    constructor(firstName, lastName, address, city, email) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.address = address;
        this.city = city;
        this.email = email;
    }
}



