/////// "Current Critters" section at the top of the page

// globals
let currentDate = new Date();
let currentHour = currentDate.getHours();
let timeTravel = false;
let calendar = flatpickr(".changeDate", {
    enableTime: true,
    altInput: true,
    altFormat: "F j, Y - h:i",
    dateFormat: "Y-m-d H:i",
    defaultDate: currentDate,
    onChange: function() {
        updateFromCalendar();
    }
});

/////// functions
// 0->jan, 2->feb, you get the picture
const monthToName = (month, compact) => {
    const months = compact ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return months[month];
}

// get the next month
const nextMonth = (month) => {
    let output = month + 1;
    // there's no month after 
    if (output > 11) {
        output = output - 12;
    }
    return output;
}

// check if current month is in species month array
const isThisMonth = (speciesMonths) => {
    return speciesMonths.includes(currentDate.getMonth());
}

// check if species is available during the current month AND during the current hour
// isThisMonth is a boolean (returned from isThisMonth()) and speciesHours is an array from the json file
const isRightNow = (isThisMonth, speciesHours) => {
    return isThisMonth && speciesHours.includes(currentDate.getHours());
}

// check if species is available next month (used to determine if they're leaving)
const isNextMonth = (speciesMonths) => {
    return speciesMonths.includes(nextMonth(currentDate.getMonth()));
}

// get HTML to render a tile
// TODO: use something more elegant like createElement() instead of a string
const tileHTML = (speciesName, speciesImage, leaving, status) => {
    let leavingClass = '';
    if (leaving) {
        leavingClass = "leaving";
    }
    return `<div class="species ${status} ${leavingClass}" style="background-image:url('img/icons/species/64/${speciesImage}')" data-glance-species="${speciesName}" title="${speciesName}"><span class="name">${speciesName}</span></div>`;
}

// update the time displayed next to the "Current Critters" heading
const updateDisplayTime = () => {
    const ampm = (currentDate.getHours() >= 12) ? "PM" : "AM";
    document.querySelector(".date").textContent = `${monthToName(currentDate.getMonth(), true)}, ${(currentDate.getHours() % 12) || 12}${ampm}`
}

/////// Data processing and display
// Return the current critters according to the time in curentDate as an object-filled array
const getCurrentCritters = () => {
    let output = [];
    Object.entries(speciesData).forEach( // loop through all species in speciesData
        ([speciesName, speciesAttributes]) => {
            const speciesType = speciesAttributes["type"];
            const speciesImage = speciesAttributes["image"];
            const speciesMonths = hemisphereMonths(southernHemisphere, speciesAttributes["months"]);
            const speciesHours = speciesAttributes["hours"];
            const thisMonth = isThisMonth(speciesMonths);
            const rightNow = isRightNow(thisMonth, speciesHours);
            const nextMonth = isNextMonth(speciesMonths);

            const toPush = { "name": speciesName, "type": speciesType, "image": speciesImage, "thisMonth": thisMonth, "rightNow": rightNow, "nextMonth": nextMonth };
            output.push(toPush);
        }
    );
    return output;
}

// Filter data from getCurrentCritters() and output the current species onto the page
// TODO: lots of repeating code that could be split into functions, especially the forEach loops
const showGlance = () => {
    const currentCritters = getCurrentCritters();

    // clear out any existing elements
    document.querySelector(".typeSection.fish").innerHTML = "";
    document.querySelector(".typeSection.bug").innerHTML = "";

    // right now (light tiles)
    currentCritters.forEach(critter => {
        const leaving = !critter["nextMonth"];
        if (critter["thisMonth"]) {
            if (critter["rightNow"]) {
                document.querySelector(`#glance .${critter["type"]}`).insertAdjacentHTML("beforeend", tileHTML(critter["name"], critter["image"], leaving, "rightNow"));
                const resultSelector = document.querySelector(`[data-glance-species="${critter["name"]}"]`);
                // add event listener so the results can be clicked
                resultSelector.addEventListener("click", (event) => {
                    resultClicked(critter["name"]);
                });
            }
        }
    });

    // this month (dark tiles)
    currentCritters.forEach(critter => {
        const leaving = !critter["nextMonth"];
        if (critter["thisMonth"]) {
            if (!critter["rightNow"]) {
                document.querySelector(`#glance .${critter["type"]}`).insertAdjacentHTML("beforeend", tileHTML(critter["name"], critter["image"], leaving, "thisMonth"));
                const resultSelector = document.querySelector(`[data-glance-species="${critter["name"]}"]`);
                // add event listener so the results can be clicked
                resultSelector.addEventListener("click", (event) => {
                    resultClicked(critter["name"]);
                });
            }
        }
    });
}

// update the display time and "glance" list based on custom calendar date
const updateFromCalendar = () => {
    currentDate = calendar.selectedDates[0];
    updateDisplayTime();
    showGlance();
}

/////// Custom date setting for time travellers
// custom date toggle
document.querySelector(".dateSwitch input").addEventListener("input", (event) => {
    // enable time travel mode (ignore local clock)
    timeTravel = document.querySelector(".dateSwitch input").checked;
    // show/hide the date picker input
    // TODO: make this more elegant
    if (document.querySelector(".changeDate.form-control").classList.contains("disabled")) {
        document.querySelector(".changeDate.form-control").classList.remove("disabled");
        try {document.querySelector(".flatpickr-mobile").classList.remove("disabled");}catch{} // TODO: find a more elegant way to get around the console error caused when .flatpickr-mobile doesn't exist
    } else {
        document.querySelector(".changeDate.form-control").classList.add("disabled");
        try {document.querySelector(".flatpickr-mobile").classList.add("disabled");}catch{} // TODO: find a more elegant way to get around the console error caused when .flatpickr-mobile doesn't exist
    }
    // update everything right away without having to wait for the update interval
    // TODO: combine with setInterval in a function
    if (timeTravel) {
        updateFromCalendar();
    } else {
        currentDate = new Date();
        updateDisplayTime();
        showGlance();
    }
});

// auto refresh
window.setInterval(() => {
    if (!timeTravel) {
        if (currentHour !== currentDate.getHours()) {
            showGlance();
            currentHour = currentDate.getHours();
        }
        updateDisplayTime();
    }
}, 1000);

updateDisplayTime();
showGlance();