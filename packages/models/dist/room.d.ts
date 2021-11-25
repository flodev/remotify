import { GameObject, Settings } from './gameObject';
import { Player } from './player';
export interface Room {
    id: string;
    name: string;
    tile: number[][];
    players: Player[];
    gameobjects: GameObject<Settings>[];
}
