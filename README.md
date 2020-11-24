# discord-bot

A [discord.js](https://discord.js.org/#/) wrapper to reduce effort

Mainly for personal use

# Installation

After installing [Node.js](https://nodejs.org/), run the following command in your package directory:

```
npm install github:ducktrshessami/discord-bot
```

This will probably never be on [npm](https://www.npmjs.com/).

discord.js also lists some [optional dependencies in their documentation](https://discord.js.org/#/docs/main/master/general/welcome) to enable voice support and various optimizations.

# Usage

```js
const DiscordBot = require("discord-bot");
const readline = require("readline");

const ios = new readline.Interface({
    input: process.stdin,
    output: process.stdout
});

let roll = new DiscordBot.Command("roll", rollCommand);
let ping = new DiscordBot.Response("ping", "Pong!");

let client = new DiscordBot(
    {
        token: "BOT_TOKEN",
        admin: [ "USER_ID" ]
    },
    [ roll ],
    [ ping ]
);

ios.on("line", line => {
    if (line.toLowerCase().trim() == "exit") {
        client.destroy();
        ios.close();
    }
})

function rollCommand(message) {
    let num = Math.ceil(Math.random() * 20); // Roll a D20
    message.channel.send(`<@${message.author.id}> rolled a \`${num}\``).catch(console.error);
}
```

![Example bot](./assets/images/foo.png)

# Documentation

## Table of Contents

1. [Class: DiscordBot](#class-discordbot)
    - [DiscordBot](#discordbotconfig-commands-responses)
    - [DiscordBot.loopPresences](#discordbotlooppresenceslist-minutes-shuffle)
    - [DiscordBot.newPresence](#discordbotnewpresencepresence-time)

2. [Class: DiscordBot.Command](#class-discordbotcommand)
    - [DiscordBot.Command](#discordbotcommandcmd-cb-options)
    - [Command.check](#commandcheckmessage-prefix-admin-execute)
    - [Command.exec](#commandexecmessage-args)
    - [DiscordBot.Command.getArgs](#static-commandgetargsmessage-prefix)

3. [Class: DiscordBot.Response](#class-discordbotresponse)
    - [DiscordBot.Response](#discordbotresponsetrigger-response-checkfunction-responsefunction-options)
    - [Response.check](#responsecheckmessage-execute)
    - [Response.say](#responsesaymessage)

## Class: DiscordBot

### DiscordBot(config[, commands, responses])

### DiscordBot.loopPresences(list, minutes[, shuffle])

### DiscordBot.newPresence([presence, time])

## Class: DiscordBot.Command

### DiscordBot.Command(cmd, cb[, options])

### Command.check(message[, prefix, admin, execute])

### Command.exec(message[, args])

### static Command.getArgs(message[, prefix])

## Class: DiscordBot.Response

### DiscordBot.Response(trigger[, response, checkFunction, responseFunction, options])

### Response.check(message[, execute])

### Response.say(message)
