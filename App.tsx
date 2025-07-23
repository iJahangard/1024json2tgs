import React from 'react';
import { useLottieConverter } from './hooks/useLottieConverter';
import { FileUploader } from './components/FileUploader';
import { FileList } from './components/FileList';
import { DownloadIcon, TrashIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const {
    files,
    addFiles,
    removeFile,
    clearAll,
    convertFile,
    convertAll,
  } = useLottieConverter();

  const canConvertAll = files.some(f => f.status === 'Ready' || (f.status === 'Error' && f.lottieData));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center gap-3">
            <SparklesIcon className="w-8 h-8 md:w-10 md:h-10 text-sky-400" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-sky-400 to-indigo-500 text-transparent bg-clip-text">
              Lottie to TGS Converter
            </h1>
          </div>
          <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
            Drag and drop your Lottie .json files below to convert them into 512x512px animated Telegram stickers.
          </p>
        </header>

        <FileUploader onFilesAdded={addFiles} />

        {files.length > 0 && (
          <div className="mt-8 md:mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
              <h2 className="text-2xl font-semibold text-slate-200">Conversion Queue</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={convertAll}
                  disabled={!canConvertAll}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Convert & Download All
                </button>
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-200 font-semibold rounded-lg hover:bg-slate-600 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                  Clear All
                </button>
              </div>
            </div>
            <FileList files={files} onRemove={removeFile} onConvert={convertFile} />
          </div>
        )}
      </main>
      <footer className="text-center py-6 text-slate-500">
        <p>Built with React & Tailwind CSS</p>
      </footer>
    </div>
  );
};

export default App;
