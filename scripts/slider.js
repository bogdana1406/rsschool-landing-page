"use strict";

const favoriteSlider = document.querySelector(".favorite");

if (favoriteSlider) {
  const slides = [...favoriteSlider.querySelectorAll(".favorite__slide")];
  const previousButton = favoriteSlider.querySelector(".slider-arrow--previous");
  const nextButton = favoriteSlider.querySelector(".slider-arrow--next");
  const pagination = favoriteSlider.querySelector(".favorite__pagination");
  const paginationButtons = [
    ...favoriteSlider.querySelectorAll(".favorite__pagination-item"),
  ];
  let currentSlide = 0;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;

      slide.classList.toggle("favorite__slide--active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    paginationButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === currentSlide;

      button.classList.toggle("favorite__pagination-item--active", isActive);

      if (isActive) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    pagination?.setAttribute("aria-label", `Slide ${currentSlide + 1} of ${slides.length}`);
  }

  previousButton?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  nextButton?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  paginationButtons.forEach((button, buttonIndex) => {
    button.addEventListener("click", () => {
      showSlide(buttonIndex);
    });
  });

  showSlide(currentSlide);
}
