const { path } = require('../util/index.js');
const config = require('../config.js');
const responder = require('./responseHandler.js');

const validate =
	(ctx, next) => {
		if(!path(['update', 'message', 'from', 'id'], ctx)) return Promise.reject(ctx);
		return ((ctx.update.message.from.id === config.masterID)
			? Promise.resolve(ctx)
			: Promise.reject(ctx))
				.then(next)
				.catch(responder.fail('Username not authenticated.'));
	};

module.exports = validate;
