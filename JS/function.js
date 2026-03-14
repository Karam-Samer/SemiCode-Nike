function changeColor(colorName) {
    let html = document.querySelector("html"),
        newColor = getComputedStyle(html).getPropertyValue(`--${colorName}`),
        currentName = colorName.split("-")[0],
        headEle = document.querySelector("head link[rel='shortcut icon']");

    html.style.setProperty("--main-color", newColor);
    changeMainImage(currentName, Logo, "logo");
    correctImgs.forEach(function (img) {
        changeMainImage(currentName, img, "correct");
    });

    changeMainImage(currentName, headEle, "logo");
}

function changeMainImage(imgName, imgEle, commonName) {
    if (imgEle == document.querySelector("head link[rel='shortcut icon']")) {
        let currentImgSrc = imgEle.href;
        imgEle.href = changeSrc(imgEle.href, `${imgName}-${commonName}.png`);
        return;
    }
    let currentImgSrc = imgEle.src;

    imgEle.src = changeSrc(imgEle.src, `${imgName}-${commonName}.png`);
}

function openPopup(popupName) {
    let popupEle = document.querySelector(`.popup[data-popup-name="${popupName}"]`);
    document.body.style.overflow = "hidden";
    popupEle.classList.add("active");
    setTimeout(function () {
        popupEle.classList.add("show");
    }, 100);
}

function closePopup() {
    let currentPopup = document.querySelector(".popup.active");
    currentPopup.classList.remove("show");
    setTimeout(function () {
        currentPopup.classList.remove("active");
        document.body.style.overflow = "auto";
    }, 1000);
}

function showListImgs(listImgs, status = false) {
    let imgsLi = ``;
    listImgs.forEach(function (productImg, index) {
        imgsLi += `
            <li class="${status ? '' : 'mainBorder'} 
            ${(index != listImgs.length - 1) ? 'me-2 me-md-0 mb-md-2' : ''}"
            onclick="changeSelectedImg(this,'${productImg}')">
                <img src="images/products/${productImg}" alt="" class="img-fluid">
            </li>
            `;
    });
    return imgsLi;
}

function showLiForImg(listImgs) {
    let imgsLi = ``;
    listImgs.forEach(function (productImg, index) {
        imgsLi += `
            <li onclick="changeSelectedImg(this,'${productImg}');changeActive(this)"
             class="mainButton 
             ${(index === 0) ? 'active' : ''}
             ${(index !== listImgs.length - 1) ? 'me-2' : ''}"></li>
            `
    });
    return imgsLi;
}

function showPrice(price, discount) {
    return `
    <p class="mb-0 fw-bold">
        ${(discount === 0) ? '' : `<span class="mainColor text-decoration-line-through">${price.toFixed(2)}<sup>$</sup></span>`}
        <span>${(price * (1 - discount)).toFixed(2)}<sup>$</sup></span>
    </p>`;
}

function showSize(sizes, status) {
    let sizeLi = ``;
    sizes.forEach(function (size, index) {
        if (status == undefined) {
            sizeLi += `
        <li
        onclick="changeActive(this); updateCartInsideLi(this,'size', '${size}')"
        class="mainButton
        ${(index === 0) ? 'active' : ''}
        ${(index != sizes.length - 1) ? 'me-2' : ''}">
            ${size}
        </li>
        `;
        } else {
            sizeLi += `
        <li
        onclick="changeActive(this); updateCartInsideLi(this,'size', '${size}')"
        class="mainButton
        ${(status.size == size) ? 'active' : ''}
        ${(index != sizes.length - 1) ? 'me-2' : ''}">
            ${size}
        </li>
        `;
        }
    });
    return sizeLi;
}

function showColor(colors, status) {
    let colorLi = ``;
    colors.forEach(function (color, index) {
        if (status == undefined) {
            colorLi += `
        <li
        style="background-color: ${color};"
        onclick="changeActive(this); updateCartInsideLi(this,'color', '${color}')"
        class="mainButton rounded-circle
        ${(index === 0) ? 'active' : ''}
        ${(index != colors.length - 1) ? 'me-2' : ''}">
        </li>
        `;
        } else {
            colorLi += `
        <li
        style="background-color: ${color};"
        onclick="changeActive(this); updateCartInsideLi(this,'color', '${color}')"
        class="mainButton rounded-circle
        ${(status.color == color) ? 'active' : ''}
        ${(index != colors.length - 1) ? 'me-2' : ''}">
        </li>
        `;
        }
    });
    return colorLi;
}

