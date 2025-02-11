document.addEventListener('DOMContentLoaded', async () => {
    try{
        const userId = localStorage.getItem('adminId');
        const response = await fetch('http://localhost:3000/api/restrictAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId})
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            if(window.location != 'http://localhost:3000/adminDashboard'){
                window.location.replace('http://localhost:3000/adminDashboard');
            }
        } else {
            const errorData = await response.json();
            window.location.replace('http://localhost:3000/adminPortal');
        }
    }catch(err){
        console.log(err)
    }    
});