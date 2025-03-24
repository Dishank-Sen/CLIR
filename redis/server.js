const express = require('express');
const client = require('./client');
const axios = require('axios'); // Import Axios

const app = express();

app.get('/', async (req, res) => {
    try {
        const cacheData = await client.get("todos");
        if (cacheData) {
            console.log("cache hit");
            await client.expire("todos", 10); // Set expiration time
            return res.json(JSON.parse(cacheData)); // Parse JSON string
        }

        // Fetch data using Axios
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/todos');

        console.log("cache miss");

        await client.set("todos", JSON.stringify(data)); // Store as string

        return res.json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(9000, () => console.log("Server running on port 9000"));
