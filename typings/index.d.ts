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
            public name: string;
            public usage: string;
            public description: string;
            public subtitle: string;
            public hidden: boolean;
            public admin: boolean;

            private callback: (message: discord.Message, args?: Array<string>) => void;

            check(message: discord.Message, prefix?: string, admin?: boolean, execute?: boolean): boolean;
            exec(message: discord.Message, args?: Array<string>): void;
        }

        class Response {

        }

        function getArgs(message: discord.Message, prefix: string): Array<string>;
    }
}
