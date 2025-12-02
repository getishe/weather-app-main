// Document.loaded = function () {
let toggled = document.querySelector("#toggle-units");
let dropdown = document.querySelector(".dropdown-menu");
let selectedDay = document.querySelector(".selected-day");
let select = document.querySelector(".select");
let optionsList = document.querySelector("ul.options-list");
let list = document.querySelectorAll("li");
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

list.forEach((li) => {
  li.addEventListener("click", function (event) {
    event.preventDefault();
    if (select) {
      select.textContent = li.textContent;
    }

    optionsList.style.display = "none";
    event.stopPropagation();
  });
});

const base = "https://api.open-meteo.com/v1/forecast";
const defaultLat = "52.52";
const defaultLon = "13.41";

const defaultParams = {
  hourly: "temperature_2m",
  timezone: "auto",
};

function buildWeatherUrl(lat = defaultLat, lon = defaultLon, extraParams = {}) {
  const params = new URLSearchParams({
    ...defaultParams, // base query params (hourly, timezone, etc.)
    ...extraParams, // any caller-specified overrides / additions
    latitude: lat, // required by Open-Meteo
    longitude: lon, // required by Open-Meteo,
  });

  return `${base}?${params.toString()}`;
}

document.addEventListener("DOMContentLoaded", function () {
  // Example usage on DOM ready: build a URL for New York City coordinates
  // You can replace the lat/lon or pass extra params (e.g. { hourly: "temperature_2m,relativehumidity_2m" })
  const url = buildWeatherUrl("40.7128", "-74.0060");
  console.log("Weather API URL:", url);

  // Browser or node fetch available
  async function getJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  getJson("https://api.example.com/data")
    .then((data) => console.log(data))
    .catch((err) => console.error("Fetch failed:", err));

  // TODO: call fetch(url).then(...).catch(...) to retrieve forecast data and update the UI.
});
setTimeout()
//write a fetch functions to recive a weather forecast
