const fs = require('fs');

// Function to append data
const appendInstitute = (newInstitute) => {
    const filePath = './jsonFiles/institutes.json';

    let data = { name: [] };

    // Check if file exists
    if (fs.existsSync(filePath)) {
        const fileData = fs.readFileSync(filePath, 'utf-8');
        
        if (fileData) {
            try {
                data = JSON.parse(fileData); // Parse existing JSON data
            } catch (error) {
                console.error("Error parsing JSON:", error);
                return;
            }
        }
    }

    // Ensure 'name' is an array
    if (!Array.isArray(data.name)) {
        data.name = [];
    }

    // Append new institute
    data.name.push(newInstitute);

    // Write updated data back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("Institute added successfully");
};

module.exports = appendInstitute;
