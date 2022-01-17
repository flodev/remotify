import { ComponentDecorator } from '../../../../.storybook/decorators'
import { StoreContextMock } from '../../../../.storybook/mocks'
import { useArgs } from '@storybook/client-api'
import { EditToolbar } from './index'
import { Mock } from 'moq.ts'
import { Stores } from '../../../state'
import { EditToolTypes } from '../../../game/editTools'

export default {
  title: 'EditToolbar',
  decorators: [ComponentDecorator],
  component: EditToolbar,
  argTypes: {
    activeEditTool: {
      options: EditToolTypes,
      control: { type: 'radio' },
      data: { type: 'enum' },
    },
    isActive: {
      control: { type: 'boolean' },
      data: { type: 'boolean' },
    },
  },
  args: {
    activeEditTool: EditToolTypes.DrawFloor,
    isActive: true,
  },
}

interface Args {
  activeEditTool: EditToolTypes | undefined
}

export const Default = (args: Args) => {
  const [{ activeEditTool, isActive }, updateArgs] = useArgs()

  const storesMock = new Mock<Stores>()
    .setup((instance) => instance.gameStore)
    .returns({
      isEditMode: isActive,
      setIsEditMode: () => {},
      setGame: () => {},
    })
    .object()

  return (
    <StoreContextMock stores={storesMock}>
      <div style={{ position: 'relative', height: '300px', width: '100%' }}>
        <EditToolbar
          activeEditTool={activeEditTool}
          setActiveEditTool={(activeEditTool: EditToolTypes) => {
            updateArgs({ activeEditTool })
          }}
        />
      </div>
    </StoreContextMock>
  )
}
