const logMessage = require("./logMessage");

/*
Send a message to a TextChannel and log it
@param channel: TextBasedChannel
@param content: String
@param options: MessageOptions | MessageAddition
@return Promise<Message>
*/
module.exports = function sendVerbose(channel, content, options) {
    return channel.send(content, options)
        .then(logMessage);
};
