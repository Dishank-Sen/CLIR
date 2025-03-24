document.addEventListener('DOMContentLoaded', async (e) => {
    const profile = document.getElementById('profile');
    const login = document.getElementById('login');
    const signup = document.getElementById('signup');
    try{
        const userId = localStorage.getItem('userId');
        if(!userId){
            console.log("no user ID found");
        }else{
            const response = await fetch('/api/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId}),
            credentials : 'include'
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                login.style.display = 'none'
                signup.style.display = 'none'
                profile.style.display = 'block'
            } else {
                const errorData = await response.json();
                console.log(errorData);
            }
        }
    }catch(err){
        console.log(err)
    }    
});