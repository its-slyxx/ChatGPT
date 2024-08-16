const Discord = require("discord.js")
const ActivityType = require("discord.js")

const { Client, IntentsBitsField } = require("discord.js")
const OpenAI = require("openai")

const openai = new OpenAI({
    apiKey: "Votre api key",
})

const client = new Discord.Client({intents: 3276799})
const CHANNEL_ID = "Id du salon du chat"
   

client.on("ready", ()=>{
    console.log(`${client.user.tag} est bien en ligne`)
})

client.on("messageCreate", async message => {
    if(message.author.bot || message.channelId !== CHANNEL_ID || message.content.startsWith("!")) {
        return;
    }
    let conversationLog = [{role: "system", content: "Je suis un BOT"}]

    try {
        await message.channel.sendTyping();
        const prevMessages = await message.channel.messages.fetch({limit: 15})
        prevMessages.reverse().forEach((msg) => {
            if(message.content.startsWith("!") || (msg.author.bot && msg.author.id !== client.user.id)) {
                return;
            }
            const role = msg.author.id === client.user.id ? "assistant" : "user";
            const name = msg.author.username.replace(/_s+/g,'_').replace(/[^\w\s]/gi,'');

                conversationLog.push({role, content: msg.content, name})
        })
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            message: conversationLog
        });
        if(completion.choices.length > 0 && completion.choices[0].message) {
            await message.reply(completion.choices[0].message);
        }
    } catch (error) {
        console.error(`Erreur : ${error.message}`)
    }
})

client.login("Token de votre bot")
