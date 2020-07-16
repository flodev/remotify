import React, { FunctionComponent, useState } from 'react'
import {MenuOutlined} from '@ant-design/icons'
import classNames from './style.scss'
import {Drawer} from 'antd'
import { useSubscription, gql } from '@apollo/client'

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
    </div>
  )
}

