// Internal
const { spawn } = require('child_process');
const { EOL } = require('os');
const os = require('os');

// Modules
const Telegraf = require('telegraf');

//Config
const config = require('./config.js');

// Utils
const { path, getText, extractCommand } = require('./util/index.js');

// Lib
const validator = require('./lib/validator.js');
const responder = require('./lib/responseHandler.js');
const listeners = require('./lib/listeners.js');

const dateOptions = {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
};

const bot = new Telegraf(config.botApiKey);
const sessions = [];
sessions.history = [];

bot.use((ctx, next) =>
	validator(ctx)
		.then(next)
		.catch(responder.fail(
			`Username Not authenticated!`
		)));

// get os info
const home  = os.homedir();
const hostname = os.hostname();
const username = os.userInfo().username;
const defaultShell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';

bot.command('start',
	ctx => {
		const newProc = spawn(defaultShell, {
			cwd: home
		});
		sessions.push(newProc);
		sessions.currentSession = newProc;
		listeners.add(sessions.currentSession, responder, ctx);
		return ctx.replyWithHTML(`Welcome to tsh -- <code>Telegram Shell!</code>\n\n`
			+ `You are now connected to <code>${hostname}</code>`
			+ ` as <strong>${username}</strong>`);
	});

bot.command('ls',
	ctx => ctx.reply(
		sessions.reduce((acc, _, index) =>
			acc ? `${acc}\n${index}` : `${index}`, '')
		|| `No sessions found. Start one with /start.`
	));

bot.command('attach',
	ctx => {
		const text = getText(ctx);
		const sessionIndex = parseInt(extractCommand('attach')(text));
		if(Number.isNaN(sessionIndex) || !sessions[sessionIndex])
			return responder.fail('Session not found. /ls for list of sessions')(ctx);
		sessions.currentSession = sessions[sessionIndex];
		listeners.add(sessions.currentSession, responder, ctx);
		return responder.success(`Reattached to shell ${sessionIndex}`)(ctx);
	});

bot.command('detach',
	ctx => {
		const text = getText(ctx);
		const sessionIndex = parseInt(extractCommand('detach')(text));
		const currentSession =
			text.trim() === '/detach'
				? sessions.currentSession : sessions[sessionIndex];
		if(!currentSession)
			return responder.fail('Session not found. /ls for list of sessions.')(ctx);
		listeners.remove(sessions.currentSession);
		sessions.currentSession = undefined;
		return responder.success(`Detached from shell ${sessionIndex}`)(ctx);
	});

bot.command('kill',
	ctx => {
		const text = getText(ctx);
		const sessionIndex = parseInt(extractCommand('kill')(text));
		if(Number.isNaN(sessionIndex) || !sessions[sessionIndex])
			return responder.fail('Session not found. /ls for list of sessions.')(ctx);
		const disconnect = sessions[sessionIndex];
		delete sessions[sessionIndex];
		if(disconnect === sessions.currentSession) sessions.currentSession = undefined;
		disconnect.kill();
		ctx.reply('Session killed. /ls for list of sessions.')
	})

bot.use(ctx => {
	if(!sessions.currentSession)
		return responder.fail(`No active session. `
			+ `Start one with /start or view list of sessions by sending /ls.`)(ctx);
	const cmd = ctx.update.message.text;
	const history = `${new Date().toLocaleDateString('en-IN', dateOptions)}: ${cmd}`;
	sessions.history.push(history);
	console.log(history);
	sessions.currentSession.stdin.write(cmd + EOL);
});

bot.startPolling();
console.log(`Polling for updates.`);
