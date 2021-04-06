// Handle message react buttons

module.exports = function reactButtons(message, reactHandlers, ms, maxMs) {
    return new Promise(async (resolve, reject) => {
        let timer, maxTimer;
        let { client } = message;

        function resetTimer() {
            clearTimeout(timer);
            timer = setTimeout(timeout, ms);
        }

        function timeout() {
            clearTimeout(timer);
            clearTimeout(maxTimer);
            client.off("messageReactionAdd", handlerWrapperAdd);
            client.off("messageReactionRemove", handlerWrapperRemove);
            resolve(message);
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
            maxTimer = setTimeout(timeout, maxMs);
        }
        for (let i = 0; i < reactHandlers.length; i++) {
            await message.react(reactHandlers[i].emoji);
        }
    });
};
