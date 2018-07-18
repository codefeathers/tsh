const addListeners = (emitter, responder, ctx) => {
	emitter.stdout.setEncoding('utf8');
	emitter.stderr.setEncoding('utf8');
	emitter.stdout.on('data', d => responder.success(`<code>${d}</code>`, { mode: 'html' })(ctx));
	emitter.stderr.on('data', e => responder.success(`<code>${e}</code>`, { mode: 'html' })(ctx));
};

const removeListeners = emitter => {
	emitter.stdout.removeAllListeners('data');
	emitter.stderr.removeAllListeners('data');
};

module.exports = {
	add: addListeners,
	remove: removeListeners,
};
