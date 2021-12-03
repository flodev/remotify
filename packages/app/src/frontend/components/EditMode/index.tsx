import React from 'react'
import styled from 'styled-components'
import { useStoreContext } from '../../../state'
import { observer } from 'mobx-react-lite'

const Container = styled.div<{ isEditMode: boolean }>`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: ${(props) => (props.isEditMode ? '2px solid palevioletred' : '0')};
  pointer-events: none;
`

export const EditMode = observer(() => {
  const {
    gameStore: { isEditMode },
  } = useStoreContext()
  return <Container isEditMode={isEditMode} />
})
