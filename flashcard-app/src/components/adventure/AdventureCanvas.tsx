import React, { useEffect, useMemo, useRef } from 'react';
import {
  Direction,
  KEEPER_POSITION,
  KEEPER_SPRITE,
  MapInteractable,
  PLAYER_SPRITES,
  TILE_SIZE,
  WORLD_COLS,
  WORLD_ROWS,
  ZOO_ANIMALS,
  ZOO_ENCLOSURES,
  ZOO_INTERACTABLES,
  tileAt,
} from '../../data/adventures/zooQuest';

interface AdventureCanvasProps {
  playerX: number;
  playerY: number;
  direction: Direction;
  learnedAnimals: string[];
  nearby: MapInteractable | null;
  step: number;
}

const PALETTE = {
  grassA: '#82a84c',
  grassB: '#789d44',
  pathA: '#d8c28a',
  pathB: '#cdb477',
  sandA: '#c9a866',
  sandB: '#bc9959',
  iceA: '#c8e6df',
  iceB: '#b3d9d2',
  waterA: '#4995aa',
  waterB: '#3a7f98',
  fence: '#704b2d',
  fenceLight: '#9a7046',
  treeDark: '#254d32',
  tree: '#397344',
  ink: '#243026',
  cream: '#f3e8c5',
};

function hash(x: number, y: number): number {
  return Math.abs((x * 73856093) ^ (y * 19349663));
}

function drawTile(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  const tile = tileAt(x, y);
  const checker = (x + y) % 2 === 0;

  if (tile === 'path') {
    ctx.fillStyle = checker ? PALETTE.pathA : PALETTE.pathB;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = 'rgba(80,57,35,.16)';
    ctx.fillRect(px + 5 + (hash(x, y) % 13), py + 7 + (hash(y, x) % 11), 3, 2);
    return;
  }

  if (tile === 'sand') {
    ctx.fillStyle = checker ? PALETTE.sandA : PALETTE.sandB;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = 'rgba(88,58,29,.2)';
    ctx.fillRect(px + 7, py + 9, 2, 2);
    ctx.fillRect(px + 23, py + 20, 2, 2);
    return;
  }

  if (tile === 'ice') {
    ctx.fillStyle = checker ? PALETTE.iceA : PALETTE.iceB;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = 'rgba(255,255,255,.4)';
    ctx.beginPath();
    ctx.moveTo(px + 4, py + 25);
    ctx.lineTo(px + 15, py + 14);
    ctx.lineTo(px + 25, py + 16);
    ctx.stroke();
    return;
  }

  if (tile === 'water') {
    ctx.fillStyle = checker ? PALETTE.waterA : PALETTE.waterB;
    ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = 'rgba(255,255,255,.24)';
    ctx.fillRect(px + 5, py + 9, 10, 2);
    ctx.fillRect(px + 18, py + 22, 8, 2);
    return;
  }

  ctx.fillStyle = checker ? PALETTE.grassA : PALETTE.grassB;
  ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

  if (tile === 'flower') {
    ctx.fillStyle = '#f1d66b';
    ctx.fillRect(px + 9, py + 8, 3, 3);
    ctx.fillStyle = '#f3efe0';
    ctx.fillRect(px + 20, py + 18, 3, 3);
  } else if (hash(x, y) % 9 === 0) {
    ctx.fillStyle = 'rgba(37,77,50,.36)';
    ctx.fillRect(px + 8, py + 19, 2, 5);
    ctx.fillRect(px + 11, py + 17, 2, 7);
  }
}

function drawFence(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  ctx.fillStyle = PALETTE.fence;
  ctx.fillRect(px, py + 12, TILE_SIZE, 8);
  ctx.fillStyle = PALETTE.fenceLight;
  ctx.fillRect(px, py + 12, TILE_SIZE, 3);
  ctx.fillStyle = PALETTE.fence;
  ctx.fillRect(px + 3, py + 5, 7, 23);
  ctx.fillRect(px + 22, py + 5, 7, 23);
  ctx.fillStyle = PALETTE.fenceLight;
  ctx.fillRect(px + 4, py + 6, 3, 17);
  ctx.fillRect(px + 23, py + 6, 3, 17);
}

function drawTree(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  ctx.fillStyle = '#5e412a';
  ctx.fillRect(px + 13, py + 18, 7, 13);
  ctx.fillStyle = PALETTE.treeDark;
  ctx.fillRect(px + 5, py + 7, 23, 16);
  ctx.fillRect(px + 9, py + 2, 15, 23);
  ctx.fillStyle = PALETTE.tree;
  ctx.fillRect(px + 9, py + 5, 14, 6);
  ctx.fillRect(px + 7, py + 11, 7, 6);
}

