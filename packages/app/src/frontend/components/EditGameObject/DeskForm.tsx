import { Form, FormInstance, Select } from 'antd'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DeskSettings, Player } from '@remotify/models'
import { DropDown, ValueItem } from '../DropDown'

const { Option } = Select

interface DeskProps {
  players: Player[]
  form: FormInstance<DeskSettings>
  deskSettings: DeskSettings
}

export const DeskForm = ({ players, form, deskSettings }: DeskProps) => {
  const { t } = useTranslation()

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo)
  }

  const onSelect = (value: string) => {
    form.setFieldsValue({ ownerId: value })
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={deskSettings}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item label={t('Desk owner')} name="ownerId">
        <Select
          placeholder={t('Select Desk owner')}
          allowClear
          onChange={onSelect}
        >
          {players.map((player) => {
            return (
              <Option value={player.id} key={player.id}>
                {player.username}
              </Option>
            )
          })}
        </Select>
      </Form.Item>
    </Form>
  )
}
