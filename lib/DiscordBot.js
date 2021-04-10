const discord = require("discord.js"); // Discord
const Command = require("./Command"); // Bot command
const utils = require("./utils"); // Bot utils

const defaultServerOptions = { // Default server options for new servers
    name: "",
    prefix: undefined
};

function defaultPrefixCmd(message, args) { // Pregenerated prefix command
    if (args.length > 1) {
        this.client.config.servers[message.guild.id].prefix = args[1];
        utils.sendVerbose(message.channel, `Custom prefix set to \`${args[1]}\``).catch(this.client._emitError);
    }
    else {
        if (this.client.config.servers[message.guild.id].prefix) {
            utils.sendVerbose(message.channel, `Current custom prefix: \`${this.client.config.servers[message.guild.id].prefix}\``).catch(this.client._emitError);
        }
        else {
            utils.sendVerbose(message.channel, "Custom prefix not set").catch(this.client._emitError);
        }
    }
}

function defaultHelpCmd(message, args) { // Pregenerated help command
    let handled = false;
    if (args.length > 1) {
        let match = this.client.commands.find(cmd => cmd.aliases.concat(cmd.name).includes(args[1].toLowerCase()));
        if (match && (!match.hidden || this.client.config.admin.includes(message.author.id))) {
            let response = `\`${match.usage}\`\n${match.description}\n${match.subtitle}`.trim();
            handled = true;
            if (match.aliases.length) {
                response += `\nAliases: \`${match.aliases.join("`, `")}\``.trim();
            }
            utils.sendVerbose(message.channel, response).catch(this.client._emitError);
        }
    }
    if (!handled) {
        utils.sendVerbose(message.channel, "", this.client.helpEmbed).catch(this.client._emitError);
    }
}

function generateCmdListEmbed(commands, color = "RANDOM") { // Pregenerated command list for help command
    return new discord.MessageEmbed({
        color: color,
        title: "Commands:",
        description: commands
            .sort()
            .filter(cmd => !cmd.admin && !cmd.hidden)
            .map(cmd => `**${cmd.name}:** ${cmd.description}`)
            .join('\n')
    });
}

class DiscordBot extends discord.Client { // Main bot class
    constructor(config = {}, commands = [], responses = []) {
        super(config.options);

        if (typeof config.prefix != "string") { // Prefix must be string
            delete config.prefix;
        }
        this.config = config;
        this.commands = commands;
        this.responses = responses;
        this.presences = { list: [] };

        this.commands.forEach(cmd => cmd.client = this); // Attach client
        this.responses.forEach(res => res.client = this);

        this.login(config.token).catch(err => this._emitError(err));

        this.on("guildCreate", this._handleGuildCreate);
        if (this.commands || this.responses) {
            this.on("message", this._handleMessage);
        }

        this.on("ready", () => {
            if (config.generateCmd) {
                if (config.generateCmd.prefix) {
                    this._generatePrefixCmd();
                }
                if (config.generateCmd.help) {
                    this._generateHelpCmd();
                }
            }

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
        else {
            foo.user.setPresence(null).catch(foo._emitError);
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

    _generatePrefixCmd() {
        let prefixCmd = new Command("prefix", defaultPrefixCmd, {
            usage: `@${this.user.username} prefix [prefix]`,
            description: "Set or display the current server's custom command prefix",
            subtitle: `@${this.user.username} will always work for commands even if a custom prefix is set`
        });
        prefixCmd.client = this;
        this.commands.push(prefixCmd);
    }

    _generateHelpCmd() {
        let helpCmd = new Command("help", defaultHelpCmd, {
            usage: `@${this.user.username} help [cmd]`,
            description: "Displays a command list or describes a specific command",
            subtitle: "<> denotes a required parameter, while [] denotes an optional one"
        });
        helpCmd.client = this;
        this.commands.push(helpCmd);
        this.helpEmbed = generateCmdListEmbed(this.commands, this.config.embedColor);
    }
};

module.exports = DiscordBot;
