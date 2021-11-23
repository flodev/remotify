export enum PlaceObjectsTypes {
  Desk = 'desk',
  Toilet = 'toilet',
}

export type PlaceObjectsType =
  | undefined
  | PlaceObjectsTypes.Desk
  | PlaceObjectsTypes.Toilet
