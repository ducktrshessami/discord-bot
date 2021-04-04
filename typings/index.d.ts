declare module "discord-bot" {
    import discord from "discord.js";

    class DiscordBot extends discord.Client {
        public config: {
            token: String,
            admin: Array<discord.Snowflake>,
            options?: discord.ClientOptions,
            embedColor?: discord.ColorResolvable
        };
        public commands: Array<DiscordBot.Command>;
        public responses: Array<DiscordBot.Response>;
        public pTimeout: NodeJS.Timeout;

        protected presences: Object;

        constructor(
            config: {
                token: String,
                admin: Array<discord.Snowflake>,
                options?: discord.ClientOptions,
                embedColor?: discord.ColorResolvable,
                generateCmd?: {
                    help?: Boolean,
                    prefix?: Boolean
                }
            },
            commands?: Array<DiscordBot.Command>,
            responses?: Array<DiscordBot.Response>
        );

        public loopPresences(list: Array<discord.PresenceData>, minutes: number, shuffle?: Boolean): void;
        public newPresence(presence?: discord.PresenceData, time?: number): void;

        private _emitError(err: Error): void;
        private _findPrefix(message: discord.Message): void;
        private _handleMessage(message: discord.Message): void;
        private _handleCommands(message: discord.Message): Boolean;
        private _handleResponses(message: discord.Message): Boolean;
        private _handleGuildCreate(guild: discord.Guild): void;
        private _generatePrefixCmd(): void;
        private _generateHelpCmd(): void;
    }

    namespace DiscordBot {
        namespace Command {
            function getArgs(message: discord.Message, prefix?: String): Array<String>;
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

            private callback: (message: discord.Message, args?: Array<String>) => void;

            constructor(
                name: String,
                callback: (message: discord.Message, args?: Array<String>) => void,
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

            public check(message: discord.Message, prefix?: String, admin?: Boolean, execute?: Boolean): Boolean;
            public exec(message: discord.Message, args?: Array<String>): void;
        }

        class Response {
            public trigger: String | Array<String>;
            public response: any;

            protected userWhitelist: Array<discord.Snowflake>;
            protected userBlacklist: Array<discord.Snowflake>;
            protected serverWhitelist: Array<discord.Snowflake>;
            protected serverBlacklist: Array<discord.Snowflake>;
            protected channelWhitelist: Array<discord.Snowflake>;
            protected channelBlacklist: Array<discord.Snowflake>;

            private checkFunction: ((message: discord.Message, trigger: String) => Boolean) | ((message: discord.Message, trigger: Array<String>) => Boolean);
            private responseFunction: (message: discord.Message, response?: any) => void;

            constructor(
                trigger: String,
                response?: any,
                checkFunction?: (message: discord.Message, trigger: String) => Boolean,
                responseFunction?: (message: discord.Message, response?: any) => void,
                options?: {
                    userWhitelist?: Array<discord.Snowflake>,
                    userBlacklist?: Array<discord.Snowflake>,
                    serverWhitelist?: Array<discord.Snowflake>,
                    serverBlacklist?: Array<discord.Snowflake>,
                    channelWhitelist?: Array<discord.Snowflake>,
                    channelBlacklist?: Array<discord.Snowflake>
                }
            );
            constructor(
                trigger: Array<String>,
                response?: any,
                checkFunction?: (message: discord.Message, trigger: Array<String>) => Boolean,
                responseFunction?: (message: discord.Message, response?: any) => void,
                options?: {
                    userWhitelist?: Array<discord.Snowflake>,
                    userBlacklist?: Array<discord.Snowflake>,
                    serverWhitelist?: Array<discord.Snowflake>,
                    serverBlacklist?: Array<discord.Snowflake>,
                    channelWhitelist?: Array<discord.Snowflake>,
                    channelBlacklist?: Array<discord.Snowflake>
                }
            );

            public check(message: discord.Message, execute?: Boolean): Boolean;
            public say(message: discord.Message): void;

            private _listCheck(message: discord.Message): Boolean;
        }

        namespace utils {
            function awaitResponse(
                channel: discord.TextChannel,
                content?: discord.StringResolvable | discord.APIMessage,
                options?: discord.MessageOptions | discord.MessageAdditions,
                messageTest: (reply: discord.Message) => Boolean,
                ms: Number,
                verbose?: Boolean
            ): Promise<discord.Message | void>;
            function logMessage(message: discord.Message): discord.Message;
            function reactButtons(
                message: discord.Message,
                reactHandlers?: Array<{
                    emoji: discord.EmojiIdentifierResolvable,
                    callback: (reaction: discord.MessageReaction, user: discord.User) => void;
                }>,
                ms: Number,
                maxMs?: Number
            ): Promise<discord.Message>;
            function sendPages(
                channel: discord.TextChannel,
                pages: Array<{
                    content?: discord.StringResolvable | discord.APIMessage,
                    options?: discord.MessageOptions | discord.MessageAdditions
                }>,
                left?: discord.EmojiIdentifierResolvable,
                right?: discord.EmojiIdentifierResolvable,
                ms: Number,
                maxMs?: Number
            ): Promise<discord.Message>;
            function sendVerbose(channel: discord.TextChannel, content?: discord.StringResolvable | discord.APIMessage, options?: discord.MessageOptions | discord.MessageAdditions): Promise<discord.Message>;
        }
    }

    export = DiscordBot;
}
