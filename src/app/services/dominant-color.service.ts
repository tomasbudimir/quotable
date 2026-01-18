import { Injectable } from '@angular/core';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

@Injectable({
  providedIn: 'root'
})
export class DominantColorService {

  getDominantColor(imgSrc: string): Promise<RGB> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgSrc;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return reject('Canvas context not available');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const { data } = ctx.getImageData(canvas.width / 10, canvas.height / 5, 
          canvas.width - canvas.width / 10, canvas.height / 2);

        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }

        resolve({
          r: r / count,
          g: g / count,
          b: b / count
        });
      };

      img.onerror = () => reject('Image failed to load: ' + imgSrc);
    });
  }

  /** Returns black or white depending on contrast */
  getContrastingColor({ r, g, b }: RGB): string {
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    if (luminance < 0.7) {
      return '#FFFFFF';
    } else if (luminance < 0.9) {
      return '	#3F00FF';
    }

    return '#000000';
  }
}
