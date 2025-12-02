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

  // call fetch(url).then(...).catch(...) to retrieve forecast data and update the UI.
  async function fetchAndRenderForecast(lat = defaultLat, lon = defaultLon) {
    try {
      const url = buildWeatherUrl(lat, lon, {
        temperature_unit: isMetric ? "celsius" : "fahrenheit",
        hourly: "temperature_2m",
        current_weather: "true",
      });

      const data = await getJson(url);
      console.log("Forecast data:", data);

      // ensure we have an output container
      let out = document.querySelector("#forecast-output");
      if (!out) {
        out = document.createElement("div");
        out.id = "forecast-output";
        out.style.marginTop = "12px";
        out.style.whiteSpace = "pre-wrap";
        document.body.appendChild(out);
      }

      // prefer current_weather if present, otherwise fall back to the first hourly value
      const unit = isMetric ? "°C" : "°F";
      if (
        data.current_weather &&
        typeof data.current_weather.temperature !== "undefined"
      ) {
        out.textContent = `Current temperature: ${data.current_weather.temperature}${unit}`;
      } else if (
        data.hourly &&
        Array.isArray(data.hourly.temperature_2m) &&
        data.hourly.time
      ) {
        // try to find the closest hourly value to now (server time already converted by timezone=auto)
        const now = new Date();
        const times = data.hourly.time;
        const temps = data.hourly.temperature_2m;
        let idx = 0;
        for (let i = 0; i < times.length; i++) {
          const t = new Date(times[i]);
          if (t >= now) {
            idx = i;
            break;
          }
        }
        out.textContent = `Forecast (${times[idx]}): ${temps[idx]}${unit}`;
      } else {
        out.textContent =
          "No temperature data available from the API response.";
      }
    } catch (err) {
      console.error("Forecast fetch failed:", err);
      let out = document.querySelector("#forecast-output");
      if (!out) {
        out = document.createElement("div");
        out.id = "forecast-output";
        document.body.appendChild(out);
      }
      out.textContent = "Failed to load forecast data.";
    }
  }

  // add a small unit toggle control if one doesn't exist
  (function ensureUnitToggle() {
    let unitBtn = document.querySelector("#unit-toggle");
    if (!unitBtn) {
      unitBtn = document.createElement("button");
      unitBtn.id = "unit-toggle";
      unitBtn.type = "button";
      unitBtn.style.marginLeft = "8px";
      if (toggled && toggled.parentNode) {
        toggled.parentNode.insertBefore(unitBtn, toggled.nextSibling);
      } else {
        document.body.appendChild(unitBtn);
      }
    }
    const updateLabel = () =>
      (unitBtn.textContent = `Units: ${isMetric ? "C" : "F"}`);
    updateLabel();
    unitBtn.addEventListener("click", () => {
      isMetric = !isMetric;
      updateLabel();
      fetchAndRenderForecast(); // refresh with new units
    });
  })();

  // wire up list selection to optionally re-fetch for a day (if li items encode a date or coords)
  list.forEach((li) => {
    li.addEventListener("click", function (event) {
      event.preventDefault();
      // keep existing behavior: set select text
      if (select) select.textContent = li.textContent;

      // if li has data attributes for coordinates, use them; otherwise use defaults
      const lat = li.getAttribute("data-lat") || defaultLat;
      const lon = li.getAttribute("data-lon") || defaultLon;

      // close options and fetch
      if (optionsList) optionsList.style.display = "none";
      event.stopPropagation();
      fetchAndRenderForecast(lat, lon);
    });
  });

  // initial fetch on load
  fetchAndRenderForecast();
});
setTimeout();
//write a fetch functions to recive a weather forecast
