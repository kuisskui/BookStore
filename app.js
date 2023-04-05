const express = require("express")
const app = express()
const port = 8000

app.set("view engine", "ejs")

app.get('/', function (req, res) {
    res.send("This is port " + port)
})

app.listen(port, function () {
    console.log(`Starting http://127.0.0.1:${port}`)
})