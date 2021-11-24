export enum DeskInteractions {
  work_hard = 'work_hard',
  sleep = 'sleep',
  punch_the_display = 'punch_the_display',
  hear_music = 'hear_music',
}

export enum ToiletInteractions {
  take_a_dump = 'toilet_take_a_dump',
  take_a_pee = 'toilet_take_a_pee',
  flush = 'toilet_flush',
}

export type PossibleGameObjectInteractions = ToiletInteractions &
  DeskInteractions

export const GameObjectInteractions = {
  desk: DeskInteractions,
  toilet: ToiletInteractions,
}
