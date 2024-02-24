const express = require('express');
const app = express();

app.get('/data', (request, response) => {

    response.json({ 'success': true})
})

app.listen(3000, () => {
    console.log('listening');
})