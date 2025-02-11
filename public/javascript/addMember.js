document.addEventListener('DOMContentLoaded', async () => {
    const memberForm = document.getElementById('memberForm');
    memberForm.addEventListener('submit', async (e) =>{
        e.preventDefault();
        const memberName = document.getElementById('memberName').value;
        const memberEmail = document.getElementById('memberEmail').value;
        const memberPassword = document.getElementById('memberPassword').value;
        const clubName = document.getElementById('clubName').textContent;
        try{
            const response = await fetch('http://localhost:3000/api/addMember', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clubName, memberName, memberEmail, memberPassword })
            });
            if(response.ok){
                const data = await response.json();
                console.log(data);
            }else{
                console.log("server error");
            }
        }catch(error){
            console.log(`error:${error}`);
        }
    })
});