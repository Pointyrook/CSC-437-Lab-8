const PRODUCTS = [ // Imagine this data came in via the server
    {
        name: "Elder Chocolate Truffles, 2oz",
        description: "The best of the best in chocolate truffles.",
        imageSrc: "https://placehold.co/200x200",
        price: 10,
        numInCart: 2
    },
    {
        name: "Jelly Belly Jelly Beans, 100 count",
        description: "Not for planting.",
        imageSrc: "https://placehold.co/200x200",
        price: 5,
        numInCart: 1
    },
    {
        name: "Kettle Chips, 8oz",
        description: "Delicious and unhealthy.",
        imageSrc: "https://placehold.co/200x200",
        price: 3,
        numInCart: 0
    },
    {
        name: "Carrots, 2lb",
        description: "Delicious and healthy.",
        imageSrc: "https://placehold.co/200x200",
        price: 2,
        numInCart: 0
    }
];

/**
 * Turns a product data object into HTML.
 *
 * @param product product data
 * @return {HTMLElement} HTML element representing the product data
 */
function renderProductCard(product) {
    const article = document.createElement("article");

    article.innerHTML = `
        <img src=${product.imageSrc} alt=${product.name} />
        <div class="product-details">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <div><button class="buy-button">Add to cart</button> <span class="num-in-cart">${product.numInCart} in cart</span></div>
        </div>`;

    let button = article.querySelector(".buy-button");
    button.addEventListener("click", () => {
        product.numInCart++;
        rerenderAllProducts();
        rerenderCart();
    })

    return article;
}

const productList = document.querySelector(".product-list");
productList.append(renderProductCard(PRODUCTS[0]));

/**
 * Recreates all product cards.
 */
function rerenderAllProducts() {
    /*
    1. remove all <article>s
    2. recreate them using the data in PRODUCTS
    3. modify the re-creation so it uses shouldProductBeVisible() (details are near the bottom of the lab directions)

    You can remove and recreate the heading element if it makes things easier.
     */
    const productList = document.querySelector(".product-list");

    const oldArticles = document.querySelectorAll("article");
    oldArticles.forEach(article => {productList.removeChild(article);});

    PRODUCTS.forEach(product => {
        if (shouldProductBeVisible(product)) {
            productList.append(renderProductCard(product));
        }
    })
}

/**
 * Recreates all cart panel info.
 */
function rerenderCart() {
    /*
    1. remove all card items
    2. recreate them and the remove buttons based off the data in PRODUCTS
     */

    const cartItems = document.querySelector(".cart-items");

    cartItems.innerHTML = "";

    PRODUCTS.forEach(product => {
        if (product.numInCart !== 0) {
            cartItems.innerHTML += `
                <p>${product.name} x${product.numInCart}</p>
                <button class="remove-button">Remove</button>`;
        }

        const button = cartItems.querySelector(".remove-button");
        button.addEventListener("click", () => {
            if (product.numInCart !== 0) {
                product.numInCart--;
            }
            rerenderAllProducts();
            rerenderCart();
        })
    })
}

const minPriceInput = document.querySelector("#minPrice");
const maxPriceInput = document.querySelector("#maxPrice");
minPriceInput.addEventListener("input", () => {
    rerenderAllProducts();
})
maxPriceInput.addEventListener("change", () => {
    rerenderAllProducts();
})

/**
 * Returns whether a product should be visible based on the current values of the price filters.
 *
 * @param product product data
 * @return {boolean} whether a product should be visible
 */
function shouldProductBeVisible(product) {
    const max = Number.parseFloat(maxPriceInput.value);
    const min = Number.parseFloat(minPriceInput.value);

    if (!isNaN(max) && !isNaN(min)) {
        return product.price <= max && product.price >= min;
    }
    else if (isNaN(max) && !isNaN(min)) {
        return product.price >= min;
    }
    else if (!isNaN(max) && isNaN(min)) {
        return product.price <= max;
    }
    else {
        return true;
    }
}

rerenderAllProducts();
rerenderCart();