function changeSelectedImg(that, selectedImg) {
    let productEle = that.closest(".product"),
        selectedImgEle = productEle.querySelector(".selectedImg img"),
        selectedImgSrc = selectedImgEle.src;

    selectedImgEle.src = changeSrc(selectedImgEle.src, selectedImg);
}

function changeSrc(mainSrc, newImg) {
    let mainSrcArr = mainSrc.split("/");

    mainSrcArr[mainSrcArr.length - 1] = newImg;

    return mainSrcArr.join("/");
}

function changeActive(that) {
    that.parentElement.querySelector(".active").classList.remove("active");
    that.classList.add("active");
}

function getProduct(productId) {
    return products.find(product => product.id === productId);
}

function openProductPopup(productId) {
    let product = getProduct(productId),
        popupBoxEle = document.querySelector(".popup[data-popup-name='product'] .box"),
        isProductInCart = productCart.find(item => item.id === product.id),
        isProductInWishlist = wishlist.find(item => item.id === product.id);
    productState = isProductInCart || isProductInWishlist;

    popupBoxEle.innerHTML = `
    <div class="row product"
    data-product-id="${product.id}"
    data-product-color="${isProductInCart == undefined && isProductInWishlist == undefined ? product.colors[0] : isProductInCart == undefined ? isProductInWishlist.color : isProductInCart.color}"
    data-product-size="${isProductInCart == undefined && isProductInWishlist == undefined ? product.sizes[0] : isProductInCart == undefined ? isProductInWishlist.size : isProductInCart.size}">
        <div class="col-md-6">
          <div class="selectedImg">
            <img src="images/products/${product.images[0]}" alt="" class="img-fluid">
          </div>
          <ul class="list-unstyled d-flex">
            
            ${showListImgs(product.images, true)}
          </ul>
        </div>
        <div class="col-md-6">
          <h3 class="mb-3">${product.name}</h3>
          ${showPrice(product.price, product.discount)}
          <hr>
          <p>${product.description}</p>
            <div class="size d-flex align-items-center my-3">
               <div class="label me-2">
                    <h6 class="mb-0">Size :</h6>
                </div>
                <div class="value">
                    <ul class="list-unstyled d-flex mb-0">
                        ${showSize(product.sizes, productState)}
                    </ul>
                </div>
            </div>

            <div class="color d-flex align-items-center my-3">
               <div class="label me-2">
                    <h6 class="mb-0">Color :</h6>
                </div>
                <div class="value">
                    <ul class="list-unstyled d-flex mb-0">
                        ${showColor(product.colors, productState)}
                    </ul>
                </div>
            </div>

            <div class="buttons mt-4 d-flex align-items-start justify-content-start flex-column gap-2">
                ${buttonIfProductInCart(productCart.find(item => item.id === product.id), product.id)} 
                ${buttonIfProductInWishlist(wishlist.find(item => item.id === product.id), product.id)}
        </div>
        </div>
      </div>
    `;

    openPopup("product");
}

function addButton(btn, productId, list) {
    let product = getProduct(productId),
        productEle = document.querySelector(`.product[data-product-id='${productId}']`),
        newOrder = {
            id: productId,
            color: productEle.dataset.productColor,
            size: productEle.dataset.productSize,
        };



    if (list === 'cart') {
        productCart.push(newOrder);
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
                    ${showSize([newOrder.size])}
                </ul>
                </div>
            </div>
            <div class="color d-flex align-items-center my-3">
               <div class="label me-2">
                    <h6 class="mb-0">Color :</h6>
                </div>
                <div class="value">
                    <ul class="list-unstyled d-flex mb-0">
                        ${showColor([newOrder.color])}
                    </ul>
                </div>
            </div>
                <button class="btn btn-danger d-block w-100" onclick="removeFromPopup(this,'cart')">Remove</button>
              </div>
            </div>
          </div>`;
    } else if (list === 'wishlist') {
        wishlist.push(newOrder);
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
                    ${showSize([newOrder.size])}
                </ul>
                </div>
            </div>
            <div class="color d-flex align-items-center my-3">
               <div class="label me-2">
                    <h6 class="mb-0">Color :</h6>
                </div>
                <div class="value">
                    <ul class="list-unstyled d-flex mb-0">
                        ${showColor([newOrder.color])}
                    </ul>
                </div>
            </div>
                <button class="btn btn-danger d-block w-100" onclick="removeFromPopup(this,'wishlist')">Remove</button>
              </div>
            </div>
          </div>`;
    }
    if (btn != null) {
        toggleCartBtn(btn, 'add', list);
        btn.setAttribute("onclick", `removeButton(this, ${productId}, '${list}')`);
    }
    isShopOrWishPopupEmpty();
    updateLocalStorage();
    updateCountEles();
}

