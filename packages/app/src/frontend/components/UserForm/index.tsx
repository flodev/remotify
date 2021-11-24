import { Col, Input, Row } from 'antd'
import { useApolloClient } from '@apollo/client'
import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import { EditOutlined } from '@ant-design/icons'
import { GameStateContext } from '../../context'

interface UserFormProps {}

const Username = styled(Input)`
  text-align: center;
`
const EditOutlinedButton = styled(EditOutlined)`
  font-size: 20px;
  margin-left: 10px;
  color: grey;
  vertical-align: middle;
`

export const UserForm = ({}: UserFormProps) => {
  let ref = useRef<Input | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const { api } = useContext(GameStateContext)
  const apolloClient = useApolloClient()
  const username = localStorage.getItem('username') as string

  const onBlur = () => {
    setIsFocused(false)
    api.changePlayerUsername({
      id: localStorage.getItem('userId')!,
      username: newUsername,
    })
    localStorage.setItem('username', newUsername)
  }

  const [newUsername, setNewUsername] = useState(username)

  return (
    <Row style={{ marginTop: '20px' }}>
      <Col>
        <Username
          ref={ref}
          value={newUsername}
          onChange={({ currentTarget: { value } }) => {
            setNewUsername(value)
          }}
          bordered={isFocused}
          onFocus={() => setIsFocused(true)}
          onBlur={onBlur}
          onPressEnter={onBlur}
          maxLength={15}
        />
      </Col>
      <Col>
        <EditOutlinedButton
          onClick={() => ref && ref.current && ref.current.focus()}
        />
      </Col>
    </Row>
  )
}