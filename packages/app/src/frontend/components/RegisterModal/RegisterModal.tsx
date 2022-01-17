import React from 'react'
import { Modal } from 'antd'

interface RegisterModalProps {}

export const RegisterModal = ({}: RegisterModalProps) => {
  return (
    <Modal title="Basic Modal" visible={true}>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </Modal>
  )
}
