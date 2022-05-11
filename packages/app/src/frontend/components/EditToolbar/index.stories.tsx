import {
  ComponentDecorator,
  RelativeDivDecorator,
} from '../../../../.storybook/decorators'
import { StoreContextMock } from '../../../../.storybook/mocks'
import { useArgs } from '@storybook/client-api'
import { EditToolbar } from './index'
import { Mock } from 'moq.ts'
import { Stores } from '../../../state'
import { EditToolTypes } from '../../../game/editTools'
import i18n from '../../../i18n'

export default {
  title: 'EditToolbar',
  decorators: [ComponentDecorator, RelativeDivDecorator],
  component: EditToolbar,
  argTypes: {
    activeEditTool: {
      description: i18n.t('Determines which item in the toolbar is active.'),
      options: EditToolTypes,
      control: { type: 'select' },
      data: { type: 'enum' },
      default: undefined,
      table: {
        defaultValue: { summary: 'undefined' },
      },
    },
    isEditMode: {
      description: i18n.t(
        'Determines whether the toolbar is shown or not. The property comes from the gameStore.'
      ),
      control: { type: 'boolean' },
      data: { type: 'boolean' },
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    setActiveEditTool: {
      description: i18n.t(
        'A callback for setting the new state of activeEditTool.'
      ),
    },
  },
  args: {
    activeEditTool: EditToolTypes.DrawFloor,
    isEditMode: true,
  },
}

export const Default = () => {
  const [{ activeEditTool, isEditMode, isRoomView }, updateArgs] = useArgs()

  const storesMock = new Mock<Stores>()
    .setup((instance) => instance.gameStore)
    .returns({
      isRoomView,
      isEditMode,
      setIsEditMode: () => {},
      setIsRoomView: () => {},
      setGame: () => {},
    })
    .object()

  return (
    <StoreContextMock stores={storesMock}>
      <EditToolbar
        activeEditTool={activeEditTool}
        setActiveEditTool={(activeEditTool: EditToolTypes) => {
          updateArgs({ activeEditTool })
        }}
      />
    </StoreContextMock>
  )
}
