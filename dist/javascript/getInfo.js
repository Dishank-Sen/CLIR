document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const dropdownName = document.getElementById('dropdown-user-name');
    const dropdownEmail = document.getElementById('dropdown-user-email');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileIcon = document.getElementById('profile');
    try{
        const response = await fetch('http://localhost:3000/api/getInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId})
        });

        if (response.ok) {
            const data = await response.json();
            const username = data.username;
            const email = data.email;
            dropdownName.innerText = username;
            dropdownEmail.innerText = email;
        } else {
            const errorData = await response.json();
        }
    }catch(err){
        console.log(err)
    }    

    // Toggle dropdown visibility
    profileIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent document click handler from firing
        profileDropdown.classList.toggle('hidden');
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', () => {
        profileDropdown.classList.add('hidden');
    });

    // Stop dropdown from hiding when clicking inside it
    profileDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});