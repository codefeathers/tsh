const path = (path, obj) => path.reduce((result, segment) => result && result[segment], obj);
const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
const getText = ctx => path(['update', 'message', 'text'], ctx) || '';
const extractCommand = cmd => text => text.replace(`/${cmd}`, '').trim();

module.exports = {
	path,
	compose,
	getText,
	extractCommand,
};
