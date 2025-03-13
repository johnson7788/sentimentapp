import { ipcRenderer } from "electron";
import { useState } from "react";

declare global {
  interface Window {
    fileApi: {
      readFile: (filePath: string) => Promise<string>;
      readFolder: (folderPath: string) => Promise<string[]>;
    };
  }
}

function App() {
  const [textContent, setTextContent] = useState<string[]>([]);

  const handleFileSelect = async () => {
    const content = await window.fileApi.readFile('path/to/file.txt');
    setTextContent([content]);
  };

  const handleFolderSelect = async () => {
    const contents = await window.fileApi.readFolder('path/to/folder');
    setTextContent(contents);
  };

  const analyzeText = async () => {
    const results = await ipcRenderer.invoke('analyze-sentiment', textContent[0]);
    console.log(results); 
  };

  return (
    <div>
      <button onClick={handleFileSelect}>选择文件</button>
      <button onClick={handleFolderSelect}>选择文件夹</button>
    </div>
  );
}