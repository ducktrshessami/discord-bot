declare module "discord-bot-response" {
    import discord from "discord.js";

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

    export = Response;
}
