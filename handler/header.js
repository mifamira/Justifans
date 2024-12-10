function loadHeader() {
    fetch('header.html') 
        .then(response => response.text()) 
        .then(data => {
            document.getElementById('header').innerHTML = data;

            const menuButton = document.getElementById('menuButton');
            const mobileMenu = document.getElementById('mobileMenu');

            if (menuButton) {
                menuButton.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                });
            }
        })
        .catch(error => console.error('Error loading header:', error));
}

window.onload = loadHeader;
