import { Button, Dropdown, Menu } from 'antd'
import React from 'react'

export type ValueItem = { key: string; value: string; icon?: React.ReactNode }

interface DropDownProps {
  values: ValueItem[]
  selectedValue?: ValueItem
  onSelect(item: ValueItem): void
}

export const DropDown = ({
  values,
  selectedValue,
  onSelect,
}: DropDownProps) => {
  return (
    <Dropdown
      overlay={
        <Menu>
          {values.map((input) => (
            <Menu.Item
              key={input.key}
              icon={input.icon || null}
              onClick={() => onSelect(input)}
            >
              {input.value}
            </Menu.Item>
          ))}
        </Menu>
      }
    >
      <Button
        style={{
          width: '100%',
        }}
      >
        <span
          style={{
            width: '100%',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {selectedValue?.value || 'Empty'}
        </span>
      </Button>
    </Dropdown>
  )
}
