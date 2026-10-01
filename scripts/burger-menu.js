"use strict";

const MOBILE_MENU_QUERY = "(max-width: 768px)";
const page = document.body;
const burgerButton = document.querySelector(".burger");
const navigation = document.querySelector(".header__nav");

if (burgerButton && navigation) {
  const mobileMenuMedia = window.matchMedia(MOBILE_MENU_QUERY);
  const navigationLinks = navigation.querySelectorAll("a");

  function isMenuOpen() {
    return page.classList.contains("menu-open");
  }

  function setMenuState(open, returnFocus = false) {
    const shouldOpen = open && mobileMenuMedia.matches;

    page.classList.toggle("menu-open", shouldOpen);
    burgerButton.classList.toggle("burger--active", shouldOpen);
    burgerButton.setAttribute("aria-expanded", String(shouldOpen));
    burgerButton.setAttribute("aria-label", shouldOpen ? "Close menu" : "Open menu");
    navigation.inert = mobileMenuMedia.matches && !shouldOpen;

    if (!shouldOpen && returnFocus) {
      burgerButton.focus();
    }
  }

  burgerButton.addEventListener("click", () => {
    setMenuState(!isMenuOpen());
  });

  burgerButton.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !event.shiftKey && isMenuOpen()) {
      event.preventDefault();
      navigationLinks[0]?.focus();
    }
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setMenuState(false);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isMenuOpen()) {
      setMenuState(false, true);
    }
  });

  mobileMenuMedia.addEventListener("change", () => {
    setMenuState(false);
  });

  setMenuState(false);
}
