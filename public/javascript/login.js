document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try{
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      if (response.ok) {
        const data = await response.json();
        const userId = data.userId;
        // console.log(userId);
        // console.log(data);
        // console.log(data.message);
        localStorage.setItem('userId', userId);
        window.location.replace('/');
      } else {
        const errorData = await response.json();
        // console.log(errorData);
        alert(`Error: ${errorData.message}`); // Display error message
      }
    }catch(error){
      alert('An error occurred: ' + error.message); 
    }
  });