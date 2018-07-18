const { path } = require('../util/index.js');
const config = require('../config.js');
const responder = require('./responseHandler.js');

const validate =
	(ctx, next) => {
		const fromId = path(['update', 'message', 'from', 'id'], ctx);
		if(!fromId) return;
		return ((fromId === config.masterID)
			? Promise.resolve(ctx)
			: Promise.reject(ctx))
				.then(next)
				.catch(responder.fail('Username not authenticated.'));
	};

module.exports = validate;
