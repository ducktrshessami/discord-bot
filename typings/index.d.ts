declare module "discord-bot" {
    import discord from "discord.js";

    class DiscordBot extends discord.Client {
        public config: {
            token: string,
            options?: discord.ClientOptions
        };
        public commands: Array<DiscordBot.Command>;
        public responses: Array<DiscordBot.Response>

        protected presences: object;

        constructor(
            config: {
                token: string
                options?: discord.ClientOptions
            },
            commands?: Array<DiscordBot.Command>,
            responses?: Array<DiscordBot.Response>
        );

        public loopPresences(list: Array<discord.PresenceData>, minutes: number, shuffle?: boolean): void;
        public newPresence(foo?: DiscordBot, p?: discord.PresenceData, time?: number): void;

        private _emitError(err: Error): void;
        private _findPrefix(message: discord.Message): void;
        private _handleMessage(message: discord.Message): void;
        private _handleCommands(message: discord.Message): boolean;
        private _handleResponses(message: discord.Message): boolean;
        private _handleGuildCreate(guild: discord.Guild): void;
    }

    namespace DiscordBot {
        namespace Command {
            function getArgs(message: discord.Message, prefix: string): Array<string>;
        }

        class Command {
            public name: string;
            public usage: string;
            public description: string;
            public subtitle: string;
            public hidden: boolean;
            public admin: boolean;

            private callback: (message: discord.Message, args?: Array<string>) => void;

            constructor(
                cmd: string,
                cb: (message: discord.Message, args?: Array<string>) => void,
                options?: {
                    usage?: string,
                    description?: string,
                    subtitle?: string,
                    hidden?: boolean,
                    admin?: boolean
                }
            );

            public check(message: discord.Message, prefix?: string, admin?: boolean, execute?: boolean): boolean;
            public exec(message: discord.Message, args?: Array<string>): void;
        }

        class Response {
            public trigger: string | Array<string>;
            public response: any;

            protected userWhitelist: Array<discord.Snowflake>;
            protected userBlacklist: Array<discord.Snowflake>;
            protected serverWhitelist: Array<discord.Snowflake>;
            protected serverBlacklist: Array<discord.Snowflake>;
            protected channelWhitelist: Array<discord.Snowflake>;
            protected channelBlacklist: Array<discord.Snowflake>;

            private checkFunction: ((message: discord.Message, trigger: string) => boolean) | ((message: discord.Message, trigger: Array<string>) => boolean);
            private responseFunction: (message: discord.Message, response?: any) => void;

            constructor(
                tr: string,
                rs?: any,
                cf?: (message: discord.Message, trigger: string) => boolean,
                rf?: (message: discord.Message, response?: any) => void,
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
                tr: Array<string>,
                rs?: any,
                cf?: (message: discord.Message, trigger: Array<string>) => boolean,
                rf?: (message: discord.Message, response?: any) => void,
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