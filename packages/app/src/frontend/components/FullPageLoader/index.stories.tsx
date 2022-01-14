import { FullPageLoader } from '.'
import { ComponentDecorator } from '../../../../.storybook/decorators'

export default {
  title: 'FullPageLoader',
  decorators: [ComponentDecorator],
  component: FullPageLoader,
}

export const Default = () => {
  return <FullPageLoader></FullPageLoader>
}
