import { PlayerAnimations, Sprite } from '.';
export interface Player {
    id: string;
    tile: {
        x: number;
        y: number;
    };
    username: string;
    firstname: string;
    is_audio_video_enabled: boolean;
    sprite: Sprite;
    animation?: PlayerAnimations;
    is_online: boolean;
    webrtc?: {
        offer?: {
            sdp: string;
            type: string;
        };
    };
}
