const Telegraf = require('telegraf');
const config = require('./config')

const bot = new Telegraf(config.apiKey)

bot.command('start', ctx => {
	return ctx.reply('Bot succesfully started!');
})

bot.hears('hi', ctx => {
	return ctx.reply('Hey!, How are you?');
})

bot.startPolling();
