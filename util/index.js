const path = (path, obj) => path.reduce((result, segment) => result && result[segment], obj);

module.exports = {
	path,
};
