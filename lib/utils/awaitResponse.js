const logMessage = require("./logMessage");

/*
Send a message and wait for a reply that passes a given test
@param channel: TextBasedChannel
@param content: String
@param options: MessageOptions | MessageAddition
@param messageTest: function(message: Message): Boolean
@param ms: Number
@param verbose: Boolean
@return Promise<Message>
*/
module.exports = function awaitResponse(messageTest, ms, channel, content, options, verbose = true) {
    return new Promise((resolve, reject) => {
        channel.send(content, options)
            .then(message => {
                let timer;
                let { client } = message;
                let handler = reply => {
                    if (message.channel.id === channel.id && messageTest(reply)) {
                        clearTimeout(timer);
                        client.off("message", handler);
                        if (verbose) {
                            logMessage(reply);
                        }
                        resolve(reply);
                    }
                };
                let timeout = () => {
                    client.off("message", handler);
                    resolve();
                };
                if (verbose) {
                    logMessage(message);
                }
                client.on("message", handler);
                timer = setTimeout(timeout, ms);
            })
    });
};
