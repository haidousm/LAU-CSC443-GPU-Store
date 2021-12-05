const API_ROOT = "";
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
<button data-id={product-id} class="add-to-cart-button">Buy Now</button>
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
    fetch(
        "https://api.polygon.io/v2/aggs/ticker/AMD/prev?adjusted=true&apiKey=1NiCvEGX5Wu5IswOIbGvex_42Narnqpy"
    )
        .then((res) => res.json())
        .then((data) => {
            document.querySelector(".amd-stock .stock-price").innerHTML =
                "$" + data.results[0].h;
        });
    setInterval(() => {
        fetch(
            "https://api.polygon.io/v2/aggs/ticker/AMD/prev?adjusted=true&apiKey=1NiCvEGX5Wu5IswOIbGvex_42Narnqpy"
        )
            .then((res) => res.json())
            .then((data) => {
                document.querySelector(".amd-stock .stock-price").innerHTML =
                    "$" + data.results[0].h;
            });
    }, 60000);

    fetch(
        "https://api.polygon.io/v2/aggs/ticker/NVDA/prev?adjusted=true&apiKey=1NiCvEGX5Wu5IswOIbGvex_42Narnqpy"
    )
        .then((res) => res.json())
        .then((data) => {
            document.querySelector(".nvidia-stock .stock-price").innerHTML =
                "$" + data.results[0].h;
        });
    setInterval(() => {
        fetch(
            "https://api.polygon.io/v2/aggs/ticker/NVDA/prev?adjusted=true&apiKey=1NiCvEGX5Wu5IswOIbGvex_42Narnqpy"
        )
            .then((res) => res.json())
            .then((data) => {
                document.querySelector(".nvidia-stock .stock-price").innerHTML =
                    "$" + data.results[0].h;
            });
    }, 60000);

    const products = await fetchProducts();
    renderProducts(products);

    // const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    // addToCartButtons.forEach((button) => {
    //     button.addEventListener("click", async () => {
    //         const productId = button.getAttribute("data-id");
    //         const url = `/cart/${productId}`;
    //         const response = await fetch(url, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //         });
    //         const data = await response.json();
    //         if (data.success) {
    //             alert("Product added to cart!");
    //         } else {
    //             alert("Something went wrong!");
    //         }
    //     });
    // });
};
