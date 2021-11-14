import * as vscode from 'vscode';

export enum UpdateType {
    Created,
    Changed,
    Deleted
}

const pattern = '**/.editorconfig';

export interface IEditorConfigSource {
    uri: string;
    path: string;
    workspace: string;
}

export interface IEditorConfigUpdate {
    type: UpdateType;
    source: IEditorConfigSource;
}

export class EditorConfigWatcher implements vscode.Disposable {
    private watcher?: vscode.FileSystemWatcher;
    private emitter = new vscode.EventEmitter<IEditorConfigUpdate>();
    private configFiles: IEditorConfigSource[] = [];

    get onConfigUpdate(): vscode.Event<IEditorConfigUpdate> {
        return this.emitter.event;
    }

    async watch() {
        const files = await vscode.workspace.findFiles(pattern);
        const configFiles: IEditorConfigSource[] = [];
        for (let i = 0; i < files.length; i++) {
            const fileUri = files[i];
            const ws = await vscode.workspace.getWorkspaceFolder(fileUri);
            if (ws) {
                configFiles.push({
                    workspace: ws.uri.toString(),
                    uri: fileUri.toString(),
                    path: fileUri.fsPath
                });
            }
        }

        this.watcher = vscode.workspace.createFileSystemWatcher(pattern);
        this.watcher.onDidCreate(uri => this.updateConfig(UpdateType.Created, uri));
        this.watcher.onDidChange(uri => this.updateConfig(UpdateType.Changed, uri));
        this.watcher.onDidDelete(uri => this.updateConfig(UpdateType.Deleted, uri));

        this.configFiles = configFiles;
        return configFiles;
    }

    private findConfig(uri: vscode.Uri): IEditorConfigSource | undefined {
        return this.configFiles.find(it => it.uri === uri.toString());
    }

    private async updateConfig(type: UpdateType, uri: vscode.Uri) {
        let config = this.findConfig(uri);
        if (config) {
            if (type === UpdateType.Deleted) {
                const index = this.configFiles.indexOf(config);
                this.configFiles.splice(index, 1);
            }
        }
        else {
            const ws = await vscode.workspace.getWorkspaceFolder(uri);
            if (!ws) {
                return;
            }
            config = {
                workspace: ws.uri.toString(),
                uri: uri.toString(),
                path: uri.fsPath
            };
            this.configFiles.push(config);
            type = UpdateType.Created;
        }
        this.emitter.fire({ type: type, source: config });
    }

    dispose() {
        if (this.watcher) {
            this.watcher.dispose();
            this.watcher = undefined;
        }
    }
}