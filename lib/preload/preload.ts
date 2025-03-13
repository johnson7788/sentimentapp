import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs/promises';
import path from 'path';

contextBridge.exposeInMainWorld('fileApi', {
  readFile: (filePath: string) => fs.readFile(filePath, 'utf-8'),
  readFolder: async (folderPath: string) => {
    const files = await fs.readdir(folderPath);
    const textFiles = files.filter(file => file.endsWith('.txt'));
    const contents = await Promise.all(
      textFiles.map(file => fs.readFile(path.join(folderPath, file), 'utf-8'))
    );
    return contents;
  },
});