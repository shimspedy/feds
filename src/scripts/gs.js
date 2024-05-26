document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/');
    const city = path[path.length - 2];
    const gradeFormatted = decodeURIComponent(path[path.length - 1]);
    const grade = gradeFormatted.replace(/GS/g, 'GS');  // no space after GS


    const stateName = document.getElementById('state-name');
    stateName.classList.add('locality-code');
    stateName.classList.add('state-abbr');
    stateName.textContent = city;


    const gsTableBody = document.getElementById('gs-table').querySelector('tbody');

    // Fetch GS data for the state and grade
    fetch('/data/gs-data.json')
        .then(response => response.json())
        .then(data => {
            const cityData = data[city];
            if (cityData && cityData[grade]) {
                const gradeData = cityData[grade];
                gradeData.forEach(entry => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>Step ${entry.step}</td>
                                    <td>${entry.hourly_salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    <td>${entry.overtime_salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
                                    <td>${entry.annual_salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>`;
                    gsTableBody.appendChild(tr);
                });
            } else {
                gsTableBody.innerHTML = '<tr><td colspan="4">No data available for this grade.</td></tr>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
