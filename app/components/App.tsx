// App.tsx
import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import WordCloud from 'react-wordcloud';
import { Tab } from '@headlessui/react';

function App() {
  const [textContent, setTextContent] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 更新后的文件处理
  const handleFileSelect = async () => {
    const path = await window.fileApi.openFileDialog();
    if (path) {
      const content = await window.fileApi.readFile(path);
      setTextContent([content]);
    }
  };

  const handleFolderSelect = async () => {
    const path = await window.fileApi.openFolderDialog();
    if (path) {
      const contents = await window.fileApi.readFolder(path);
      setTextContent(contents);
    }
  };

  const analyze = async () => {
    setLoading(true);
    try {
      const analysis = await Promise.all(
        textContent.map(text => 
          ipcRenderer.invoke('analyze-sentiment', text)
        )
      );
      setResults(analysis);
    } finally {
      setLoading(false);
    }
  };

  // 可视化数据准备
  const sentimentData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [{
      label: '情感分布',
      data: [
        results.filter(r => r.overall_sentiment === 'positive').length,
        results.filter(r => r.overall_sentiment === 'negative').length,
        results.filter(r => r.overall_sentiment === 'neutral').length
      ],
      backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E']
    }]
  };

  const wordData = results.flatMap(r => 
    r.emotions.flatMap(e => 
      e.keywords.map(k => ({ text: k.word, value: k.count }))
  );

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={handleFileSelect}
        >
          选择文件
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={handleFolderSelect}
        >
          选择文件夹
        </button>
        <button
          className="px-4 py-2 bg-purple-500 text-white rounded disabled:opacity-50"
          onClick={analyze}
          disabled={!textContent.length || loading}
        >
          {loading ? '分析中...' : '开始分析'}
        </button>
      </div>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {['情感分布', '关键词云', '知识图谱'].map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700
                 ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2
                 ${selected ? 'bg-white shadow' : 'text-blue-100 hover:bg-white/[0.12]'}`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel>
            <div className="h-96">
              <Bar data={sentimentData} options={{ responsive: true }} />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="h-96">
              <WordCloud words={wordData} />
            </div>
          </Tab.Panel>
          <Tab.Panel>
            {/* 知识图谱实现 */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}