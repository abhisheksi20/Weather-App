import {
  getWeatherFromCoords,
  getCoordsFromApi,
  setLocationObject,
  cleanText,
} from "./dataFunction.js";

import { getHomeLocation } from "./dataFunction.js";

import CurrentLocation from "./CurrentLocation.js";
import {
  setPlaceholderText,
  addSpinner,
  displayError,
  updateScreenReaderConfirmation,
  displayApiError,
  updateDisplay,
} from "./domFunctions.js";

// We have created the instance of class here //
const currentLoc = new CurrentLocation();

const initApp = () => {
  // add listeners
  const geoButton = document.getElementById("getLocation");
  geoButton.addEventListener("click", getGeoWeather);

  const homeButton = document.getElementById("home");
  homeButton.addEventListener("click", loadWeather);

  const saveButton = document.getElementById("saveLocation");
  saveButton.addEventListener("click", saveLocation);
  const unitButton = document.getElementById("unit");
  unitButton.addEventListener("click", setUnitPref);
  const refreshButton = document.getElementById("refresh");
  refreshButton.addEventListener("click", refreshWeather);
  const locationEntry = document.getElementById("searchBar_form");
  locationEntry.addEventListener("submit", submitNewLocation);

  //set up
  setPlaceholderText();

  //load weather
  loadWeather();
};

document.addEventListener("DOMContentLoaded", initApp);

const getGeoWeather = (event) => {
  if (event) {
    if (event.type === "click") {
      const mapIcon = document.querySelector(".fa-map-marker-alt");
      addSpinner(mapIcon);
    }
  }

  if (!navigator.geolocation) geoError();

  //getCurrentPosition is gives the current position. It is a method defined in the Geolocation API
  //It returns a Promise
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};

const geoError = (errObj) => {
  const errMsg = errObj.message ? errObj.message : "Geolocation not supported";
  displayError(errMsg, errMsg);
};

const geoSuccess = (position) => {
  const myCoordsObj = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
    name: `Lat: ${position.coords.latitude} Long: ${position.coords.longitude}`,
  };
  //
  setLocationObject(currentLoc, myCoordsObj);
  updateDataAndDisplay(currentLoc);
};

const updateDataAndDisplay = async (locationObj) => {
  const weatherJson = await getWeatherFromCoords(locationObj);
  if (weatherJson) updateDisplay(weatherJson, locationObj);
};

const loadWeather = (event) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !event) return getGeoWeather;
  if (!savedLocation && event.type === "click") {
    displayError(
      "No home Location Saved.",
      "Please Save your home location first."
    );
  } else if (savedLocation && !event) {
    displayHomeLocationWeather(savedLocation);
  } else {
    const homeIcon = document.querySelector(".fa-home");
    addSpinner(homeIcon);
    displayHomeLocationWeather(savedLocation);
  }
};

const displayHomeLocationWeather = (home) => {
  if (typeof home === "string") {
    const locationJson = Json.parse(home);
    const myCoordsObj = {
      lat: locationJson.lat,
      lon: locationJson.lon,
      name: locationJson.name,
      unit: locationJson.unit,
    };

    setLocationObject(currentLoc, myCoordsObj);
    updateDataAndDisplay(currentLoc);
  }
};

const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    const Location = {
      name: currentLoc.getName(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      unit: currentLoc.getUnit(),
    };
    localStorage.setItem("defaultWeatherLocation", JSON.stringify(location));
    updateScreenReaderConfirmation(
      `Saved ${currentLoc.getName()} as home location.`
    );
  }
};

const setUnitPref = () => {
  const unitIcon = document.querySelector(".fa-chart-bar");
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataAndDisplay(currentLoc);
};

const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-sync-alt");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLoc);
};

const submitNewLocation = async (event) => {
  event.preventDefault();
  const text = document.getElementById("searchBar_text").value;
  const entryText = cleanText(text);
  if (!entryText.length) return;

  const locationIcon = document.querySelector(".fa-search");
  addSpinner(locationIcon);
  const coordsData = await getCoordsFromApi(entryText, currentLoc.getUnit());

  if (coordsData) {
    if (coordsData.cod === 200) {
      const myCoordsObj = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.name}, ${coordsData.sys.country}`
          : coordsData.name,
      };
      //success

      setLocationObject(currentLoc, myCoordsObj);
      updateDataAndDisplay(currentLoc);
    } else {
      displayApiError(coordsData);
    }
  } else {
    displayError("Connection Error", "Connection Error");
  }
};

const updateDateAndDisplay = async (locationObj) => {
  const weatherJson = await getWeatherFromCoords(weatherJson);
  //if (weatherJson) updateDisplay (weatherJson, locationObj)
};
