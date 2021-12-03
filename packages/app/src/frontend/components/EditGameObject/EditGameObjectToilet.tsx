import React from 'react'
import { EditGameObject } from '.'
import { GameObject, ToiletSettings } from '../../../models'
import { Form } from 'antd'

interface EditGameObjectToiletProps {
  toilet: GameObject<ToiletSettings>
  onClose(): void
}

export const EditGameObjectToilet = ({
  onClose,
  toilet,
}: EditGameObjectToiletProps) => {
  const [form] = Form.useForm<ToiletSettings>()
  return <EditGameObject form={form} onClose={onClose} gameObject={toilet} />
}
