export type Direction = 'up' | 'down' | 'left' | 'right';
export type TileKind = 'grass' | 'path' | 'sand' | 'ice' | 'water' | 'fence' | 'tree' | 'flower';

export interface Point {
  x: number;
  y: number;
}

export interface BilingualLine {
  de: string;
  en: string;
}

export interface ZooAnimal {
  id: string;
  german: string;
  english: string;
  article: 'der' | 'die' | 'das';
  plural: string;
  factDe: string;
  factEn: string;
  sound: string;
  position: Point;
  enclosure:
    | 'savanna'
    | 'elephant'
    | 'giraffe'
    | 'tiger'
    | 'jungle'
    | 'ice'
    | 'plains'
    | 'bear'
    | 'gorilla'
    | 'crocodile'
    | 'flamingo'
    | 'kangaroo'
    | 'rhino'
    | 'hippo'
    | 'seal'
    | 'owl'
    | 'polarBear'
    | 'panda'
    | 'camel'
    | 'wolf'
    | 'fox'
    | 'parrot'
    | 'snake'
    | 'tortoise';
  sprite: string;
  encounterImage: string;
}

export type InteractableKind = 'animal' | 'keeper' | 'sign' | 'binoculars';

export interface MapInteractable {
  id: string;
  kind: InteractableKind;
  position: Point;
  range: number;
  animalId?: string;
  label: string;
  lines?: BilingualLine[];
}

export interface Enclosure {
  id: ZooAnimal['enclosure'];
  x: number;
  y: number;
  width: number;
  height: number;
  ground: TileKind;
  sign: string;
}

export const TILE_SIZE = 32;
export const WORLD_COLS = 42;
export const WORLD_ROWS = 50;
export const PLAYER_START: Point = { x: 22, y: 48 };

export const ZOO_ENCLOSURES: Enclosure[] = [
  { id: 'savanna', x: 1, y: 1, width: 8, height: 6, ground: 'sand', sign: 'LÖWEN' },
  { id: 'elephant', x: 11, y: 1, width: 8, height: 6, ground: 'sand', sign: 'ELEFANTEN' },
  { id: 'giraffe', x: 22, y: 1, width: 8, height: 6, ground: 'grass', sign: 'GIRAFFEN' },
  { id: 'tiger', x: 33, y: 1, width: 8, height: 6, ground: 'grass', sign: 'TIGER' },
  { id: 'jungle', x: 1, y: 9, width: 8, height: 6, ground: 'grass', sign: 'AFFEN' },
  { id: 'ice', x: 11, y: 9, width: 8, height: 6, ground: 'ice', sign: 'PINGUINE' },
  { id: 'plains', x: 22, y: 9, width: 8, height: 6, ground: 'sand', sign: 'ZEBRAS' },
  { id: 'bear', x: 33, y: 9, width: 8, height: 6, ground: 'grass', sign: 'BÄREN' },
  { id: 'gorilla', x: 1, y: 17, width: 8, height: 6, ground: 'grass', sign: 'GORILLAS' },
  { id: 'crocodile', x: 11, y: 17, width: 8, height: 6, ground: 'water', sign: 'KROKODILE' },
  { id: 'flamingo', x: 22, y: 17, width: 8, height: 6, ground: 'water', sign: 'FLAMINGOS' },
  { id: 'kangaroo', x: 33, y: 17, width: 8, height: 6, ground: 'sand', sign: 'KÄNGURUS' },
  { id: 'rhino', x: 1, y: 25, width: 8, height: 6, ground: 'sand', sign: 'NASHÖRNER' },
  { id: 'hippo', x: 11, y: 25, width: 8, height: 6, ground: 'water', sign: 'NILPFERDE' },
  { id: 'seal', x: 22, y: 25, width: 8, height: 6, ground: 'ice', sign: 'ROBBEN' },
  { id: 'owl', x: 33, y: 25, width: 8, height: 6, ground: 'grass', sign: 'EULEN' },
  { id: 'polarBear', x: 1, y: 33, width: 8, height: 6, ground: 'ice', sign: 'EISBÄREN' },
  { id: 'panda', x: 11, y: 33, width: 8, height: 6, ground: 'grass', sign: 'PANDAS' },
  { id: 'camel', x: 22, y: 33, width: 8, height: 6, ground: 'sand', sign: 'KAMELE' },
  { id: 'wolf', x: 33, y: 33, width: 8, height: 6, ground: 'grass', sign: 'WÖLFE' },
  { id: 'fox', x: 1, y: 41, width: 8, height: 6, ground: 'grass', sign: 'FÜCHSE' },
  { id: 'parrot', x: 11, y: 41, width: 8, height: 6, ground: 'grass', sign: 'PAPAGEIEN' },
  { id: 'snake', x: 22, y: 41, width: 8, height: 6, ground: 'sand', sign: 'SCHLANGEN' },
  { id: 'tortoise', x: 33, y: 41, width: 8, height: 6, ground: 'sand', sign: 'SCHILDKRÖTEN' },
];

