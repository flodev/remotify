import React, { useContext } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Button, notification } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'
import { useStoreContext } from '../../../state'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'

interface InviteProps {}

const InviteButton = styled(Button)`
  pointer-events: all;
  top: 0;
  left: 50%;
  position: absolute;
  transform: translate(-50%);
  -webkit-transform: translate(-50%);
`

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
      <InviteButton
        type="default"
        icon={<ShareAltOutlined />}
        size="middle"
        color="#fff"
      >
        Invite
      </InviteButton>
    </CopyToClipboard>
  )
})
