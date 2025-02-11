document.addEventListener('DOMContentLoaded', async (event) => {
    function waitForEmail(timeout = 5000) {
        return new Promise((resolve, reject) => {
            let elapsedTime = 0;
            const interval = 100; // Check every 100ms
    
            const checkEmail = setInterval(() => {
                const dropdownEmail = document.getElementById('dropdown-user-email');
                if (dropdownEmail && dropdownEmail.innerText.trim() !== "") {
                    clearInterval(checkEmail);
                    resolve(dropdownEmail.innerText.trim()); // Return email
                }
                elapsedTime += interval;
                if (elapsedTime >= timeout) {
                    clearInterval(checkEmail);
                    reject("Error: Email loading timed out");
                }
            }, interval);
        });
    }    



    const userEmail = await waitForEmail();
    try{
        const response = await fetch('http://localhost:3000/api/showClub', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userEmail})
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            const errorData = await response.json();
            console.log(errorData);
        }
    }catch(err){
        console.log(err)
    }    
});