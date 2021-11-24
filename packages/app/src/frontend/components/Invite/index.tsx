import React, { useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, notification } from 'antd'
import { ClientContext } from '../../context'
import { MenuOutlined, ShareAltOutlined } from '@ant-design/icons'

interface InviteProps {}

export const Invite = ({}: InviteProps) => {
  const { client } = useContext(ClientContext)
  const inviteUrl = `http://${window.location.host}/invite/${encodeURIComponent(
    (client && client.share_id) || ''
  )}`

  const openNotification = () => {
    notification.info({
      message: `${inviteUrl} copied to your clipboard. Send it to your friends.`,
      placement: 'topRight',
      duration: 5000,
      style: { zIndex: 1000000 },
    })
  }

  if (!client) {
    return <></>
  }
  return (
    <CopyToClipboard text={inviteUrl} onCopy={openNotification}>
      <Button
        type="default"
        icon={<ShareAltOutlined />}
        size="middle"
        color="#fff"
        style={{
          pointerEvents: 'all',
          top: 0,
          right: '30%',
          position: 'absolute',
        }}
      >
        Invite
      </Button>
    </CopyToClipboard>
  )
}
