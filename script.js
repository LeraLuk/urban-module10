const productsContainer = document.getElementById("products");
const loadMoreButton = document.getElementById("loadMore");
const categorySelect = document.getElementById("category");
const categorySelectAdd = document.getElementById("categorySelect");

let products = [];
let categories = [];

// Fetch all categories
fetch("https://fakestoreapi.com/products/categories")
  .then((response) => response.json())
  .then((data) => {
    categories = data;
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.add(option);
      const addCategoryOption = document.createElement("option");
      addCategoryOption.value = category;
      addCategoryOption.textContent = category;
      categorySelectAdd.add(addCategoryOption);
    });
  })
  .catch((error) => {
    alert("An error occurred while fetching categories.");
  });

// Fetch initial products
fetchProducts();

function fetchProducts() {
  fetch("https://fakestoreapi.com/products")
    .then((response) => response.json())
    .then((data) => {
      products = data;
      renderProducts(products.slice(0, 6));
    })
    .catch((error) => {
      alert("An error occurred while fetching products.");
    });
}

function renderProducts(productsArray) {
  productsContainer.innerHTML = "";
  productsArray.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <img src=${product.image} >
            <h3>${product.title}</h3>
            <p>$${product.price}</p>
            <div class="description"><p>${product.description}</p></div>
            <p>Category: ${product.category}</p>
            <button onclick="deleteProduct(${product.id})">Delete Product</button>
        `;
    productsContainer.appendChild(card);
  });
}

function filterProducts() {
  const selectedCategory = categorySelect.value;
  if (selectedCategory === "") {
    renderProducts(products.slice(0, 6));
  } else {
    const filteredProducts = products.filter(
      (product) => product.category === selectedCategory
    );
    renderProducts(filteredProducts);
  }
}

function loadMoreProducts() {
  const currentProducts = productsContainer.querySelectorAll(".card").length;
  renderProducts(products.slice(currentProducts, currentProducts + 6));
}

function addProduct(event) {
  event.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;
  const description = document.getElementById("description").value;
  const category = categorySelectAdd.value;

  try {
    fetch("https://fakestoreapi.com/products", {
      method: "POST",
      body: JSON.stringify({
        title: name,
        price: price,
        description: description,
        category: category,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Product added successfully!");
        fetchProducts();
      })
      .catch((error) => {
        alert("An error occurred while adding the product.");
      });
  } catch (error) {
    alert("An error occurred while adding the product.");
  }
}

function deleteProduct(productId) {
  try {
    fetch(`https://fakestoreapi.com/products/${productId}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Product deleted successfully!");
        fetchProducts();
      })
      .catch((error) => {
        alert("An error occurred while deleting the product.");
      });
  } catch (error) {
    alert("An error occurred while deleting the product.");
  }
}
