import type React from 'react';

// Declaration for the lottie-player custom element, which is loaded from a CDN.
// This allows TypeScript to recognize the <lottie-player> JSX tag.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src: string;
        background: string;
        speed: string;
        style: React.CSSProperties;
        loop: boolean;
        autoplay: boolean;
      }, HTMLElement>;
    }
  }
}

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
