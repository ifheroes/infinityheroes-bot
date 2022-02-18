module.exports = {
	name: 'ready',
	once: true,
	execute(client) {
		console.log(`\nReady! Logged in as ${client.user.tag}\n`);
		client.user.setActivity("mit neuen Posts!", { type: 'PLAYING' });
	},
};