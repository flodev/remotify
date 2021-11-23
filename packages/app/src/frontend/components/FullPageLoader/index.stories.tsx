import React from 'react'
import { useState } from 'react'
import { FullPageLoader } from '.'
import { ComponentDecorator } from '../../../../.storybook/decorators'

export default {
  title: 'FullPageLoader',
  decorators: [ComponentDecorator],
}

export const Default = () => {
  return <FullPageLoader></FullPageLoader>
}
