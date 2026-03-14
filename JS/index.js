let carousel = document.querySelector("header #ks-carousel"),
    nextBtn = carousel.querySelector("button.next"),
    prevBtn = carousel.querySelector("button.prev"),
    mySliders = carousel.querySelectorAll(".ks-carousel-item"),
    navEle = document.querySelector("nav"),
    heightOfNav = navEle.clientHeight,
    searchEle = document.querySelector("nav form"),
    correctImgs = document.querySelectorAll("section .title img"),
    navLinks = document.querySelectorAll("nav .nav-link"),
    loadingPage = document.querySelector("#LoadingPage"),
    popupBoxes = document.querySelectorAll(".popup .box"),
    latestContentEle = document.querySelector("#Latest .content"),
    featuresContentEle = document.querySelector("#Featured .content .row"),
    popupCartBody = document.querySelector(".popup[data-popup-name='shop'] .box .body .row"),
    popupWishlistBody = document.querySelector(".popup[data-popup-name='wish'] .box .body .row"),
    productCart = [],
    wishlist = [];

if (localStorage.getItem("cart") == null) {
    updateLocalStorage();
} else {
    productCart = JSON.parse(localStorage.getItem("cart")) || [];
    wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
}

isShopOrWishPopupEmpty();


window.addEventListener("DOMContentLoaded", function () {
    mySliders[0].classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(function () {
        loadingPage.classList.add("hide");
        document.body.style.overflow = "auto";
    }, 1);
});

window.addEventListener("scroll", function () {
    if (window.scrollY > heightOfNav / 2) {
        navEle.classList.add("scrolled");
    } else {
        navEle.classList.remove("scrolled");
    }

    navLinks.forEach(function (navLink) {
        let sectionEle = document.querySelector(navLink.getAttribute("href")),
            topOfSection = sectionEle.offsetTop - heightOfNav,
            bottomOfSection = topOfSection + sectionEle.offsetHeight;
        if (window.scrollY >= topOfSection && window.scrollY < bottomOfSection) {
            document.querySelector("nav .nav-link.active").classList.remove("active");
            navLink.classList.add("active");
        }
    });
});

nextBtn.addEventListener("click", function () {
    let currentSlider = carousel.querySelector(".ks-carousel-item.active"),
        nextSlider = currentSlider.nextElementSibling ?? carousel.querySelector(".ks-carousel-item:first-child"),
        currentColorName = nextSlider.dataset.colorName;
    currentSlider.classList.remove("active");
    nextSlider.classList.add("active");
    changeColor(currentColorName);
});

prevBtn.addEventListener("click", function () {
    let currentSlider = carousel.querySelector(".ks-carousel-item.active"),
        prevSlider = currentSlider.previousElementSibling ?? carousel.querySelector(".ks-carousel-item:last-child"),
        currentColorName = prevSlider.dataset.colorName;
    currentSlider.classList.remove("active");
    prevSlider.classList.add("active");
    changeColor(currentColorName);
});

navLinks.forEach(function (navLink) {
    navLink.addEventListener("click", function (e) {
        e.preventDefault();
        let oldLink = document.querySelector("nav .nav-link.active"),
            sectionEle = document.querySelector(navLink.getAttribute("href")),
            topOfSection = sectionEle.offsetTop - heightOfNav;

        oldLink.classList.remove("active");
        navLink.classList.add("active");

        window.scrollTo({
            top: topOfSection
        });

    });
});

popupBoxes.forEach(function (box) {
    box.addEventListener("click", function (e) {
        e.stopPropagation();
    });
});

latest.forEach(function (product) {
    let isProductInCart = productCart.find(item => item.id === product.id),
        isProductInWishlist = wishlist.find(item => item.id === product.id),
        productState = isProductInCart || isProductInWishlist;

    latestContentEle.innerHTML += `
    <div class="product p-4 rounded-4 mainBorder mb-3" data-product-id="${product.id}" 
    data-product-color="${productState ? productState.color : product.colors[0]}"
    data-product-size="${productState ? productState.size : product.sizes[0]}"
    >
        <div class="row">
        <div class="col-lg-6 mb-md-4 mb-lg-0 part1">
            <div class="item">
            <div class="row">
                <div class="col-md-2 col-lg-2">
                <div class="item">
                    <ul class="list-unstyled mb-0">
                        ${showListImgs(product.images)}
                    </ul>
                </div>
                </div>
                <div class="col-md-10 col-lg-10">
                <div class="item d-flex align-items-center justify-content-center h-100">
                    <div class="selectedImg">
                    <img src="images/products/${product.images[0]}" alt="" class="img-fluid">
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div class="col-lg-6 part2">
            <div class="item">
            <h3 class="mainColor">${product.name}</h3>
            <p>${product.description}</p>
            <div class="price d-flex align-items-center">
                <div class="label me-2">
                <h6 class="mb-0">Price :</h6>
                </div>
                <div class="value">
                    ${showPrice(product.price, product.discount)}
                </div>
            </div>
            <div class="size d-flex align-items-center">
                <div class="label me-2">
                <h6 class="mb-0">Size :</h6>
                </div>
                <div class="value">
                <ul class="list-unstyled d-flex mb-0">
                    ${showSize(product.sizes, productState)}
                </ul>
                </div>
                
            </div>
            
            <div class="buttons mt-4">
                ${buttonIfProductInCart(isProductInCart, product.id)} 
                ${buttonIfProductInWishlist(isProductInWishlist, product.id)}
            </div>
            </div>
        </div>
        </div>
    </div>`;
});

