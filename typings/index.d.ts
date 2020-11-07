declare module "discord-bot" {
    import discord from "discord.js";

    class DiscordBot extends discord.Client {
        
    }

    namespace DiscordBot {
        class Command {

        }

        class Response {

        }

        function getArgs(message: discord.Message, prefix: string): Array;
    }
}
