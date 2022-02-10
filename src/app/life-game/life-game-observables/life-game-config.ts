
export interface LifeGameConfig {
  name: string;
  aliveCoords: {x: number, y: number}[];
  height: number;
  width: number;
  category: string;
  looped: boolean;
}
