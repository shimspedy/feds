document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname.split('/');
    const state = path[path.length - 2];
    const grade = decodeURIComponent(path[path.length - 1]);
    const stateName = document.getElementById('state-name');
    const gradeName = document.getElementById('grade-name');
    
    stateName.classList.add('locality-code');
    gradeName.textContent = grade;
    stateName.textContent = state;
    
    // Update the title of the page
    document.title = `GS Information for ${state} - ${grade}`;

    const gradeTableBody = document.getElementById('grade-table').querySelector('tbody');

    // Fetch GS data for the state and grade
    fetch('/gs-data.json')
        .then(response => response.json())
        .then(data => {
            const stateData = data[state];
            if (stateData && stateData[grade]) {
                const gradeData = stateData[grade];
                gradeData.forEach(entry => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${entry.step}</td>
                                    <td>${entry.salary.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>`;
                    gradeTableBody.appendChild(tr);
                });
            } else {
                gradeTableBody.innerHTML = '<tr><td colspan="2">No data available for this grade.</td></tr>';
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});
