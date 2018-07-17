const { EOL } = require('os');
const { path } = require('../util/index.js');

const success = (response, mode) => ctx => {
	const respondAs = (mode && mode.toLowerCase() === 'html') ? 'replyWithHTML' : 'reply';
	return response ? ctx[respondAs](response) : null;
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

const fail = response => ctx => {
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
	return ctx.reply(response);
};

module.exports = {
	success, fail,
};
