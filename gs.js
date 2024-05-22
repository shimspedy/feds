document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const year = urlParams.get('year');
    const stateYear = document.getElementById('state-year');
    const gsTableBody = document.getElementById('gs-table').querySelector('tbody');

    stateYear.textContent = `${state} ${year}`;

    // Fetch GS data for the state and year
    fetch('./gs-data.json')
        .then(response => response.json())
        .then(data => {
            const stateData = data[state];
            const yearData = stateData.filter(entry => entry.year == year);
            yearData.forEach(entry => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<td>${entry.grade}</td>
                                <td>${entry.step}</td>
                                <td>${entry.salary}</td>`;
                gsTableBody.appendChild(tr);
            });
        });
});
