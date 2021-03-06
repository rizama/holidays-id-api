const cheerio = require("cheerio");
const moment = require("moment");
require("moment-timezone");
const { jsonResponse, errorJson, convertMonth, convertDay, requestGet } = require("../utils");
const availableYear = ['2018', '2019', '2020', '2021', '2022', '2023', '2024'];

let cacheData = {};
let cacheTime;

module.exports = {
    index: (req, res) => {
        const fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;

        return jsonResponse(res, {
            maintainer: "Rizky Sam Pratama <rizkysampratama@gmail.com>",
            source: "https://github.com/rizama/holidays-id-api",
            public_holiday: {
                endpoint: "/holidays/:year",
                description: "Show Indonesia calendar public holidays by year.",
                note: "Available 2018-2024",
                example: fullUrl + "holidays/2021",
            },
        });
    },
    holiday: async (req, res) => {
        try {

            const year = req.params.year;

            // Memori cache
            let keysCacheData = Object.keys(cacheData);
            if (cacheTime && (cacheTime > Date.now() - 30 * 1000) && keysCacheData.includes(year)) {
                return jsonResponse(res, cacheData[year]);
            }

            if (!availableYear.includes(year)) {
                return errorJson(res, "Sorry, year not available.", 400);
            }

            const content = await requestGet(`${process.env.BASE_URL}/${year}-dates`);
            const $ = cheerio.load(content);
            const results = [];
            $('#row-inner-travel > article > div.page__content > table > tbody').children('tr').each((index, el) => {

                let dateMonth = $(el).find('td:nth-child(1)').text().trim();

                if (!(dateMonth == "")) {
                    if (dateMonth.includes('to')) {
                        dateMonth = dateMonth.split('to');

                        let startRange = moment(`${dateMonth[0]}${year}`, "DD MMM YYYY");
                        let endRange = moment(`${dateMonth[1]} ${year}`, "DD MMM YYYY");
                        let diff = startRange.diff(endRange, 'days');
                        let cloneStartRange = startRange.clone();


                        let arrDay = $(el).find('td:nth-child(2)').text().trim().split("to");
                        let holiday = $(el).find('td:nth-child(3)').text().trim();

                        if (diff != -1) {
                            let range = Math.abs(diff) - 1;
                            for (let index = 0; index < range; index++) {
                                const fullDate = cloneStartRange.add(1, 'days');
                                let date = fullDate.format("DD");
                                let month = fullDate.format('MMMM');
                                let day = fullDate.format('dddd');
                                let title = holiday;

                                let body = {};
                                body.date = date;
                                body.day = day;
                                body.month = month;
                                body.year = year;
                                body.holiday = title;
                                body.datetime_ms = moment(`${date} ${month} ${year}`, "DD MMMM YYYY").valueOf();

                                results.push(body);
                            }
                        }

                        for (const [index, dateMonth_] of dateMonth.entries()) {

                            newDateMonth = dateMonth_.trim().split(" ");
                            let date = newDateMonth[0];
                            let month = convertMonth(newDateMonth[1]);
                            let day = convertDay(arrDay[index].trim());
                            let title = holiday;

                            let body = {};
                            body.date = date;
                            body.day = day;
                            body.month = month;
                            body.year = year;
                            body.holiday = title;
                            body.datetime_ms = moment(`${date} ${month} ${year}`, "DD MMMM YYYY").valueOf();

                            results.push(body);
                        }

                    } else {
                        dateMonth = dateMonth.split(" ");
                        let date = dateMonth[0];
                        let month = convertMonth(dateMonth[1]);
                        let day = convertDay($(el).find('td:nth-child(2)').text().trim());
                        let holiday = $(el).find('td:nth-child(3)').text().trim();

                        let body = {};
                        body.date = date;
                        body.day = day;
                        body.month = month;
                        body.year = year;
                        body.holiday = holiday;
                        body.datetime_ms = moment(`${date} ${month} ${year}`, "DD MMMM YYYY").valueOf();

                        results.push(body);
                    }
                }
            });

            results.pop();

            cacheData[year] = results;
            cacheTime = Date.now();

            return jsonResponse(res, results);

        } catch (error) {
            return errorJson(res, error);
        }
    }
};