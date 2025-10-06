let toggled = document.querySelector("#toggle-units");
let dropdown = document.querySelector(".dropdown-menu");

toggled.addEventListener("click", function (event) {
  event.preventDefault();
  if (dropdown.style.display == "none") {
    dropdown.style.display = "block";
    event.stopPropagation();
    //Prevent body click from firing
  } else {
    dropdown.style.display == "block";
  }
});

document.body.addEventListener("click", function () {
  dropdown.style.display = "none";
});
