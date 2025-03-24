document.addEventListener('DOMContentLoaded', async () => {
    const clubSection = document.getElementById('clubSection'); 
    try{
        const response = await fetch('/api/miscellaneous', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
        });

        if (response.ok) {
            const clubs = await response.json();
            console.log(clubs);
            if(clubs.length > 2){
                clubSection.classList.add('sm:grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');
            }
            if (clubs.length > 0) {
                clubs.forEach(club => {
                  // Create a new div for each club
                  const clubElement = document.createElement('div');
                  clubElement.classList.add('club-card', 'bg-white', 'p-4', 'mb-6', 'rounded-lg', 'shadow-md','flex','flex-col','items-center','justify-center');
          
                  // Populate the club card with the club's data
                  clubElement.innerHTML = `
                    <div class="club-header flex justify-between items-center mb-4">
                      <h2 class="text-2xl font-bold text-gray-700">${club.clubName}</h2>
                    </div>
                    <div class="club-icons flex space-x-4">
                      <img src="${club.icon}" class="h-60 w-auto">
                    </div>
                    <div class="bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold rounded-full w-52 h-16 flex items-center justify-center mx-auto my-6">
                        <a href="/clubDetail/${encodeURIComponent(club.clubName)}">Explore</a>
                    </div>
                  `;
                  // Append the club card to the clubs section
                  clubSection.appendChild(clubElement);
                });
              } else {
                clubSection.innerHTML = '<p>No miscellaneous clubs found.</p>';  // Show a message if no clubs exist
              }
        } else {
            const errorData = await response.json();
        }
    }catch(err){
        console.log(err)
    }    
});