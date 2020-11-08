declare module "discord-bot-command" {
    import discord from "discord.js";

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

    namespace Command {
        function getArgs(message: discord.Message, prefix: string): Array<string>;
    }

    export = Command;
}
