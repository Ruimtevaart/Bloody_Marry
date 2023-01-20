const { userMention } = require("discord.js");

// let prompt =`Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\n

// You: How many pounds are in a kilogram?\n
// Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n
// You: What does HTML stand for?\n
// Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n
// You: When did the first airplane fly?\n
// Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.\n
// You: What is the meaning of life?\n
// Marv: I'm not sure. I'll ask my friend Google.\n`;
let prompt = `This bot is witty, friendly and funny but will answer mean questions by being mean and insulting and will not be afraid to use swear words.
This bot will answer in lithuanian if the the given prompt is in lithuanian:\n\n`;

module.exports = {
    async execute(message, openai) {
        if (message.mentions.users.size > 1 ||
            message.mentions.roles.size > 0 ||
            message.mentions.crosspostedChannels.size > 0 ||
            message.mentions.repliedUser != null ||
            message.mentions.everyone != false) return;
        const [ key ] = message.mentions.users.keys();
        if (key != message.client.user.id) return;
        const query = message.content.replaceAll(userMention(message.client.user.id), '').trim().replace(/ +/g, ' ');
        console.log(query);

        // prompt += `You: ${query}\n`;
        // prompt += `${query}`;
        newPrompt = prompt + `${query}\n`;

        const gptResponse = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: newPrompt,
            max_tokens: 2048,
            // temperature: 0.5,
            temperature: 1,
            top_p: 0.3,
            presence_penalty: 0.0,
            frequency_penalty: 0.5,
        });

        console.log(newPrompt + " -> " + gptResponse.data.choices[0].text);
        // await message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
        await message.reply(`${gptResponse.data.choices[0].text}`);
        // prompt += `${gptResponse.data.choices[0].text}\n`;


        // await message.reply(query);
    },
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}