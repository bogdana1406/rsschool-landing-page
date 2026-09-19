const menuGrid = document.querySelector(".menu__grid");
const categoryButtons = document.querySelectorAll(".category-button");
const loadMoreButton = document.querySelector(".menu__load-more");
const productModal = document.querySelector(".product-modal");
const modalImage = productModal.querySelector(".product-modal__image");
const modalTitle = productModal.querySelector(".product-modal__title");
const modalDescription = productModal.querySelector(".product-modal__description");
const modalSizes = productModal.querySelector(".product-modal__sizes");
const modalAdditives = productModal.querySelector(".product-modal__additives");
const modalPrice = productModal.querySelector(".product-modal__price");
const modalCloseButton = productModal.querySelector(".product-modal__close");
let modalTrigger = null;
let selectedProduct = null;
let selectedSize = "s";
const selectedAdditives = new Set();

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

  card.tabIndex = 0;
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `Open details for ${product.name}`);

  image.src = getProductImagePath(product, index);
  image.alt = product.name;
  image.width = 340;
  image.height = 340;

  imageBox.append(image);
  content.append(title, description, price);
  card.append(imageBox, content);
  card.addEventListener("click", () => openProductModal(product, index, card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductModal(product, index, card);
    }
  });

  return card;
}

function getProductImagePath(product, index) {
  return `../assets/images/${product.category}-${index + 1}.jpg`;
}

function createSizeButton(sizeKey, sizeData) {
  const button = createElement("button", "product-option");
  const key = createElement("span", "product-option__key", sizeKey.toUpperCase());
  const label = createElement("span", "product-option__label", sizeData.size);
  const isSelected = sizeKey === selectedSize;

  button.type = "button";
  button.dataset.size = sizeKey;
  button.classList.toggle("product-option--active", isSelected);
  button.setAttribute("aria-pressed", String(isSelected));
  button.append(key, label);
  button.addEventListener("click", () => selectSize(sizeKey));

  return button;
}

function renderSizeOptions(product) {
  const sizeButtons = Object.entries(product.sizes).map(([sizeKey, sizeData]) =>
    createSizeButton(sizeKey, sizeData),
  );

  modalSizes.replaceChildren(...sizeButtons);
}

function selectSize(sizeKey) {
  selectedSize = sizeKey;

  modalSizes.querySelectorAll(".product-option").forEach((button) => {
    const isSelected = button.dataset.size === selectedSize;

    button.classList.toggle("product-option--active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });

  updateTotalPrice();
}

function createAdditiveButton(additive, index) {
  const button = createElement("button", "product-option");
  const key = createElement("span", "product-option__key", String(index + 1));
  const label = createElement("span", "product-option__label", additive.name);

  button.type = "button";
  button.dataset.additive = String(index);
  button.setAttribute("aria-pressed", "false");
  button.append(key, label);
  button.addEventListener("click", () => toggleAdditive(index, button));

  return button;
}

function renderAdditiveOptions(product) {
  const additiveButtons = product.additives.map(createAdditiveButton);

  modalAdditives.replaceChildren(...additiveButtons);
}

function toggleAdditive(index, button) {
  if (selectedAdditives.has(index)) {
    selectedAdditives.delete(index);
  } else {
    selectedAdditives.add(index);
  }

  const isSelected = selectedAdditives.has(index);
  button.classList.toggle("product-option--active", isSelected);
  button.setAttribute("aria-pressed", String(isSelected));
  updateTotalPrice();
}

function updateTotalPrice() {
  const basePrice = Number(selectedProduct.price);
  const sizePrice = Number(selectedProduct.sizes[selectedSize]["add-price"]);
  const additivesPrice = [...selectedAdditives].reduce(
    (total, index) => total + Number(selectedProduct.additives[index]["add-price"]),
    0,
  );

  modalPrice.textContent = `$${(basePrice + sizePrice + additivesPrice).toFixed(2)}`;
}

function openProductModal(product, index, trigger) {
  modalTrigger = trigger;
  selectedProduct = product;
  selectedSize = "s";
  selectedAdditives.clear();
  modalImage.src = getProductImagePath(product, index);
  modalImage.alt = product.name;
  modalTitle.textContent = product.name;
  modalDescription.textContent = product.description;
  renderSizeOptions(product);
  renderAdditiveOptions(product);
  updateTotalPrice();
  document.body.classList.add("modal-open");
  productModal.showModal();
}

function closeProductModal() {
  productModal.close();
}

function renderProducts(products, category) {
  const categoryProducts = products.filter((product) => product.category === category);
  const cards = categoryProducts.map(createProductCard);

  menuGrid.classList.remove("menu__grid--expanded");
  menuGrid.replaceChildren(...cards);
  loadMoreButton.hidden = categoryProducts.length <= 4;
  loadMoreButton.setAttribute("aria-expanded", "false");
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

function showAdditionalProducts() {
  menuGrid.classList.add("menu__grid--expanded");
  loadMoreButton.hidden = true;
  loadMoreButton.setAttribute("aria-expanded", "true");
}

modalCloseButton.addEventListener("click", closeProductModal);

productModal.addEventListener("click", (event) => {
  if (event.target === productModal) {
    closeProductModal();
  }
});

productModal.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  modalTrigger?.focus();
  modalTrigger = null;
});

async function loadProducts() {
  try {
    const response = await fetch("../data/products.json");

    if (!response.ok) {
      throw new Error(`Products request failed with status ${response.status}`);
    }

    const products = await response.json();
    renderProducts(products, "coffee");
    enableCategorySwitching(products);
    loadMoreButton.addEventListener("click", showAdditionalProducts);
  } catch (error) {
    menuGrid.textContent = "The menu could not be loaded. Please try again later.";
    console.error(error);
  }
}

loadProducts();
