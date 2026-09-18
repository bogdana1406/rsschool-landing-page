const menuGrid = document.querySelector(".menu__grid");
const categoryButtons = document.querySelectorAll(".category-button");
const loadMoreButton = document.querySelector(".menu__load-more");

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
  loadMoreButton.hidden = categoryProducts.length <= 4;
}

function selectCategory(products, selectedButton) {
  categoryButtons.forEach((button) => {
    const isActive = button === selectedButton;

    button.classList.toggle("category-button--active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts(products, selectedButton.dataset.category);
}

function enableCategorySwitching(products) {
  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => selectCategory(products, button));
  });
}

async function loadProducts() {
  try {
    const response = await fetch("../data/products.json");

    if (!response.ok) {
      throw new Error(`Products request failed with status ${response.status}`);
    }

    const products = await response.json();
    renderProducts(products, "coffee");
    enableCategorySwitching(products);
  } catch (error) {
    menuGrid.textContent = "The menu could not be loaded. Please try again later.";
    console.error(error);
  }
}

loadProducts();
