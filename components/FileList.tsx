import React from 'react';
import type { LottieFile } from '../types';
import { FileCard } from './FileCard';

interface FileListProps {
  files: LottieFile[];
  onRemove: (id: string) => void;
  onConvert: (id: string) => void;
}

export const FileList: React.FC<FileListProps> = ({ files, onRemove, onConvert }) => {
  return (
    <div className="space-y-4">
      {files.map(file => (
        <FileCard
          key={file.id}
          file={file}
          onRemove={() => onRemove(file.id)}
          onConvert={() => onConvert(file.id)}
        />
      ))}
    </div>
  );
};
