document.addEventListener('DOMContentLoaded', async (e) => {
    const profile = document.getElementById('profile');
    const login = document.getElementById('login');
    const signup = document.getElementById('signup');
    const userId = localStorage.getItem('userId');
    try{
        const response = await fetch('http://localhost:3000/api/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId}),
        credentials : 'include'
        });

        if (response.ok) {
            const data = await response.json();
            // console.log(data.message);
            login.style.display = 'none'
            signup.style.display = 'none'
            profile.style.display = 'block'
        } else {
            const errorData = await response.json();
        }
    }catch(err){
        // console.log(err)
    }    
});