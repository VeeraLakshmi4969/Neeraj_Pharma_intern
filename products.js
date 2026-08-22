
// NEERAJ PHARMA - PRODUCT DATA


const products = [
    {
        id: 1,
        name: "Dolo 650 Tablet",
        company: "Micro Labs Ltd.",
        price: 35,
        image: "dolo.jpeg",
        description:
            "Dolo 650 Tablet is commonly used for temporary relief from fever and mild to moderate pain. Use medicines only according to appropriate medical advice."
    },

    {
        id: 2,
        name: "Vitamin C Tablets",
        company: "HealthKart",
        price: 250,
        image: "vitamin c.jpeg",
        description:
            "Vitamin C Tablets are a dietary supplement that supports normal immune function and overall health."
    },

    {
        id: 3,
        name: "Foracort 200 Rotacaps",
        company: "Cipla Ltd.",
        price: 185,
        image: "foracort.webp",
        description:
            "Foracort 200 Rotacaps are prescribed for the management of certain respiratory conditions. Use only as directed by a healthcare professional."
    },

    {
        id: 4,
        name: "Pantocid 40mg Tablet",
        company: "Sun Pharmaceutical Industries Ltd.",
        price: 165,
        image: "PANTOCID-40.jpg",
        description:
            "Pantocid 40mg Tablet is used as prescribed for conditions related to excess stomach acid."
    },

    {
        id: 5,
        name: "Volini Pain Relief Spray",
        company: "Sun Pharma Consumer Healthcare",
        price: 245,
        image: "VOLINI.webp",
        description:
            "Volini Pain Relief Spray is a topical product used for temporary relief from muscle and joint pain."
    },

    {
        id: 6,
        name: "Revital H",
        company: "Sun Pharma Consumer Healthcare",
        price: 310,
        image: "REVITAL.jpeg",
        description:
            "Revital H is a daily health supplement containing vitamins and minerals."
    }
];


// ======================================================
// CART FUNCTIONS
// ======================================================

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem("cart")
        );

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}


function saveCart(cart) {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


function addProductToCart(product) {

    if (!product) {
        return;
    }

    const cart = getCart();

    const existingProduct = cart.find(
        item =>
            Number(item.id) === Number(product.id)
    );

    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            company: product.company,
            price: Number(product.price),
            image: product.image,
            quantity: 1
        });
    }

    saveCart(cart);

    updateBadges();
}


function removeProductFromCart(productId) {

    let cart = getCart();

    cart = cart.filter(
        item =>
            Number(item.id) !== Number(productId)
    );

    saveCart(cart);

    updateBadges();
}


function updateCartQuantity(productId, quantity) {

    const cart = getCart();

    const product = cart.find(
        item =>
            Number(item.id) === Number(productId)
    );

    if (!product) {
        return;
    }

    quantity = Number(quantity);

    if (quantity < 1) {

        removeProductFromCart(productId);

        return;
    }

    product.quantity = quantity;

    saveCart(cart);

    updateBadges();
}


function clearCart() {

    localStorage.removeItem("cart");

    updateBadges();
}


// ======================================================
// WISHLIST FUNCTIONS
// ======================================================

function getWishlist() {

    try {

        const wishlist = JSON.parse(
            localStorage.getItem("wishlist")
        );

        return Array.isArray(wishlist)
            ? wishlist
            : [];

    } catch (error) {

        return [];
    }
}


function saveWishlist(wishlist) {

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );
}


// ======================================================
// TOGGLE WISHLIST
// ======================================================

function toggleWishlist(product) {

    if (!product) {
        return false;
    }

    let wishlist = getWishlist();

    const existingIndex =
        wishlist.findIndex(
            item =>
                Number(item.id) ===
                Number(product.id)
        );


    // Remove if already present

    if (existingIndex !== -1) {

        wishlist.splice(
            existingIndex,
            1
        );

        saveWishlist(wishlist);

        updateBadges();

        return false;
    }


    // Add product

    wishlist.push({

        id: product.id,

        name: product.name,

        company: product.company,

        price: Number(product.price),

        image: product.image,

        quantity: 1

    });


    saveWishlist(wishlist);

    updateBadges();

    return true;
}


// ======================================================
// REMOVE FROM WISHLIST
// ======================================================

function removeFromWishlist(productId) {

    let wishlist = getWishlist();

    wishlist = wishlist.filter(
        item =>
            Number(item.id) !==
            Number(productId)
    );

    saveWishlist(wishlist);

    updateBadges();
}


// ======================================================
// CHECK WISHLIST
// ======================================================

function isProductWishlisted(productId) {

    const wishlist = getWishlist();

    return wishlist.some(
        item =>
            Number(item.id) ===
            Number(productId)
    );
}


// ======================================================
// NAVIGATION BADGES
// ======================================================

function updateBadges() {

    const cartBadge =
        document.getElementById(
            "cart-badge"
        );

    const wishlistBadge =
        document.getElementById(
            "wishlist-badge"
        );


    // Cart badge

    if (cartBadge) {

        const cart = getCart();

        const totalQuantity =
            cart.reduce(
                (total, item) =>
                    total +
                    Number(
                        item.quantity || 1
                    ),
                0
            );

        cartBadge.textContent =
            totalQuantity;
    }


    // Wishlist badge

    if (wishlistBadge) {

        wishlistBadge.textContent =
            getWishlist().length;
    }
}


// ======================================================
// FIND PRODUCT
// ======================================================

function getProductById(id) {

    return products.find(
        product =>
            Number(product.id) ===
            Number(id)
    );
}


// ======================================================
// INITIALIZE BADGES
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateBadges();

    }
);