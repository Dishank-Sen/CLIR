const { createClient } = require('redis');
const dotenv = require('dotenv');
const { EnvironmentModuleGraph } = require('vite');

dotenv.config();

const client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    }
});

client.on('error', err => console.log('Redis Client Error', err));

async function connectRedis() {
    try {
        await client.connect();
        console.log("Connected to Redis");
    } catch (error) {
        console.error("Redis Connection Failed:", error);
    }
}

connectRedis(); // Ensure connection is established

module.exports = client;
