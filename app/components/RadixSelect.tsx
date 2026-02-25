
import { Select } from '@radix-ui/themes'
import React from 'react'

function RadixSelect({formData, setFormData}: {formData: any, setFormData: any    }) {
  return (
    <>
      <Select.Root onValueChange={(value) => setFormData({ ...formData, sector: value })}>
        <Select.Trigger />
        <Select.Content>
            <Select.Group>
                <Select.Label>Select Sector</Select.Label>
                <Select.Item value="orange">Orange</Select.Item>
                <Select.Item value="apple">Apple</Select.Item>
                <Select.Item value="carrot">Carrot</Select.Item>
                <Select.Item value="potato">Potato</Select.Item>
            </Select.Group>
        </Select.Content>
      </Select.Root>
    </>
  )
}

export default RadixSelect
