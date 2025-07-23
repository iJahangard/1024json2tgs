import { useState, useCallback } from 'react';
import type { LottieFile } from '../types';
import { parseLottieFile, convertToTGS } from '../services/conversionService';

export const useLottieConverter = () => {
  const [files, setFiles] = useState<LottieFile[]>([]);

  const updateFileStatus = useCallback((id: string, status: Partial<LottieFile>) => {
    setFiles(prevFiles =>
      prevFiles.map(f => (f.id === id ? { ...f, ...status } : f))
    );
  }, []);

  const addFiles = useCallback(async (newFiles: File[]) => {
    for (const file of newFiles) {
      const id = `${file.name}-${file.lastModified}-${Math.random()}`;
      const preliminaryFile: LottieFile = {
        id,
        originalFile: file,
        lottieData: null,
        metadata: null,
        status: 'Parsing',
        errorMessage: null,
      };

      setFiles(prev => [...prev, preliminaryFile]);

      try {
        const { lottieData, metadata } = await parseLottieFile(file);
        updateFileStatus(id, { status: 'Ready', lottieData, metadata });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error during parsing.';
        updateFileStatus(id, { status: 'Error', errorMessage: message });
      }
    }
  }, [updateFileStatus]);

  const removeFile = useCallback((id: string) => {
    setFiles(prevFiles => prevFiles.filter(f => f.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
  }, []);

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const convertFile = useCallback(async (id: string) => {
    const fileToConvert = files.find(f => f.id === id);
    if (!fileToConvert || !fileToConvert.lottieData) {
      updateFileStatus(id, { status: 'Error', errorMessage: 'File data not available for conversion.' });
      return;
    }

    updateFileStatus(id, { status: 'Converting', errorMessage: null });

    try {
      const tgsBlob = await convertToTGS(fileToConvert.lottieData);
      const originalName = fileToConvert.originalFile.name;
      const tgsFilename = `${originalName.substring(0, originalName.lastIndexOf('.')) || originalName}.tgs`;
      triggerDownload(tgsBlob, tgsFilename);
      updateFileStatus(id, { status: 'Success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown conversion error.';
      updateFileStatus(id, { status: 'Error', errorMessage: message });
    }
  }, [files, updateFileStatus]);
  
  const convertAll = useCallback(async () => {
    const filesToConvert = files.filter(f => f.status === 'Ready' || (f.status === 'Error' && f.lottieData));
    for (const file of filesToConvert) {
      await convertFile(file.id);
    }
  }, [files, convertFile]);


  return { files, addFiles, removeFile, clearAll, convertFile, convertAll };
};
