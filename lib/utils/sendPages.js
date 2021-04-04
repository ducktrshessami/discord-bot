const sendVerbose = require("./sendVerbose");
const reactButtons = require("./reactButtons");

/*
sendVerbose a message and set up handling for reacts to change the message content
@param channel: TextBasedChannel
@param pages: Object {
    content: String
    options: MessageOptions | MessageAddition
}
@param left: EmojiIdentifierResolvable
@param right: EmojiIdentifierResolvable
@param ms: Number
@return Promise<Message>
*/
module.exports = function sendPages(channel, pages, left, right, ms) {
    let i = 0;
    return sendVerbose(channel, pages[i].content ? pages[i].content : "", pages[i].options)
        .then(message => reactButtons(message, [
            {
                emoji: left,
                callback: () => {
                    if (--i < 0) {
                        i = pages.length - 1;
                    }
                    message.edit(pages[i].content ? pages[i].content : "", pages[i].options);
                }
            },
            {
                emoji: right,
                callback: () => {
                    if (++i >= pages.length) {
                        i = 0;
                    }
                    message.edit(pages[i].content ? pages[i].content : "", pages[i].options);
                }
            }
        ], ms));
};
