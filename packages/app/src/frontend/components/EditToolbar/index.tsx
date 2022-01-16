import styled from 'styled-components'
import {
  AppstoreAddOutlined,
  DragOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { REGISTRY_CHANGE_EDIT_TOOL } from '../../../constants'
import { EditToolType, EditToolTypes } from '../../../game/editTools'
import { useTranslation } from 'react-i18next'
import { createToolbarButton, ToolbarRight } from '../Toolbar'
import { observer } from 'mobx-react-lite'
import { useStoreContext } from '../../../state'

const Label = styled.p`
  margin-bottom: 2px;
  font-size: 10px;
`

const DragOutlinedButton = createToolbarButton(DragOutlined)
const EditOutlinedButton = createToolbarButton(EditOutlined)
const AppstoreAddOutlinedButton = createToolbarButton(AppstoreAddOutlined)

interface EditToolbarProps {
  activeEditTool: EditToolType
  setActiveEditTool(editTool: EditToolType): void
}

export const EditToolbar = observer(
  ({ activeEditTool, setActiveEditTool }: EditToolbarProps) => {
    const {
      gameStore: { isEditMode, game },
    } = useStoreContext()
    const { t } = useTranslation()
    const setActiveEditToolType = (editToolType: EditToolType) => {
      setActiveEditTool(editToolType)
      game?.registry.set(REGISTRY_CHANGE_EDIT_TOOL, editToolType)
    }
    if (!isEditMode) {
      return <></>
    }
    return (
      <ToolbarRight>
        <DragOutlinedButton
          isActive={activeEditTool === EditToolTypes.Drag}
          onClick={() => setActiveEditToolType(EditToolTypes.Drag)}
        />
        <Label>{t('Drag')}</Label>
        <EditOutlinedButton
          isActive={activeEditTool === EditToolTypes.DrawWall}
          onClick={() => setActiveEditToolType(EditToolTypes.DrawWall)}
        />
        <Label>{t('Draw Wall')}</Label>
        <EditOutlinedButton
          isActive={activeEditTool === EditToolTypes.DrawFloor}
          onClick={() => setActiveEditToolType(EditToolTypes.DrawFloor)}
        />
        <Label>{t('Draw Floor')}</Label>
        <AppstoreAddOutlinedButton
          isActive={activeEditTool === EditToolTypes.PlaceObjects}
          onClick={() => setActiveEditToolType(EditToolTypes.PlaceObjects)}
        />
        <Label>{t('Place Objects')}</Label>
      </ToolbarRight>
    )
  }
)
