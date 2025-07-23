import type { LottieMetadata } from '../types';

declare const pako: any;

export const parseLottieFile = (file: File): Promise<{ lottieData: any; metadata: LottieMetadata }> => {
  return new Promise((resolve, reject) => {
    if (file.type !== 'application/json') {
      reject(new Error('File is not a JSON.'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const json = JSON.parse(text);

        if (!json.w || !json.h || !json.fr || json.op === undefined || json.ip === undefined) {
          reject(new Error('Invalid Lottie file format. Missing required properties.'));
          return;
        }

        const metadata: LottieMetadata = {
          width: json.w,
          height: json.h,
          frameRate: Math.round(json.fr),
          duration: (json.op - json.ip) / json.fr,
        };

        resolve({ lottieData: json, metadata });
      } catch (e) {
        reject(new Error('Failed to parse JSON file.'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
    reader.readAsText(file);
  });
};

export const convertToTGS = (lottieData: any): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        try {
            // Deep clone to avoid mutating the original data used for previews
            const newLottieData = JSON.parse(JSON.stringify(lottieData));

            const originalW = newLottieData.w;
            const originalH = newLottieData.h;
            const { ip, fr } = newLottieData;

            // 1. Cap duration to 3 seconds, as required by Telegram
            const maxDurationInFrames = 3 * fr;
            const currentDurationInFrames = newLottieData.op - ip;
            if (currentDurationInFrames > maxDurationInFrames) {
                newLottieData.op = ip + maxDurationInFrames;
            }

            // 2. Scale animation to fit 512x512 via a pre-comp wrapper
            const scaleFactor = 512 / Math.max(originalW, originalH);
            
            const precompAsset = {
                id: 'tgs_wrapper_comp',
                layers: newLottieData.layers, // Use original layers
            };

            if (!newLottieData.assets) {
                newLottieData.assets = [];
            }
            newLottieData.assets.push(precompAsset);

            const wrapperLayer = {
                ddd: 0,
                ind: 1,
                ty: 0, // Pre-composition layer type
                nm: 'TGS Wrapper',
                refId: precompAsset.id,
                sr: 1,
                ks: {
                    o: { a: 0, k: 100 }, // Opacity: 100%
                    r: { a: 0, k: 0 },   // Rotation: 0
                    p: { a: 0, k: [256, 256] }, // Position: center of 512x512
                    a: { a: 0, k: [originalW / 2, originalH / 2] }, // Anchor: center of original
                    s: { a: 0, k: [scaleFactor * 100, scaleFactor * 100] }, // Scale
                },
                ao: 0,
                w: originalW,
                h: originalH,
                ip: newLottieData.ip,
                op: newLottieData.op,
                st: newLottieData.ip,
                bm: 0,
            };

            newLottieData.layers = [wrapperLayer];
            
            // Set final canvas dimensions
            newLottieData.w = 512;
            newLottieData.h = 512;
            
            // Telegram stickers do not support expressions or markers
            if (newLottieData.expressions) {
                delete newLottieData.expressions;
            }
            if (newLottieData.markers) {
              delete newLottieData.markers;
            }
            
            const jsonString = JSON.stringify(newLottieData);
            const gzippedData = pako.gzip(jsonString);

            const blob = new Blob([gzippedData], { type: 'application/gzip' });
            resolve(blob);
        } catch (error) {
            reject(new Error('Failed during TGS conversion process.'));
        }
    });
};
