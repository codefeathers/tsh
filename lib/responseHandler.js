const { EOL } = require('os');
const { path } = require('../util/index.js');

const parseOptions = ({ mode, asReply }, ctx) => {
	const respondMode = (mode && mode.toLowerCase() === 'html') ? 'replyWithHTML' : 'reply';
	const options = asReply ? { reply_to_message_id: ctx.message.message_id } : {};
	return [ respondMode, options ];
}

const success = (response, options) => ctx => {
	const [ respondMode, replyOptions ] = parseOptions(options, ctx);
	return response ? ctx[respondMode](response, replyOptions) : null;
};

const convertCtx = ctx => {
	const message = path(['update', 'message'], ctx);
	const { id, first_name, username, language_code } = path(['from'], message);
	const { text } = message;
	return JSON.stringify({
		id,
		first_name,
		username,
		language_code,
		text,
	}, null, 2);
};

const fail = (response, options) => ctx => {
	const [ respondMode, replyOptions ] = parseOptions(options, ctx);
	if(!response
		|| !path(['update', 'message'], ctx)
	) return;
	console.log(
		EOL,
		response,
		EOL,
		`With context: `,
		convertCtx(ctx),
	);
	return ctx[respondMode](response, replyOptions);
};

module.exports = {
	success, fail,
};
