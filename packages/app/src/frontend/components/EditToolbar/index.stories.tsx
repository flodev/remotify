import { ComponentDecorator } from '../../../../.storybook/decorators'
import { StoreContextMock } from '../../../../.storybook/mocks'
import { EditToolTypes } from '../../../game/editTools'
import { EditToolbar } from './index'
import { Mock } from 'moq.ts'
import { Stores } from '../../../state'
import { useState } from 'react'

export default {
  title: 'EditToolbar',
  decorators: [ComponentDecorator],
  component: EditToolbar,
}

export const Default = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(true)

  const storesMock = new Mock<Stores>()
    .setup((instance) => instance.gameStore)
    .returns({ isEditMode, setIsEditMode, setGame: () => {} })
    .object()

  return (
    <StoreContextMock stores={storesMock}>
      <EditToolbar
        activeEditTool={EditToolTypes.Drag}
        setActiveEditTool={() => {}}
      />
    </StoreContextMock>
  )
}
