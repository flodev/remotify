import { Sprite } from '.';
interface AnimationSettings {
    frameRate: number;
    repeat: number;
}
export declare enum DeskAnimations {
    idle = "desk_idle"
}
export declare enum ToiletAnimations {
    idle = "toilet_idle",
    dump = "toilet_dump",
    pee = "toilet_pee"
}
export declare enum PlayerAnimations {
    idle = "player_idle",
    walk = "player_walk"
}
export declare enum AnimationTypes {
    deskAnimation = "desk_animation",
    deskInteraction = "desk_interaction",
    toiletAnimation = "toilet_animation",
    toiletInteraction = "toilet_interaction"
}
export interface Animation<T> {
    id: string;
    key: string;
    sprite_id: string;
    type: T;
    sprites?: Sprite[];
    frames: boolean | number[];
    settings: AnimationSettings | {};
}
export {};
