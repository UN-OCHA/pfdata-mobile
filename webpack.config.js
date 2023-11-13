const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
	const config = await createExpoWebpackConfigAsync(env, argv);
	// Customize the config before returning it.

	// Set the publicPath to './' so that it outputs relative paths
	config.output.publicPath = "./";

	return config;
};
