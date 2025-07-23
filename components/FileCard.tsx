import React, { memo } from 'react';
import type { LottieFile } from '../types';
import { DownloadIcon, TrashIcon, AlertTriangleIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon, LoaderIcon } from './icons';

interface FileCardProps {
  file: LottieFile;
  onRemove: () => void;
  onConvert: () => void;
}

const StatusBadge: React.FC<{ status: LottieFile['status'] }> = ({ status }) => {
  const statusStyles = {
    Parsing: 'bg-yellow-500/20 text-yellow-400',
    Ready: 'bg-sky-500/20 text-sky-400',
    Converting: 'bg-indigo-500/20 text-indigo-400 animate-pulse',
    Success: 'bg-green-500/20 text-green-400',
    Error: 'bg-red-500/20 text-red-400',
  };
  const statusIcons = {
    Parsing: <LoaderIcon className="w-4 h-4 animate-spin" />,
    Ready: <CheckCircleIcon className="w-4 h-4" />,
    Converting: <LoaderIcon className="w-4 h-4 animate-spin" />,
    Success: <CheckCircleIcon className="w-4 h-4" />,
    Error: <XCircleIcon className="w-4 h-4" />,
  };
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {statusIcons[status]}
      {status}
    </div>
  );
};


const ActionButton: React.FC<{ file: LottieFile; onConvert: () => void }> = ({ file, onConvert }) => {
    switch (file.status) {
        case 'Ready':
        case 'Success':
            return (
                <button
                    onClick={onConvert}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-sky-700 transition-colors"
                >
                    <DownloadIcon className="w-4 h-4" />
                    Download
                </button>
            );
        case 'Error':
             return (
                 <button
                    onClick={onConvert}
                    disabled={!file.lottieData}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-600 text-white font-semibold text-sm rounded-md shadow-sm hover:bg-amber-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                >
                    <RefreshCwIcon className="w-4 h-4" />
                    Retry
                </button>
             );
        case 'Converting':
        case 'Parsing':
            return (
                 <button
                    disabled
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-600 text-slate-400 font-semibold text-sm rounded-md cursor-wait"
                >
                    <LoaderIcon className="w-4 h-4 animate-spin" />
                    Processing...
                </button>
            );
        default:
            return null;
    }
};

export const FileCard: React.FC<FileCardProps> = memo(({ file, onRemove, onConvert }) => {
  const { originalFile, status, metadata, errorMessage } = file;
  const lottieJsonString = file.lottieData ? JSON.stringify(file.lottieData) : '';
  const isTooLong = metadata && metadata.duration > 3;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 transition-all hover:border-slate-600 shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-shrink-0 w-full md:w-24 h-24 bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center">
          {status === 'Ready' || status === 'Success' || (status === 'Error' && lottieJsonString) ? (
            <lottie-player
              src={lottieJsonString}
              background="transparent"
              speed="1"
              style={{ width: '96px', height: '96px' }}
              loop
              autoplay
            ></lottie-player>
          ) : (
            <div className="text-slate-500 text-sm">
              {status === 'Parsing' ? 'Loading...' : 'Preview N/A'}
            </div>
          )}
        </div>

        <div className="flex-grow">
          <h3 className="font-bold text-slate-100 truncate" title={originalFile.name}>{originalFile.name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400 mt-1">
            {metadata && (
              <>
                <span>Size: {metadata.width}x{metadata.height}px</span>
                <span>Duration: {metadata.duration.toFixed(2)}s</span>
                <span>Framerate: {metadata.frameRate}fps</span>
              </>
            )}
          </div>
          <div className="mt-3">
             <StatusBadge status={status} />
          </div>
        </div>

        <div className="flex-shrink-0 flex md:flex-col items-center justify-between md:justify-start gap-2">
            <ActionButton file={file} onConvert={onConvert} />
          <button onClick={onRemove} className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-700 rounded-full transition-colors">
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {isTooLong && (
        <div className="mt-3 p-3 bg-yellow-900/50 border border-yellow-700/50 rounded-lg flex items-start gap-3">
          <AlertTriangleIcon className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-yellow-400">Duration Warning</p>
            <p className="text-sm text-yellow-500">
              Animation is longer than 3 seconds and will be automatically trimmed to 3 seconds during conversion.
            </p>
          </div>
        </div>
      )}

      {status === 'Error' && errorMessage && (
        <div className="mt-3 p-3 bg-red-900/50 border border-red-700/50 rounded-lg flex items-start gap-3">
          <XCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-400">Conversion Error</p>
            <p className="text-sm text-red-500">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
});