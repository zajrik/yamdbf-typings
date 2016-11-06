// Type definitions for yamdbf v2.4.0
// Project: https://github.com/zajrik/yamdbf
// License: MIT

declare module 'yamdbf'
{
	import { User } from 'discord.js';
	import { Guild } from 'discord.js';
	import { Client } from 'discord.js';
	import { Message } from 'discord.js';
	import { Collection } from 'discord.js';
	import { ClientOptions } from 'discord.js';
	import { PermissionResolvable } from 'discord.js';

	export const version: string;

	export class Bot extends Client
	{
		public constructor(botOptions: BotOptions, clientOptions?: ClientOptions);
		public name: string;
		public commandsDir: string;
		public statusText: string;
		public selbot: boolean;
		public version: string;
		public disableBase: string[];
		public config: Object;

		public storage: LocalStorage;
		public guildStorages: GuildStorageRegistry<string, GuildStorage>;
		public commands: CommandRegistry<string, Command>;

		private _token: string;
		private _guildDataStorage: LocalStorage;
		private _guildSettingStorage: LocalStorage;
		private _guildStorageLoader: GuildStorageLoader;
		private _commandLoader: CommandLoader;
		private _dispatcher: CommandDispatcher;

		public loadCommand(command: string): void;
		public start(): this;
		public setDefaultSetting(key: string, value: any): this;
		public removeDefaultSetting(key: string): this;
		public defaultSettingExists(key: string): boolean;
		public getPrefix(guild: string | Guild): string;
	}

	type BotOptions = {
		name: string;
		token: string;
		commandsDir: string;
		statusText?: string;
		selfbot?: boolean;
		version?: string;
		disableBase?: string[];
		config: Object;
	}

	export class Command
	{
		public constructor(bot: Bot, info: CommandInfo);
		public bot: Bot;
		public name: string;
		public description: string;
		public usage: string;
		public extraHelp: string;
		public group: string;
		public aliases: string[];
		public guildOnly: boolean;
		public argOpts: ArgOpts;
		public permissions: PermissionResolvable[];
		public roles: string[];
		public ownerOnly: boolean;
		public overloads: string;

		public action(message: Message,
						args: Array<number | string>,
						mentions: User[],
						original: string): any;
		public register(): void;

		private _respond(message: Message, response: string, code: string): Promise<Message>;
	}

	type CommandInfo = {
		name: string;
		description: string;
		usage: string;
		extraHelp: string;
		group: string;
		aliases?: string[];
		guildOnly?: boolean;
		argOpts?: ArgOpts;
		permissions?: PermissionResolvable[];
		roles?: string[];
		ownerOnly?: boolean;
		overloads?: string;
	}

	type ArgOpts = {
		stringArgs?: boolean;
		separator?: string;
	}

	export class CommandDispatcher
	{
		public constructor(bot: Bot);
		private _bot: Bot;

		public handleMessage(message: Message): Promise<any>;
		public processContent(message: Message): Object;
		public checkPermissions(dm: boolean, message: Message, command: Command): PermissionResolvable[];
		public hasRoles(dm: boolean, message: Message, command: Command): boolean;

		public commandNotFoundError(message: Message): Promise<Message>;
		public guildOnlyError(message: Message): Promise<Message>;
		public missingPermissionsError(missing: PermissionResolvable[], message: Message): Promise<Message>;
		public missingRolesError(message: Message, command: Command): Promise<Message>;

		public dispatch(command: Command,
						message: Message,
						args: Array<number | string>,
						mentions: User[],
						original: string): Promise<any>;
	}

	export class CommandLoader
	{
		public constructor(bot: Bot);
		private _bot: Bot;

		public loadCommands(): void;
		public reloadCommand(): void;
	}

	export class CommandRegistry<key, value> extends Collection<key, value>
	{
		public groups: string[];

		public register(): void;
		public findByNameOrAlias(text: string): Command;
		public filterGuildUsable(bot: Bot, message: Message): Collection<string, Command>;
		public filterDMUsable(bot: Bot, message: Message): Collection<string, Command>;
		public filterDMHelp(bot: Bot, message: Message): Collection<string, Command>;
	}

	export class GuildStorage
	{
		public constructor(bot: Bot, guild: Guild | string, dataStorage: LocalStorage, settingsStorage: LocalStorage);
		private _id: string;
		private _dataStorage: LocalStorage;
		private _settingsStorage: LocalStorage;
		private _temp: Object;

		public id: string;

		public settingsLength: number;
		public settingsKeys: string[];

		public settingKey(index: number): string;
		public getSetting(key: string): any;
		public setSetting(key: string, value: any): void;
		public removeSetting(key: string): void;
		public settingExists(key: string): boolean;
		public resetSettings(defaults: DefaultGuildSettings): void;

		public length: number;
		public keys: string[];

		public key(index: number): string;
		public getItem(key: string): any;
		public setItem(key: string, value: any): void;
		public removeItem(key: string): void;
		public exists(key: string): boolean;
		public clear(): void;

		public nonConcurrentAccess(key: string, callback: Function): Promise<any>;
	}

	type DefaultGuildSettings = {
		prefix: string;
		disabledGroups: string[];
	}

	export class GuildStorageLoader
	{
		public constructor(bot: Bot);
		private _bot: Bot;

		public loadStorages(dataStorage: LocalStorage, settingsStorage: LocalStorage): void;
		public initNewGuilds(dataStorage: LocalStorage, settingsStorage: LocalStorage): void;
	}

	export class GuildStorageRegistry<key, value> extends Collection<key, value>
	{
		public get(guild: key): value;
		public get(guild: Guild): value;
		public findAll(key: string, value: any): Collection<key, value>;
		public findAll(key: string, value: any): any;
		public findAllBySetting(key: string, value: any): Collection<key, value>;
		public resetAllGuildSettings(defaults: DefaultGuildSettings): void;
	}

	export class LocalStorage
	{
		public constructor(fileName: string);
		public length: number;
		public keys: string[];

		public key(index: number): string;
		public getItem(key: string): any;
		public setItem(key: string, value: any): void;
		public removeItem(key: string): void;
		public exists(key: string): boolean;
		public clear(): void;

		public nonConcurrentAccess(key: string, callback: Function): Promise<any>;
	}
}
