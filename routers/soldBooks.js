const express = require("express")
const router = express.Router()

router.get('/', function (req, res) {
    res.send("soldBooks page")
})

module.exports = router