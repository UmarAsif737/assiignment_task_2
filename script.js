//Setting some global Variables
const apiURL = "https://api.openbrewerydb.org/breweries?per_page=20";
const apiURL2 =
  "https://api.openbrewerydb.org/breweries?by_state=new_york&per_page=20";
const mydata = getData();
const allStates = document.querySelector("#states");

//Using a little jQuery
$(document).ready(function () {
  $("#states").change(function () {
    $("#address").text("");
    $("#name").text("");
    if (allStates.value != "Select Any State") {
      selectByState();
    }
  });
});

// Get Data
async function getData() {
  const response = await fetch(`${apiURL}`);
  const data = await response.json();
  dropDownStates();
  return data;
}

//Finding unique states from the data
function dropDownStates() {
  mydata.then((res) => {
    const states = getUniquePropertyValues(res, "state");

    states.map((state) => {
      if (state != null) {
        let element = document.createElement("option");
        element.appendChild(document.createTextNode(state));
        element.setAttribute("value", state);
        document.getElementById("states").appendChild(element);
      }
    });
  });
}

function getUniquePropertyValues(_array, _property) {
  // Set will store only distinct values
  return [...new Set(_array.map((element) => element[_property]))];
}

//Selecting the data based on the selected state
function selectByState() {
  const stateSelected = allStates.value;
  let element = document.createElement("b");
  element.appendChild(document.createTextNode("Name"));
  document.getElementById("name").appendChild(element);
  let element2 = document.createElement("b");
  element2.appendChild(document.createTextNode("Address"));
  document.getElementById("address").appendChild(element2);
  mydata.then((res) => {
    res.map((singleData) => {
      if (stateSelected == singleData.state) {
        let element = document.createElement("p");
        element.appendChild(document.createTextNode(singleData.name));
        document.getElementById("name").appendChild(element);
        let element2 = document.createElement("p");
        element2.appendChild(document.createTextNode(singleData.street));
        document.getElementById("address").appendChild(element2);
      }
    });
  });
}

// // Add Event Listeners
// allStates.addEventListener("change", () => {
//   const myNode = document.getElementById("name");
//   myNode.innerHTML = "";
//   const myNode2 = document.getElementById("address");
//   myNode2.innerHTML = "";
//   selectByState();
// });
