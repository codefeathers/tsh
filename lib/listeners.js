const addListeners = (emitter, responder, ctx) => {
	emitter.stdout.setEncoding('utf8');
	emitter.stderr.setEncoding('utf8');
	emitter.stdout.on('data', d => responder.success(d)(ctx));
	emitter.stderr.on('data', e => responder.success(e)(ctx));
};

const removeListeners = emitter => {
	emitter.stdout.removeAllListeners('data');
	emitter.stderr.removeAllListeners('data');
};

module.exports = {
	add: addListeners,
	remove: removeListeners,
};