export const ZOO_ANIMALS: ZooAnimal[] = [
  {
    id: 'lion',
    german: 'der Löwe',
    english: 'the lion',
    article: 'der',
    plural: 'die Löwen',
    factDe: 'Der Löwe hat eine große Mähne.',
    factEn: 'The lion has a large mane.',
    sound: 'Roaaar!',
    position: { x: 5, y: 5 },
    enclosure: 'savanna',
    sprite: '/adventure/zoo/sprites/lion.png',
    encounterImage: '/adventure/zoo/encounter-lion.png',
  },
  {
    id: 'elephant',
    german: 'der Elefant',
    english: 'the elephant',
    article: 'der',
    plural: 'die Elefanten',
    factDe: 'Der Elefant hat einen langen Rüssel.',
    factEn: 'The elephant has a long trunk.',
    sound: 'Tröööt!',
    position: { x: 15, y: 5 },
    enclosure: 'elephant',
    sprite: '/adventure/zoo/sprites/elephant.png',
    encounterImage: '/adventure/zoo/encounter-elephant.png',
  },
  {
    id: 'giraffe',
    german: 'die Giraffe',
    english: 'the giraffe',
    article: 'die',
    plural: 'die Giraffen',
    factDe: 'Die Giraffe hat einen sehr langen Hals.',
    factEn: 'The giraffe has a very long neck.',
    sound: 'Mampf, mampf.',
    position: { x: 26, y: 5 },
    enclosure: 'giraffe',
    sprite: '/adventure/zoo/sprites/giraffe.png',
    encounterImage: '/adventure/zoo/encounter-giraffe.png',
  },
  {
    id: 'monkey',
    german: 'der Affe',
    english: 'the monkey',
    article: 'der',
    plural: 'die Affen',
    factDe: 'Der Affe klettert gern auf Bäume.',
    factEn: 'The monkey likes climbing trees.',
    sound: 'Uh-uh-ah-ah!',
    position: { x: 5, y: 13 },
    enclosure: 'jungle',
    sprite: '/adventure/zoo/sprites/monkey.png',
    encounterImage: '/adventure/zoo/encounter-monkey.png',
  },
  {
    id: 'penguin',
    german: 'der Pinguin',
    english: 'the penguin',
    article: 'der',
    plural: 'die Pinguine',
    factDe: 'Der Pinguin kann sehr gut schwimmen.',
    factEn: 'The penguin can swim very well.',
    sound: 'Honk!',
    position: { x: 15, y: 13 },
    enclosure: 'ice',
    sprite: '/adventure/zoo/sprites/penguin.png',
    encounterImage: '/adventure/zoo/encounter-penguin.png',
  },
  {
    id: 'zebra',
    german: 'das Zebra',
    english: 'the zebra',
    article: 'das',
    plural: 'die Zebras',
    factDe: 'Das Zebra hat schwarze und weiße Streifen.',
    factEn: 'The zebra has black and white stripes.',
    sound: 'Wieher!',
    position: { x: 26, y: 13 },
    enclosure: 'plains',
    sprite: '/adventure/zoo/sprites/zebra.png',
    encounterImage: '/adventure/zoo/encounter-zebra.png',
  },
  {
    id: 'tiger',
    german: 'der Tiger',
    english: 'the tiger',
    article: 'der',
    plural: 'die Tiger',
    factDe: 'Der Tiger hat orangefarbene und schwarze Streifen.',
    factEn: 'The tiger has orange and black stripes.',
    sound: 'Grrrr!',
    position: { x: 37, y: 5 },
    enclosure: 'tiger',
    sprite: '/adventure/zoo/sprites/tiger.png',
    encounterImage: '/adventure/zoo/sprites/tiger.png',
  },
  {
    id: 'bear',
    german: 'der Bär',
    english: 'the bear',
    article: 'der',
    plural: 'die Bären',
    factDe: 'Der Bär ist groß und stark.',
    factEn: 'The bear is big and strong.',
    sound: 'Brumm!',
    position: { x: 37, y: 13 },
    enclosure: 'bear',
    sprite: '/adventure/zoo/sprites/bear.png',
    encounterImage: '/adventure/zoo/sprites/bear.png',
  },
  {
    id: 'gorilla',
    german: 'der Gorilla',
    english: 'the gorilla',
    article: 'der',
    plural: 'die Gorillas',
    factDe: 'Der Gorilla lebt in einer großen Gruppe.',
    factEn: 'The gorilla lives in a large group.',
    sound: 'Uuh-uuh!',
    position: { x: 5, y: 21 },
    enclosure: 'gorilla',
    sprite: '/adventure/zoo/sprites/gorilla.png',
    encounterImage: '/adventure/zoo/sprites/gorilla.png',
  },
  {
    id: 'crocodile',
    german: 'das Krokodil',
    english: 'the crocodile',
    article: 'das',
    plural: 'die Krokodile',
    factDe: 'Das Krokodil liegt still im Wasser.',
    factEn: 'The crocodile lies still in the water.',
    sound: 'Schnapp!',
    position: { x: 15, y: 21 },
    enclosure: 'crocodile',
    sprite: '/adventure/zoo/sprites/crocodile.png',
    encounterImage: '/adventure/zoo/sprites/crocodile.png',
  },
  {
    id: 'flamingo',
    german: 'der Flamingo',
    english: 'the flamingo',
    article: 'der',
    plural: 'die Flamingos',
    factDe: 'Der Flamingo steht oft auf einem Bein.',
    factEn: 'The flamingo often stands on one leg.',
    sound: 'Krah!',
    position: { x: 26, y: 21 },
    enclosure: 'flamingo',
    sprite: '/adventure/zoo/sprites/flamingo.png',
    encounterImage: '/adventure/zoo/sprites/flamingo.png',
  },
  {
    id: 'kangaroo',
    german: 'das Känguru',
    english: 'the kangaroo',
    article: 'das',
    plural: 'die Kängurus',
    factDe: 'Das Känguru trägt sein Baby im Beutel.',
    factEn: 'The kangaroo carries its baby in a pouch.',
    sound: 'Hüpf!',
    position: { x: 37, y: 21 },
    enclosure: 'kangaroo',
    sprite: '/adventure/zoo/sprites/kangaroo.png',
    encounterImage: '/adventure/zoo/sprites/kangaroo.png',
  },
  {
    id: 'rhino',
    german: 'das Nashorn',
    english: 'the rhinoceros',
    article: 'das',
    plural: 'die Nashörner',
    factDe: 'Das Nashorn hat ein großes Horn.',
    factEn: 'The rhinoceros has a large horn.',
    sound: 'Stampf!',
    position: { x: 5, y: 29 },
    enclosure: 'rhino',
    sprite: '/adventure/zoo/sprites/rhino.png',
    encounterImage: '/adventure/zoo/sprites/rhino.png',
  },
  {
    id: 'hippo',
    german: 'das Nilpferd',
    english: 'the hippopotamus',
    article: 'das',
    plural: 'die Nilpferde',
    factDe: 'Das Nilpferd verbringt viel Zeit im Wasser.',
    factEn: 'The hippopotamus spends a lot of time in the water.',
    sound: 'Grunz!',
    position: { x: 15, y: 29 },
    enclosure: 'hippo',
    sprite: '/adventure/zoo/sprites/hippo.png',
    encounterImage: '/adventure/zoo/sprites/hippo.png',
  },
  {
    id: 'seal',
    german: 'die Robbe',
    english: 'the seal',
    article: 'die',
    plural: 'die Robben',
    factDe: 'Die Robbe schwimmt schnell und elegant.',
    factEn: 'The seal swims quickly and elegantly.',
    sound: 'Oark!',
    position: { x: 26, y: 29 },
    enclosure: 'seal',
    sprite: '/adventure/zoo/sprites/seal.png',
    encounterImage: '/adventure/zoo/sprites/seal.png',
  },
  {
    id: 'owl',
    german: 'die Eule',
    english: 'the owl',
    article: 'die',
    plural: 'die Eulen',
    factDe: 'Die Eule kann nachts sehr gut sehen.',
    factEn: 'The owl can see very well at night.',
    sound: 'Huhu!',
    position: { x: 37, y: 29 },
    enclosure: 'owl',
    sprite: '/adventure/zoo/sprites/owl.png',
    encounterImage: '/adventure/zoo/sprites/owl.png',
  },
  {
    id: 'polar-bear',
    german: 'der Eisbär',
    english: 'the polar bear',
    article: 'der',
    plural: 'die Eisbären',
    factDe: 'Der Eisbär hat ein dichtes weißes Fell.',
    factEn: 'The polar bear has thick white fur.',
    sound: 'Brumm!',
    position: { x: 5, y: 37 },
    enclosure: 'polarBear',
    sprite: '/adventure/zoo/sprites/polar-bear.png',
    encounterImage: '/adventure/zoo/sprites/polar-bear.png',
  },
  {
    id: 'panda',
    german: 'der Panda',
    english: 'the panda',
    article: 'der',
    plural: 'die Pandas',
    factDe: 'Der Panda frisst jeden Tag viel Bambus.',
    factEn: 'The panda eats a lot of bamboo every day.',
    sound: 'Mampf!',
    position: { x: 15, y: 37 },
    enclosure: 'panda',
    sprite: '/adventure/zoo/sprites/panda.png',
    encounterImage: '/adventure/zoo/sprites/panda.png',
  },
  {
    id: 'camel',
    german: 'das Kamel',
    english: 'the camel',
    article: 'das',
    plural: 'die Kamele',
    factDe: 'Das Kamel kann lange ohne Wasser leben.',
    factEn: 'The camel can live for a long time without water.',
    sound: 'Brüll!',
    position: { x: 26, y: 37 },
    enclosure: 'camel',
    sprite: '/adventure/zoo/sprites/camel.png',
    encounterImage: '/adventure/zoo/sprites/camel.png',
  },
  {
    id: 'wolf',
    german: 'der Wolf',
    english: 'the wolf',
    article: 'der',
    plural: 'die Wölfe',
    factDe: 'Der Wolf lebt und jagt in einem Rudel.',
    factEn: 'The wolf lives and hunts in a pack.',
    sound: 'Auuuu!',
    position: { x: 37, y: 37 },
    enclosure: 'wolf',
    sprite: '/adventure/zoo/sprites/wolf.png',
    encounterImage: '/adventure/zoo/sprites/wolf.png',
  },
  {
    id: 'fox',
    german: 'der Fuchs',
    english: 'the fox',
    article: 'der',
    plural: 'die Füchse',
    factDe: 'Der Fuchs hat einen langen buschigen Schwanz.',
    factEn: 'The fox has a long bushy tail.',
    sound: 'Japp!',
    position: { x: 5, y: 45 },
    enclosure: 'fox',
    sprite: '/adventure/zoo/sprites/fox.png',
    encounterImage: '/adventure/zoo/sprites/fox.png',
  },
  {
    id: 'parrot',
    german: 'der Papagei',
    english: 'the parrot',
    article: 'der',
    plural: 'die Papageien',
    factDe: 'Der Papagei hat bunte Federn und kann Wörter nachahmen.',
    factEn: 'The parrot has colourful feathers and can imitate words.',
    sound: 'Krah!',
    position: { x: 15, y: 45 },
    enclosure: 'parrot',
    sprite: '/adventure/zoo/sprites/parrot.png',
    encounterImage: '/adventure/zoo/sprites/parrot.png',
  },
  {
    id: 'snake',
    german: 'die Schlange',
    english: 'the snake',
    article: 'die',
    plural: 'die Schlangen',
    factDe: 'Die Schlange bewegt sich ohne Beine.',
    factEn: 'The snake moves without legs.',
    sound: 'Zisch!',
    position: { x: 26, y: 45 },
    enclosure: 'snake',
    sprite: '/adventure/zoo/sprites/snake.png',
    encounterImage: '/adventure/zoo/sprites/snake.png',
  },
  {
    id: 'tortoise',
    german: 'die Schildkröte',
    english: 'the tortoise',
    article: 'die',
    plural: 'die Schildkröten',
    factDe: 'Die Schildkröte trägt einen harten Panzer.',
    factEn: 'The tortoise carries a hard shell.',
    sound: 'Knusper!',
    position: { x: 37, y: 45 },
    enclosure: 'tortoise',
    sprite: '/adventure/zoo/sprites/tortoise.png',
    encounterImage: '/adventure/zoo/sprites/tortoise.png',
  },
];

