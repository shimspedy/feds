document.addEventListener('DOMContentLoaded', () => {
    // Insert the canonical link tag
    const canonicalUrl = `https://www.afrixi.com${window.location.pathname}`;
    const linkElement = document.createElement('link');
    linkElement.setAttribute('rel', 'canonical');
    linkElement.setAttribute('href', canonicalUrl);
    document.head.appendChild(linkElement);

    // Fetch and insert the menu
    const menuPlaceholder = document.getElementById('menu-placeholder');
    
    fetch('/menu.html')
        .then(response => response.text())
        .then(data => {
            menuPlaceholder.innerHTML = data;
        })
        .catch(error => console.error('Error loading menu:', error));
});
