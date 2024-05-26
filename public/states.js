document.addEventListener('DOMContentLoaded', () => {
    const statesList = document.getElementById('states-list');
    const searchBar = document.getElementById('search-bar');
    const stateMap = {
        "AL": "Albany-Schenectady, NY-MA",
        "AQ": "Albuquerque-Santa Fe-Las Vegas, NM",
        "ATL": "Atlanta-Athens-Clarke County-Sandy Springs, GA-AL",
        "AU": "Austin-Round Rock-Georgetown, TX",
        "BH": "Birmingham-Hoover-Talladega, AL",
        "BOS": "Boston-Worcester-Providence, MA-RI-NH-CT-ME-VT",
        "BU": "Buffalo-Cheektowaga-Olean, NY",
        "BN": "Burlington-South Burlington-Barre, VT",
        "CT": "Charlotte-Concord, NC-SC",
        "CHI": "Chicago-Naperville, IL-IN-WI",
        "CIN": "Cincinnati-Wilmington-Maysville, OH-KY-IN",
        "CLE": "Cleveland-Akron-Canton, OH-PA",
        "CS": "Colorado Springs, CO",
        "COL": "Columbus-Marion-Zanesville, OH",
        "CC": "Corpus Christi-Kingsville-Alice, TX",
        "DFW": "Dallas-Fort Worth, TX-OK",
        "DV": "Davenport-Moline, IA-IL",
        "DAY": "Dayton-Springfield-Kettering, OH",
        "DEN": "Denver-Aurora, CO",
        "DM": "Des Moines-Ames-West Des Moines, IA",
        "DET": "Detroit-Warren-Ann Arbor, MI",
        "FN": "Fresno-Madera-Hanford, CA",
        "HB": "Harrisburg-Lebanon, PA",
        "HAR": "Hartford-East Hartford, CT-MA",
        "HOU": "Houston-The Woodlands, TX",
        "HNT": "Huntsville-Decatur, AL-TN",
        "IND": "Indianapolis-Carmel-Muncie, IN",
        "KC": "Kansas City-Overland Park-Kansas City, MO-KS",
        "LR": "Laredo, TX",
        "LV": "Las Vegas-Henderson, NV-AZ",
        "LA": "Los Angeles-Long Beach, CA",
        "MFL": "Miami-Port St. Lucie-Fort Lauderdale, FL",
        "MIL": "Milwaukee-Racine-Waukesha, WI",
        "MSP": "Minneapolis-St. Paul, MN-WI",
        "NY": "New York-Newark, NY-NJ-CT-PA",
        "OM": "Omaha-Council Bluffs-Fremont, NE-IA",
        "PB": "Palm Bay-Melbourne-Titusville, FL",
        "PHL": "Philadelphia-Reading-Camden, PA-NJ-DE-MD",
        "PX": "Phoenix-Mesa, AZ",
        "PIT": "Pittsburgh-New Castle-Weirton, PA-OH-WV",
        "POR": "Portland-Vancouver-Salem, OR-WA",
        "RA": "Raleigh-Durham-Cary, NC",
        "RN": "Reno-Fernley, NV",
        "RCH": "Richmond, VA",
        "RT": "Rochester-Batavia-Seneca Falls, NY",
        "SAC": "Sacramento-Roseville, CA-NV",
        "SO": "San Antonio-New Braunfels-Pearsall, TX",
        "SD": "San Diego-Chula Vista-Carlsbad, CA",
        "SF": "San Jose-San Francisco-Oakland, CA",
        "SEA": "Seattle-Tacoma, WA",
        "SN": "Spokane-Spokane Valley-Coeur d'Alene, WA-ID",
        "SL": "St. Louis-St. Charles-Farmington, MO-IL",
        "TU": "Tucson-Nogales, AZ",
        "VB": "Virginia Beach-Norfolk, VA-NC",
        "DCB": "Washington-Baltimore-Arlington, DC-MD-VA-WV-PA",
        "RUS": "Rest of U.S.",
        "AK": "State of Alaska",
        "HI": "State of Hawaii"
    };

    let statesData = {};

    // Fetch GS data and populate the states list
    fetch('/gs-data.json')
        .then(response => response.json())
        .then(data => {
            statesData = data;
            displayStates(Object.keys(stateMap));
        });

    // Function to display the states
    function displayStates(states) {
        statesList.innerHTML = '';
        states.forEach(state => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><a href="/state/${state}" class="state-abbr">${stateMap[state]}</a></td>
                <td>${state}</td>
            `;
            statesList.appendChild(row);
        });
    }

    // Event listener for search bar input
    searchBar.addEventListener('input', (e) => {
        const searchString = e.target.value.toLowerCase();
        const filteredStates = Object.keys(stateMap).filter(state => stateMap[state].toLowerCase().includes(searchString));
        displayStates(filteredStates);
    });

    // Replace state abbreviations with full names
    function replaceStateAbbreviations() {
        const stateElements = document.querySelectorAll('.state-abbr');

        stateElements.forEach(element => {
            const abbr = element.textContent.trim();
            if (stateMap[abbr]) {
                element.textContent = stateMap[abbr];
            }
        });
    }

    document.addEventListener('DOMContentLoaded', replaceStateAbbreviations);
});
