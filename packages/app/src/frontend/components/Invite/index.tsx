import React, { useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, notification } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'
import { useStoreContext } from '../../../state'
import { observer } from 'mobx-react-lite'

interface InviteProps {}

export const Invite = observer(({}: InviteProps) => {
  const {
    clientStore: { client },
  } = useStoreContext()
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
})
