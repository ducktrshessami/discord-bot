// Log a message

module.exports = function logMessage(message) {
    let source = message.guild ? `${message.guild.id}/${message.channel.id}` : message.channel.id;
    if (message.content) {
        console.log(`[${source}] ${message.author.username}#${message.author.discriminator}: ${message.content}`);
    }
    if (message.attachments) {
        console.log(`[${source}] ${message.author.username}#${message.author.discriminator}: [${message.attachments.size} ATTACHMENTS]`);
    }
    if (message.embeds) {
        console.log(`[${source}] ${message.author.username}#${message.author.discriminator}: [${message.embeds.length} EMBEDS]`);
    }
    return message;
};
