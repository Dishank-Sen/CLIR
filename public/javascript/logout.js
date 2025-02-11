document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');
    const logout = document.getElementById('logout');
    logout.addEventListener('click', async () => {
        try{
            const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId})
            });
    
            if (response.ok) {
                console.log('Logged out successfully');
                localStorage.removeItem('userId'); 
                window.location.replace('/login') 
            } else {
                const errorData = await response.json();
            }
        }catch(err){
            console.log(err)
        }    
    })
});