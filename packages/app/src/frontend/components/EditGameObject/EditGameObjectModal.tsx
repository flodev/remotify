import React, { FunctionComponent, useState } from 'react'
import { Button, FormInstance, Modal } from 'antd'
import { useTranslation } from 'react-i18next'
import { PlaceObjectsType, PlaceObjectsTypes } from '../../../game/gameobjects'
import { DeskForm } from './DeskForm'
import { Settings } from '../../../models'

interface EditGameObjectProps {
  gameObjectType: PlaceObjectsType
  children: React.ReactChild
  form: FormInstance<Settings>
  onClose(): void
  onCancel(): void
  onDelete(): void
  onFinish(settings: Settings): any
  isVisible: boolean
}

export const EditGameObjectModal = ({
  gameObjectType: gameObjecType,
  children,
  form,
  onClose,
  onCancel,
  onDelete,
  onFinish,
  isVisible,
}: EditGameObjectProps) => {
  const { t } = useTranslation()
  return (
    <Modal
      title={t(`Edit Game Object title ${gameObjecType}`)}
      visible={isVisible}
      onOk={() => {}}
      onCancel={onCancel}
      destroyOnClose={true}
      afterClose={() => onClose()}
      footer={[
        <Button key="back" danger style={{ marginLeft: 0 }} onClick={onDelete}>
          {t('Delete')}
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          {t('Cancel')}
        </Button>,
        <Button
          key="link"
          type="primary"
          onClick={() => {
            form.submit()
            onFinish(form.getFieldsValue())
          }}
        >
          {t('Save')}
        </Button>,
      ]}
    >
      {children}
    </Modal>
  )
}
