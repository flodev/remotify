import React, { FunctionComponent, useState } from 'react'
import {MenuOutlined, ShareAltOutlined} from '@ant-design/icons'
import classNames from './style.scss'
import {Drawer, Button, Dropdown} from 'antd'
import { useSubscription, gql } from '@apollo/client'
import {InviteMenu} from './InviteMenu'

const subscription = gql`
subscription MyQuery {
  client {
    name
    rooms {
      name
      players {
        firstname
      }
    }
  }
}`

export const HoveringControls = () => {
  const [visible, setVisible] = useState(false)

  const stuff = useSubscription(
    subscription,
  );

  return (
    <div className={classNames.hoveringControls}>
      <MenuOutlined className={classNames.icon} style={{color: '#fff'}} onClick={() => setVisible(true)}/>

      <Drawer
          title="Basic Drawer"
          placement="left"
          closable={false}
          onClose={() => setVisible(false)}
          visible={visible}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
      </Drawer>
      <Dropdown overlay={<InviteMenu/>} placement="bottomRight" style={{pointerEvents: 'all'}}>
        <Button
          type="default"
          icon={<ShareAltOutlined />}
          size="middle"
          color="#fff"
          className={classNames.share}
          style={{pointerEvents: 'all'}}
          >
          Invite
        </Button>
      </Dropdown>
    </div>
  )
}

