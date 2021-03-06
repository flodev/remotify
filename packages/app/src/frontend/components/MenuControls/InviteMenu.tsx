import React, { FunctionComponent, useRef, useEffect } from 'react'
import { Menu, Input, notification, InputRef } from 'antd'
// @ts-ignore
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useStoreContext } from '../../../state'
import { observer } from 'mobx-react-lite'

interface InviteMenuProps {}

const openNotification = () => {
  notification.info({
    message: 'Copied to Clipboard',
    placement: 'topRight',
    style: { zIndex: 1000000 },
  })
}

export const InviteMenu: FunctionComponent<InviteMenuProps> = observer(() => {
  const inputRef = useRef<InputRef | null>(null)
  const {
    clientStore: { client },
  } = useStoreContext()
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
})
