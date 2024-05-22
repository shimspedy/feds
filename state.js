document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const stateName = document.getElementById('state-name');
    const stateTableBody = document.getElementById('state-table').querySelector('tbody');

    stateName.textContent = `GS Information for ${state}`;

    // Fetch GS data for the state
    fetch('./gs-data.json')
        .then(response => response.json())
        .then(data => {
            const stateData = data[state];
            stateData.forEach(entry => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td><a href="gs.html?state=${state}&year=${entry.year}">${entry.year}</a></td>
                                <td>${entry.grade}</td>
                                <td>${entry.step}</td>
                                <td>${entry.salary}</td>`;
                stateTableBody.appendChild(tr);
            });
        });
});
