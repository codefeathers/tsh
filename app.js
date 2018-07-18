// Internal
const { spawn } = require('child_process');
const { EOL } = require('os');
const os = require('os');

// Runtime
const runtime = {
	home: os.homedir(),
	hostname: os.hostname(),
	username: os.userInfo().username,
	shell: os.platform() === 'win32' ? 'cmd.exe' : 'bash',
	sessions: [],
	identifierState: 0,
	history: [],
}

// Modules
const Telegraf = require('telegraf');

//Config
const config = require('./config.js');

// Lib
const validator = require('./lib/validator.js');
const responder = require('./lib/responseHandler.js');
const sessionFinder = require('./lib/sessionFinder.js');
const listeners = require('./lib/listeners.js');

// Utils
const { extractCommandText } = require('./util/index.js');

const dateOptions = {
	weekday: 'long',
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
};

const bot = new Telegraf(config.botApiKey);
const getSession = sessionFinder(runtime.sessions);

// Validate bot's master
bot.use(validator);

bot.command('start',
	ctx => {
		const newProc = spawn(runtime.shell, {
			cwd: runtime.home
		});
		const identifier = extractCommandText('start')(ctx);
		if(identifier) newProc.identifier = identifier;
		else newProc.identifier = runtime.identifierState;
		newProc.index = runtime.identifierState;
		runtime.sessions[runtime.identifierState] = newProc;
		runtime.identifierState++;
		runtime.currentSession = newProc;
		listeners.add(runtime.currentSession, responder, ctx);
		return responder.success(`Welcome to tsh -- <code>Telegram Shell!</code>\n\n`
			+ `You are now connected to <code>${runtime.hostname}</code>`
			+ ` as <strong>${runtime.username}</strong>.`,
			'html',
		)(ctx);
	});

bot.command('shell',
	ctx => {
		const shell = extractCommandText('shell')(ctx);
		runtime.shell = shell;
		return responder.success(`Shell changed to ${shell}.`)(ctx);
	});

bot.command('save',
	ctx => {
		const identifier = extractCommandText('save')(ctx);
		if(!identifier) return responder.fail('Need a valid identifier to save session.')(ctx);
		runtime.currentSession.identifier = identifier;
		return responder.success(`Saved session <code>${identifier}</code>.`, 'html')(ctx);
	});

bot.command('ls',
	ctx => ctx.reply(
		runtime.sessions.reduce((acc, session) =>
			acc ? `${acc}\n${session.identifier}` : `${session.identifier}`, '')
		|| `No sessions found. Start one with /start.`
	));

bot.command('attach',
	ctx => {
		const session = getSession(ctx)('attach');
		if(!session)
			return responder.fail('Session not found. /ls for list of sessions')(ctx);
		runtime.currentSession = session;
		listeners.add(runtime.currentSession, responder, ctx);
		return responder.success(`Reattached to shell ${session.identifier}`)(ctx);
	});

bot.command('detach',
	ctx => {
		const session = getSession(ctx)('detach') || runtime.currentSession;
		if(!session)
			return responder.fail('Session not found. /ls for list of sessions.')(ctx);
		listeners.remove(session);
		runtime.currentSession = undefined;
		return responder.success(`Detached from shell ${session.identifier}`)(ctx);
	});

bot.command('kill',
	ctx => {
		const session = getSession(ctx)('kill') || runtime.currentSession;
		if(!session)
			return responder.fail('Session not found. /ls for list of sessions.')(ctx);
		session.kill();
		delete runtime.sessions[session.index];
		if(session === runtime.currentSession) runtime.currentSession = undefined;
		ctx.reply('Session killed. /ls for list of sessions.')
	})

bot.use(ctx => {
	if(!runtime.currentSession)
		return responder.fail(`No active session. `
			+ `Start one with /start or view list of sessions by sending /ls.`)(ctx);
	const cmd = ctx.update.message.text;
	const history = `${new Date().toLocaleDateString('en-IN', dateOptions)}: ${cmd}`;
	runtime.history.push(history);
	console.log(history);
	runtime.currentSession.stdin.write(cmd + EOL);
});

bot.startPolling();
console.log(`Polling for updates.`);
