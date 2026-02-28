import { CanvasTexture, type Texture } from 'three';
import type { Continent } from './types';

/**
 * TODO подумать над альтернативным способом рисования текстуры
 */
export const createGlobeTexture = ({
  continents,
  waterColor,
  continentColor,
  width,
  height,
}: {
  continents: Continent['perimeterNodeCoordinates'][],
  waterColor: string,
  continentColor: string,
  width: number,
  height: number
}): Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Заливаем фон базовым цветом
  ctx.fillStyle = waterColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Рисуем континенты
  continents.forEach(continent => {
    ctx.fillStyle = continentColor;
    ctx.beginPath();
    continent.forEach(([lon, lat], index) => {
      const x = ((lon + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.fill();
  });

  const texture = new CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
};
