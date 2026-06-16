async function loadProducts() {
  const { data, error } = await supabase
    .from("products")
    .select("*");

  if (error) {
    console.error("Error loading products:", error);
    return;
  }

  const container = document.getElementById("products-container");
  container.innerHTML = "";

  data.forEach(product => {
    const card = document.createElement("div");

    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image_urls?.[0] || ''}" />
      <h3>${product.name}</h3>
      <p>KES ${product.price}</p>
      <button onclick="addToCart('${product.id}')">
        Add to Cart
      </button>
    `;

    container.appendChild(card);
  });
}

loadProducts();