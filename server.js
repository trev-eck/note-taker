var PORT = process.env.PORT || 3000;
const express = require('express');
const app = express();

app.listen(PORT, function() {
    console.log(`Listening on port: ${PORT}`);
})