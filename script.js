"use strict";
const apiURL =
  "https://pkgstore.datahub.io/core/world-cities/world-cities_json/data/5b3dd46ad10990bca47b04b4739a02ba/world-cities_json.json";
const countryOptions = document.getElementById("country");
const stateOptions = document.getElementById("state");
const cityOptions = document.getElementById("city");

function handleCountryAjaxResponse(evnt) {
  if (evnt.target.status !== 200) {
    return;
  }

  let loadedData = evnt.target.response;
  getUniqueCountries(loadedData);
  countryOptions.addEventListener("change", () => {
    disableField();
    getUniqueStatesByCountry(loadedData);
  });

  stateOptions.addEventListener("change", () => {
    disableField();
    getUniqueCitesByStateAndCountry(loadedData);
  });

  cityOptions.addEventListener("change", () => {
    writeMessage(loadedData);
  });
}

function getUniqueCountries(_array) {
  // Set will store only distinct values
  const country = [...new Set(_array.map((element) => element.country))];
  country.map((data) => {
    let element = document.createElement("option");
    element.appendChild(document.createTextNode(data));
    element.setAttribute("value", data);
    countryOptions.appendChild(element);
  });
}

function getUniqueStatesByCountry(_array) {
  // Set will store only distinct values
  const state = [
    ...new Set(
      _array.map((element) => {
        if (countryOptions.value == element.country) {
          return element.subcountry;
        }
      })
    ),
  ];

  stateOptions.innerHTML = "";
  let element = document.createElement("option");
  element.appendChild(document.createTextNode("Select Any State"));
  element.setAttribute("value", "Select Any State");
  stateOptions.appendChild(element);

  cityOptions.innerHTML = "";
  let element2 = document.createElement("option");
  element2.appendChild(document.createTextNode("Select Any City"));
  element2.setAttribute("value", "Select Any City");
  cityOptions.appendChild(element2);

  state.map((data) => {
    if (data != undefined) {
      let element = document.createElement("option");
      element.appendChild(document.createTextNode(data));
      element.setAttribute("value", data);
      stateOptions.appendChild(element);
    }
  });
}

function getUniqueCitesByStateAndCountry(_array) {
  // Set will store only distinct values
  const state = [
    ...new Set(
      _array.map((element) => {
        if (
          countryOptions.value == element.country &&
          stateOptions.value == element.subcountry
        ) {
          return element.name;
        }
      })
    ),
  ];

  cityOptions.innerHTML = "";
  let element = document.createElement("option");
  element.appendChild(document.createTextNode("Select Any City"));
  element.setAttribute("value", "Select Any City");
  cityOptions.appendChild(element);

  state.map((data) => {
    if (data != undefined) {
      let element = document.createElement("option");
      element.appendChild(document.createTextNode(data));
      element.setAttribute("value", data);
      cityOptions.appendChild(element);
    }
  });
}

function makeAjaxRequest(evnt) {
  let request = new XMLHttpRequest();
  request.open("GET", apiURL);
  request.responseType = "json";
  request.send();

  request.addEventListener("load", handleCountryAjaxResponse);

  request.addEventListener("error", function (evnt) {
    console.error(evnt);
  });
}

function writeMessage(_array) {
  const geoNameId = _array.filter((element) => {
    if (
      countryOptions.value == element.country &&
      stateOptions.value == element.subcountry &&
      cityOptions.value == element.name
    ) {
      return element;
    }
  });
  console.log(geoNameId);
  document.getElementById(
    "address"
  ).innerHTML = `The GeoNameId of country <b>${countryOptions.value}</b> with state <b>${stateOptions.value}</b> having a city <b>${cityOptions.value}</b> is <b>${geoNameId[0].geonameid}</b>`;
}

function disableField() {
  if (countryOptions.value == "Select Any Country") {
    stateOptions.disabled = true;
    cityOptions.disabled = true;
  } else {
    stateOptions.disabled = false;
    if (stateOptions.value == "Select Any State") {
      cityOptions.disabled = true;
    } else {
      cityOptions.disabled = false;
    }
  }
}

disableField();
makeAjaxRequest();
