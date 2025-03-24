const fs = require('fs');

const retrieve = () => {
    try {
        const data = fs.readFileSync('./jsonFiles/institutes.json',"utf-8");
        const names = JSON.parse(data).name;  // it is the name array
        return names;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = retrieve;