
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
function getCart() {
    try {
        const cart = JSON.parse(localStorage.getItem("cart"));
        if (Array.isArray(cart)) {
            return cart;
        }
        return [];
    } catch (error) {
        return [];
    }
}
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}
// ADD PRODUCT TO CART
function addProductToCart(product) {
    if (!product) {
        return;
    }
    let cart = getCart();
    const productId = Number(product.id);
    const existingProduct = cart.find(function (item) {
        return Number(item.id) === productId;
    });
    if (existingProduct) {
        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;
    } else {
        cart.push({
            id: productId,
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
// UPDATE CART QUANTITY
function updateCartQuantity(productId, quantity) {
    let cart = getCart();
    const id = Number(productId);
    const product = cart.find(function (item) {
        return Number(item.id) === id;
    });
    if (!product) {
        return;
    }
    quantity = Number(quantity);
    if (quantity <= 0) {
        removeProductFromCart(id);
        return;
    }
    product.quantity = quantity;
    saveCart(cart);
    updateBadges();
}
// REMOVE PRODUCT FROM CART
function removeProductFromCart(productId) {
    const id = Number(productId);
    let cart = getCart();
    cart = cart.filter(function (item) {
        return Number(item.id) !== id;
    });

    saveCart(cart);

    updateBadges();
}


// CLEAR CART
function clearCart() {

    localStorage.removeItem("cart");

    updateBadges();
}
function getWishlist() {

    try {

        const wishlist =
            JSON.parse(localStorage.getItem("wishlist"));

        if (Array.isArray(wishlist)) {
            return wishlist;
        }

        return [];

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
function isProductWishlisted(productId) {
    const id = Number(productId);
    const wishlist = getWishlist();
    return wishlist.some(function (item) {
        return Number(item.id) === id;
    });
}
function toggleWishlist(product) {

    if (!product) {
        return false;
    }
    let wishlist = getWishlist();
    const productId = Number(product.id);
    const existingIndex = wishlist.findIndex(function (item) {
        return Number(item.id) === productId;
    });
    if (existingIndex !== -1) {
        wishlist.splice(existingIndex, 1);
        saveWishlist(wishlist);
        updateBadges();
        return false;
    }
    wishlist.push({
        id: productId,
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
// REMOVE FROM WISHLIST (FIXED)
function removeFromWishlist(productId) {
    let wishlist = getWishlist();
    const id = Number(productId); // Ensure target ID is a Number

    // Filter out items matching the target ID (converting both to Numbers to prevent string/number bugs)
    wishlist = wishlist.filter(function (item) {
        return Number(item.id) !== id;
    });

    // Save using saveWishlist helper so localStorage updates correctly
    saveWishlist(wishlist);
    
    // Update header badges
    updateBadges();
}
// CLEAR WISHLIST
function clearWishlist() {

    localStorage.removeItem("wishlist");

    updateBadges();
}
// GET PRODUCT BY ID
function getProductById(id) {
    const productId = Number(id);
    return products.find(function (product) {
        return Number(product.id) === productId;
    });
}
function updateBadges() {
    const cartBadge =
        document.getElementById("cart-badge");
    const wishlistBadge =
        document.getElementById("wishlist-badge");
    // CART BADGE
    if (cartBadge) {
        const cart = getCart();
        const totalQuantity =
            cart.reduce(function (total, item) {
                return total +
                    Number(item.quantity || 1);
            }, 0);
        cartBadge.textContent = totalQuantity;
    }
    // WISHLIST BADGE
    if (wishlistBadge) {
        const wishlist = getWishlist();
        wishlistBadge.textContent =
            wishlist.length;
    }


  }
document.addEventListener(
    "DOMContentLoaded",
    function () {
        updateBadges();

    }
);