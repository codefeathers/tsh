const { compose, getText, extractCommandText } = require('../util/index.js');

const sessionFinder = sessions => ctx => command => {
	const identifier = compose(
		extractCommandText(command),
		getText,
	)(ctx);

	return sessions[identifier];
};

module.exports = sessionFinder;