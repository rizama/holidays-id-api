const { json } = require("express");

const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { jsonResponse, errorJson } = require("../utils");

module.exports = {
    index: (req, res) => {
        const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

        return jsonResponse(res, {
            maintainer: "Rizky Sam Pratama <rizkysampratama@gmail.com>",
            source: "https://github.com/rizama/holidays-id-api",
        });
    }
};