// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path";
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, StreamInfo } from "vscode-languageclient/node";
import * as net from "net";
import * as os from "os";
import * as fs from "fs";
import { ConfigWatcher, IConfigUpdate } from "./ConfigWatcher";

interface LuaModule extends vscode.QuickPickItem {
	moduleName: string;
	path: string;
	name: string;
}

const LANGUAGE_ID = 'lua';
let DEBUG_MODE = true;

let client: LanguageClient;
let saveContext: vscode.ExtensionContext;
let editorConfigWatcher: ConfigWatcher;
let moduleConfigWatcher: ConfigWatcher;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	DEBUG_MODE = process.env['EMMY_CODESTYLE_DEV'] === "true";
	saveContext = context;

	saveContext.subscriptions.push(vscode.commands.registerCommand("emmylua.codestyle.insertEditorConfig", insertEditorConfig));

	editorConfigWatcher = new ConfigWatcher('**/.editorconfig');

	editorConfigWatcher.onConfigUpdate(onEditorConfigUpdate);

	saveContext.subscriptions.push(editorConfigWatcher);

	registerCustomCommands(saveContext);

	startServer();
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function onEditorConfigUpdate(e: IConfigUpdate) {
	if (client) {
		client.sendRequest('config/editorconfig/update', e);
	}
}

function registerCustomCommands(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('emmylua.spell.addDict', (word) => {
		let config = vscode.workspace.getConfiguration();
		let value: any[] | undefined = config.get("emmylua.spell.dict");
		if (value === undefined) {
			value = [];
		}

		value.push(word);
		config.update("emmylua.spell.dict", value, vscode.ConfigurationTarget.Workspace);
	}))
}

async function startServer() {
	const editorConfigFiles = await editorConfigWatcher.watch();
	// const moduleConfigFiles = await moduleConfigWatcher.watch();
	let dictionaryPath = [
		path.join(saveContext.extensionPath, "dictionary", "dictionary.txt").toString(),
		path.join(saveContext.extensionPath, "dictionary", "lua_dict.txt").toString()
	]

	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: LANGUAGE_ID }],
		synchronize: {
			configurationSection: ["emmylua.lint", "emmylua.spell", "emmylua.name", "files.associations"],
			fileEvents: [
				vscode.workspace.createFileSystemWatcher("**/*.lua")
			]
		},
		initializationOptions: {
			workspaceFolders: vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.map(f => f.uri.toString()) : null,
			client: 'vsc',
			editorConfigFiles,
			localeRoot: path.join(saveContext.extensionPath, "locale").toString(),
			dictionaryPath
			// extensionChars: "@$"
		}
	};

	let serverOptions: ServerOptions;
	if (DEBUG_MODE) {
		// The server is a started as a separate app and listens on port 5008
		const connectionInfo = {
			port: 5008,
		};
		serverOptions = () => {
			// Connect to language server via socket
			let socket = net.connect(connectionInfo);
			let result: StreamInfo = {
				writer: socket,
				reader: socket as NodeJS.ReadableStream
			};
			socket.on("close", () => {
				console.log("client connect error!");
			});
			return Promise.resolve(result);
		};
	} else {
		let platform: string = os.platform();

		let command: string = "";
		switch (platform) {
			case "win32":
				command = path.join(
					saveContext.extensionPath,
					'server',
					'bin',
					'CodeFormatServer.exe'
				)
				break;
			case "linux":
				command = path.join(
					saveContext.extensionPath,
					'server',
					'bin',
					'CodeFormatServer'
				)
				fs.chmodSync(command, '777');
				break;
			case "darwin":
				command = path.join(
					saveContext.extensionPath,
					'server',
					'bin',
					'CodeFormatServer'
				)
				fs.chmodSync(command, '777');
				break;
		}
		serverOptions = {
			command: command,
			args: []
		};
	}

	client = new LanguageClient(LANGUAGE_ID, "EmmyLuaCodeStyle plugin for vscode.", serverOptions, clientOptions);
	client.start().then(() => {
		console.log("client ready");
	});
}

function insertEditorConfig() {

	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		return;
	}

	const ins = new vscode.SnippetString();

	let content = fs.readFileSync(path.join(saveContext.extensionPath, "lua.template.editorconfig"))

	ins.appendText(content.toString("utf8"));
	activeEditor.insertSnippet(ins);
}
