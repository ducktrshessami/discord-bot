let admin = { id: "123" };
let owner = { id: "234" };
let member = { id: "345" };
let guild = {
    id: "456",
    ownerID: owner.id
};

module.exports = {
    admin: admin,
    owner: owner,
    member: member,
    guild: guild
};
