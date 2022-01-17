import { ComponentDecorator } from '../../../../.storybook/decorators'
import { RegisterModal } from './RegisterModal'

export default {
  title: 'RegisterModal',
  decorators: [ComponentDecorator],
  component: RegisterModal,
}

export const Default = () => {
  return <RegisterModal />
}
