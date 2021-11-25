import { Point } from '.';
import { GameObjectType } from '.';
import { PlaceObjectsType } from './placeObjectType';
export declare type OccupiedTile = {
    x: number;
    y: number;
};
export interface DeskSettings extends Settings {
    ownerId?: string;
}
export interface ToiletSettings extends Settings {
    content?: ToiletContent;
}
export declare enum ToiletContent {
    pee = "pee",
    dump = "dump"
}
export declare const getSettingsByType: (type: PlaceObjectsType, settings: Settings) => Settings;
export declare type Settings = {
    occupiedTiles: OccupiedTile[];
};
export interface GameObject<S extends Settings> {
    id?: string;
    gameobjectype: GameObjectType;
    type_id: string;
    room_id: string;
    tile: Point;
    settings: S;
    animation?: string;
    player_id?: string;
}
