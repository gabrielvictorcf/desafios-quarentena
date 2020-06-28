let isBotGuessing = false;
let guessedNumber = null;

/**
* Just a simple sleep function. It will return a promisse that will resolve itself
* in `time` milisseconds.
* @argument { number } time The time in Milisseconds the function will wait.
* @returns { Promise<void> }
*/
function sleep (time) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), time);
	});
}

const chooseNumber = () =>{
    return Math.floor(Math.random()*50)
}

function whoWon (playerChoice, botChoice) {
    if(/^\d{2}/.test(playerChoice)) return 'invalid play';
	else if (playerChoice === botChoice) return 'player';
	else return 'bot';
}

async function startPlaying (bot, chatId) {
    await bot.sendMessage(chatId,`Adivinhe um número entre 0 e 50`);
    await sleep(1000);
    await bot.sendMessage(chatId,`3...`);
    await sleep(1000);
    await bot.sendMessage(chatId,`2...`);
    await sleep(1000);
    await bot.sendMessage(chatId,`1...`);
    isBotGuessing = true;
    await sleep(500);
    guessedNumber = chooseNumber();
    await bot.sendMessage(chatId,`${guessedNumber}!!!`);
    await sleep(1500);
    if (isBotGuessing){
        isBotGuessing = false;
        await bot.sendMessage(chatId,`Demorou demais >:`);
    }
}

function readUserResponse (bot, chatId, message) {
	const winner = whoWon(message, guessedNumber);
	const response = {
		'player': 'Acertou (𐨨𐭃𐨨)',
		'bot': 'É dificil mesmo, mas dá!',
	}[winner] || `Tem que ser um número né`;
	bot.sendMessage(chatId, response);
	isBotGuessing = false;
	guessedNumber = null;
}

//Segue a mesma logica de jokempo.js
function main (bot, chatId, message) {
	if (isBotGuessing) {
        //Se a flag for true, é porque o usuario vai adivinhar
		readUserResponse(bot, chatId, message);
		return true;
	} else if (message === '/adivinhe') {
		startPlaying(bot, chatId);
		return true;
	} else {
		return false;
	}
}

module.exports = {
    main
}