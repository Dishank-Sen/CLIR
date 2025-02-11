document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("clubForm").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Create a FormData object
    const formData = new FormData();
    formData.append("clubName", document.getElementById("clubName").value);
    formData.append("adminName", document.getElementById("adminName").value);
    formData.append("adminEmail", document.getElementById("adminEmail").value);
    formData.append("adminPhone", document.getElementById("adminPhone").value);
    formData.append("category", document.getElementById("category").value);
    formData.append("clubEmail", document.getElementById("clubEmail").value);
    formData.append("clubPassword", document.getElementById("clubPassword").value);
    formData.append("permissionPassword", document.getElementById("permissionPassword").value);

    // Append files separately
    formData.append("adminProfileImage", document.getElementById("adminProfileImage").files[0]);
    formData.append("clubIcon", document.getElementById("clubIcon").files[0]);
    formData.append("permissionDocument", document.getElementById("permissionDocument").files[0]);

    try {
      const response = await fetch("http://localhost:3000/api/createClub", {
        method: "POST",
        body: formData, // No need to set `Content-Type`, Fetch will set it automatically
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log(data.message);
        alert(data.message);
        // window.location.replace('http://localhost:3000/login')
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred: " + error.message);
    }
  });
});
