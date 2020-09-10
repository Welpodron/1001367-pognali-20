const filterCountries = document.querySelector("#filter-countries--js");
const filterDescription = filterCountries.querySelector("#filter-countries__description--js");
const filterButtonToggle = filterCountries.querySelector("#filter-countries__button-toggle--js");
const filterButtonClose = filterCountries.querySelector("#filter-countries__button-close--js");
const filterDropdown = filterCountries.querySelector("#filter-countries__dropdown--js");
const filterCountriesCatalog = filterCountries.querySelector("#filter-countries__catalog-regions--js");

const formFeatures = document.querySelector("#form-features--js");

const toggleButtonText = (expanded, button) => {
  !expanded ? (button.textContent = "Свернуть") : (button.textContent = "Показать все");
};

const toggleMenu = (button) => {
  let expanded = button.getAttribute("aria-expanded") === "true" || false;
  filterButtonToggle.setAttribute("aria-expanded", !expanded);
  filterButtonClose.setAttribute("aria-expanded", !expanded);
  filterButtonToggle.classList.toggle("filter-countries__button--toggle-active");
  toggleButtonText(expanded, filterButtonToggle);
  filterDescription.classList.toggle("filter-countries__description--active");
  filterCountriesCatalog.classList.toggle("filter-countries__catalog-regions--active");
  filterDropdown.classList.toggle("filter-countries__dropdown--active");
};

const handleClick = (evt) => {
  switch (evt.target) {
    case filterButtonToggle:
      toggleMenu(evt.target);
      break;
    case filterButtonClose:
      toggleMenu(evt.target);
      break;
    default:
      break;
  }
};

const formHandleClick = (evt) => {
  if (evt.target && evt.target.classList.contains("form-features__button--toggle")) {
    let button = evt.target;
    let expanded = button.getAttribute("aria-expanded") === "true" || false;
    button.setAttribute("aria-expanded", !expanded);
    button.classList.toggle("form-features__button--toggle-active");
    if (button.nextElementSibling) {
      let dropdown = button.nextElementSibling;
      dropdown.classList.toggle("form-features__fieldset--active");
    }
  }
};

filterCountries.addEventListener("click", handleClick);
formFeatures.addEventListener("click", formHandleClick);
