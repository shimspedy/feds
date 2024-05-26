document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/');
    const city = path[path.length - 2];
    const gradeFormatted = decodeURIComponent(path[path.length - 1]);
    const grade = gradeFormatted.replace(/LEO/g, 'LEO');  // no space after LEO


    const stateName = document.getElementById('state-name');
    stateName.classList.add('locality-code');
    stateName.classList.add('state-abbr');
    stateName.textContent = city;


    const leoTableBody = document.getElementById('leo-table').querySelector('tbody');

    // Fetch leo data for the state and grade
    fetch('/leo-data.json')
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
                    leoTableBody.appendChild(tr);
                });
            } else {
                leoTableBody.innerHTML = '<tr><td colspan="4">No data available for this grade.</td></tr>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
