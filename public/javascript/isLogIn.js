document.addEventListener('DOMContentLoaded', async () => {
    
    try{
        const userId = localStorage.getItem('userId');
        if(!userId){
            console.log("no user ID found");
            window.location.replace('/login');
        }else{
            const response = await fetch('/api/getInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId})
            });
    
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                console.log("logged in")
            } else {
                const errorData = await response.json();
                window.location.replace('/login')
            }
        }
    }catch(err){
        console.log(err)
    }    
});