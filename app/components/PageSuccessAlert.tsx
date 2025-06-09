"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import { useSuccessAlert } from '../context/PageSuccessAlertProvider';
import { Snackbar, Alert, SnackbarCloseReason } from '@mui/material';

const PageSuccessAlert:React.FC<IStyledFC> = () => {
    const {message, setMessage} = useSuccessAlert();
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setMessage(null);
    };
    return(
        <Snackbar open={!!message} autoHideDuration={6000} onClose={handleClose}>
        <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
        >
            {message}
        </Alert>
        </Snackbar>
    )
}

export default PageSuccessAlert;