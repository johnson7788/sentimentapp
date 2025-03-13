import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs/promises';
import path from 'path';


contextBridge.exposeInMainWorld('fileApi', {
  openFileDialog: async () => ipcRenderer.invoke('open-file-dialog'),
  openFolderDialog: async () => ipcRenderer.invoke('open-folder-dialog'),
  readFile: (filePath: string) => fs.readFile(filePath, 'utf-8'),
  readFolder: async (folderPath: string) => {
    const files = await fs.readdir(folderPath);
    return Promise.all(
      files.filter(f => f.endsWith('.txt'))
        .map(f => fs.readFile(path.join(folderPath, f), 'utf-8')
    );
  }
});