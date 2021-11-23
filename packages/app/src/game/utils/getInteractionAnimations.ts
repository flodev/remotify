import { Animation, AnimationTypes } from '../../models'
import { PlaceObjectsTypes } from '../gameobjects'

const interactionRegex = new RegExp('interaction_', 'g')

export const getInteractionAnimations = (
  animations: Animation<unknown>[],
  type: AnimationTypes
): Animation<AnimationTypes>[] =>
  animations.filter((animation) => animation.type === type) as Animation<
    typeof type
  >[]

export const getAnimationInteractionType = (
  gameObjectTypeName: PlaceObjectsTypes
) => {
  switch (gameObjectTypeName) {
    case PlaceObjectsTypes.Desk:
      return AnimationTypes.deskInteraction
    case PlaceObjectsTypes.Toilet:
      return AnimationTypes.toiletInteraction
    default:
      throw new Error('unknown type')
  }
}
