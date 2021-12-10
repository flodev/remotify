import { notification } from 'antd'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router'
import { FullPageLoader } from '..'
import { tempSignup, regainToken } from '@remotify/open-api'
import { TempSignupType } from '@remotify/models'
import { JwtCache } from '@remotify/graphql'
import { cleanLocalStorage } from '../../utils'
interface InitProps {
  setCanOpenGame?(canOpenGame: boolean): void
  isInvite?: boolean
  jwtCache: JwtCache
}

export const Init = ({ setCanOpenGame, jwtCache, isInvite }: InitProps) => {
  const { inviteId } = useParams<{ inviteId: string }>()
  const history = useHistory()
  const { t } = useTranslation()
  const register = async () => {
    try {
      const { roomName, username, id, roomId } = await tempSignup(
        process.env.REACT_APP_AUTH_API_URL!,
        inviteId ? TempSignupType.invitation : TempSignupType.temporary,
        jwtCache,
        inviteId && decodeURIComponent(inviteId)
      )
      localStorage.setItem('userId', id)
      localStorage.setItem('username', username)
      localStorage.setItem('roomName', roomName)
      localStorage.setItem('roomId', roomId)
      setCanOpenGame && setCanOpenGame(true)
      if (inviteId) {
        history.push('/')
      }
    } catch (e) {
      notification.error({
        message: t('cannot register'),
      })
    }
  }

  useEffect(() => {
    if (isInvite) {
      cleanLocalStorage()
    }
  }, [isInvite])

  useEffect(() => {
    if (localStorage.getItem('refresh_token')) {
      if (jwtCache.has()) {
        setCanOpenGame && setCanOpenGame(true)
      } else {
        ;(async function () {
          await regainToken(process.env.REACT_APP_AUTH_API_URL!, jwtCache)
          setCanOpenGame && setCanOpenGame(true)
        })()
      }
    } else {
      register()
    }
  }, [])

  return <FullPageLoader />
}
