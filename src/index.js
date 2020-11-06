const discord = require("discord.js"); // Discord

const defaultServerOptions = { // Default server options for new servers
    name: "",
    prefix: undefined
};
const defaultCMDOptions = { // Default command options
    usage: "",
    description: "",
    subtitle: "",
    hidden: false,
    admin: false
};
const defaultResponseOptions = { // Default response options
    userWhitelist: [],
    userBlacklist: [],
    serverWhitelist: [],
    serverBlacklist: [],
    channelWhitelist: [],
    channelBlacklist: []
};

class DiscordBot extends discord.Client { // Main bot class
    constructor(config, commands = [], responses = []) {
        super(config.options);
        
        if (typeof config.prefix != "string") { // Prefix must be string
            delete config.prefix;
        }
        this.config = config;
        this.commands = commands;
        this.responses = responses;
        this.presences = {list: []};
        
        this.login(config.token).catch(err => {throw err;});
        
        this.on("guildCreate", this._handleGuildCreate);
        if (this.commands || this.responses) {
            this.on("message", this._handleMessage);
        }
        
        this.on("ready", () => {
            this.guilds.cache.each(this._handleGuildCreate, this); // Update server names
            this.emit("configUpdate", this.config);
        });
    }
    
    loopPresences(list, minutes, shuffle = true) { // Set periodic presences
        this.presences = {};
        this.presences.list = list;
        this.presences.ms = minutes * 60000;
        this.presences.shuffle = shuffle;
        this.presences.last = list.length;
        this.newPresence();
    }
    
    newPresence(foo = this, p, time) { // Update current presence
        if (foo.pTimeout) {
            clearTimeout(foo.pTimeout);
        }
        if (!(p && time) && foo.presences.list.length && foo.presences.ms) { // If looping set presences
            time = foo.presences.ms;
            if (foo.presences.shuffle) {
                foo.presences.last = Math.floor(Math.random() * foo.presences.list.length);
                p = foo.presences.list[foo.presences.last];
            }
            else {
                if (++foo.presences.last >= foo.presences.list.length) {
                    foo.presences.last = 0;
                }
                p = foo.presences.list[foo.presences.last];
            }
        }
        if (p && time) { // If setting a specified presence
            foo.user.setPresence(p).then(() => foo.pTimeout = setTimeout(foo.newPresence, time, foo)).catch(foo._emitError);
        }
    }
    
    _emitError(err) { // See function name
        this.emit("error", err);
    }
    
    _findPrefix(message) { // Check for a prefix
        return [this.config.servers[message.guild.id].prefix, this.config.prefix, "<@" + this.user.id + "> ", "<@!" + this.user.id + "> "].find(p => message.content.startsWith(p));
    }
    
    _handleMessage(message) { // Handle commands and responses as applicable
        var foo = false;
        if (message.author.id != this.user.id) {
            if (this.commands) {
                foo = this._handleCommands(message);
            }
            if (this.responses && !foo) {
                this._handleResponses(message);
            }
        }
    }
    
    _handleCommands(message) { // Handle commands
        var cPrefix;
        if (cPrefix = this._findPrefix(message)) {
            return this.commands.some(cmd => cmd.check(message, cPrefix, this.config.admin.includes(message.author.id)));
        }
        return false;
    }
    
    _handleResponses(message) { // Handle responses
        return this.responses.some(response => response.check(message));
    }
    
    _handleGuildCreate(guild) { // Update server configs
        if (!this.config.servers) {
            this.config.servers = {};
        }
        if (!this.config.servers[guild.id]) {
            this.config.servers[guild.id] = defaultServerOptions;
        }
        this.config.servers[guild.id].name = guild.name;
    }
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

class Response { // Bot response class
    constructor(tr, rs, cf, rf = defaultResponseFunction, options = {}) {
        this.trigger = tr;
        this.response = rs;
        this.responseFunction = rf;
        this.userWhitelist = options.userWhitelist || defaultResponseOptions.userWhitelist;
        this.userBlacklist = options.userBlacklist || defaultResponseOptions.userBlacklist;
        this.serverWhitelist = options.serverWhitelist || defaultResponseOptions.serverWhitelist;
        this.serverBlacklist = options.serverBlacklist || defaultResponseOptions.serverBlacklist;
        this.channelWhitelist = options.channelWhitelist || defaultResponseOptions.channelWhitelist;
        this.channelBlacklist = options.channelBlacklist || defaultResponseOptions.channelBlacklist;
        if (typeof this.trigger == "string") {
            this.checkFunction = cf || defaultSimpleCheckFunction; // Response based on whole message
        }
        else {
            this.checkFunction = cf || defaultCheckFunction; // Response based on keywords
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

function getArgs(message, prefix) { // Get args for a command from a message
    return message.content.toLowerCase().substring(prefix.length).replace(/\n/g, ' ').split(' ');
}

function defaultSimpleCheckFunction(message, trigger) { // Default checking function for string triggers
    return message.content.toLowerCase().trim() == trigger.toLowerCase().trim();
}

function defaultCheckFunction(message, trigger) { // Default checking function for keyword-based triggers
    return trigger.every(tr => message.content.toLowerCase().includes(tr.toLowerCase().trim()));
}

function defaultResponseFunction(message, response) { // Default function for responding
    message.channel.send(response).catch(err => message.client.emit("error", err));
}

module.exports = DiscordBot; // Export things
module.exports.getArgs = getArgs;
module.exports.Command = Command;
module.exports.Response = Response;
