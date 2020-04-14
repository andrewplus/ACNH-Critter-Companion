/////// global variables
let typeFilter = "all";

/////// selectors
const speciesSearch = document.querySelector("#speciesSearch");
const typeFilterSelector = document.querySelectorAll("[name='type']");
const results = document.querySelector("#results");
const speciesResult = document.querySelectorAll(".month");

/////// input
// typing in search box
speciesSearch.addEventListener("input", (event) => {
    if (speciesSearch.value === "") {
        speciesSearch.classList.add("empty");
    } else {
        speciesSearch.classList.remove("empty");
    }
    showResults();
});
// adjusting filters
typeFilterSelector.forEach(element => {
    element.addEventListener("input", (event) => {
        results.scroll(0,0);
        typeFilter = element.value;
        showResults();
    });
});

/////// show results based on content of the search box
const showResults = () => {
    let inputValue = speciesSearch.value.toLowerCase();
    results.innerHTML = ""; // clear any previous results
    // loop through all the species and look for matches
    Object.entries(speciesData).forEach(
        ([speciesName, speciesAttributes]) => {
            // species type filter
            if (speciesAttributes["type"] === typeFilter || typeFilter === "all") {
                const speciesNameLower = speciesName.toLowerCase();
                const speciesImage = speciesAttributes["image"];
                // check if it matches the matches the input
                if (speciesNameLower.includes(inputValue)) {
                    // append the result
                    results.insertAdjacentHTML("beforeend", `<div class="result" data-species="${speciesName}"><img src="img/icons/species/32/${speciesImage}" style="vertical-align:middle"><span>${speciesName}</span></div>`);
                    const resultSelector = document.querySelector(`[data-species="${speciesName}"]`);
                    // add event listener so the results can be clicked
                    resultSelector.addEventListener("click", (event) => {
                        resultClicked(speciesName);
                    });
                }
            }
        }
    );
}

/////// show the data pertaining to the search result collected by the user
const resultClicked = speciesName => {
    scrollToDB();

    // clear the month/year sections
    massClassManipulate(".month", activeClass, "remove");
    massClassManipulate(".hour", activeClass, "remove");

    // append data to right column
    document.querySelector("#dataPanel .name .value").textContent = speciesName;
    document.querySelector("#dataPanel .image img").src = `img/renders/${speciesData[speciesName]["image"]}`;
    document.querySelector("#dataPanel .location .value").textContent = speciesData[speciesName]["location"];
    if (speciesData[speciesName]["shadowSize"] === undefined) { // display shadow size as "N/A" for bugs
        document.querySelector("#dataPanel .shadowSize .value").textContent = "N/A";
    } else {
        document.querySelector("#dataPanel .shadowSize .value").textContent = speciesData[speciesName]["shadowSize"];
    }
    document.querySelector("#dataPanel .price .value").textContent = `${numberWithCommas(speciesData[speciesName]["price"])} bells`;

    // append month data to right column
    if (!speciesData[speciesName]["allYear"]) {
        hemisphereMonths(southernHemisphere, speciesData[speciesName]["months"]).forEach(
            (month) => {
                document.querySelector(`.month[data-month='${month}']`).classList.add(activeClass);
            }
        );
    } else {
        massClassManipulate(".month", activeClass, "add");
    }

    // append hour data to right column
    if (!speciesData[speciesName]["allDay"]) {
        speciesData[speciesName]["hours"].forEach(
            (hour) => {
                document.querySelector(`.hour[data-hour='${hour}']`).classList.add(activeClass);
            }
        );
    } else {
        massClassManipulate(".hour", activeClass, "add");
    }
}

/////// show unfiltered results list when the page initially loads
showResults();