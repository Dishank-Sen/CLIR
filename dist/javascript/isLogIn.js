document.addEventListener('DOMContentLoaded', async () => {
    const userId = localStorage.getItem('userId');

    try{
        const response = await fetch('http://localhost:3000/api/getInfo', {
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
            window.location.replace('http://localhost:3000/login')
        }
    }catch(err){
        console.log(err)
    }    
});