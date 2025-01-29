document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const path = window.location.pathname.split('/');
    const state = decodeURIComponent(path[path.length - 1]);
    console.log('State:', state);

    const stateNameElement = document.getElementById('state-name');
    stateNameElement.textContent = state;

    fetch('/state_pages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data);
            const stateData = data.states[state];
            if (stateData) {
                console.log('State data:', stateData);

                // Populate city list
                const cityList = document.getElementById('city-list');
                stateData.cities.forEach(city => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('collection-item');
                    listItem.innerHTML = `<a href="/${encodeURIComponent(state)}/${encodeURIComponent(city)}">${city}</a>`;
                    cityList.appendChild(listItem);
                });

                // Populate state codes
                const stateTableBody = document.getElementById('state-table').querySelector('tbody');
                stateData.codes.forEach(code => {
                    const row = document.createElement('tr');
                    row.innerHTML = `<td>${code}</td>`;
                    stateTableBody.appendChild(row);
                });
            } else {
                console.error(`No data available for state: ${state}`);
                console.log('Available states:', Object.keys(data.states));
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
