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
	DEBUG_MODE = process.env['EMMY_DEV'] === "true";
	saveContext = context;

	saveContext.subscriptions.push(vscode.commands.registerCommand("emmyluacodestyle.insertEditorConfig", insertEditorConfig));

	editorConfigWatcher = new ConfigWatcher('**/.editorconfig');

	editorConfigWatcher.onConfigUpdate(onEditorConfigUpdate);

	saveContext.subscriptions.push(editorConfigWatcher);


	moduleConfigWatcher = new ConfigWatcher('**/lua.module.json');

	moduleConfigWatcher.onConfigUpdate(onModuleConfigUpdate);

	saveContext.subscriptions.push(moduleConfigWatcher);

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

function onModuleConfigUpdate(e: IConfigUpdate) {
	if (client) {
		client.sendRequest('config/moduleconfig/update', e);
	}
}

async function startServer() {
	const editorConfigFiles = await editorConfigWatcher.watch();
	const moduleConfigFiles = await moduleConfigWatcher.watch();

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
			editorConfigFiles,
			moduleConfigFiles,
			localeRoot: path.join(saveContext.extensionPath, "locale").toString()
		},
		middleware: {
			executeCommand: async (command, args, next) => {
				if (command === "emmylua.reformat.me") {
					return next(command, args);
				}
				else if (command === "emmylua.import.me") {
					const modules: any[] = args.slice(2);
					const selectList: LuaModule[] = modules.map(e => {
						return {
							moduleName: e.moduleName,
							path: e.path,
							name: e.name,
							label: `import from ${e.moduleName}`,
							description: `${e.path}`
						}
					});
					if (selectList.length === 1) {
						const selected = selectList[0];
						return next(command, [args[0], args[1], selected.moduleName, selected.name]);
					}
					else{
						const selected = await vscode.window.showQuickPick(selectList, {
							matchOnDescription: true,
							matchOnDetail: true,
							placeHolder: "select module import"
						});
						if (selected) {
							return next(command, [args[0], args[1], selected.moduleName, selected.name]);
						}
					}
				}
			}
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
