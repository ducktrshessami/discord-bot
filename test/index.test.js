const assert = require("assert");
const DiscordBot = require("../lib");
const examples = require("./foobar");

describe("DiscordBot", function() {
    describe("defaultHelpCmd", function() {
        it("detects aliases on specific command help", function(done) {
            let foo, message, client, help;
            foo = new DiscordBot.Command("foo", () => true, {
                aliases: ["bar"],
                usage: true
            });
            message = {
                author: examples.admin,
                content: "help bar",
                channel: {
                    send: (response) => {
                        assert.strictEqual(response, `\`${foo.usage}\``);
                        done();
                    }
                }
            };
            client = new DiscordBot({ generateCmd: { help: true } }, [foo]);
            client.user = examples.admin;
            client._generateHelpCmd();
            help = client.commands.pop();
            client.destroy();
            help.check(message);
        });
    });
});
