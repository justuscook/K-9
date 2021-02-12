import Commando from 'discord.js-commando';
import {token} from './config.json'
import * as path from 'path'
import { TextChannel } from 'discord.js';

const client = new Commando.CommandoClient({
	commandPrefix: '?',
	owner: '269643701888745474'
});

client.registry
.registerDefaultTypes()
.registerGroups([
    ['builds', 'Build related commands']
])
.registerDefaultGroups()
.registerDefaultCommands({
	help: false,
})
.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready',async () => {
	const chan = await client.channels.fetch('620344940852936714');

	await (chan as TextChannel).send('K-9 online doc!')
});

client.login(token);
