import { Form, FormInstance, Select } from 'antd'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ToiletSettings } from '../../../models'

const { Option } = Select

interface DeskProps {
  form: FormInstance<any>
  deskSettings: ToiletSettings
}

export const ToiletForm = ({ form }: DeskProps) => {
  const { t } = useTranslation()

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{}}
      autoComplete="off"
    ></Form>
  )
}
