document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    if(password == confirmPassword) {
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, password }),
        });
    
        // Check if the response is successful (status code 200-299)
        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          window.location.replace('/login')
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`); // Display error message
        }
      } catch (error) {
        alert('An error occurred: ' + error.message); // Handle network or other errors
      }
    }else{
      alert('Passwords do not match');
    }
  });