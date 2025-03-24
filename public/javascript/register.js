// this will take all the data of institute and save it to the temporary database

document.addEventListener('DOMContentLoaded', async () =>{
    const basicInfo = document.getElementById('basicInfo');
    const locationDetail = document.getElementById('locationDetail');
    const documentDetail = document.getElementById('documentDetail');
    const form1 = document.getElementById('form1');
    const form2 = document.getElementById('form2');
    const form3 = document.getElementById('form3');
    const locationBack = document.getElementById('locationBack');
    const documentBack = document.getElementById('documentBack');
    const countryDropdown = document.getElementById('countryDropdown');
    const stateDropdown = document.getElementById('stateDropdown');
    const cityDropdown = document.getElementById('cityDropdown');
    const formData = new FormData();
    let count = 0;

    basicInfo.addEventListener('submit', (e) => {
        if(count == 0){
            count++;
            e.preventDefault();
            const instituteName = document.getElementById('instituteName').value;
            const instituteEmail = document.getElementById('instituteEmail').value;
            const instituteContact = document.getElementById('instituteContact').value;
            const instituteWebsite = document.getElementById('instituteWebsite').value;
            const instituteLogo = document.getElementById('instituteLogo');
            formData.append("instituteName",instituteName);
            formData.append("instituteEmail",instituteEmail);
            formData.append("instituteContact",instituteContact);
            formData.append("instituteWebsite",instituteWebsite);
            formData.append("instituteLogo",instituteLogo.files[0]);
            form1.style.display = 'none';
            form3.style.display = 'none';
            form2.style.display = 'flex';
        }else{
            e.preventDefault();
            form1.style.display = 'none';
            form3.style.display = 'none';
            form2.style.display = 'flex';
        }
    });

    locationDetail.addEventListener('submit', (e) => {
        if(count == 1){
            count++;
            e.preventDefault();
            const country = document.getElementById('country').value;
            const state = document.getElementById('state').value;
            const city = document.getElementById('city').value;
            const pinCode = document.getElementById('pinCode').value;
            const address = document.getElementById('address').value;
            const mapLocation = document.getElementById('mapLocation').value;
            formData.append("country",country);
            formData.append("state",state);
            formData.append("city",city);
            formData.append("pinCode",pinCode);
            formData.append("address",address);
            formData.append("mapLocation",mapLocation);
            form2.style.display = 'none';
            form1.style.display = 'none';
            form3.style.display = 'flex';
        }else{
            e.preventDefault();
            form2.style.display = 'none';
            form1.style.display = 'none';
            form3.style.display = 'flex';
        }
    });

    documentDetail.addEventListener('submit', async (e) => {
        if(count == 2){
            e.preventDefault();
            const registrationCertificate = document.getElementById('registrationCertificate');
            const affilationCertificate = document.getElementById('affilationCertificate');
            const letterHead = document.getElementById('letterHead');
            formData.append("registrationCertificate",registrationCertificate.files[0]);
            formData.append("affilationCertificate",affilationCertificate.files[0]);
            formData.append("letterHead",letterHead.files[0]);
            document.getElementById('overlay').classList.remove('hidden');
            document.getElementById('loading').style.display = 'flex';
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: formData,
                });

                if(response.ok){
                    const data = await response.json();
                    alert(data.message);
                    window.location.replace('http://localhost:3000');
                }else{
                    alert("some error occured while fetching the response");
                }
            } catch (error) {
                console.log(error);
                alert(error);
            }
        }else{
            e.preventDefault();
            form1.style.display = 'none';
            form3.style.display = 'none';
            form2.style.display = 'flex';
        }
    });

    locationBack.addEventListener('click', () => {
        form2.style.display = 'none';
        form3.style.display = 'none';
        form1.style.display = 'flex';
    });

    documentBack.addEventListener('click', () => {
        form3.style.display = 'none';
        form1.style.display = 'none';
        form2.style.display = 'flex';
    });

    const addDropdown = (countries) => {
        countries.forEach((country) => {
            const countryOption = document.createElement("option");
            countryOption.value = country.country;
            countryOption.textContent = country.country;
            countryDropdown.appendChild(countryOption);
        });
    
        // Clear state and city dropdowns when country changes
        countryDropdown.addEventListener('change', () => {
    
            const selectedCountry = countries.find(c => c.country === countryDropdown.value);
            if (selectedCountry) {
                selectedCountry.states.forEach(state => {
                    const stateOption = document.createElement("option");
                    stateOption.value = state.state;
                    stateOption.textContent = state.state;
                    stateDropdown.appendChild(stateOption);
                });
            }
        });
    
        // Populate cities when state is selected
        stateDropdown.addEventListener('change', () => {
            
            const selectedCountry = countries.find(c => c.country === countryDropdown.value);
            if (selectedCountry) {
                const selectedState = selectedCountry.states.find(s => s.state === stateDropdown.value);
                if (selectedState) {
                    selectedState.cities.forEach(city => {
                        const cityOption = document.createElement("option");
                        cityOption.value = city;
                        cityOption.textContent = city;
                        cityDropdown.appendChild(cityOption);
                    });
                }
            }
        });
    };
    

    const retrieve = async () => {
        try {
          const response = await fetch('/api/retrieveRegionData');
    
          if(!response){
            console.log("response is empty");
            return null;
          }
          const data = await response.json();
          const countries = Object.values(data.message);
          return countries;
        } catch (error) {
          console.log(error);
          return null;
        }
      }

    const countries = await retrieve();
    addDropdown(countries);
});