export const KEEPER_POSITION: Point = { x: 19, y: 48 };
export const KEEPER_SPRITE = '/adventure/zoo/sprites/keeper.png';
export const PLAYER_SPRITES: Record<Direction, string> = {
  up: '/adventure/zoo/sprites/player-up.png',
  down: '/adventure/zoo/sprites/player-down.png',
  left: '/adventure/zoo/sprites/player-right.png',
  right: '/adventure/zoo/sprites/player-right.png',
};

export const ZOO_INTERACTABLES: MapInteractable[] = [
  {
    id: 'keeper',
    kind: 'keeper',
    position: KEEPER_POSITION,
    range: 1,
    label: 'Mit Frau Keller sprechen',
  },
  {
    id: 'map-sign',
    kind: 'sign',
    position: { x: 20, y: 24 },
    range: 1,
    label: 'Zooplan lesen',
    lines: [
      { de: 'TIERPARK BERLIN — ZOOPLAN', en: 'BERLIN ZOO — ZOO MAP' },
      { de: 'Der Tierpark hat vierundzwanzig große Gehege.', en: 'The zoo has twenty-four large enclosures.' },
      { de: 'Folge den Wegen und beobachte jedes Tier.', en: 'Follow the paths and observe every animal.' },
      { de: '„Gehege“ ist das deutsche Wort für enclosure.', en: '“Gehege” is the German word for enclosure.' },
    ],
  },
  {
    id: 'binoculars',
    kind: 'binoculars',
    position: { x: 31, y: 16 },
    range: 1,
    label: 'Durch das Fernglas schauen',
    lines: [
      { de: 'Du schaust durch das Fernglas.', en: 'You look through the binoculars.' },
      { de: 'In der Ferne siehst du eine Giraffe!', en: 'In the distance you see a giraffe!' },
      { de: 'Ich sehe ein Tier.', en: 'I see an animal.' },
    ],
  },
  ...ZOO_ANIMALS.map((animal) => ({
    id: animal.id,
    kind: 'animal' as const,
    position: animal.position,
    range: 3,
    animalId: animal.id,
    label: 'Tier im Gehege beobachten',
  })),
];

