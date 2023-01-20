module.exports = {
    async execute(message) {
        console.log(message.mentions);
        if (message.mentions.users.size > 1 ||
            message.mentions.roles.size > 0 ||
            message.mentions.crosspostedChannels.size > 0 ||
            message.mentions.repliedUser != null) return;
        await message.reply(message.content);
        // console.log(message.mentions);
    },
};