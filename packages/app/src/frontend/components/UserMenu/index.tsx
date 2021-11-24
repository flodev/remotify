import React, {
  ElementRef,
  FunctionComponent,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  UserOutlined,
  EditOutlined,
  DownOutlined,
  VideoCameraAddOutlined,
} from '@ant-design/icons'
import styled from 'styled-components'
import {
  Button,
  Col,
  Divider,
  Drawer,
  Dropdown,
  Input,
  Menu,
  Row,
  Spin,
  Switch,
} from 'antd'

import { UserForm, VideoForm } from '..'
import { ClientContext, GameStateContext } from '../../context'

const UserOutlinedButtonButton = styled(UserOutlined)`
  right: 0;
  font-size: 30px;
  pointer-events: all;
`

const SpinButton = styled(Spin)`
  right: 10px;
  position: absolute;
  font-size: 30px;
  pointer-events: all;
`
const CenterH1 = styled.h1`
  text-align: center;
`

export const UserMenu = () => {
  const [isVisible, setVisible] = useState(false)
  const { player } = useContext(ClientContext)

  if (!player) {
    return <SpinButton size={'large'} />
  }

  return (
    <>
      <UserOutlinedButtonButton
        style={{ color: '#fff', height: '50px' }}
        onClick={() => setVisible(true)}
      />
      <Drawer
        placement="right"
        closable={false}
        onClose={() => setVisible(false)}
        visible={isVisible}
      >
        <UserForm />
        <VideoForm />
      </Drawer>
    </>
  )
}
