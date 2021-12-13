import { Col, Input, Row, Form } from 'antd'
import { useApolloClient } from '@remotify/graphql'
import React, { useContext, useRef, useState } from 'react'
import styled from 'styled-components'
import { EditOutlined } from '@ant-design/icons'
import { ApiContext } from '../../context'
import { Player } from '@remotify/models'
import { EditInputButton } from '..'

interface UserFormProps {
  player: Player
}

const Username = styled(Input)`
  text-align: center;
`
const EditOutlinedButton = styled(EditOutlined)`
  font-size: 20px;
  margin-left: 10px;
  color: grey;
  vertical-align: middle;
`

interface Values {
  username: string
}

export const UserForm = ({ player }: UserFormProps) => {
  let ref = useRef<Input | null>(null)
  const [form] = Form.useForm<Values>()

  const [isFocused, setIsFocused] = useState(false)
  const { api } = useContext(ApiContext)

  const onFinish = (values: Values) => {
    setIsFocused(false)
    api.changePlayerUsername({
      id: localStorage.getItem('userId')!,
      username: values.username,
    })
    localStorage.setItem('username', values.username)
  }
  const submit = () => {
    form.submit()
  }

  const toggleFocus = () => {
    if (isFocused) {
      ref?.current?.blur()
      setIsFocused(false)
    } else {
      ref?.current?.focus()
      setIsFocused(true)
    }
  }

  return (
    <Form
      form={form}
      name="room-form"
      wrapperCol={{ flex: '5' }}
      initialValues={{ username: player.username }}
      onFinish={onFinish}
      layout="horizontal"
    >
      <EditInputButton
        onClick={toggleFocus}
        alignButton="right"
        containerProps={{ style: { justifyContent: 'center' } }}
      >
        <Form.Item
          name="username"
          style={{ margin: 0 }}
          rules={[{ required: true }, { min: 3 }, { max: 15 }]}
        >
          <Username
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={submit}
            required={true}
            minLength={3}
            onPressEnter={submit}
            maxLength={15}
          />
        </Form.Item>
      </EditInputButton>
    </Form>
  )
}
