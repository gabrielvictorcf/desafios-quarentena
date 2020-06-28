process.env.NTBA_FIX_319 = true; // Silences an annoying error message.
const TelegramBot = require('node-telegram-bot-api');
const guessGame = require('./guess');
const randomPhrases = require('./random-phrases');
const botFile = require('./token');

// replace the value below with the Telegram token you receive from @BotFather
const token = botFile.testBot.token;

if (token === 'YOUR ACCESS TOKEN HERE') {
	console.log('You forgot to replate the access token!!! Properly read the README before continuing >:(');
	process.exit(-1);
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
bot.commands = {
	help: "/help - Veja os comandos disponíveis",
	jokempo: "/jokempo - Me derrote no Jokempo!",
	numGuess: "/adivinhe - Acerte o numero em que estou pensando!"
}

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', async (msg) => {
	const chatMessage = msg.text.trim().toLowerCase();
	const chatId = msg.chat.id;
	const curDate = new Date();
	//Esse array é uma enumeração dos dias, já que getDay() retorna um numero
	const weekDays = [`Domingo`,`Segunda`,`Terça`,`Quarta`,`Quinta`,`Sexta`,`Sabado`];
	
	if (chatMessage.startsWith('ola') || chatMessage.startsWith('oi')) {
		bot.sendMessage(chatId, 'Olá! Como vai o seu dia?');
	}
	else if(chatMessage.startsWith(`/help`)){
		bot.sendMessage(chatId,`Meus comandos são:\n`+
		"/help - Veja meus comandos\n"+
		"/adivinhe - Tente acertar o numero em que pensei");
	}
	else if(chatMessage.includes(`que dia é hoje`)){
		bot.sendMessage(chatId,`Hoje é ${weekDays[curDate.getDay()]}!`);
	}
	else if(chatMessage.startsWith(`quem te fez`)){
		bot.sendMessage(chatId,`Gabriel V!`);
	}
	else if(guessGame.main(bot,chatId,chatMessage)){
		return;
	} else {
		randomPhrases.writeRandomPhrase(bot, chatId);
	}
});

console.log('Fetching data...');
bot.getMe().then(me => {
	console.log(`I'm ready to serve! Talk to me on @${me.username}`);
	console.log(`or visit this link: https://t.me/${me.username}`);
});