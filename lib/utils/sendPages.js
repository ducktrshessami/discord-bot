// sendVerbose a message and set up handling for reacts to change the message content

const sendVerbose = require("./sendVerbose");
const reactButtons = require("./reactButtons");

module.exports = function sendPages(channel, pages, ms, left = "⬅️", right = "➡️", maxMs) {
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
        ], ms, maxMs));
};
