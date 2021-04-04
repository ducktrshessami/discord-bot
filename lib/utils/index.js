
const fs = require("fs");
const path = require("path");

var utils = {};

// Handle every other file in this dir as a util
fs
    .readdirSync(__dirname)
    .filter(file => (
        (file.indexOf('.') !== 0) &&
        (file !== path.basename(__filename)) &&
        (file.slice(-3) === '.js')
    ))
    .map(file => file.slice(0, -3).toLowerCase())
    .forEach(file => utils[file] = require(path.join(__dirname, file)));

module.exports = utils;
