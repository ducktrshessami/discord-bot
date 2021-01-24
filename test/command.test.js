const assert = require("assert");
const Command = require("../lib/command");
const example = require("./foobar");

const works = () => true;
const adminCmd = new Command("foobar", works, { admin: true });
const ownerCmd = new Command("foo", works, { owner: true, aliases: ["f"] });
const memberCmd = new Command("bar", works, { aliases: ["b"] });

describe("Command", function() {
    describe("#constructor", function() {
        it("auto formats command name", function() {
            const unformatted = " cHiCkEn\n", formatted = "chicken";
            let cmd = new Command(unformatted, works);
            assert.strictEqual(cmd.name, formatted);
        });
    });
    describe("#check", function() {
        it("handles aliases properly", function() {
            let message = {
                author: memberCmd,
                cleanContent: "b 1",
                content: "b 1"
            };
            assert(memberCmd.check(message, "", false, false));
        });
    });
});
