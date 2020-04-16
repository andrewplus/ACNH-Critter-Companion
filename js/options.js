// globals
const optionsButton = document.querySelector("#optionsButton");
const options = document.querySelector("#options");
let optionsAreOpen = false;

let darkMode = false;
if (localStorage.getItem("dark") === "true") {
    darkMode = true;
}

// functions
const toggleOptions = () => {
    optionsAreOpen = !optionsAreOpen;
    document.querySelector("body").classList.toggle("optionsOpen");
    if (optionsAreOpen) {
        options.style.display = "block";
        window.setTimeout(() => {
            options.classList.toggle("open");
        }, 10);
    } else {
        options.classList.toggle("open");
        window.setTimeout(() => {
            options.style.display = "none";
        }, 300);
    }
}

const switchTheme = () => {
    document.querySelector("body").classList.add("transitionAll");
    if (darkMode) {
        document.querySelector("body").classList.add("dark");
        localStorage.setItem("dark", "true");
    } else {
        document.querySelector("body").classList.remove("dark");
        localStorage.setItem("dark", "false");
    }
    window.setTimeout(() => {
        document.querySelector("body").classList.remove("transitionAll");
    }, 150);
}

// hide if at bottom of page
window.addEventListener("scroll", function() {
    if (window.scrollY+window.innerHeight > document.documentElement.scrollHeight-60 && !document.querySelector("body").classList.contains("optionsOpen")) {
        optionsButton.classList.add("scrolledToBottom");
    } else {
        optionsButton.classList.remove("scrolledToBottom");
    }
});

// close options
document.querySelector("#optionsButton").addEventListener("click", (event) => {
    toggleOptions();
});

document.querySelector("#darken").addEventListener("click", (event) => {
    toggleOptions();
});

// dark mode toggle
if (darkMode) {
    document.querySelector(".darkSwitch input").checked = true;
}

document.querySelector(".darkSwitch input").addEventListener("input", (event) => {
    choice = document.querySelector(".darkSwitch input").checked;
    darkMode = choice;

    switchTheme();
});

// southern hemisphere toggle
if (southernHemisphere) {
    document.querySelector(".hemisphereSwitch input").checked = true;
}

document.querySelector(".hemisphereSwitch input").addEventListener("input", (event) => {
    choice = document.querySelector(".hemisphereSwitch input").checked;
    southernHemisphere = choice;

    localStorage.setItem("southern", southernHemisphere);
    showGlance();
    if (currentCritter !== "unset") {
        resultClicked(currentCritter, true);
    }
});