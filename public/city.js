document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/');
    const state = path[path.length - 2];
    const city = path[path.length - 1];
    const cityNameElement = document.getElementById('city-name');
    cityNameElement.textContent = city;

    fetch('./state_pages.json')
        .then(response => response.json())
        .then(data => {
            const stateData = data.states[state];
            if (stateData) {
                // Populate city codes (same as state codes for now)
                const cityTableBody = document.getElementById('city-table').querySelector('tbody');
                stateData.codes.forEach(code => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${code}</td>`;
                    cityTableBody.appendChild(row);
                });
            } else {
                console.error(`No data available for state: ${state}`);
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
