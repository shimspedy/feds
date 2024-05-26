document.addEventListener('DOMContentLoaded', () => {
    const menuPlaceholder = document.getElementById('menu-placeholder');
    
    fetch('./menu.html')
        .then(response => response.text())
        .then(data => {
            menuPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading menu:', error));
});
