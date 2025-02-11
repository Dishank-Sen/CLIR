document.addEventListener('DOMContentLoaded', async () => {

  const showLoading = () => {
    document.getElementById('loading-container').style.display = 'flex'; // Show loading spinner
  };

  const hideLoading = () => {
    document.getElementById('loading-container').style.display = 'none'; // Hide loading spinner
  };

  document.getElementById('fileForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const fileInput = document.getElementById('resourceFile');
    const fileDescription = document.getElementById('fileDescription');
    const clubName = document.getElementById('clubName').textContent;
    const formData = new FormData(); // Create a new FormData object to hold the file

    formData.append('file', fileInput.files[0]); // Append the file to the FormData
    formData.append('fileDescription', fileDescription.value);
    formData.append('clubName', clubName);

    // Show loading spinner before sending request
    showLoading();

    try {
      // Send the file to the server using the Fetch API
      const response = await fetch('/api/addFile', {
        method: 'POST',
        body: formData, // Send FormData (which includes the file)
      });

      // Check for success or failure
      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json(); // Get the server response
      document.getElementById('resourceMessage').textContent = `File uploaded successfully!`;
      console.log(result);
    } catch (error) {
      document.getElementById('resourceMessage').textContent = `Error: ${error.message}`;
      console.error('Error:', error);
    } finally {
      // Hide loading spinner after receiving response
      hideLoading();
    }
  });

  document.getElementById('linkForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const resourceLink = document.getElementById('resourceLink').value;
    const linkDescription = document.getElementById('linkDescription').value;
    const clubName = document.getElementById('clubName').textContent;

    // Show loading spinner before sending request
    showLoading();

    try {
      const response = await fetch('/api/addLink', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clubName, resourceLink, linkDescription }) // Send JSON
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      document.getElementById('resourceMessage').textContent = `Link uploaded successfully!`;
      console.log(result);
    } catch (error) {
      document.getElementById('resourceMessage').textContent = `Error: ${error.message}`;
      console.error('Error:', error);
    } finally {
      // Hide loading spinner after receiving response
      hideLoading();
    }
  });

});
