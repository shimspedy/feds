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

function replaceStateAbbreviations() {
    const path = window.location.pathname.split('/');
    const isLeoPage = path.includes('leo'); // Check if the URL includes 'leo' indicating it's a LEO page
    
    const stateElements = document.querySelectorAll('.state-abbr');
    
    stateElements.forEach(element => {
        const abbr = element.textContent.trim();
        if (stateMap[abbr]) {
            const fullName = stateMap[abbr];
            element.textContent = fullName;
            
            if (isLeoPage) {
                // Fetch LEO data and update the title for LEO page
                const state = path[path.length - 2];
                const gradeFormatted = decodeURIComponent(path[path.length - 1]);
                const grade = gradeFormatted.replace(/LEO/g, 'LEO');  // Add space after LEO

                fetch('/leo-data.json')
                    .then(response => response.json())
                    .then(data => {
                        const stateData = data[state];
                        if (stateData && stateData[grade]) {
                            const pageTitle = `${grade} Law Enforcement and Police Officer Salary Information in ${fullName}`;
                            document.title = pageTitle;
                            if (element.tagName === 'H1') {
                                element.textContent = pageTitle;
                            }
                            updateMetaDescription(`${pageTitle} -Detailed information on salaries, hourly rates, and overtime rates for Law Enforcement Officers and police officers. Learn how much cops make and explore comprehensive salary data.`);
                        } else {
                            const pageTitle = `Law Enforcement and Police Officer Salary Information in ${fullName}`;
                            document.title = pageTitle;
                            if (element.tagName === 'H1') {
                                element.textContent = pageTitle;
                            }
                            updateMetaDescription(`${pageTitle} - Detailed information on salaries, hourly rates, and overtime rates for Law Enforcement Officers and police officers. Learn how much cops make and explore comprehensive salary data.`);
                        }
                    })
                    .catch(error => console.error('Error fetching data:', error));
            } else {
                // Update the title and H1 for State page
                const pageTitle = `Law Enforcement and Police Officer Salary Information in ${fullName}`;
                document.title = pageTitle;
                if (element.tagName === 'H1') {
                    element.textContent = pageTitle;
                }
                updateMetaDescription(`${pageTitle} - Explore detailed salary information forLaw Enforcement and Police Officer Salary Information by state.`);
            }
        }
    });
}

function updateMetaDescription(description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
    }
    metaDescription.content = description;
}

document.addEventListener('DOMContentLoaded', replaceStateAbbreviations);
