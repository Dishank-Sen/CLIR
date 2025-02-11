document.addEventListener('DOMContentLoaded',async () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent the default form submission
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        try{
          const response = await fetch('/api/adminVerify', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
          });
          if (response.ok) {
            const data = await response.json();
            const adminId = data.adminId;
            localStorage.setItem('adminId', adminId);
            window.location.replace('/adminDashboard');
          } else {
            const errorData = await response.json();
            // console.log(errorData);
            alert(`Error: ${errorData.message}`); // Display error message
          }
        }catch(error){
          alert('An error occurred: ' + error.message); 
        }
      });
});