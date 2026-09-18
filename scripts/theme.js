"use strict";

const THEME_STORAGE_KEY = "coffee-house-theme";
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return savedTheme === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  const isDarkTheme = theme === "dark";

  root.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(isDarkTheme));
  themeToggle?.setAttribute(
    "aria-label",
    isDarkTheme ? "Switch to light theme" : "Switch to dark theme",
  );
}

applyTheme(getSavedTheme());

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
});
