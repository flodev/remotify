import React, { FunctionComponent, useContext, useState } from 'react'
import { MenuOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Drawer, Button, Dropdown, Switch } from 'antd'
import { gql } from '@remotify/graphql'
import { ApiContext } from '../../context'
import { UserMenu } from '../UserMenu'
import { EditToolbar } from '../EditToolbar'
import styled from 'styled-components'
import { PlaceObjectsToolbar } from '../PlaceObjectsToolbar'
import { InviteMenu } from './InviteMenu'
import { Invite } from '..'
import { useTranslation } from 'react-i18next'
import { EditToolType } from '../../../game/editTools'
import { REGISTRY_IS_EDIT_MODE } from '../../../constants'
import { useStoreContext } from '../../../state'
import { observer } from 'mobx-react-lite'

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

const Container = styled.div`
  position: absolute;
  pointer-events: none;
  display: flex;
  justify-content: space-between;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const MenuOutlinedButton = styled(MenuOutlined)`
  font-size: 30px;
  pointer-events: all;
`

const DrawerStyled = styled(Drawer)`
  .ant-drawer-close {
    order: 1;
  }
`

export const MenuControls = observer(() => {
  const [visible, setVisible] = useState(false)
  const {
    gameStore: { isEditMode, setIsEditMode, game },
  } = useStoreContext()
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
    <Container>
      <MenuOutlinedButton
        style={{ color: '#646464', height: '50px' }}
        onClick={() => setVisible(true)}
      />
      <DrawerStyled
        title="Menu"
        closable={true}
        footer={
          <a
            href="https://github.com/flodev/remotify"
            target="_blank"
            rel="noreferrer"
          >
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
      </DrawerStyled>

      <UserMenu />
      <EditToolbar
        activeEditTool={activeEditTool}
        setActiveEditTool={setActiveEditTool}
      />
      <PlaceObjectsToolbar activeEditTool={activeEditTool} game={game} />
      <Invite />
    </Container>
  )
})