function drawSign(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  text: string,
  highlighted: boolean,
): void {
  const px = x * TILE_SIZE;
  const py = y * TILE_SIZE;
  ctx.fillStyle = '#4a321f';
  ctx.fillRect(px + 14, py + 12, 4, 20);
  ctx.fillStyle = highlighted ? '#f4d74f' : PALETTE.cream;
  ctx.fillRect(px - 9, py - 2, 50, 18);
  ctx.strokeStyle = PALETTE.ink;
  ctx.lineWidth = 2;
  ctx.strokeRect(px - 9, py - 2, 50, 18);
  ctx.fillStyle = PALETTE.ink;
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, px + 16, py + 10, 46);
  ctx.textAlign = 'left';
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | undefined,
  x: number,
  y: number,
  width: number,
  height: number,
  mirror = false,
  bob = 0,
): void {
  const centerX = x * TILE_SIZE + TILE_SIZE / 2;
  const baseY = y * TILE_SIZE + TILE_SIZE - 3;
  ctx.fillStyle = 'rgba(25,38,27,.28)';
  ctx.beginPath();
  ctx.ellipse(centerX, baseY, width * 0.28, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  if (!image) return;
  ctx.save();
  ctx.translate(centerX, baseY - height + bob);
  if (mirror) {
    ctx.scale(-1, 1);
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(image, -width / 2, 0, width, height);
  ctx.restore();
}

export const AdventureCanvas: React.FC<AdventureCanvasProps> = ({
  playerX,
  playerY,
  direction,
  learnedAnimals,
  nearby,
  step,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<Record<string, HTMLImageElement>>({});

  const spriteSources = useMemo(
    () => ({
      playerUp: PLAYER_SPRITES.up,
      playerDown: PLAYER_SPRITES.down,
      playerSide: PLAYER_SPRITES.right,
      keeper: KEEPER_SPRITE,
      ...Object.fromEntries(ZOO_ANIMALS.map((animal) => [animal.id, animal.sprite])),
    }),
    [],
  );

  useEffect(() => {
    Object.entries(spriteSources).forEach(([key, src]) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        imagesRef.current[key] = image;
      };
    });
  }, [spriteSources]);

  useEffect(() => {
    let request = 0;

    const render = () => {
      const canvas = canvasRef.current;
      const parent = canvas?.parentElement;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !parent || !ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const viewW = parent.clientWidth;
      const viewH = parent.clientHeight;
      if (canvas.width !== viewW * dpr || canvas.height !== viewH * dpr) {
        canvas.width = viewW * dpr;
        canvas.height = viewH * dpr;
        canvas.style.width = `${viewW}px`;
        canvas.style.height = `${viewH}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      const zoom = viewW < 640 ? 1.35 : 1.75;
      const worldW = WORLD_COLS * TILE_SIZE * zoom;
      const worldH = WORLD_ROWS * TILE_SIZE * zoom;
      const desiredX = viewW / 2 - (playerX * TILE_SIZE + TILE_SIZE / 2) * zoom;
      const desiredY = viewH / 2 - (playerY * TILE_SIZE + TILE_SIZE / 2) * zoom;
      const cameraX = Math.min(0, Math.max(viewW - worldW, desiredX));
      const cameraY = Math.min(0, Math.max(viewH - worldH, desiredY));

      ctx.fillStyle = '#14261a';
      ctx.fillRect(0, 0, viewW, viewH);
      ctx.save();
      ctx.translate(Math.round(cameraX), Math.round(cameraY));
      ctx.scale(zoom, zoom);

      for (let y = 0; y < WORLD_ROWS; y++) {
        for (let x = 0; x < WORLD_COLS; x++) drawTile(ctx, x, y);
      }

      // Entrance arch and path details.
      ctx.fillStyle = '#315b39';
      const entranceY = WORLD_ROWS - 2;
      const entranceCenter = Math.floor(WORLD_COLS / 2);
      ctx.fillRect((entranceCenter - 3) * TILE_SIZE, entranceY * TILE_SIZE, TILE_SIZE, TILE_SIZE * 2);
      ctx.fillRect((entranceCenter + 3) * TILE_SIZE, entranceY * TILE_SIZE, TILE_SIZE, TILE_SIZE * 2);
      ctx.fillStyle = '#f1d66b';
      ctx.fillRect((entranceCenter - 3) * TILE_SIZE, entranceY * TILE_SIZE, TILE_SIZE * 7, 7);
      ctx.fillStyle = PALETTE.ink;
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TIERPARK', (entranceCenter + 0.5) * TILE_SIZE, entranceY * TILE_SIZE + 6);
      ctx.textAlign = 'left';

      for (let y = 0; y < WORLD_ROWS; y++) {
        for (let x = 0; x < WORLD_COLS; x++) {
          const tile = tileAt(x, y);
          if (tile === 'fence') drawFence(ctx, x, y);
          if (tile === 'tree') drawTree(ctx, x, y);
        }
      }

      ZOO_ENCLOSURES.forEach((enclosure) => {
        const signX = enclosure.x + Math.floor(enclosure.width / 2);
        const signY = enclosure.y < 10 ? enclosure.y + enclosure.height - 1 : enclosure.y;
        const animal = ZOO_ANIMALS.find((candidate) => candidate.enclosure === enclosure.id);
        drawSign(ctx, signX, signY, enclosure.sign, nearby?.animalId === animal?.id);
      });

      const mapSign = ZOO_INTERACTABLES.find((item) => item.id === 'map-sign');
      const binoculars = ZOO_INTERACTABLES.find((item) => item.id === 'binoculars');
      if (mapSign) {
        drawSign(ctx, mapSign.position.x, mapSign.position.y, 'ZOOPLAN', nearby?.id === mapSign.id);
      }
      if (binoculars) {
        drawSign(
          ctx,
          binoculars.position.x,
          binoculars.position.y,
          'FERNGLAS',
          nearby?.id === binoculars.id,
        );
      }

      const time = performance.now();
      const animalBob = Math.sin(time / 520) * 1.5;
      ZOO_ANIMALS.forEach((animal, index) => {
        const isNearby = nearby?.animalId === animal.id;
        const learned = learnedAnimals.includes(animal.id);
        const height = animal.id === 'giraffe' ? 70 : animal.id === 'elephant' ? 54 : 48;
        const width = animal.id === 'giraffe' ? 48 : animal.id === 'elephant' ? 64 : 54;
        drawSprite(
          ctx,
          imagesRef.current[animal.id],
          animal.position.x,
          animal.position.y,
          width,
          height,
          index % 2 === 0,
          animalBob + index % 2,
        );
        if (isNearby) {
          ctx.fillStyle = '#f4d74f';
          ctx.strokeStyle = PALETTE.ink;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(
            animal.position.x * TILE_SIZE + 16,
            animal.position.y * TILE_SIZE - height + 7,
            9,
            0,
            Math.PI * 2,
          );
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = PALETTE.ink;
          ctx.font = 'bold 12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(learned ? '✓' : '!', animal.position.x * TILE_SIZE + 16, animal.position.y * TILE_SIZE - height + 11);
          ctx.textAlign = 'left';
        }
      });

      drawSprite(
        ctx,
        imagesRef.current.keeper,
        KEEPER_POSITION.x,
        KEEPER_POSITION.y,
        38,
        51,
        false,
      );
      if (nearby?.kind === 'keeper') {
        ctx.fillStyle = '#f4d74f';
        ctx.fillRect(KEEPER_POSITION.x * TILE_SIZE + 11, KEEPER_POSITION.y * TILE_SIZE - 30, 11, 15);
        ctx.fillStyle = PALETTE.ink;
        ctx.font = 'bold 12px monospace';
        ctx.fillText('!', KEEPER_POSITION.x * TILE_SIZE + 13, KEEPER_POSITION.y * TILE_SIZE - 18);
      }

      const walkingBob = step % 2 === 0 ? 0 : -2;
      const playerImage =
        direction === 'up'
          ? imagesRef.current.playerUp
          : direction === 'down'
            ? imagesRef.current.playerDown
            : imagesRef.current.playerSide;
      drawSprite(
        ctx,
        playerImage,
        playerX,
        playerY,
        direction === 'left' || direction === 'right' ? 32 : 36,
        48,
        direction === 'left',
        walkingBob,
      );

      ctx.restore();
      request = requestAnimationFrame(render);
    };

    request = requestAnimationFrame(render);
    return () => cancelAnimationFrame(request);
  }, [playerX, playerY, direction, learnedAnimals, nearby, step]);

  return (
    <canvas
      ref={canvasRef}
      data-player={`${playerX},${playerY}`}
      data-nearby={nearby?.id ?? ''}
      className="block h-full w-full image-pixelated"
      aria-label="Interactive top-down zoo world"
    />
  );
};
