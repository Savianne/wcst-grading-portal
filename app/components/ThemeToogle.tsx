'use client'
import { IconButton } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import { useColorMode } from '../context/ThemeModeProvider'

export default function ThemeToggle() {
  const theme = useTheme()
  const { toggleColorMode } = useColorMode()

  return (
    <IconButton onClick={toggleColorMode} color="inherit" sx={{marginRight: "15px"}}>
      {theme.palette.mode === 'dark' ? <Brightness7 sx={{width: '40px', height: '40px'}} /> : <Brightness4 sx={{width: '40px', height: '40px'}}/>}
    </IconButton>
  )
}