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
const achievementsList = document.querySelector('.achievements-list');
const timeSpentSpan = document.querySelector('.time-spent span');
const instructionsDiv = document.querySelector('.instructions');
const countryInfoDiv = document.querySelector('.country-info');
const themeToggle = document.getElementById('theme-toggle');
// zoom variables
let currentZoom = 1;
const zoomStep = 0.1; //each click will zoom in/out by 10%
const minZoom = 0.5; // Minimum zoom level
const maxZoom = 7; // Maximum zoom level
// Custom country data for the journey map
const customCountryData = {
    'PS': {
        name: 'Palestine',
        flag: 'assets/images/palestine.png',
        achievements: [
            'Background: Palestinian (born and raised in Palestine)',
            'Graduated High School with a 90.1% Average',
            'Collaborated and built connections with diverse individuals',
            'Gained hands-on experience in high-pressure work environments.',
        ],
        timespent: 'Spent my early life (0–18) in Palestine.'
    },
    'CY': {
        name: 'Cyprus',
        flag: 'https://flagcdn.com/w320/cy.png',
        achievements: [
            'B.Sc. in Mathematics and Computer Science',
            'High Honors and Honors in first two semesters',
            'Relocated internationally to pursue higher education.',
            'Built a strong foundation in programming through self-driven learning and projects.'
        ],
        timespent: '4 years'
    },
    'Cyprus': {
        name: 'Cyprus',
        flag: 'https://flagcdn.com/w320/cy.png',
        achievements: [
            'B.Sc. in Mathematics and Computer Science',
            'High Honors and Honors in first two semesters',
            'Relocated internationally to pursue higher education.',
            'Built a strong foundation in programming through self-driven learning and projects.'
        ],
        timespent: '4 years'
    }
};
// panning variables
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let currentPanX = 0;
let currentPanY = 0;
let currentpanx= 0
let currentpany = 0;

if (themeToggle) {
    themeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<strong>☀</strong>' : '<strong>⏾</strong>';
        themeToggle.setAttribute('aria-pressed', String(isDark));
    });
}

// Hover Effects
countries.forEach(function(country) {
    country.addEventListener("mouseenter", function () {
        this.style.fill = "#c99aff";
    });

    country.addEventListener("mouseout", function () {
        this.style.fill = "#ececec";
    });

    // Click event
    country.addEventListener("click", async function () {
        const countryName = this.getAttribute("name") || this.getAttribute("class") || "";
        const countryId = this.getAttribute("id") || "";
        const className = this.getAttribute("class") || "";
        const normalizedName = (countryName || className)?.trim();
        const lookupName = normalizedName === "Cyprus" || normalizedName === "cyprus" ? "Cyprus" : normalizedName;
        let customData = customCountryData[countryId] || customCountryData[lookupName] || customCountryData[countryName] || customCountryData[className] || null;
        console.log('clicked country', { countryName, countryId, className, lookupName, customData: customData?.name || null });

        if (lookupName === "Cyprus" || countryId === "CY" || className === "Cyprus") {
            customData = {
                name: 'Cyprus',
                flag: 'https://flagcdn.com/w320/cy.png',
                achievements: [
                    'B.Sc. in Mathematics and Computer Science',
                    'High Honors and Honors in first two semesters',
                    'Relocated internationally to pursue higher education.',
                    'Built a strong foundation in programming through self-driven learning and projects.'
                ],
                timespent: '4 years'
            };
        } else if (countryId === "PS" || lookupName === "Palestine" || className === "Palestine") {
            customData = customCountryData["PS"];
        }

        if (instructionsDiv) instructionsDiv.classList.add("hide");
        if (countryInfoDiv) countryInfoDiv.classList.remove("hide");
        if (sidepanel) sidepanel.classList.add("active");

        if (countryname) countryname.innerText = customData?.name || countryName || countryId || "Country";

        let flagUrl = customData?.flag || "";

        if (!flagUrl && countryName) {
            try {
                const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
                if (response.ok) {
                    const data = await response.json();
                    const apiCountry = Array.isArray(data) && data[0] ? data[0] : null;
                    flagUrl = apiCountry?.flags?.png || "";
                }
            } catch (error) {
                console.error("Flag fetch failed:", error);
            }
        }

        if (flag) {
            if (flagUrl) {
                flag.src = flagUrl;
                flag.style.display = "block";
            } else {
                flag.style.display = "none";
            }
        }

        if (achievementsList) {
            achievementsList.innerHTML = "";
            if (customData?.achievements?.length) {
                customData.achievements.forEach(function (achievement) {
                    const li = document.createElement('li');
                    li.innerText = achievement;
                    achievementsList.appendChild(li);
                });
            } else {
                achievementsList.innerHTML = "<li>No achievements data available.</li>";
            }
        }

        if (timeSpentSpan) {
            timeSpentSpan.textContent = customData?.timespent || "N/A";
        }

        if (loading) loading.classList.add("hide");
        if (container) container.classList.remove("hide");
        if (closeBtn) closeBtn.classList.remove("hide");
    });
});

// Close side panel
if (closeBtn) {
    closeBtn.addEventListener("click", function () {
        if (sidepanel) {
            sidepanel.classList.add("closing");
            // Wait for animation to complete before hiding
            setTimeout(function() {
                sidepanel.classList.remove("active");
                sidepanel.classList.remove("closing");
                if (countryInfoDiv) countryInfoDiv.classList.add("hide");
                if (instructionsDiv) instructionsDiv.classList.remove("hide");
                if (closeBtn) closeBtn.classList.add("hide");
            }, 400);
        }
    });
}

// Close panel when clicking on map background
if (map) {
    map.addEventListener("click", function (event) {
        if (event.target === map) {
            sidepanel.classList.add("closing");
            // Wait for animation to complete before removing active
            setTimeout(function() {
                sidepanel.classList.remove("active");
                sidepanel.classList.remove("closing");
                if (closeBtn) closeBtn.classList.add("hide");
            }, 400);
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

//add wheel event for zooming with mouse wheel
function handleWheelZoom(e) {
    e.preventDefault(); //stop page from scrolling
    // deltay is negative when scrolling up (zoom in) and positive when scrolling down (zoom out)
    if (e.deltaY < 0) {
        //scroll up - zoom in
        handleZoomIn();
    } else if (e.deltaY > 0) {
        //scroll down - zoom out
        handleZoomOut();
    }
}
// attach wheel event to svg wrapper 
if (svgWrapper) {
    svgWrapper.addEventListener("wheel", handleWheelZoom, {passive: false});
}
