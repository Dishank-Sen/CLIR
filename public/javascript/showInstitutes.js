// this will show all the approved institute in the institute Section

// const { urlencoded } = require("body-parser");

document.addEventListener('DOMContentLoaded', async () => {
    // Function to create and append institute cards
    let instituteName;

    function displayInstitutes(data) {
        const container = document.getElementById("instituteContainer");
        container.innerHTML = ""; // Clear previous entries

        data.forEach(inst => {
            const card = document.createElement("div");
            card.className = "p-4";

            card.innerHTML = `
                <div class="w-full h-auto sm:w-1/2 md:w-1/3 bg-gray-200 p-4 rounded-lg grid grid-rows-3 shadow-md gap-6">
                    <div class="flex justify-center">
                        <img src="${inst.logo}" alt="" class="w-14 h-14 rounded-full">
                    </div>
                    <div class="flex justify-center gap-4">
                        <h1 class="text-3xl font-bold" id="instituteName">${inst.name}</h1>
                        <a href="${inst.website}"><img src="./images/link-svgrepo-com.svg" alt="" class="h-6 w-auto"></a>
                    </div>
                    <div class="flex justify-start gap-4">
                        <img src="./images/email-1-svgrepo-com.svg" alt="" class="h-8 w-auto">
                        <p class="text-md text-gray-600">${inst.email}</p>
                    </div>
                    <div class="flex justify-start gap-4">
                        <img src="./images/profile.svg" alt="" class="h-8 w-auto">
                        <p class="text-md text-gray-600">${inst.contact}</p>
                    </div>
                    <div class="flex justify-center">
                        <button class="bg-blue-500 rounded-lg px-4 py-2 text-xl font-bold text-white" id="explore">Explore</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Function to fetch data from API
    async function fetchInstitutes() {
        try {
            const response = await fetch("/api/institutes");
            const data = await response.json();
            if(!data.message){
                console.log("no institute");
            }else{
                instituteName = data.message;
                displayInstitutes(data.message);
            }
        } catch (error) {
            console.error("Error fetching institute data:", error);
        }
    }

    // This function will send the name of the institutes in the url when explore button is clicked

    const sendInstituteName = (instituteName) => {
        const urlencodedName = encodeURIComponent(instituteName);
        document.getElementById('explore').addEventListener('click', () => {
            window.location.assign(`/loadClubs/${urlencodedName}`);
        })

    }

    fetchInstitutes();
    sendInstituteName(instituteName)
});