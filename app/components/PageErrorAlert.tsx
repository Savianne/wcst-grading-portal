"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import { useErrorAlert } from '../context/PageErrorAlertProvider';

import { Snackbar, Alert, SnackbarCloseReason } from '@mui/material';

const PageErrorAlert:React.FC<IStyledFC> = () => {
    const {error, setError} = useErrorAlert();
    const handleClose = (
        event?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setError(null);
    };
    return(
        <Snackbar open={!!error} autoHideDuration={6000} onClose={handleClose}>
        <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            sx={{ width: '100%' }}
        >
            {error}
        </Alert>
        </Snackbar>
    )
}

export default PageErrorAlert;