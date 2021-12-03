import React, { useContext, useEffect, useState } from 'react'
import { GameStateContext } from '../../context'
import { DesktopOutlined } from '@ant-design/icons'
import { REGISTRY_CHANGE_PLACE_OBJECTS } from '../../../constants'
import { EditToolType, EditToolTypes } from '../../../game/editTools'
import { useTranslation } from 'react-i18next'
import { PlaceObjectsType, PlaceObjectsTypes } from '../../../game/gameobjects'
import {
  createToolbarButton,
  Label,
  ToolbarBottom,
  ToolbarItem,
} from '../Toolbar'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faToilet } from '@fortawesome/free-solid-svg-icons'
import { useStoreContext } from '../../../state'

const DesktopOutlinedButton = createToolbarButton(DesktopOutlined)
const ToiletButton = createToolbarButton(FontAwesomeIcon)

export const PlaceObjectsToolbar = ({
  activeEditTool,
}: {
  activeEditTool: EditToolType
}) => {
  const { game } = useContext(GameStateContext)
  const { gameObjectTypes } = useStoreContext()
  const [objectToPlace, setObjectToPlace] = useState<PlaceObjectsType>(
    undefined
  )

  const setObjectToPlaceAndFireEvent = (placeObjectType: PlaceObjectsType) => {
    const gameObjectType = gameObjectTypes.find(
      (type) => placeObjectType === type.name
    )
    setObjectToPlace(placeObjectType)
    game?.registry.set(REGISTRY_CHANGE_PLACE_OBJECTS, gameObjectType)
  }
  const { t } = useTranslation()

  useEffect(() => {
    if (activeEditTool !== EditToolTypes.PlaceObjects) {
      setObjectToPlaceAndFireEvent(undefined)
    }
  }, [activeEditTool])

  if (activeEditTool !== EditToolTypes.PlaceObjects) {
    return <></>
  }
  return (
    <ToolbarBottom>
      <ToolbarItem>
        <DesktopOutlinedButton
          isActive={objectToPlace === PlaceObjectsTypes.Desk}
          onClick={() => setObjectToPlaceAndFireEvent(PlaceObjectsTypes.Desk)}
        />
        <Label>{t('Desk')}</Label>
      </ToolbarItem>
      <ToolbarItem>
        <ToiletButton
          icon={faToilet}
          isActive={objectToPlace === PlaceObjectsTypes.Toilet}
          onClick={() => setObjectToPlaceAndFireEvent(PlaceObjectsTypes.Toilet)}
        />
        <Label>{t('Toilet')}</Label>
      </ToolbarItem>
    </ToolbarBottom>
  )
}
