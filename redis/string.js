const client = require('./client');

const users = [
    {
        name: "dishank",
        age: 18,
    },
    {
        name: "daksh",
        age: 18,
    }
];

async function init() {
    await client.lPush("users", JSON.stringify(users[0]));
    await client.lPush("users", JSON.stringify(users[1]));

    const res1 = await client.lRange("users",0,-1);
    const userData = res1.map((user) => JSON.parse(user));
    console.log(JSON.parse(userData));
}

init();