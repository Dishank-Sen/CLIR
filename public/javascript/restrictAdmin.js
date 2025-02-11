document.addEventListener('DOMContentLoaded', async () => {
    try{
        const userId = localStorage.getItem('adminId');
        const response = await fetch('/api/restrictAdmin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId})
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.message);
            if(window.location != '/adminDashboard'){
                window.location.replace('/adminDashboard');
            }
        } else {
            const errorData = await response.json();
            window.location.replace('/adminPortal');
        }
    }catch(err){
        console.log(err)
    }    
});