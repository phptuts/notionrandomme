const express = require('express');
const https = require('https');
const app = express();

async function getRandomUser() {
    const url = 'https://randomuser.me/api';
    const response = await fetch(url);
    const json = await response.json();

    return json;
}


app.get('/data', async (request, response) => {
    const person = await getRandomUser();
    response.json({ 'success': true, person })
});



app.listen(3000, () => {
    console.log('listening');
})