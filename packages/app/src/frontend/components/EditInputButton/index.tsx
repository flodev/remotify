import React, { HTMLProps } from 'react'
import { EditOutlined } from '@ant-design/icons'
import styled from 'styled-components'

interface EditInputButtonProps {
  onClick(): void
  alignButton?: 'left' | 'right'
  children: React.ReactNode
  containerProps?: React.HTMLAttributes<HTMLDivElement>
  buttonProps?: React.HTMLAttributes<HTMLInputElement>
}

export const EditOutlinedButton = styled(EditOutlined)`
  font-size: 20px;
  margin-left: 10px;
  color: grey;
  vertical-align: middle;
`

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

export const EditInputButton = ({
  alignButton = 'left',
  children,
  onClick,
  containerProps = {},
  buttonProps = {},
}: EditInputButtonProps) => {
  return (
    <Container {...containerProps}>
      {alignButton === 'left' && (
        <EditOutlinedButton onClick={onClick} {...buttonProps} />
      )}
      {children}
      {alignButton === 'right' && (
        <EditOutlinedButton onClick={onClick} {...buttonProps} />
      )}
    </Container>
  )
}
