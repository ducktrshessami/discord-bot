const defaultCMDOptions = { // Default command options
    usage: "",
    description: "",
    subtitle: "",
    hidden: false,
    admin: false
};

class Command { // Bot command class
    constructor(cmd, cb, options = {}) {
        this.name = cmd.toLowerCase().trim();
        this.callback = cb;
        this.usage = options.usage || defaultCMDOptions.usage;
        this.description = options.description || defaultCMDOptions.description;
        this.subtitle = options.subtitle || defaultCMDOptions.subtitle;
        this.hidden = options.hidden || defaultCMDOptions.hidden;
        this.admin = options.admin || defaultCMDOptions.admin;
    }
    
    check(message, prefix = "", admin = false, execute = true) { // Check if a message matches this command
        var args = getArgs(message, prefix);
        if (args[0].toLowerCase() == this.name && (!this.admin || admin)) {
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

function getArgs(message, prefix) { // Get args for a command from a message
    return message.content.toLowerCase().substring(prefix.length).replace(/\n/g, ' ').split(' ');
}

module.exports = Command; // Export things
module.exports.getArgs = getArgs;
