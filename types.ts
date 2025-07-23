export type FileStatus = 'Parsing' | 'Ready' | 'Converting' | 'Success' | 'Error';

export interface LottieMetadata {
  width: number;
  height: number;
  duration: number;
  frameRate: number;
}

export interface LottieFile {
  id: string;
  originalFile: File;
  lottieData: any | null;
  status: FileStatus;
  metadata: LottieMetadata | null;
  errorMessage: string | null;
}
