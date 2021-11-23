import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Spin } from 'antd'

interface FullPageLoaderProps {
  children?: ReactElement
}

const FullPage = styled.div`
  background-color: black;
  position: absolute;
  top: 0;
  bottom: 0%;
  left: 0;
  right: 0%;
  background-color: white;
  z-index: 99;
`

const Center = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  /* bring your own prefixes */
  transform: translate(-50%, -50%);
`

export const FullPageLoader = ({ children }: FullPageLoaderProps) => {
  return (
    <FullPage>
      <Center>
        <Spin size="large" />
        {children}
      </Center>
    </FullPage>
  )
}
