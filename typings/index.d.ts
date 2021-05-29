declare module "discord-bot" {
    import Discord from "discord.js";

    class DiscordBot extends Discord.Client {
        public config: {
            token: String,
            admin: Array<Discord.Snowflake>,
            options?: Discord.ClientOptions,
            embedColor?: Discord.ColorResolvable
        };
        public commands: Array<DiscordBot.Command>;
        public responses: Array<DiscordBot.Response>;
        public pTimeout: NodeJS.Timeout;

        protected presences: Object;

        constructor(
            config: {
                token: String,
                admin: Array<Discord.Snowflake>,
                options?: Discord.ClientOptions,
                embedColor?: Discord.ColorResolvable,
                generateCmd?: {
                    help?: Boolean,
                    prefix?: Boolean
                }
            },
            commands?: Array<DiscordBot.Command>,
            responses?: Array<DiscordBot.Response>
        );

        public loopPresences(list: Array<Discord.PresenceData>, minutes: number, shuffle?: Boolean): void;
        public newPresence(presence?: Discord.PresenceData, time?: number): void;

        private _emitError(err: Error): void;
        private _findPrefix(message: Discord.Message): void;
        private _handleMessage(message: Discord.Message): void;
        private _handleCommands(message: Discord.Message): Boolean;
        private _handleResponses(message: Discord.Message): Boolean;
        private _handleGuildCreate(guild: Discord.Guild): void;
        private _generatePrefixCmd(): void;
        private _generateHelpCmd(): void;
    }

    namespace DiscordBot {
        namespace Command {
            function getArgs(message: Discord.Message, prefix?: String): Array<String>;
        }

        class Command {
            public client: DiscordBot;
            public name: String;
            public usage: String;
            public description: String;
            public subtitle: String;
            public hidden: Boolean;
            public owner: Boolean;
            public admin: Boolean;
            public aliases: Array<String>;

            private callback: (message: Discord.Message, args?: Array<String>) => void;

            constructor(
                name: String,
                callback: (message: Discord.Message, args?: Array<String>) => void,
                options?: {
                    usage?: String,
                    description?: String,
                    subtitle?: String,
                    hidden?: Boolean,
                    owner?: Boolean,
                    admin?: Boolean,
                    aliases?: Array<String>;
                }
            );

            public check(message: Discord.Message, prefix?: String, admin?: Boolean, execute?: Boolean): Boolean;
            public exec(message: Discord.Message, args?: Array<String>): void;
        }

        class Response {
            public trigger: String | Array<String>;
            public response: any;

            protected userWhitelist: Array<Discord.Snowflake>;
            protected userBlacklist: Array<Discord.Snowflake>;
            protected serverWhitelist: Array<Discord.Snowflake>;
            protected serverBlacklist: Array<Discord.Snowflake>;
            protected channelWhitelist: Array<Discord.Snowflake>;
            protected channelBlacklist: Array<Discord.Snowflake>;

            private checkFunction: ((message: Discord.Message, trigger: String) => Boolean) | ((message: Discord.Message, trigger: Array<String>) => Boolean);
            private responseFunction: (message: Discord.Message, response?: any) => void;

            constructor(
                trigger: String,
                response?: any,
                checkFunction?: (message: Discord.Message, trigger: String) => Boolean,
                responseFunction?: (message: Discord.Message, response?: any) => void,
                options?: {
                    userWhitelist?: Array<Discord.Snowflake>,
                    userBlacklist?: Array<Discord.Snowflake>,
                    serverWhitelist?: Array<Discord.Snowflake>,
                    serverBlacklist?: Array<Discord.Snowflake>,
                    channelWhitelist?: Array<Discord.Snowflake>,
                    channelBlacklist?: Array<Discord.Snowflake>
                }
            );
            constructor(
                trigger: Array<String>,
                response?: any,
                checkFunction?: (message: Discord.Message, trigger: Array<String>) => Boolean,
                responseFunction?: (message: Discord.Message, response?: any) => void,
                options?: {
                    userWhitelist?: Array<Discord.Snowflake>,
                    userBlacklist?: Array<Discord.Snowflake>,
                    serverWhitelist?: Array<Discord.Snowflake>,
                    serverBlacklist?: Array<Discord.Snowflake>,
                    channelWhitelist?: Array<Discord.Snowflake>,
                    channelBlacklist?: Array<Discord.Snowflake>
                }
            );

            public check(message: Discord.Message, execute?: Boolean): Boolean;
            public say(message: Discord.Message): void;

            private _listCheck(message: Discord.Message): Boolean;
        }

        namespace utils {
            function awaitResponse(
                messageTest: (reply: Discord.Message) => Boolean,
                ms: Number,
                channel: Discord.TextChannel,
                content?: Discord.StringResolvable | Discord.APIMessage,
                options?: Discord.MessageOptions | Discord.MessageAdditions,
                verbose?: Boolean
            ): Promise<Discord.Message | void>;
            function logMessage(message: Discord.Message): Discord.Message;
            function reactButtons(
                message: Discord.Message,
                reactHandlers: Array<{
                    emoji: Discord.EmojiIdentifierResolvable,
                    callback: (reaction: Discord.MessageReaction, user: Discord.User, add: Boolean) => void;
                }>,
                ms: Number,
                maxMs?: Number
            ): Promise<Discord.Message>;
            function sendPages(
                channel: Discord.TextChannel,
                pages: Array<{
                    content?: Discord.StringResolvable | Discord.APIMessage,
                    options?: Discord.MessageOptions | Discord.MessageAdditions
                }>,
                ms: Number,
                left?: Discord.EmojiIdentifierResolvable,
                right?: Discord.EmojiIdentifierResolvable,
                maxMs?: Number
            ): Promise<Discord.Message>;
            function sendVerbose(channel: Discord.TextChannel, content?: Discord.StringResolvable | Discord.APIMessage, options?: Discord.MessageOptions | Discord.MessageAdditions): Promise<Discord.Message>;
        }
    }

    export default DiscordBot;
    export { default as Discord } from "discord.js";
}
