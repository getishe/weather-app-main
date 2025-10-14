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

document.addEventListener("DOMContentLoaded", function () {
  // Your code here
  body.style.display = "block";
  
});
