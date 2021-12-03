import React, { FunctionComponent, useRef, useEffect } from 'react'
import { Menu, Input, notification } from 'antd'
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useStoreContext } from '../../../state'

interface InviteMenuProps {}

const openNotification = () => {
  notification.info({
    message: 'Copied to Clipboard',
    placement: 'topRight',
    style: { zIndex: 1000000 },
  })
}

export const InviteMenu: FunctionComponent<InviteMenuProps> = () => {
  const inputRef = useRef<Input | null>(null)
  const { client } = useStoreContext()
  const inviteUrl = `http://${window.location.host}/invite/${encodeURIComponent(
    (client && client.share_id) || ''
  )}`
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
  useEffect(() => {
    if (inputRef) {
      inputRef.current?.focus()
    }
  }, [inputRef])

  return (
    <Menu style={{ zIndex: 0 }}>
      <Menu.Item key={'ssdfs'}>
        <CopyToClipboard text={inviteUrl} onCopy={onCopy}>
          <Input onFocus={onFocus} ref={inputRef} value={inviteUrl} />
        </CopyToClipboard>
      </Menu.Item>
    </Menu>
  )
}
