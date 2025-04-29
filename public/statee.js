// BACKUP FILE - NOT IN USE
// This is a backup of the original states list implementation that used state_pages.json
// The active implementation is now in states.js which uses gs-data.json

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    fetch('/state_pages.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data fetched:', data);
            const states = Object.keys(data.states);
            const statesList = document.getElementById('states-list');

            states.forEach(state => {
                const listItem = document.createElement('li');
                listItem.classList.add('collection-item');
                listItem.innerHTML = `<a href="/${encodeURIComponent(state)}">${state}</a>`;
                statesList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});
