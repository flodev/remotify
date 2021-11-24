import { Player } from '@remotify/models'

export const getPlayerData = (player: Partial<Player> = {}): Player => ({
  id: '1',
  firstname: 'florian',
  is_online: true,
  username: 'floho',
  is_audio_video_enabled: false,
  tile: {
    x: 10,
    y: 10,
  },
  sprite: {
    id: '1',
    name: 'sprite',
    settings: { frameHeight: 10, frameWidth: 10 },
    url: 'test.png',
  },
  ...player,
})
