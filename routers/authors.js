const express = require("express")
const router = express.Router()
const pool = require("../database/mssql")

router.get('/', function (req, res) {
    res.send("authors page")
})

module.exports = router