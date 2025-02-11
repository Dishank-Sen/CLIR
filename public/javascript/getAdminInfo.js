document.addEventListener('DOMContentLoaded', async () => {
    const adminId = localStorage.getItem('adminId');
    const clubName = document.getElementById('clubName');
    try{
        const response = await fetch('/api/getAdminInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({adminId})
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data.adminInfo);
            clubName.innerText = data.adminInfo.clubName;
        } else {
            const errorData = await response.json();
        }
    }catch(err){
        console.log(err)
    }    
});