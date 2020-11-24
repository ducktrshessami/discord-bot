const discord = require("discord.js"); // Discord
const Command = require("./command"); // Bot command
const Response = require("./response"); // Bot response

const defaultServerOptions = { // Default server options for new servers
    name: "",
    prefix: undefined
};

class DiscordBot extends discord.Client { // Main bot class
    constructor(config = {}, commands = [], responses = []) {
        super(config.options);
        
        if (typeof config.prefix != "string") { // Prefix must be string
            delete config.prefix;
        }
        this.config = config;
        this.commands = commands;
        this.responses = responses;
        this.presences = {list: []};

        this.commands.forEach(cmd => cmd.client = this); // Attach client
        this.responses.forEach(res => res.client = this);
        
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
    
    newPresence(presence, time, foo = this) { // Update current presence
        if (foo.pTimeout) {
            clearTimeout(foo.pTimeout);
        }
        if (!(presence && time) && foo.presences.list.length && foo.presences.ms) { // If looping set presences
            time = foo.presences.ms;
            if (foo.presences.shuffle) {
                foo.presences.last = Math.floor(Math.random() * foo.presences.list.length);
                presence = foo.presences.list[foo.presences.last];
            }
            else {
                if (++foo.presences.last >= foo.presences.list.length) {
                    foo.presences.last = 0;
                }
                presence = foo.presences.list[foo.presences.last];
            }
        }
        if (presence && time) { // If setting a specified presence
            foo.user.setPresence(presence).then(() => foo.pTimeout = setTimeout(foo.newPresence, time, null, null, foo)).catch(foo._emitError);
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

module.exports = DiscordBot; // Export things
module.exports.Command = Command;
module.exports.Response = Response;
