import { notification } from 'antd'
import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router-dom'
import { FullPageLoader } from '..'
import { tempSignup, regainToken, Api } from '@remotify/open-api'
import { TempSignupType } from '@remotify/models'
import { JwtCache } from '@remotify/graphql'
import { cleanLocalStorage } from '../../utils'
interface InitProps {
  setCanOpenGame?(canOpenGame: boolean): void
  isInvite?: boolean
  jwtCache: JwtCache
  api?: Api
}

export const Init = ({
  setCanOpenGame,
  jwtCache,
  isInvite,
  api,
}: InitProps) => {
  const { inviteId } = useParams<{ inviteId: string }>()
  const history = useHistory()
  const { t } = useTranslation()
  const register = useCallback(async () => {
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
  }, [])

  const init = useCallback(async () => {
    if (localStorage.getItem('refresh_token')) {
      const isReady = (await api?.checkIsReady()) || false
      if (isReady) {
        setCanOpenGame && setCanOpenGame(true)
      } else {
        cleanLocalStorage()
        window.location.href = '/'
      }
    } else {
      register()
    }
  }, [])

  useEffect(() => {
    if (isInvite) {
      cleanLocalStorage()
    }
  }, [isInvite])

  useEffect(() => {
    init()
  }, [])

  return <FullPageLoader />
}
