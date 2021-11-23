import {
  DeskAnimations,
  Settings,
  ToiletAnimations,
  ToiletInteractions,
} from '../../models'
import { PhaserGameObject, Player } from '../gameobjects'
import { InteractionMenu, InteractionMenuEntry } from '../interactionMenu'
export * from './InteractionObserver'

ToiletInteractions
export interface InteractionReceiver {
  stopInteraction(): Settings
  isInteractionReceivable(player: Player): boolean
  receiveInteraction(interaction: InteractionMenuEntry): Settings
  getFollowUpAnimation(
    settings: Settings
  ): DeskAnimations | ToiletAnimations | undefined
}

export const getInteractionForPlayer = (
  interaction: InteractionMenuEntry,
  gameObject: PhaserGameObject
): InteractionMenuEntry => {
  const type = gameObject.getModel().gameobjectype.name
  const regex = new RegExp('^' + type, 'ig')
  return {
    name: interaction.name.replace(regex, 'player'),
    text: interaction.text,
  }
}
