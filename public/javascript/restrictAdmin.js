document.addEventListener("DOMContentLoaded", async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      if(!adminId){
        console.log("no Admin ID found");
      }else{
        const response = await fetch("/api/restrictAdmin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminId }),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log(data.message);
    
          // ✅ Fix: Redirect only if NOT already on '/adminDashboard'
          if (window.location.pathname !== "/adminDashboard") {
            window.location.replace("/adminDashboard");
          }
        } else {
          const errorData = await response.json();
          console.log(errorData.message);
    
          // ✅ Fix: Redirect only if NOT already on '/adminPortal'
          if (window.location.pathname !== "/adminPortal") {
            window.location.replace("/adminPortal");
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
  