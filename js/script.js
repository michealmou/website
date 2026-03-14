// DOM Elements
const map = document.querySelector(".mapsvg")
const countries = document.querySelectorAll("path");
const sidepanel = document.querySelector(".side-panel");
const container = document.querySelector(".side-panel .container");
const closeBtn = document.querySelector(".close-btn");
const zoomin = document.querySelector(".zoom-in");
const zoomout = document.querySelector(".zoom-out");
const countryname = document.querySelector('.country');
const flag = document.querySelector('.flag');
const area = document.querySelector('.area');
const capital = document.querySelector('.capital');
const region = document.querySelector('.region');
const population = document.querySelector('.population');
const description = document.querySelector('.description');
const loading = document.querySelector(".loading");
const svgWrapper = document.querySelector(".svg-wrapper");
// zoom variables
let currentZoom = 1;
const zoomStep = 0.1; //each click will zoom in/out by 10%
const minZoom = 0.5; // Minimum zoom level
const maxZoom = 5; // Maximum zoom level
// Custom country data (will be populated from API)
let customCountryData = {};
// panning variables
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let currentPanX = 0;
let currentPanY = 0;
let currentpanx= 0
let currentpany = 0;
// Fetch all countries from REST Countries API
async function loadCountriesData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        
        const countries = await response.json();
        countries.forEach(country => {
            customCountryData[country.cca2] = {
                name: country.name.common,
                flag: country.flags.png,
                area: country.area ? (country.area.toLocaleString() + " km²") : "N/A",
                capital: country.capital ? country.capital[0] : "N/A",
                region: country.region,
                population: country.population ? country.population.toLocaleString() : "N/A",
                description: `${country.name.common} is located in ${country.region}.`
            };
        });
        console.log("Countries data loaded successfully");
    } catch (error) {
        console.error("Error loading countries data:", error);
    }
}

// Load countries data on page load
document.addEventListener('DOMContentLoaded', loadCountriesData);

// Hover Effects
countries.forEach(country => {
    country.addEventListener("mouseenter", function () {
        this.style.fill = "#c99aff";
    });

    country.addEventListener("mouseout", function () {
        this.style.fill = "#ececec";
    });

    // Click event
    country.addEventListener("click", function (e) {
        const countryName = this.getAttribute("name") || this.getAttribute("class");
        
        // Show loading state
        if (loading) loading.innerText = "Loading...";
        if (container) container.classList.add("hide");
        if (loading) loading.classList.remove("hide");
        if (sidepanel) sidepanel.classList.add("active");

        // Get custom data
        const countryData = customCountryData[countryName];

        // Fetch from REST Countries API
        fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
            .then(response => {
                if (!response.ok) return null;
                return response.json();
            })
            .then(data => {
                setTimeout(() => {
                    const apiData = data ? data[0] : null;

                    if (countryname) countryname.innerText = countryData ? countryData.name : (apiData ? apiData.name.common : countryName);
                    if (area) area.innerText = `Area: ${countryData ? countryData.area : (apiData ? apiData.area + " km²" : "N/A")}`;
                    if (capital) capital.innerText = `Capital: ${countryData ? countryData.capital : (apiData && apiData.capital ? apiData.capital[0] : "N/A")}`;
                    if (population) population.innerText = `Population: ${countryData ? countryData.population : (apiData ? apiData.population.toLocaleString() : "N/A")}`;
                    if (region) region.innerText = `Region: ${countryData ? countryData.region : (apiData ? apiData.region : "N/A")}`;
                    if (description) description.innerText = countryData ? countryData.description : (apiData ? `${apiData.name.common} is located in ${apiData.region}.` : "N/A");
                    
                    if (flag) {
                        const flagUrl = (countryData && countryData.flag) ? countryData.flag : (apiData ? apiData.flags.png : "");
                        if (flagUrl) {
                            flag.src = flagUrl;
                            flag.style.display = "block";
                        }
                    }

                    // Hide loading and show content
                    if (loading) loading.classList.add("hide");
                    if (container) container.classList.remove("hide");
                }, 400);
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                if (loading) loading.innerText = "Failed to load country details.";
            });
    });
});

// Close side panel
if (closeBtn) {
    closeBtn.addEventListener("click", function () {
        sidepanel.classList.remove("active");
    });
}

// Close panel when clicking on map background
if (map) {
    map.addEventListener("click", function (event) {
        if (event.target === map) {
            sidepanel.classList.remove("active");
        }
    });
}

// Zoom controls
function handleZoomIn() {
    if (currentZoom < maxZoom) {
        currentZoom += zoomStep;
        applyZoom();
    }
}

function handleZoomOut() {
    if (currentZoom > minZoom) {
        currentZoom -= zoomStep;
        applyZoom();

        // Reset pan when zooming out completely
        if (currentZoom <= 1) {
            currentZoom = 1; // Ensure it doesn't go below 1
            resetPan();
            applyZoom();
        }
    }
}

function applyZoom() {
    if (svgWrapper) {
        svgWrapper.style.transform = `translate(${currentPanX}px, ${currentPanY}px) scale(${currentZoom})`;
    }
}
// start panning
function startPanning(e) {
    // Only start panning if the click is on the SVG wrapper (not on controls or side panel)
    if (e.target.tagName === 'path'){
        return;
    }
    // only pan if zoomed in 
    if (currentZoom <= 1) {
        return;
    }
    isPanning = true;
    panStartX = e.clientX - currentPanX;
    panStartY = e.clientY - currentPanY;
    // add visual feedback for panning
    if (svgWrapper) {
        svgWrapper.classList.add("panning");
    }
}

// pan during drag (mouse move)

function pan(e) {
    if (!isPanning) return;
    currentPanX = e.clientX - panStartX;
    currentPanY = e.clientY - panStartY;    
    //apply pan without transtion for smooth dragging
    if (svgWrapper) {
        svgWrapper.style.transform = `translate(${currentPanX}px, ${currentPanY}px) scale(${currentZoom})`;
    }
}
// stop panning
function stopPanning() {
    isPanning = false;
    // remove panning class to restore cursor and transition
    if (svgWrapper) {
        svgWrapper.classList.remove("panning");
    }
}
// reset pan whening zooming out completely
function resetPan() {
    currentPanX = 0;
    currentPanY = 0;
}

if (zoomin) {
    zoomin.addEventListener("click", handleZoomIn);
}
if (zoomout) {
    zoomout.addEventListener("click", handleZoomOut);
}
// pan controls - attach event listeners

if (map){
    map.addEventListener("mousedown", startPanning);
    map.addEventListener("mousemove", pan);
    map.addEventListener("mouseup", stopPanning);
}
//reset pan when zoom restuns to 1x
