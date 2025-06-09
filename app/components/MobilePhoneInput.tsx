'use client'

import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { IStyledFC } from '../types/IStyledFC'
import { Box, MenuItem, Select, TextField, SelectChangeEvent, Divider } from '@mui/material'

const countryCodes = [
  { code: '+63', label: 'Philippines' },
]

interface IPHPhoneNumberInput extends IStyledFC {
  value: string;
  required: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void
}

const PhoneInputFC: React.FC<IPHPhoneNumberInput> = ({className, value, onChange, required, disabled}) => {
  const [countryCode, setCountryCode] = useState('+63');

  const handleCodeChange = (event: SelectChangeEvent) => {
    setCountryCode(event.target.value)
  }

  return (
    <div className={className}>
      <Select
        value={countryCode}
        onChange={handleCodeChange}
        sx={{ minWidth: 120}}
        disabled={disabled}
      >
        {countryCodes.map((item) => (
          <MenuItem key={item.code} value={item.code}>
            {item.code} ({item.label})
          </MenuItem>
        ))}
      </Select>
      <Divider orientation="vertical" variant="middle" flexItem />
      <input disabled={disabled} maxLength={10} required={required} value={value} type='tel' placeholder='Mobile Number' onChange={(e) => onChange? onChange(e.target.value) : ''}/>
    </div>
  )
}

const PhoneInput = styled(PhoneInputFC)`
    && {
        display: flex;
        flex: 1;
        height: fit-content;
        align-items: center;
        border: 1px solid gray;
        border-radius: 5px;
        border-color: rgba(var(--mui-palette-common-onBackgroundChannel) / 0.23);

        fieldset {
            outline: 0;
            border: 0;
            margin-right: 20px;
        }

        > input {
            display: flex;
            flex: 1;
            height: 50px;
            outline: 0;
            border: 0;
            margin-left: 20px;
            background-color: transparent;
            font-size: 16px;
        }
    }
`

export default PhoneInput;