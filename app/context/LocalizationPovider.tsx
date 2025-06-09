"use client"
import { LocalizationProvider } from '@mui/x-date-pickers'
import { IStyledFC } from '../types/IStyledFC'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

export default function LocalizationContextProvider({ children } : { children: React.ReactNode}) {
    return(
        < LocalizationProvider dateAdapter={AdapterDayjs}>
            { children }
        </ LocalizationProvider>
    )
}