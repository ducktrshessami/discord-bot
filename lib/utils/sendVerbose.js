// Send a message to a TextChannel and log it

const logMessage = require("./logMessage");

module.exports = function sendVerbose(channel, content, options) {
    return channel.send(content, options)
        .then(logMessage);
};
