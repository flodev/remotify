import React, { HTMLProps } from 'react'
import { EditOutlined } from '@ant-design/icons'
import styled from 'styled-components'

interface EditInputButtonProps {
  onClick(): void
  children: React.ReactNode
  containerProps?: React.HTMLAttributes<HTMLDivElement>
}

const EditOutlinedButton = styled(EditOutlined)`
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
  children,
  onClick,
  containerProps = {},
}: EditInputButtonProps) => {
  return (
    <Container {...containerProps}>
      <EditOutlinedButton onClick={onClick} />
      {children}
    </Container>
  )
}
