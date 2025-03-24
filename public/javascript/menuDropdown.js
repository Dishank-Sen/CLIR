document.addEventListener('DOMContentLoaded', () => {
    const menuDropdown = document.getElementById('menuDropdown');
    const menu = document.getElementById('menu');
    
    // Toggle dropdown visibility
    menu.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent document click handler from firing
        menuDropdown.classList.toggle('hidden');
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', () => {
        menuDropdown.classList.add('hidden');
    });

    // Stop dropdown from hiding when clicking inside it
    menu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

});