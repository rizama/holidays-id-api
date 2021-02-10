const { json } = require("express");

module.exports = {
    index: (req, res) => {
        res.send("Hallo Sam");
    }
};