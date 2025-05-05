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

const headerString = `
<header class="header-container-main">
    <div class="header-container-left">
        <h1 class="header-text-title">Erik Petrovich</h1>
        <nav class="nav-container-main">
            <a href="index.html">Home</a>
            <a href="profession.html">Profession</a>
            <a href="#">To Be Continued...</a>
        </nav>
    </div>
    <div class="header-container-right">
        <label class="dark-mode-checkbox">
            <input type="checkbox" autocomplete="off"/>
            Dark mode
        </label>
        <button class="menu-button">Menu</button>
    </div>
</header>
`

document.body.prepend(toHtmlElement(headerString).firstChild);

const header = document.querySelector("header");
const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".nav-container-main");

document.body.addEventListener("click", (e) => {
    if(!header.contains(e.target)){
        nav.setAttribute("style", "display: none");
    }
})

menuButton.addEventListener("click", (e) => {
    nav.setAttribute("style", "display: flex");
})

function checkScreenWidth(minWidth) {
    if (window.innerWidth > minWidth) {
        nav.setAttribute("style", "display: flex");
    }
    else {
        nav.setAttribute("style", "display: none");
    }
}

onresize = () => {
    checkScreenWidth(910);
}

const darkModeCheckbox = document.querySelector(".dark-mode-checkbox").firstElementChild;
darkModeCheckbox.addEventListener("change", (e) => {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("dark-mode", e.target.checked);
})

if (localStorage.getItem("dark-mode") === "true") {
    darkModeCheckbox.dispatchEvent(new Event("change"));
    darkModeCheckbox.checked = true;
}
