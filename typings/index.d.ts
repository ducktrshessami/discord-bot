declare module "discord-bot" {
    import discord from "discord.js";

    class DiscordBot extends discord.Client {
        public config: {
            token: string,
            admin: Array<string>,
            options?: discord.ClientOptions,
            generateHelp?: boolean,
            embedColor?: discord.ColorResolvable
        };
        public commands: Array<DiscordBot.Command>;
        public responses: Array<DiscordBot.Response>

        protected presences: object;

        constructor(
            config: {
                token: string,
                admin: Array<string>,
                options?: discord.ClientOptions,
                generateHelp?: boolean,
                embedColor?: discord.ColorResolvable
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
    }

    namespace DiscordBot {
        namespace Command {
            function getArgs(message: discord.Message, prefix?: string): Array<string>;
        }

        class Command {
            public client: DiscordBot;
            public name: string;
            public usage: string;
            public description: string;
            public subtitle: string;
            public hidden: boolean;
            public admin: boolean;

            private callback: (message: discord.Message, args?: Array<string>) => void;

            constructor(
                name: string,
                callback: (message: discord.Message, args?: Array<string>) => void,
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
                trigger: string,
                response?: any,
                checkFunction?: (message: discord.Message, trigger: string) => boolean,
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
                trigger: Array<string>,
                response?: any,
                checkFunction?: (message: discord.Message, trigger: Array<string>) => boolean,
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