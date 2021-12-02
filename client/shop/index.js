const PRODUCT_TEMPLATE = ` <div class="product-container {product-brand}-product">
<img
    src="{product-img}"
    alt=""
/>
<div class="product-details">
    <p class="title">{product-title}</p>
    <p class="price">{product-price}</p>
</div>
<button>Buy Now</button>
</div>`;

/* Fetch Products */
fetch("http://localhost:5100/products/")
    .then((res) => res.json())
    .then((products) => {
        products.forEach((product) => {
            let productsContainer = document.querySelector(".products");

            productsContainer.innerHTML += PRODUCT_TEMPLATE.replace(
                "{product-brand}",
                product.brand
            )
                .replace("{product-img}", product.image)
                .replace("{product-title}", product.name)
                .replace("{product-price}", product.price);
        });
    });
