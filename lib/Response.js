const defaultResponseOptions = { // Default response options
    userWhitelist: [],
    userBlacklist: [],
    serverWhitelist: [],
    serverBlacklist: [],
    channelWhitelist: [],
    channelBlacklist: []
};

class Response { // Bot response class
    constructor(trigger, response, checkFunction, responseFunction = defaultResponseFunction, options = {}) {
        this.trigger = trigger;
        this.response = response;
        this.responseFunction = responseFunction;
        this.userWhitelist = options.userWhitelist || defaultResponseOptions.userWhitelist;
        this.userBlacklist = options.userBlacklist || defaultResponseOptions.userBlacklist;
        this.serverWhitelist = options.serverWhitelist || defaultResponseOptions.serverWhitelist;
        this.serverBlacklist = options.serverBlacklist || defaultResponseOptions.serverBlacklist;
        this.channelWhitelist = options.channelWhitelist || defaultResponseOptions.channelWhitelist;
        this.channelBlacklist = options.channelBlacklist || defaultResponseOptions.channelBlacklist;
        if (typeof this.trigger == "string") {
            this.checkFunction = checkFunction || defaultSimpleCheckFunction; // Response based on whole message
        }
        else {
            this.checkFunction = checkFunction || defaultCheckFunction; // Response based on keywords
        }
    }

    check(message, execute = true) { // Check if a message would trigger this response
        if (this._listCheck(message) && this.checkFunction(message, this.trigger)) {
            if (execute) {
                this.say(message);
            }
            return true;
        }
        return false;
    }

    say(message) { // Respond to a message
        this.responseFunction(message, this.response);
    }

    _listCheck(message) { // Check if the right conditions are met
        var user = true, server = true, channel = true;
        if (this.userWhitelist.length) { // Check user lists
            user = this.userWhitelist.includes(message.author.id);
        }
        else if (this.userBlacklist.length) {
            user = !this.userBlacklist.includes(message.author.id);
        }
        if (this.serverWhitelist.length) { // Check server lists
            server = this.serverWhitelist.includes(message.guild.id);
        }
        else if (this.serverBlacklist.length) {
            server = !this.serverWhitelist.includes(message.guild.id);
        }
        if (this.channelWhitelist.length) { // Check channel lists
            channel = this.channelWhitelist.includes(message.channel.id);
        }
        else if (this.channelBlacklist.length) {
            channel = !this.channelWhitelist.includes(message.channel.id);
        }
        return user && server && channel;
    }
};

function defaultSimpleCheckFunction(message, trigger) { // Default checking function for string triggers
    return message.content.toLowerCase().trim() == trigger.toLowerCase().trim();
}

function defaultCheckFunction(message, trigger) { // Default checking function for keyword-based triggers
    return trigger.every(tr => message.content.toLowerCase().includes(tr.toLowerCase().trim()));
}

function defaultResponseFunction(message, response) { // Default function for responding
    message.channel.send(response).catch(err => message.client.emit("error", err));
}

module.exports = Response; // Export things
