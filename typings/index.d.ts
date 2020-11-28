declare module "discord-bot" {
    import discord from "discord.js";

    class DiscordBot extends discord.Client {
        public config: {
            token: String,
            admin: Array<String>,
            options?: discord.ClientOptions,
            embedColor?: discord.ColorResolvable
        };
        public commands: Array<DiscordBot.Command>;
        public responses: Array<DiscordBot.Response>

        protected presences: Object;

        constructor(
            config: {
                token: String,
                admin: Array<String>,
                options?: discord.ClientOptions,
                embedColor?: discord.ColorResolvable,
                generateCmd?: {
                    help?: boolean,
                    prefix?: boolean
                }
            },
            commands?: Array<DiscordBot.Command>,
            responses?: Array<DiscordBot.Response>
        );

        public loopPresences(list: Array<discord.PresenceData>, minutes: number, shuffle?: boolean): void;
        public newPresence(presence?: discord.PresenceData, time?: number): void;

        private _emitError(err: Error): void;
        private _findPrefix(message: discord.Message): void;
        private _handleMessage(message: discord.Message): void;
        private _handleCommands(message: discord.Message): boolean;
        private _handleResponses(message: discord.Message): boolean;
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
            public hidden: boolean;
            public owner: boolean;
            public admin: boolean;

            private callback: (message: discord.Message, args?: Array<String>) => void;

            constructor(
                name: String,
                callback: (message: discord.Message, args?: Array<String>) => void,
                options?: {
                    usage?: String,
                    description?: String,
                    subtitle?: String,
                    hidden?: boolean,
                    owner?: boolean,
                    admin?: boolean
                }
            );

            public check(message: discord.Message, prefix?: String, admin?: boolean, execute?: boolean): boolean;
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

            private checkFunction: ((message: discord.Message, trigger: String) => boolean) | ((message: discord.Message, trigger: Array<String>) => boolean);
            private responseFunction: (message: discord.Message, response?: any) => void;

            constructor(
                trigger: String,
                response?: any,
                checkFunction?: (message: discord.Message, trigger: String) => boolean,
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
                checkFunction?: (message: discord.Message, trigger: Array<String>) => boolean,
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

            public check(message: discord.Message, execute?: boolean): boolean;
            public say(message: discord.Message): void;

            private _listCheck(message: discord.Message): boolean;
        }
    }

    export = DiscordBot;
}