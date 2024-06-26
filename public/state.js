document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/');
    const state = path[path.length - 1];
    const stateName = document.getElementById('state-name');
    stateName.classList.add('state-abbr');
    stateName.textContent = state;


    const stateTableBody = document.getElementById('state-table').querySelector('tbody');

    // Fetch GS data for the state
    fetch('/gs-data.json')
        .then(response => response.json())
        .then(data => {
            const stateData = data[state];
            if (stateData) {
                for (const grade in stateData) {
                    const row = document.createElement('tr');
                    let rowHTML = `<td><a href="../gs/${state}/${encodeURIComponent(grade)}">${grade}</a></td>`;
                    stateData[grade].forEach(stepData => {
                        rowHTML += `<td>${stepData.annual_salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>`;
                    });
                    row.innerHTML = rowHTML;
                    stateTableBody.appendChild(row);
                }
            } else {
                stateTableBody.innerHTML = '<tr><td colspan="11">No data available for this state.</td></tr>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
