/// <reference path="../yamdbf.d.ts" />

import { Bot } from 'yamdbf';
import { Message } from 'discord.js';
import * as path from 'path';

const config: any = {
	token: 'MjQ0NjcxMDE1NzIyOTQyNDY0.CwA7Kg.mcdajnX8fb24ZvlvVFPYRSvy8sY',
	owner: ['0000000000000']
};

const bot: Bot = new Bot({
	name: 'test',
	version: '0.0.0',
	token: config.token,
	commandsDir: path.join(__dirname, 'commands'),
	config: config
});

bot.on('message', (message: Message) =>
{
	console.log('Received message.');
});
