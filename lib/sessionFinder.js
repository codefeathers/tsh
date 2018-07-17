const { extractCommandText } = require('../util/index.js');

const sessionFinder = sessions => ctx => command => {
	const identifier = extractCommandText(command)(ctx);
	return sessions[identifier] || sessions.filter(session => session.identifier === identifier)[0];
};

module.exports = sessionFinder;