// this will load all the available temp institute for review

document.addEventListener('DOMContentLoaded', async () => {
    // Function to create and append institute cards
    function displayInstitutes(data) {
        const container = document.getElementById("instituteContainer");
        container.innerHTML = ""; // Clear previous entries

        data.forEach(inst => {
            const card = document.createElement("div");
            card.className = "bg-white shadow-lg rounded-lg p-6";

            card.innerHTML = `
                <div class="flex items-center gap-4">
                    <img src="${inst.basicInfo.logo}" alt="Logo" class="w-14 h-14 rounded-full border" loading="lazy" width="56" height="56">
                    <div>
                        <h3 class="text-xl font-semibold text-gray-800">${inst.basicInfo.name}</h3>
                        <p class="text-gray-500">${inst.basicInfo.email}</p>
                    </div>
                </div>
                <div>
                <p class="mt-3 text-gray-600"><strong>Contact:</strong> +91 ${inst.basicInfo.contact}</p>
                <p class="text-gray-600"><strong>Location:</strong> ${inst.locationDetail.city}, ${inst.locationDetail.state}, ${inst.locationDetail.country}</p>
                <p class="text-gray-600"><strong>Pin Code:</strong>${inst.locationDetail.pinCode}</p>
                <p class="text-gray-600"><strong>Address:</strong>${inst.locationDetail.address}</p>
                <p class="text-gray-600"><strong>Map Location:</strong>${inst.locationDetail.mapLocation}</p>
                <p class="text-gray-600">
                    <strong>Website:</strong> 
                    <a href="${inst.basicInfo.website}" class="text-blue-500 underline" target="_blank">Visit</a>
                </p>
                <p class="text-gray-600"><strong>Registration Certificate:</strong><a href="${inst.documentDetail.registrationCertificate}" class="text-blue-500 underline" target="_blank">View</a></p>
                <p class="text-gray-600"><strong>Affilation Certificate:</strong><a href="${inst.documentDetail.affilationCertificate}" class="text-blue-500 underline" target="_blank">View</a></p>
                <p class="text-gray-600"><strong>Letter Head:</strong><a href="${inst.documentDetail.letterHead}" class="text-blue-500 underline" target="_blank">View</a></p>
                </div>
                <div class="mt-4 flex flex-row justify-between">
                    <div>
                        <button class="bg-[#28a745] text-gray-800 px-4 py-2 rounded-md hover:bg-[#1e7e34]" id="approve_${encodeURIComponent(inst.basicInfo.name)}" onclick="approve(this.id)">Approve</button>
                    </div>
                    <div>
                        <button class="bg-[#dc3545] text-gray-800 px-4 py-2 rounded-md hover:bg-[#c82333]" id="reject_${encodeURIComponent(inst.basicInfo.name)}" onclick="reject(this.id)">Reject</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    }

    // Function to fetch data from API
    async function fetchInstitutes() {
        try {
            const response = await fetch("/api/tempInstitutes");
            const data = await response.json();
            if(!data){
                console.log("no institute");
            }else{
                displayInstitutes(data);
            }
        } catch (error) {
            console.error("Error fetching institute data:", error);
        }
    }

    // Search Functionality
    document.getElementById("searchInput").addEventListener("input", function () {
        const searchValue = this.value.toLowerCase();
        const filteredInstitutes = institutes.filter(inst =>
            inst.name.toLowerCase().includes(searchValue) ||
            inst.city.toLowerCase().includes(searchValue) ||
            inst.state.toLowerCase().includes(searchValue)
        );
        displayInstitutes(filteredInstitutes);
    });

    // Load data on page load
    fetchInstitutes();

});

async function approve(id) {
    try {
        const name = decodeURIComponent(id.split("_")[1]);
        const response = await fetch('/api/approve',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name:name})
        });

        if(response.ok){
            const data = await response.json();
            alert(data.message);
            window.location.reload();
        }else{
            alert("some error occured while fetching");
        }
    } catch (error) {
        console.log(error);
        alert(error);
    }
}

async function reject(id) {
    try {
        const name = decodeURIComponent(id.split("_")[1]);
        const response = await fetch('/api/reject',{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name:name})
        });

        if(response.ok){
            const data = await response.json();
            alert(data.message);
            window.location.reload();
        }else{
            alert("some error occured while fetching");
        }
    } catch (error) {
        console.log(error);
        alert(error);
    }
}
