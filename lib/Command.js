const defaultCMDOptions = { // Default command options
    usage: "",
    description: "",
    subtitle: "",
    hidden: false,
    owner: false,
    admin: false,
    aliases: []
};

class Command { // Bot command class
    constructor(name, callback, options = {}) {
        this.name = name.toLowerCase().trim();
        this.callback = callback;
        this.usage = options.usage || defaultCMDOptions.usage;
        this.description = options.description || defaultCMDOptions.description;
        this.subtitle = options.subtitle || defaultCMDOptions.subtitle;
        this.hidden = options.hidden || defaultCMDOptions.hidden;
        this.owner = options.owner || defaultCMDOptions.owner;
        this.admin = options.admin || defaultCMDOptions.admin;
        this.aliases = options.aliases || defaultCMDOptions.aliases;
    }

    check(message, prefix = "", admin = false, execute = true) { // Check if a message matches this command
        var args = getArgs(message, prefix);
        if (this.aliases.concat(this.name).includes(args[0].toLowerCase()) && (!this.admin || admin) && (!this.owner || message.author.id == message.guild.ownerID)) {
            if (execute) {
                this.exec(message, args);
            }
            return true;
        }
        return false;
    }

    exec(message, args) { // Execute this command
        this.callback(message, args);
    }
};

function getArgs(message, prefix = "") { // Get args for a command from a message
    return message.content.toLowerCase().substring(prefix.length).replace(/\n/g, ' ').split(' ');
}

module.exports = Command; // Export things
module.exports.getArgs = getArgs;