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
 * Takes an HTML string and returns an DocumentFragment object containing HTML element objects.  If the input has a
 * single root element like "<div><p>child</p></div>", you can access it via fragment.firstElementChild.  Otherwise, if
 * it's multiple elements like "<li>item1</li><li>item2</li>" you can access them via fragment.children.
 *
 * @param {string} htmlString - a string of some HTML
 * @return {DocumentFragment} - DocumentFragment object containing HTML elements
 */
const PARSER = new DOMParser();

export function toHtmlElement(htmlString) {
    const doc = PARSER.parseFromString(htmlString, "text/html");
    const collection = doc.head.childElementCount
        ? doc.head.children
        : doc.body.children;
    const fragment = new DocumentFragment();

    fragment.replaceChildren(...collection);
    return fragment;
}

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
    })
}

function setUpButtons() {
    const buyButtons = document.querySelectorAll(".buy-button");
    const removeButtons = document.querySelectorAll(".remove-button");
    const minPriceInput = document.querySelector("#minPrice");
    const maxPriceInput = document.querySelector("#maxPrice");

    buyButtons.forEach(button => {
        button.addEventListener("click", () => {
            const buttonProductName = button.parentElement.parentElement.querySelector("h3").innerText;
            for (let product of PRODUCTS) {
                if (buttonProductName === product.name) {
                    product.numInCart++;

                    rerenderAllProducts();
                    rerenderCart();
                    setUpButtons();
                    break;
                }
            }
        })
    })

    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const buttonProductName = removeLastWord(button.previousElementSibling.innerText);
            for (let product of PRODUCTS) {
                if (buttonProductName === product.name) {
                    product.numInCart--;

                    rerenderAllProducts();
                    rerenderCart();
                    setUpButtons();
                    break;
                }
            }
        })
    })

    minPriceInput.addEventListener("change", () => {
        rerenderAllProducts();
    })

    maxPriceInput.addEventListener("change", () => {
        rerenderAllProducts();
    })
}

function removeLastWord(str) {
    var lastIndex = str.lastIndexOf(" ");
    return str.substring(0, lastIndex);
}

const minPriceInput = document.querySelector("#minPrice");
const maxPriceInput = document.querySelector("#maxPrice");
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
setUpButtons();
