import styled from 'styled-components'

export const Toolbar = styled.div`
  background-color: white;
  position: absolute;
  pointer-events: all;
  padding: 5px;
  display: flex;
`

export const ToolbarRight = styled(Toolbar)`
  right: 0;
  top: 50%;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  transform: translate(0, -50%);
`

export const ToolbarBottom = styled(Toolbar)`
  bottom: 0;
  margin: 0;
  align-items: flex-start;
  flex-direction: row;
  right: 0;
`

export interface ToolbarButton {
  $isActive: boolean
}

export const createToolbarButton = (button: any) => styled(
  button
)<ToolbarButton>`
  font-size: 30px;
  border: 1px solid grey;
  ${(props) => (props.$isActive === true ? 'background-color: lightgrey;' : '')}
`

export const Label = styled.p`
  margin-bottom: 2px;
  font-size: 10px;
`
export const ToolbarItem = styled.div`
  text-align: center;
  margin-right: 5px;
  width: 50px;
`
