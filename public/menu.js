document.addEventListener('DOMContentLoaded', () => {
    // Ensure the canonical link tag exists
    const canonicalUrl = `https://fedspay.com${window.location.pathname}`;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Fetch and insert the menu only if it is not already present
    const menuPlaceholder = document.getElementById('menu-placeholder');
    if (!menuPlaceholder || menuPlaceholder.innerHTML.trim()) {
        return;
    }

    fetch('/menu.html')
        .then(response => response.text())
        .then(data => {
            menuPlaceholder.innerHTML = data;
            document.dispatchEvent(new CustomEvent('menu:loaded'));
        })
        .catch(error => console.error('Error loading menu:', error));
});
