// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as path from "path";
import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, StreamInfo } from "vscode-languageclient/node";
import * as net from "net";
import * as os from "os";
import * as fs from "fs";
import { EditorConfigWatcher, IEditorConfigUpdate } from "./editorConfigWatcher";

const LANGUAGE_ID = 'lua';
let DEBUG_MODE = true;

let client: LanguageClient;
let saveContext: vscode.ExtensionContext;
let configWatcher: EditorConfigWatcher;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	DEBUG_MODE = process.env['EMMY_DEV'] === "true";
	saveContext = context;

	saveContext.subscriptions.push(vscode.commands.registerCommand("emmyluacodestyle.insertEditorConfig", insertEditorConfig));

	configWatcher = new EditorConfigWatcher();

	configWatcher.onConfigUpdate(onConfigUpdate);

	saveContext.subscriptions.push(configWatcher);

	startServer();
}

// this method is called when your extension is deactivated
export function deactivate() {
}

function onConfigUpdate(e: IEditorConfigUpdate) {
	if (client) {
		client.sendRequest('updateEditorConfig', e);
	}
}

async function startServer() {
	const configFiles = await configWatcher.watch();
	const clientOptions: LanguageClientOptions = {
		documentSelector: [{ scheme: 'file', language: LANGUAGE_ID }],
		synchronize: {
			configurationSection: ["emmylua.codestyle", "files.associations"],
			fileEvents: [
				vscode.workspace.createFileSystemWatcher("**/*.lua")
			]
		},
		initializationOptions: {
			workspaceFolders: vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.map(f => f.uri.toString()) : null,
			client: 'vsc',
			configFiles: configFiles,
			localeRoot: path.join(saveContext.extensionPath, "locale").toString()
		}
	};

	let serverOptions: ServerOptions;
	if (DEBUG_MODE) {
		// The server is a started as a separate app and listens on port 5008
		const connectionInfo = {
			port: 5008
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
					'Windows',
					'bin',
					'CodeFormatServer.exe'
				)
				break;
			case "linux":
				command = path.join(
					saveContext.extensionPath,
					'server',
					'Linux',
					'bin',
					'CodeFormatServer.exe'
				)
				fs.chmodSync(command, '777');
				break;
			case "darwin":
				command = path.join(
					saveContext.extensionPath,
					'server',
					'macOS',
					'bin',
					'CodeFormatServer.exe'
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
	saveContext.subscriptions.push(client.start());
	await client.onReady();
	console.log("client ready");
}

function insertEditorConfig() {

	const activeEditor = vscode.window.activeTextEditor;
	if (!activeEditor) {
		return;
	}
	const document = activeEditor.document;

	const ins = new vscode.SnippetString();

	let content = fs.readFileSync(path.join(saveContext.extensionPath, "lua.template.editorconfig"))

	ins.appendText(content.toString("utf8"));
	activeEditor.insertSnippet(ins);
}
