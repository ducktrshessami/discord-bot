declare module "discord-bot" {
    import discord from "discord.js";
    import BotCommand from "discord-bot-command";
    import BotResponse from "discord-bot-response";

    class DiscordBot extends discord.Client {
        public config: {
            token: string,
            options?: discord.ClientOptions
        };
        public commands: Array<BotCommand>;
        public responses: Array<BotResponse>

        protected presences: object;

        constructor(
            config: {
                token: string
                options?: discord.ClientOptions
            },
            commands?: Array<BotCommand>,
            responses?: Array<BotResponse>
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
        const Command = BotCommand;
        const Response = BotResponse;
    }

    export = DiscordBot;
}