function removeButton(btn, productId, list) {
    let product = getProduct(productId),
        productEle = document.querySelector(`.product[data-product-id='${productId}']`);

    if (list === 'cart') {
        productCart = productCart.filter(product => product.id !== productId);
        let popupProductEle = popupCartBody.querySelector(`.product[data-product-id="${productId}"]`);
        if (popupProductEle) {
            popupProductEle.remove();
        }
    } else if (list === 'wishlist') {
        wishlist = wishlist.filter(product => product.id !== productId);
        let popupProductEle = popupWishlistBody.querySelector(`.product[data-product-id="${productId}"]`);
        if (popupProductEle) {
            popupProductEle.remove();
        }
    }

    updateLocalStorage();
    isShopOrWishPopupEmpty();
    toggleCartBtn(btn, 'remove', list);
    updateCountEles();
    btn.setAttribute("onclick", `addButton(this, ${productId}, '${list}')`);
}

function updateCartInsideLi(that, change, value) {
    let productEle = that.closest(".product"),
        productId = Number(productEle.dataset.productId);
    productEle.setAttribute(`data-product-${change}`, value);
    document.querySelectorAll(`#Featured .product[data-product-id="${productId}"]`).forEach(productEle => {
        productEle.setAttribute(`data-product-${change}`, value);
    });
}

function toggleCartBtn(that, status, list) {
    if (status === "add") {
        that.textContent = (list === 'cart') ? "Remove From Cart" : "Remove From Wishlist";
        that.classList.add("remove");
    } else {
        that.textContent = (list === 'cart') ? "Add To Cart" : "Add To Wishlist";
        that.classList.remove("remove");
    }
}

function updateLocalStorage() {
    localStorage.setItem("cart", JSON.stringify(productCart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}

function buttonIfProductInCart(status, productId) {
    if (status) {
        return `<button class="btn mainButton me-2 remove" onclick="removeButton(this, ${productId},'cart')">Remove From Cart</button>`;
    } else {
        return `<button class="btn mainButton me-2" onclick="addButton(this, ${productId}, 'cart')">Add To Cart</button>`;
    }
}

function buttonIfProductInWishlist(status, productId) {
    if (status) {
        return `<button class="btn mainButton remove" onclick="removeButton(this, ${productId}, 'wishlist')">Remove From Wishlist</button>`;
    }
    else {
        return `<button class="btn mainButton" onclick="addButton(this, ${productId}, 'wishlist')">Add To Wishlist</button>`;
    }
}

function isShopOrWishPopupEmpty() {
    if (productCart.length === 0) {
        popupCartBody.nextElementSibling.classList.add("d-none");
        popupCartBody.previousElementSibling.classList.remove("d-none");
    } else {
        popupCartBody.previousElementSibling.classList.add("d-none");
        popupCartBody.nextElementSibling.classList.remove("d-none");
    }
    if (wishlist.length === 0) {
        popupWishlistBody.nextElementSibling.classList.add("d-none");
        popupWishlistBody.previousElementSibling.classList.remove("d-none");
    } else {
        popupWishlistBody.previousElementSibling.classList.add("d-none");
        popupWishlistBody.nextElementSibling.classList.remove("d-none");
    }
}

function removeFromPopup(btn, list) {
    let productEle = btn.closest(".product"),
        productId = productEle.dataset.productId;

    if (list === 'cart') {
        productCart = productCart.filter(product => product.id != productId);
        popupCartBody.querySelector(`.product[data-product-id="${productId}"]`).remove();
    } else if (list === 'wishlist') {
        wishlist = wishlist.filter(product => product.id != productId);
        popupWishlistBody.querySelector(`.product[data-product-id="${productId}"]`).remove();
    }

    updateLocalStorage();
    isShopOrWishPopupEmpty();

}

function updateCountEles() {
    if (wishlist.length > 0) {
        wishlistCountEle.textContent = wishlist.length;
        wishlistCountEle.classList.remove("d-none");
    } else {
        wishlistCountEle.classList.add("d-none");
    }
    if (productCart.length > 0) {
        shopCountEle.textContent = productCart.length;
        shopCountEle.classList.remove("d-none");
    } else {
        shopCountEle.classList.add("d-none");
    }
}
