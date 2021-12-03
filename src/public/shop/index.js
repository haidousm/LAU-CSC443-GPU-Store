const API_ROOT = "http://localhost:3000";
const PRODUCTS_API = `${API_ROOT}/products`;

const PRODUCT_TEMPLATE = ` <div class="product-container {product-brand}-product" onclick="window.location.href='${PRODUCTS_API}/{product-id}'">
<img
    src="{product-img}"
    alt=""
/>
<div class="product-details">
    <p class="title">{product-title}</p>
    <p class="price">\${product-price}</p>
</div>
<button>Buy Now</button>
</div>`;

const productsContainer = document.querySelector(".products");

const brandFilters = { amd: false, nvidia: false };

const fetchProducts = async () => {
    const products = await (await fetch(PRODUCTS_API)).json();
    return products;
};

const fetchProductsByBrands = async () => {
    const products = [];
    for (const brand in brandFilters) {
        if (brandFilters[brand]) {
            products.push(
                ...(await (
                    await fetch(`${PRODUCTS_API}/brand/${brand.toUpperCase()}`)
                ).json())
            );
        }
    }
    return products;
};

const renderProducts = (products) => {
    productsContainer.innerHTML = "";

    products.forEach((product) => {
        products.innerHTML = "";
        productsContainer.innerHTML += PRODUCT_TEMPLATE.replace(
            "{product-brand}",
            product.brand.name.toLowerCase()
        )
            .replace("{product-id}", product.id)
            .replace("{product-img}", product.image)
            .replace("{product-title}", product.name)
            .replace("{product-price}", product.price);
    });
};

const filterByBrand = async (event) => {
    brandFilters[event.target.id] = event.target.checked;
    if (Object.values(brandFilters).every((value) => value === false)) {
        renderProducts(await fetchProducts());
    } else {
        renderProducts(await fetchProductsByBrands());
    }
};

window.onload = async () => {
    const products = await fetchProducts();
    renderProducts(products);
};
