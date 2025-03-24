document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const profileDropdown = document.getElementById('profileDropdown');
    const profileIcon = document.getElementById('profile');
    const retrieveUserData = async (userId) => {
        try{
            const response = await fetch('/api/getInfo', {
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
                document.getElementById('login').classList.add('hidden');
                document.getElementById('signup').classList.add('hidden');
                profileIcon.style.display = 'flex';
                return {username,email};
            } else {
                console.log("error in fetching");
                return null;
            }
        }catch(err){
            console.log(err)
        }    
    }
    
    const addProfileDropdown = (username,email) => {
        profileDropdown.innerHTML = `<div class="p-4 border-b border-gray-200 flex items-center justify-center flex-col">
            <p id="dropdown-user-name" class="font-medium text-gray-700">${username}</p>
            <p id="dropdown-user-email" class="text-sm text-gray-500">${email}</p>
          </div>
          <div class="p-4 border-b border-gray-200 flex items-center justify-center flex-col">
            <p id="logout" class="font-medium text-gray-700 cursor-pointer">Logout -></p>
          </div>`
    }

    // Toggle dropdown visibility
    profileIcon.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent document click handler from firing
        profileDropdown.classList.toggle('hidden');
        addProfileDropdown(username,email);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', () => {
        profileDropdown.classList.add('hidden');
    });

    // Stop dropdown from hiding when clicking inside it
    profileDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    const {username,email} = await retrieveUserData(userId);
});