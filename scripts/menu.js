const menuGrid = document.querySelector(".menu__grid");

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (textContent) {
    element.textContent = textContent;
  }

  return element;
}

function createProductCard(product, index) {
  const card = createElement("article", "product-card");
  const imageBox = createElement("div", "product-card__image-box");
  const image = createElement("img", "product-card__image");
  const content = createElement("div", "product-card__content");
  const title = createElement("h2", "product-card__title", product.name);
  const description = createElement("p", "product-card__description", product.description);
  const price = createElement("p", "product-card__price", `$${product.price}`);

  if (index >= 4) {
    card.classList.add("product-card--additional");
  }

  image.src = `../assets/images/${product.category}-${index + 1}.jpg`;
  image.alt = product.name;
  image.width = 340;
  image.height = 340;

  imageBox.append(image);
  content.append(title, description, price);
  card.append(imageBox, content);

  return card;
}

function renderProducts(products, category) {
  const categoryProducts = products.filter((product) => product.category === category);
  const cards = categoryProducts.map(createProductCard);

  menuGrid.replaceChildren(...cards);
}

async function loadProducts() {
  try {
    const response = await fetch("../data/products.json");

    if (!response.ok) {
      throw new Error(`Products request failed with status ${response.status}`);
    }

    const products = await response.json();
    renderProducts(products, "coffee");
  } catch (error) {
    menuGrid.textContent = "The menu could not be loaded. Please try again later.";
    console.error(error);
  }
}

loadProducts();
