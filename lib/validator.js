const { path } = require('../util/index.js');
const config = require('../config.js');

const validate =
	ctx => {
		if(!path(['update', 'message', 'from', 'id'], ctx)) return Promise.reject(ctx);
		return (ctx.update.message.from.id === config.masterID) ? Promise.resolve(ctx) : Promise.reject(ctx);
	}

module.exports = validate;