export function getEnclosureAt(x: number, y: number): Enclosure | null {
  return (
    ZOO_ENCLOSURES.find(
      (e) => x >= e.x && x < e.x + e.width && y >= e.y && y < e.y + e.height,
    ) ?? null
  );
}

export function isFenceTile(x: number, y: number): boolean {
  return ZOO_ENCLOSURES.some((e) => {
    const inside = x >= e.x && x < e.x + e.width && y >= e.y && y < e.y + e.height;
    if (!inside) return false;
    return x === e.x || x === e.x + e.width - 1 || y === e.y || y === e.y + e.height - 1;
  });
}

const TREE_POINTS: Point[] = [
  { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 21, y: 0 }, { x: 31, y: 0 },
  { x: 41, y: 0 }, { x: 0, y: 8 }, { x: 10, y: 8 }, { x: 21, y: 8 },
  { x: 32, y: 8 }, { x: 41, y: 8 }, { x: 0, y: 16 }, { x: 10, y: 16 },
  { x: 21, y: 16 }, { x: 41, y: 16 }, { x: 0, y: 24 }, { x: 10, y: 24 },
  { x: 21, y: 24 }, { x: 41, y: 24 }, { x: 0, y: 33 }, { x: 41, y: 33 },
  { x: 0, y: 32 }, { x: 10, y: 32 }, { x: 21, y: 32 }, { x: 32, y: 32 },
  { x: 41, y: 32 }, { x: 0, y: 40 }, { x: 10, y: 40 }, { x: 21, y: 40 },
  { x: 32, y: 40 }, { x: 41, y: 40 }, { x: 0, y: 49 }, { x: 41, y: 49 },
];

