document.addEventListener('DOMContentLoaded', async () => {
    const clubForm = document.getElementById('passwordForm');
    
    clubForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const clubName = document.getElementById('clubName').value;
        const clubEmail = document.getElementById('clubEmail').value;
        const clubPassword = document.getElementById('clubPassword').value;
        try{
            const response = await fetch('/api/passwordManager', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clubName, clubEmail, clubPassword })
            })

            if(response.ok){
                const data = await response.json();
                console.log(data);
            }else{
                console.log("server error");
            }
        }catch(error){
            console.log(error);
        }
    });
});