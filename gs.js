document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const state = urlParams.get('state');
    const grade = urlParams.get('grade');
    const gradeState = document.getElementById('grade-state');
    const gsTableBody = document.getElementById('gs-table').querySelector('tbody');

    gradeState.textContent = `${grade} in ${state}`;

    // Fetch GS data for the state and grade
    fetch('gs-data.json')
        .then(response => response.json())
        .then(data => {
            const stateData = data[state];
            if (stateData && stateData[grade]) {
                const gradeData = stateData[grade];
                gradeData.forEach(entry => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `<td>${entry.step}</td>
                                    <td>$${entry.salary}</td>`;
                    gsTableBody.appendChild(tr);
                });
            } else {
                gsTableBody.innerHTML = '<tr><td colspan="2">No data available for this grade.</td></tr>';
            }
        });
});
