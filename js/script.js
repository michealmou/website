/*// DOM Elements
const map = document.querySelector("svg");
const countries = document.querySelectorAll("path");
const sidepanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const zoominbtn = document.querySelector(".zoom-in");
const zoomoutbtn = document.querySelector(".zoom-out");
const zoomvalueoutput = document.querySelector(".zoom-value");
const countrynameoutput = document.querySelector(".country-name");
const countryflagoutput = document.querySelector(".country-flag");
const briefingoutput = document.querySelector(".briefing");
const keyachievementsoutput = document.querySelector(".key-achievement");
const timespentoutput = document.querySelector(".time-spent");
const skillsoutput = document.querySelector(".skills-gained");
const loading = document.querySelector(".loading");

// 🌍 ADD YOUR CUSTOM DATA HERE 🌍
// To add a new country, use the EXACT 'name' attribute from your SVG path as the key.
const customCountryData = {
    "Palestine": {
        briefing: "Volunteered at local tech communities and helped build digital infrastructure for small businesses.",
        key_achievements: "Launched 3 major websites, Hosted web development workshops",
        time_spent: "3 months",
        skills_gained: "Leadership, Empathy, Arabic language, Problem Solving",
        flag_url: "./images/palestine.png"
    },
    "Jordan": {
        briefing: "Studied abroad focusing on mathematics and advanced computing.",
        key_achievements: "Won first place in the Amman university hackathon",
        time_spent: "6 months",
        skills_gained: "Algorithms, Team Collaboration, Advanced CSS",
        flag_url: "https://flagcdn.com/w320/jo.png" // You can use local paths or external URLs!
    },
    "Canada": {
        briefing: "Worked as a junior game developer at an indie studio.",
        key_achievements: "Shipped a prototype in Unity, Fixed 150+ bugs",
        time_spent: "8 months",
        skills_gained: "C#, Unity, Physics Programming, Git",
        flag_url: "https://flagcdn.com/w320/ca.png"
    }
};

countries.forEach(country => {
    country.addEventListener("mouseenter", function () {
        const classList = [...this.classList].join(".");

        if (classList.length > 0) {
            const selector = '.' + classList;
            const matchingElements = document.querySelectorAll(selector);
            matchingElements.forEach(e1 => e1.style.fill = "#c99aff");
        } else {
            this.style.fill = "#c99aff";
        }
    });

    country.addEventListener("mouseout", function () {
        const classList = [...this.classList].join(".");

        if (classList.length > 0) {
            const selector = '.' + classList;
            const matchingElements = document.querySelectorAll(selector);
            // Revert to your SVG's base fill color
            matchingElements.forEach(e1 => e1.style.fill = "#ececec");
        } else {
            this.style.fill = "#ececec";
        }
    });

    country.addEventListener("click", function (e) {
        // Find the mapped country name
        let clickedCountryName = "";

        // The SVG paths use the 'name' attribute, for example: name="Palestine"
        if (this.hasAttribute("name")) {
            clickedCountryName = this.getAttribute("name");
        } else if (this.classList.length > 0) {
            clickedCountryName = this.classList[0]; // Fallback just in case
        }

        if (!clickedCountryName) return;

        // UI transitions
        if (loading) loading.innerText = "Loading...";
        if (container) container.classList.add("hide");
        if (loading) loading.classList.remove("hide");
        if (sidepanel) sidepanel.classList.add("side-panel-open");

        // Grab your custom country data
        const countryInfo = customCountryData[clickedCountryName];

        // Fetch data from REST Countries API to dynamically pull the flag
        fetch(`https://restcountries.com/v3.1/name/${clickedCountryName}?fullText=true`)
            .then(response => {
                if (!response.ok) return null;
                return response.json();
            })
            .then(data => {
                setTimeout(() => {
                    const apiData = data ? data[0] : null;

                    // Name (Fallback to SVG name if API fails)
                    if (countrynameoutput) {
                        countrynameoutput.innerText = apiData ? apiData.name.common : clickedCountryName;
                    }

                    // Flag priority: Custom Data -> API Data -> Nothing
                    if (countryflagoutput) {
                        const flagUrl = (countryInfo && countryInfo.flag_url)
                            ? countryInfo.flag_url
                            : (apiData ? apiData.flags.png : "");

                        if (flagUrl) {
                            countryflagoutput.src = flagUrl;
                            countryflagoutput.style.display = "block";
                        } else {
                            countryflagoutput.style.display = "none";
                        }
                    }

                    if (countryInfo) {
                        // Display your custom text if it exists
                        if (briefingoutput) briefingoutput.innerText = countryInfo.briefing || "N/A";
                        if (keyachievementsoutput) keyachievementsoutput.innerText = countryInfo.key_achievements || "N/A";
                        if (timespentoutput) timespentoutput.innerText = countryInfo.time_spent || "N/A";
                        if (skillsoutput) skillsoutput.innerText = countryInfo.skills_gained || "N/A";
                    } else {
                        // When they click a new country without custom data yet
                        if (briefingoutput) briefingoutput.innerText = "Wow! Uncharted territory. No journey data added here yet.";
                        if (keyachievementsoutput) keyachievementsoutput.innerText = "To be determined...";
                        if (timespentoutput) timespentoutput.innerText = "0 days (so far!)";
                        if (skillsoutput) skillsoutput.innerText = "Wanderlust";
                    }

                    // Hide loading and show container
                    if (loading) loading.classList.add("hide");
                    if (container) container.classList.remove("hide");
                }, 400); // UI delay for feel
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                if (loading) loading.innerText = "Failed to load country details.";
            });
    });
});

if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        sidepanel.classList.remove("side-panel-open");
    });
}