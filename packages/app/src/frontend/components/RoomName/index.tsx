import { Input, Col, Row, Form, FormInstance, message } from 'antd'
import { observer } from 'mobx-react-lite'
import { useContext, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { EditInputButton } from '..'
import { useStoreContext } from '../../../state'
import { ApiContext } from '../../context'

const FormStyled = styled(Form)`
  position: absolute;
  bottom: 0;
  left: 0;
  margin: 0 auto;
  color: white;
  width: 100%;
  color: #646464;
  font-size: 15px;
  font-weight: bold;
`

const RoomInput = styled(Input)`
  display: inline;
  background-color: transparent;
  color: #646464;
  font-weight: bold;
  text-align: left;
  border: 0;
  outline: none;
  &:focus {
    background: rgba(167, 167, 167, 0.8) !important;
  }
`

interface RoomNameProps {}

interface Values {
  room: string
}

export const RoomName = observer(({}: RoomNameProps) => {
  const [form] = Form.useForm<Values>()
  const [isFocused, setIsFocused] = useState(false)
  const { api } = useContext(ApiContext)
  const {
    roomStore: { room },
  } = useStoreContext()
  let ref = useRef<Input | null>(null)

  const toggleFocus = () => {
    if (isFocused) {
      ref?.current?.blur()
      setIsFocused(false)
    } else {
      ref?.current?.focus()
      setIsFocused(true)
    }
  }

  const onFinish = async (values: any) => {
    const roomValues = values as Values
    if (room) {
      try {
        await api.changeRoom({
          object: { name: roomValues.room },
          id: room?.id,
        })
      } catch (e) {
        message.error('cannot change room name')
        console.error('cannot change room name', e)
      }
    }
  }

  const onFinishFailed = () => {
    console.log('onFinishFailed')
  }

  const submit = () => {
    form.submit()
  }

  if (!room) {
    return <></>
  }

  return (
    <FormStyled
      form={form}
      name="room-form"
      wrapperCol={{ flex: '5' }}
      initialValues={{ room: room.name, tset: null }}
      onFinish={onFinish}
      layout="horizontal"
    >
      <EditInputButton
        onClick={toggleFocus}
        containerProps={{ style: { justifyContent: 'center' } }}
      >
        <Form.Item name="room" style={{ margin: 0 }}>
          <RoomInput
            ref={ref}
            maxLength={50}
            onBlur={submit}
            onPressEnter={submit}
            required={true}
          />
        </Form.Item>
      </EditInputButton>
    </FormStyled>
  )
})