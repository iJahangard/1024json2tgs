import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon } from './icons';

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFilesAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  }, [onFilesAdded]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(Array.from(e.target.files));
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const dragClass = isDragging ? 'border-indigo-500 bg-slate-800' : 'border-slate-600 hover:border-slate-500';

  return (
    <div
      onClick={handleClick}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed ${dragClass} rounded-2xl cursor-pointer transition-all duration-300 bg-slate-800/50`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="application/json,.json"
        className="hidden"
        onChange={handleChange}
      />
      <UploadCloudIcon className="w-16 h-16 text-slate-500 mb-4" />
      <p className="text-xl font-semibold text-slate-200">
        Drag & drop your files here
      </p>
      <p className="text-slate-400">or click to browse</p>
    </div>
  );
};
