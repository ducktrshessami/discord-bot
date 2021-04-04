// Handle message react buttons

module.exports = async function reactButtons(message, ms, reactHandlers = [], maxMs) {
    let timer;
    let { client } = message;
    let resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(timeout, ms);
    };
    let timeout = () => {
        client.off("messageReactionAdd", handlerWrapper);
        client.off("messageReactionRemove", handlerWrapper);
    };
    let handlerWrapper = async (reaction, user) => {
        if (!reaction.me) {
            let handler = reactHandlers.find(handler => reaction.emoji.toString().includes(handler.emoji.toString()));
            if (handler) {
                await handler.callback(reaction, user);
                resetTimer();
            }
        }
    };
    client.on("messageReactionAdd", handlerWrapper);
    client.on("messageReactionRemove", handlerWrapper);
    timer = setTimeout(timeout, ms);
    if (maxMs) {
        setTimeout(timeout, maxMs);
    }
    for (let i = 0; i < reactHandlers.length; i++) {
        await message.react(reactHandlers[i].emoji);
    }
    return message;
};
