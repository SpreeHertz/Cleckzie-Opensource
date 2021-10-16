const { Client, Collection } = require("discord.js");
const Levels = require("discord-xp");
const chalk = require("chalk");
require('dotenv').config();

// Note: 32767 means all intents.
const client = new Client({
	intents: 32767,
	disableMentions: 'everyone',
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

module.exports = client;

// discord-xp
try {
	Levels.setURL(process.env.database).then(console.log(chalk.grey('[info] -' + chalk.cyanBright(' Database successfully connected') + chalk.magentaBright(' for messages leveling.') + chalk.yellow(' (discord-xp)'))));
}
catch (err) {
	console.log(chalk.red('[error] - Something wrong happened while trying to connect to database for the discord-xp package.'));
}

client.on("messageCreate", async (message) => {
	if (!message.guild) return;
	if (message.author.bot) return;

	const randomAmountOfXp = Math.floor(Math.random() * 9) + 1;
	const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
	if (hasLeveledUp) {
		const user = await Levels.fetch(message.author.id, message.guild.id);
		message.channel.send({ content: `Congratulations ${message.author.username}, your level is now ${user.level}. :tada:` })
			.then(m => {
				setTimeout(() => {
					m.delete();
				},
				10000);
			});

	}
});


client.commands = new Collection();
client.slashCommands = new Collection();
client.config = require("./config/config.json");

[client.antiCrash ? "antiCrash" : null]
	.filter(Boolean)
	.forEach(h => {
		require(`./SlashCommands/${h}`)(client);
	});

require("./handler")(client);


client.login(process.env.token);
