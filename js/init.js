/////// General functions, init stuff

/////// global variables
const version = 3;
let southernHemisphere = false; // default hemisphere
const activeClass = "active";

/////// functions
// for adding/removing classes of all children; used for the months/hours when displaying critter data
const massClassManipulate = (selector, classToManipulate, removeOrAdd) => {
    document.querySelectorAll(selector).forEach(
        (element) => {
            if (removeOrAdd === "remove") {
                element.classList.remove(classToManipulate);
            } else if (removeOrAdd === "add") {
                element.classList.add(classToManipulate);
            }
        }
    );
}

// 80000 -> 80,000
const numberWithCommas = x => { // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// smooth scroll the the speciesDB; used when a critter is clicked
const scrollToDB = () => {
    document.querySelector(".speciesDB").scrollIntoView({
        behavior: "smooth"
    });
}

// convert to southern hemisphere by offsetting all months by 6
// used ANY TIME months are being grabbed from the JSON. toSouth=true enables the conversion
const hemisphereMonths = (toSouth, array) => {
    let output = [];
    if (toSouth) {
        array.forEach(month => {
            let convertedValue = month + 6;
            if (convertedValue > 11) {
                convertedValue = convertedValue - 12;
            }
            output.push(convertedValue);
        });
    } else {
        output = array;
    }
    return output;
}

/////// hemisphere control
// check if there's a localstorage key set
if (localStorage.getItem("southern") === "true") {
    southernHemisphere = true;
}

// insert correct text in the switch hemispheres button
const hemisphereToggle = document.querySelector("#hemisphereSwitch");
if (southernHemisphere) {
    hemisphereToggle.innerHTML = "Switch to northern hemisphere";
} else {
    hemisphereToggle.innerHTML = "Switch to southern hemisphere";
}

// switch hemispheres click
// TODO: repeated code; this logic could be a function
// TODO: make it not require a location.reload()
hemisphereToggle.addEventListener("click", (event) => {
    if (southernHemisphere) {
        southernHemisphere = false;
        localStorage.setItem("southern", southernHemisphere);
        location.reload();
    } else {
        southernHemisphere = true;
        localStorage.setItem("southern", southernHemisphere);
        location.reload();
    }
});

// last visit version visited key update
localStorage.setItem("lastVisitVersion", version)