// const fs = require('fs');

// const filteredData = []; // Initialize an empty array

// const retrieve = () => {
//     try {
//         const data = fs.readFileSync('./jsonFiles/regionData.json', "utf-8");
//         const jsonData = JSON.parse(data);

//         jsonData.forEach((country) => { 
//             filteredData.push({
//                 country: country.name, 
//                 phoneCode: country.phonecode, 
//                 states: country.states.map(state => ({
//                     state: state.name, 
//                     cities: state.cities.map(city => (city.name)) || [] 
//                 }))
//             });
//         });
//         fs.writeFileSync('./jsonFiles/filteredData.json', JSON.stringify(filteredData, null, 2), 'utf-8');
//         console.log("data saved");
//     } catch (error) {
//         console.log(error);
//         return null;
//     }
// };


const fs = require('fs');

const retrieve = () => {
    const data = fs.readFileSync('./jsonFiles/regionData.json','utf-8');
    const jsonData = JSON.parse(data);
    console.log(jsonData[0]);
}

retrieve();