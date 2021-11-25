import { Sprite } from '.';
import { PlaceObjectsTypes } from './placeObjectType';
export declare type OccupiedTilesCount = {
    vertical: number;
    horizontal: number;
};
export declare type InteractionPosition = {
    x: number;
    y: number;
};
export interface GameObjectType {
    id: string;
    name: PlaceObjectsTypes;
    sprite_id: string;
    sprite: Sprite;
    settings: {
        occupiedTilesCount: OccupiedTilesCount;
        interactionPosition: InteractionPosition;
    };
}
