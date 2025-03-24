document.addEventListener('DOMContentLoaded', async () =>{
  // const loading = document.getElementById('loading');
  // loading.style.display = 'none';
  const institutesDropdown = document.getElementById('institutesDropdown');

  const addDropdown = (names) => {
      names.forEach((name) => {
        const option = document.createElement("option");
        option.value = `${name}`;
        option.text = `${name}`;
        institutesDropdown.appendChild(option);
    });
  }

  const retrieve = async () => {
    try {
      const response = await fetch('/api/retrieveInstituteNames');

      if(!response){
        console.log("response is empty");
        return null;
      }
      const data = await response.json();
      const names = Object.values(data.message);
      return names;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent the default form submission
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const institute = institutesDropdown.value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    document.getElementById('overlay').classList.remove('hidden');
    document.getElementById('loading').style.display = 'flex';
    if(password == confirmPassword) {
      try {
        // loading.style.display = 'block';
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, email, institute, password }),
        });
    

        if (response.ok) {
          // loading.style.display = 'none';
          const data = await response.json();
          // console.log(data);
          alert(data.message);
          window.location.replace('/login')
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`); 
        }
      } catch (error) {
        alert('An error occurred: ' + error.message); 
      }
    }else{
      alert('Passwords do not match');
    }
  });

  const names = await retrieve();
  addDropdown(names);
});