export function tileAt(x: number, y: number): TileKind {
  if (x < 0 || y < 0 || x >= WORLD_COLS || y >= WORLD_ROWS) return 'fence';
  if (TREE_POINTS.some((p) => p.x === x && p.y === y)) return 'tree';
  if (isFenceTile(x, y)) return 'fence';
  const enclosure = getEnclosureAt(x, y);
  if (enclosure) {
    if (enclosure.id === 'elephant' && x >= 15 && y <= 5) return 'water';
    if (enclosure.id === 'ice' && x >= 15 && y >= 15) return 'water';
    return enclosure.ground;
  }
  if ([9, 10, 20, 21, 31, 32].includes(x)) return 'path';
  if ([7, 8, 15, 16, 23, 24, 31, 32, 39, 40, 47, 48, 49].includes(y)) return 'path';
  return (x + y) % 17 === 0 ? 'flower' : 'grass';
}

export function isWalkable(x: number, y: number): boolean {
  const tile = tileAt(x, y);
  if (['fence', 'tree', 'water'].includes(tile)) return false;
  if (getEnclosureAt(x, y)) return false;
  if (ZOO_INTERACTABLES.some((i) => i.kind !== 'animal' && i.position.x === x && i.position.y === y)) {
    return false;
  }
  return true;
}

