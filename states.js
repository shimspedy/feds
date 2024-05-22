document.addEventListener('DOMContentLoaded', () => {
    const statesList = document.getElementById('states-list');
    const searchBar = document.getElementById('search-bar');
    let statesData = {};

    // Fetch GS data and populate the states list
    fetch('gs-data.json')
        .then(response => response.json())
        .then(data => {
            statesData = data;
            displayStates(Object.keys(statesData));
        });

    // Function to display the states
    function displayStates(states) {
        statesList.innerHTML = '';
        states.forEach(state => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = `state.html?state=${state}`;
            a.textContent = state;
            li.appendChild(a);
            statesList.appendChild(li);
        });
    }

    // Event listener for search bar input
    searchBar.addEventListener('input', (e) => {
        const searchString = e.target.value.toLowerCase();
        const filteredStates = Object.keys(statesData).filter(state => state.toLowerCase().includes(searchString));
        displayStates(filteredStates);
    });
});
