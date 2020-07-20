import React, { FunctionComponent, useRef, useContext } from 'react'
import {Menu, Input, notification} from 'antd'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ClientContext } from '../../app/ClientContext';

interface InviteMenuProps {
  text: string
}

const openNotification = () => {
  notification.info({
    message: 'Copied to Clipboard',
    placement: 'topRight',
    style: {zIndex: 1000},
  });
};

export const InviteMenu: FunctionComponent<InviteMenuProps> = () => {
  const inputRef = useRef<Input | null>(null)
  const {client} = useContext(ClientContext)
  const inviteUrl = `https://${window.location.host}/invite/${encodeURIComponent(client.share_id)}`
  const onFocus = () => {
    if (inputRef && inputRef.current) {
      inputRef.current.select()
    }
  }
  const onCopy = (_text: string, result: boolean) => {
    if (result === true) {
      openNotification()
    }
  }
  return (
    <Menu style={{zIndex: 0}}>
      <Menu.Item>
        <CopyToClipboard text={inviteUrl}
          onCopy={onCopy}>
          <Input onFocus={onFocus} ref={inputRef} value={inviteUrl}/>
        </CopyToClipboard>
      </Menu.Item>
    </Menu>
  )
}