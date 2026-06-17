/** Pitch slot coords (x%, y%) — attack at top, GK at bottom. Index matches best11 array order. */

const BASE_433 = [
  { x: 50, y: 10 },
  { x: 78, y: 20 },
  { x: 22, y: 20 },
  { x: 50, y: 38 },
  { x: 32, y: 42 },
  { x: 68, y: 42 },
  { x: 88, y: 64 },
  { x: 62, y: 68 },
  { x: 38, y: 68 },
  { x: 12, y: 64 },
  { x: 50, y: 88 },
];

export const FORMATION_COORDS = {
  '4-3-3': BASE_433,
  '4-2-3-1': [
    { x: 50, y: 9 },
    { x: 78, y: 24 },
    { x: 22, y: 24 },
    { x: 50, y: 24 },
    { x: 35, y: 48 },
    { x: 65, y: 48 },
    { x: 88, y: 66 },
    { x: 62, y: 70 },
    { x: 38, y: 70 },
    { x: 12, y: 66 },
    { x: 50, y: 88 },
  ],
  '4-4-2': [
    { x: 38, y: 11 },
    { x: 62, y: 11 },
    { x: 12, y: 38 },
    { x: 35, y: 42 },
    { x: 65, y: 42 },
    { x: 88, y: 38 },
    { x: 88, y: 66 },
    { x: 62, y: 70 },
    { x: 38, y: 70 },
    { x: 12, y: 66 },
    { x: 50, y: 88 },
  ],
  '3-5-2': [
    { x: 38, y: 11 },
    { x: 62, y: 11 },
    { x: 10, y: 40 },
    { x: 30, y: 44 },
    { x: 50, y: 46 },
    { x: 70, y: 44 },
    { x: 90, y: 40 },
    { x: 68, y: 70 },
    { x: 50, y: 72 },
    { x: 32, y: 70 },
    { x: 50, y: 88 },
  ],
  '5-3-2': [
    { x: 38, y: 11 },
    { x: 62, y: 11 },
    { x: 30, y: 44 },
    { x: 50, y: 46 },
    { x: 70, y: 44 },
    { x: 8, y: 66 },
    { x: 28, y: 70 },
    { x: 50, y: 72 },
    { x: 72, y: 70 },
    { x: 92, y: 66 },
    { x: 50, y: 88 },
  ],
};

export function getFormationCoords(formation) {
  return FORMATION_COORDS[formation] ?? BASE_433;
}

/** Position labels per best11 index, matched to formation layout */
export const FORMATION_POSITIONS = {
  '4-3-3': ['ST', 'RW', 'LW', 'CM', 'CM', 'CM', 'RB', 'CB', 'CB', 'LB', 'GK'],
  '4-2-3-1': ['ST', 'RW', 'LW', 'CAM', 'CM', 'CM', 'RB', 'CB', 'CB', 'LB', 'GK'],
  '4-4-2': ['ST', 'ST', 'LM', 'CM', 'CM', 'RM', 'RB', 'CB', 'CB', 'LB', 'GK'],
  '3-5-2': ['ST', 'ST', 'LWB', 'CM', 'CM', 'CM', 'RWB', 'CB', 'CB', 'CB', 'GK'],
  '5-3-2': ['ST', 'ST', 'CM', 'CM', 'CM', 'LWB', 'CB', 'CB', 'CB', 'RWB', 'GK'],
};

export function getFormationPositions(formation) {
  return FORMATION_POSITIONS[formation] ?? FORMATION_POSITIONS['4-3-3'];
}
