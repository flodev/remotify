import React, { FunctionComponent, useContext, useState } from 'react'
import { MenuOutlined, ShareAltOutlined } from '@ant-design/icons'
import classNames from './style.scss'
import { Drawer, Button, Dropdown, Switch } from 'antd'
import { useSubscription, gql } from '@apollo/client'
import { GameStateContext } from '../../context'
import { UserMenu } from '../UserMenu'
import { EditToolbar } from '../EditToolbar'
import styled from 'styled-components'
import { PlaceObjectsToolbar } from '../PlaceObjectsToolbar'
import { InviteMenu } from './InviteMenu'
import { Invite } from '..'
import { useTranslation } from 'react-i18next'
import { EditToolType } from '../../../game/editTools'
import { REGISTRY_IS_EDIT_MODE } from '../../../constants'

const subscription = gql`
  subscription MyQuery {
    client {
      name
      rooms {
        name
        players {
          firstname
        }
      }
    }
  }
`

const MenuOutlinedButton = styled(MenuOutlined)`
  font-size: 30px;
  pointer-events: all;
`

export const MenuControls = () => {
  const [visible, setVisible] = useState(false)
  const { isEditMode, setIsEditMode } = useContext(GameStateContext)
  const { game } = useContext(GameStateContext)
  const [activeEditTool, setActiveEditTool] = useState<
    EditToolType | undefined
  >(undefined)

  // const stuff = useSubscription(subscription)
  const onChange = () => {
    game?.registry.set(REGISTRY_IS_EDIT_MODE, !isEditMode)
    setIsEditMode(!isEditMode)
    setActiveEditTool(undefined)
  }
  const { t } = useTranslation()

  return (
    <div className={classNames.hoveringControls}>
      <MenuOutlinedButton
        style={{ color: '#fff', height: '50px' }}
        onClick={() => setVisible(true)}
      />
      <Drawer
        title="Menu"
        closable={true}
        footer={
          <a href="https://github.com/flodev/remotify" target="_blank">
            Github
          </a>
        }
        placement="left"
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <p>
          <Switch onChange={onChange} checked={isEditMode} /> {t('Edit Mode')}
        </p>
      </Drawer>

      <UserMenu />
      <EditToolbar
        activeEditTool={activeEditTool}
        setActiveEditTool={setActiveEditTool}
      />
      <PlaceObjectsToolbar activeEditTool={activeEditTool} />
      <Invite />
    </div>
  )
}
