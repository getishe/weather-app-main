// Document.loaded = function () {
let toggled = document.querySelector("#toggle-units");
let dropdown = document.querySelector(".dropdown-menu");
let selectedDay = document.querySelector(".selected-day");
let optionsList = document.querySelector("ul.options-list");
toggled.addEventListener("click", function (event) {
  event.preventDefault();
  if (dropdown.style.display == "none") {
    dropdown.style.display = "block";
    event.stopPropagation();
    //Prevent body click from firing
  } else {
    dropdown.style.display = "none";
    event.stopPropagation();
  }
});

toggled.addEventListener("click", function (event) {
  event.preventDefault();
  if (dropdown.style.display == "block") {
    optionsList.style.display = "none";
    event.stopPropagation();
  }
});
selectedDay.addEventListener("click", function (event) {
  event.preventDefault();
  if (optionsList.style.display == "none") {
    optionsList.style.display = "block";
    event.stopPropagation();
  } else {
    optionsList.style.display = "none";
    event.stopPropagation();
  }
});

selectedDay.addEventListener("click", function (event) {
  event.preventDefault();
  if (optionsList.style.display == "block") {
    dropdown.style.display = "none";
    event.stopPropagation();
  }
});

document.body.addEventListener("click", function () {
  dropdown.style.display = "none";
  optionsList.style.display = "none";
});

Document.addEventListener("DOMContentLoaded", function () {
  // create a variable to track units and initialize UI state
  let isMetric = true; // default to metric (Celsius)

  // ensure dropdowns are hidden on load
  if (dropdown) dropdown.style.display = "none";
  if (optionsList) optionsList.style.display = "none";

  // set a sensible default for selectedDay if empty
  if (selectedDay && !selectedDay.textContent.trim()) {
    selectedDay.textContent = "Select a day";
  }

  // wire up option items to update the selected day (if there are list items)
  if (optionsList) {
    optionsList.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", function (e) {
        e.preventDefault();
        if (selectedDay) selectedDay.textContent = this.textContent.trim();
        optionsList.style.display = "none";
        // stop propagation so body click doesn't immediately hide things again
        e.stopPropagation();
      });
    });
  }
});
//add some features 

document.querySelector(".menu-button").addEventListener("click", () => {
  document.querySelector(".options-list").classList.toggle("show");
});
