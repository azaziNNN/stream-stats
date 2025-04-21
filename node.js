const express = require('express');
const corsAnywhere = require('cors-anywhere');

const app = express();

app.use(corsAnywhere);

app.listen(3000, () => {
    console.log('Proxy server running on http://localhost:3000');
});