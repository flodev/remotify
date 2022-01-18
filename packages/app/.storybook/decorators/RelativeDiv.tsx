import styled from 'styled-components'

const RelativeDiv = styled.div`
  position: relative;
  width: 300px;
  height: 500px;
`

export const RelativeDivDecorator = (Story: any) => (
  <RelativeDiv>
    <Story />
  </RelativeDiv>
)
