document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    try{
        const response = await fetch('/api/getInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId})
        });

        if (response.ok) {
            console.log("logged in")
        } else {
            const errorData = await response.json();
            window.location.replace('/login')
        }
    }catch(err){
        console.log(err)
    }    
});