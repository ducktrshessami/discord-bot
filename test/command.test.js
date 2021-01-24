const assert = require("assert");
const Command = require("../lib/command");
const example = require("./foobar");

const works = () => true;
const adminCmd = new Command("foobar", works, { admin: true });
const ownerCmd = new Command("foo", works, { owner: true, aliases: ["f"] });
const memberCmd = new Command("bar", works, { aliases: ["b"] });

describe("Command", function() {
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
