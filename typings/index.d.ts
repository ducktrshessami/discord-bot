declare module "discord-bot" {
    import discord from "discord.js";

    class DiscordBot extends discord.Client {
        public config: {
            token: string,
            options?: discord.ClientOptions
        };
        public commands: Array<DiscordBot.Command>;
        public responses: Array<DiscordBot.Response>

        private presences: object;

        constructor(
            config: {
                token: string
                options?: discord.ClientOptions
            },
            commands?: Array<DiscordBot.Command>,
            responses?: Array<DiscordBot.Response>
        );

        loopPresences(list: Array<discord.PresenceData>, minutes: number, shuffle?: boolean): void;
        newPresence(foo?: DiscordBot, p?: discord.PresenceData, time?: number): void;
    }

    namespace DiscordBot {
        class Command {

        }

        class Response {

        }

        function getArgs(message: discord.Message, prefix: string): Array<string>;
    }
}
