import { FullPageLoader } from './index'
import {
  ComponentDecorator,
  RelativeDivDecorator,
} from '../../../../.storybook/decorators'

export default {
  title: 'FullPageLoader',
  decorators: [ComponentDecorator, RelativeDivDecorator],
  component: FullPageLoader,
}

export const Default = () => {
  return <FullPageLoader></FullPageLoader>
}
