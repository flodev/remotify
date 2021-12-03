import React, { useState } from 'react'
import { UserOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Drawer, Spin } from 'antd'

import { UserForm, VideoForm } from '..'
import { useStoreContext } from '../../../state'
import { observer } from 'mobx-react-lite'

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

export const UserMenu = observer(() => {
  const [isVisible, setVisible] = useState(false)
  const {
    playerStore: { player },
  } = useStoreContext()

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
})
