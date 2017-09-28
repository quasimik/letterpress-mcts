const express = require('express')
const app = express()
// app.set("view engine", "html");

const logic = require('./logic.js')

var value = logic.get();

app.get('/', function(request, response) {
    response.send(value)
})

// app.listen(3000, function() {
//     console.log('listening on port 3000...')
// })