export function getFacingTarget(x: number, y: number, direction: Direction): Point {
  if (direction === 'up') return { x, y: y - 1 };
  if (direction === 'down') return { x, y: y + 1 };
  if (direction === 'left') return { x: x - 1, y };
  return { x: x + 1, y };
}

export function getNearbyInteractable(
  player: Point,
  direction: Direction,
): MapInteractable | null {
  const facing = getFacingTarget(player.x, player.y, direction);
  const candidates = ZOO_INTERACTABLES.filter((item) => {
    const dx = item.position.x - player.x;
    const dy = item.position.y - player.y;
    const distance = Math.abs(dx) + Math.abs(dy);
    if (distance > item.range) return false;
    if (direction === 'up' && dy >= 0) return false;
    if (direction === 'down' && dy <= 0) return false;
    if (direction === 'left' && dx >= 0) return false;
    if (direction === 'right' && dx <= 0) return false;
    return true;
  });
  return (
    candidates.sort((a, b) => {
      const da = Math.abs(a.position.x - facing.x) + Math.abs(a.position.y - facing.y);
      const db = Math.abs(b.position.x - facing.x) + Math.abs(b.position.y - facing.y);
      return da - db;
    })[0] ?? null
  );
}

export function buildAnimalQuiz(animal: ZooAnimal): {
  question: string;
  options: string[];
  correct: string;
} {
  const alternatives = ZOO_ANIMALS.filter((a) => a.id !== animal.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((a) => a.german);
  return {
    question: `Which German name belongs in your field guide?`,
    options: [animal.german, ...alternatives].sort(() => Math.random() - 0.5),
    correct: animal.german,
  };
}
