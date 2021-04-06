// Handle message react buttons

module.exports = async function reactButtons(message, reactHandlers, ms, maxMs) {
    let timer;
    let { client } = message;

    function resetTimer() {
        clearTimeout(timer);
        timer = setTimeout(timeout, ms);
    }

    function timeout() {
        client.off("messageReactionAdd", handlerWrapperAdd);
        client.off("messageReactionRemove", handlerWrapperRemove);
    }

    async function handlerWrapperAdd(reaction, user) {
        if (!reaction.me) {
            let handler = reactHandlers.find(handler => reaction.emoji.toString().includes(handler.emoji.toString()));
            if (handler) {
                await handler.callback(reaction, user, true);
                resetTimer();
            }
        }
    }

    async function handlerWrapperRemove(reaction, user) {
        if (!reaction.me) {
            let handler = reactHandlers.find(handler => reaction.emoji.toString().includes(handler.emoji.toString()));
            if (handler) {
                await handler.callback(reaction, user, false);
                resetTimer();
            }
        }
    }

    client.on("messageReactionAdd", handlerWrapperAdd);
    client.on("messageReactionRemove", handlerWrapperRemove);
    timer = setTimeout(timeout, ms);
    if (maxMs) {
        setTimeout(timeout, maxMs);
    }
    for (let i = 0; i < reactHandlers.length; i++) {
        await message.react(reactHandlers[i].emoji);
    }
    return message;
};