features.forEach(function (product) {
    let isProductInCart = productCart.find(item => item.id === product.id),
        isProductInWishlist = wishlist.find(item => item.id === product.id),
        productState = isProductInCart || isProductInWishlist;
    featuresContentEle.innerHTML += `
    <div class="col-sm-6 col-lg-3 mb-3 product text-center"
    data-product-id="${product.id}"
    data-product-color="${productState ? productState.color : product.colors[0]}"
    data-product-size="${productState ? productState.size : product.sizes[0]}"
    >
        <div class="item p-3 rounded-3">
        ${product.discount == 0 ? '' : `<p class="offer">${(product.discount * 100)}%</p>`}
        <div class="head pb-5">
        <p class="text-appended bg-primary rounded-5">Double Click To add to wishlist</p>
        <div class="selectedImg">
                <img src="images/products/${product.images[0]}" alt="" class="img-fluid">
            </div>
            <i onclick="openProductPopup(${product.id})" class="fa-solid fa-magnifying-glass rounded-circle"></i>
            <ul class="list-unstyled">
                ${showLiForImg(product.images)}
            </ul>
            </div>
            <div class="body">
            <h6>${product.name}</h6>
            <div class="value">
                ${showPrice(product.price, product.discount)}
            </div>
            </div>
        </div>
        </div>
    `
});

productCart.forEach(function (cartProduct) {
    let product = getProduct(cartProduct.id);
    popupCartBody.innerHTML += `
    <div class="col-sm-6 col-md-4 product mb-3" data-product-id="${product.id}">
            <div class="content">
              <div class="head"><img src="images/products/${product.images[0]}" alt="" class="img-fluid"></div>
              <div class="body">
                <h5>${product.name}</h5>
                <div class="price d-flex align-items-center my-3">
                    <div class="label me-2">
                    <h6 class="mb-0">Price :</h6>
                    </div>
                    <div class="value">
                        ${showPrice(product.price, product.discount)}
                    </div>
                 </div>
                 <div class="size d-flex align-items-center my-3">
                <div class="label me-2">
                <h6 class="mb-0">Size :</h6>
                </div>
                <div class="value">
                <ul class="list-unstyled d-flex mb-0">
                    ${showSize([cartProduct.size])}
                </ul>
                </div>
            </div>
            <div class="color d-flex align-items-center my-3">
               <div class="label me-2">
                    <h6 class="mb-0">Color :</h6>
                </div>
                <div class="value">
                    <ul class="list-unstyled d-flex mb-0">
                        ${showColor([cartProduct.color])}
                    </ul>
                </div>
            </div>
                <button class="btn btn-danger d-block w-100" onclick="removeFromPopup(this,'cart')">Remove</button>
              </div>
            </div>
          </div>`;
});

wishlist.forEach(function (wishProduct) {
    let product = getProduct(wishProduct.id);
    popupWishlistBody.innerHTML += `
    <div class="col-sm-6 col-md-4 product mb-3" data-product-id="${product.id}">
            <div class="content">
              <div class="head"><img src="images/products/${product.images[0]}" alt="" class="img-fluid"></div>
              <div class="body">
                <h5>${product.name}</h5>
                <div class="price d-flex align-items-center my-3">
                    <div class="label me-2">
                    <h6 class="mb-0">Price :</h6>
                    </div>
                    <div class="value">
                        ${showPrice(product.price, product.discount)}
                    </div>
                 </div>
                 <div class="size d-flex align-items-center my-3">
                <div class="label me-2">
                <h6 class="mb-0">Size :</h6>
                </div>
                <div class="value">
                <ul class="list-unstyled d-flex mb-0">
                    ${showSize([wishProduct.size])}
                </ul>
                </div>
            </div>
            <div class="color d-flex align-items-center my-3">
               <div class="label me-2">
                    <h6 class="mb-0">Color :</h6>
                </div>
                <div class="value">
                    <ul class="list-unstyled d-flex mb-0">
                        ${showColor([wishProduct.color])}
                    </ul>
                </div>
            </div>
                <button class="btn btn-danger d-block w-100" onclick="removeFromPopup(this,'wishlist')">Remove</button>
              </div>
            </div>
          </div>`;
});

searchEle.addEventListener("submit", function (e) {
    e.preventDefault();
    let searchInput = searchEle.querySelector("input").value.trim().toLowerCase();
    if (searchInput == "") return;
    let foundProduct = products.find(function (product) {
        return product.name.toLowerCase().includes(searchInput);
    });

    if (!foundProduct) {
        alert("No product found with this name");
        return;
    }

    let product = document.querySelector(`.product[data-product-id="${foundProduct.id}"]`);
    if (!product) {
        alert("Product found but not rendered on page");
        return;
    }
    window.scrollTo({
        top: product.offsetTop - heightOfNav
    });
    console.log(product.children[0]);
    product.children[0].classList.add("bg-success", "bg-opacity-10");
    setTimeout(function () {
        product.children[0].classList.remove("bg-success", "bg-opacity-10")
    }, 2000);
});


let featuresProducts = featuresContentEle.querySelectorAll(".product");
featuresProducts.forEach(function (product) {
    product.addEventListener("dblclick", function (e) {
        let productId = Number(product.dataset.productId);

        if (wishlist.find(item => item.id === productId)) {
            return;
        }

        addButton(null, productId, "wishlist");
        updateLocalStorage();
        isShopOrWishPopupEmpty();

        product.children[0].classList.add("bg-danger", "bg-opacity-10");
        setTimeout(function () {
            product.children[0].classList.remove("bg-danger", "bg-opacity-10");
        }, 900);
    });
});