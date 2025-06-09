"use client"
import React from "react";
import { styled, keyframes } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';

import { DeleteModalContextProvider } from "../../context/DeleteModalContext";

import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { 
    Button,
    IconButton,
    Divider,
    CircularProgress,
    Snackbar,
    Alert
} from "@mui/material";

interface IDelete extends IStyledFC {
    onDeleteSuccess: () => void,
}
const FCDeleteModal: React.FC<IDelete> = ({className, onDeleteSuccess}) => {
    const deleteModalContext = React.useContext(DeleteModalContextProvider);
    const [showBlinker, updateShowBlinker] = React.useState(false);
    const [isDeleting, updateIsDeleting] = React.useState(false);
    const [isErrorDeletion, setIsErrorDeletion] = React.useState(false);

    React.useEffect(() => {
        if(showBlinker) {
            setTimeout(() => {
                updateShowBlinker(false);
            }, 600)
        }
    }, [showBlinker]);
    return (
        !(deleteModalContext?.modalState == "inactive")? 
        <div className={className}>
            <Snackbar open={isErrorDeletion} autoHideDuration={6000} onClose={() => setIsErrorDeletion(false)}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    Failed to delete record!
                </Alert>
            </Snackbar>
            <div className="mover" onClick={() => updateShowBlinker(true)} style={{top: deleteModalContext?.modalState == "open"? "0": '-100%', opacity: deleteModalContext?.modalState == "open"? 1 : 0.1}}>
                <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-head">
                        { showBlinker &&  <div className="blinker"></div> } 
                        <div className="close-btn-area">
                            <span className="close-btn-container">
                                <IconButton 
                                aria-label="close"
                                onClick={(e) => deleteModalContext?.closeDeleteModal()}>
                                    <CloseIcon />
                                </IconButton>
                            </span>
                        </div>
                        <div className="warning-text">
                            <span className="warning-icon">
                                <ErrorOutlineIcon sx={{fontSize: "50px"}} />
                            </span>
                            <h1>Are you sure about this Action?</h1>
                        </div>
                    </div>
                    <div className="modal-body">
                        <h1>Warning! This action can not be undone.</h1>
                        <h2>You are about to delete</h2>
                        <h3>{deleteModalContext?.itemName}</h3>
                        <div className="modal-btn-container">
                            <Button  
                            disabled={isDeleting}
                            onClick={(e) => deleteModalContext?.closeDeleteModal()} 
                            >Cancel</Button>
                            <Divider orientation="vertical" sx={{height: '30px'}} />
                            <Button 
                            startIcon={isDeleting? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />} 
                            color="error"
                            onClick={(e) => {
                                updateIsDeleting(true);
                                deleteModalContext?.confirmBtnAction && deleteModalContext?.confirmBtnAction()
                                .then(res => {
                                    if(res.success) {
                                        updateIsDeleting(false);
                                        deleteModalContext.closeDeleteModal();
                                        isErrorDeletion && setIsErrorDeletion(false);
                                        onDeleteSuccess()
                                    } else throw res
                                })
                                .catch(() => {
                                    updateIsDeleting(false);
                                    setIsErrorDeletion(true)
                                })
                            }} 
                            >Continue delete</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        : null 
    )
}

const blinkAnimation = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const DeleteModalStyled = styled(FCDeleteModal)`
    position: fixed;
    display: flex;
    width: 100%;
    height: 100vh;
    background-color: ${({theme}) => theme.palette.mode == "dark"? "#00000073" : "#1e1e1e38"};
    z-index: 5000;
    left: 0;
    top: 0;

    && > .mover {
        position: absolute;
        left: 0;
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        /* background-color: orange; */
        transition: top 100ms ease-in-out, opacity 200ms;

        > .delete-modal {
            display: flex;
            flex: 0 1 450px;
            background-color: ${({theme}) => theme.palette.mode == "dark"? "#303030" : "#e7e7e7"};
            box-shadow: 17px 20px 61px 21px rgb(0 0 0 / 25%);
            flex-wrap: wrap;
            border-radius: 3px;
            padding-bottom: 30px;

            > .modal-head {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 0 1 100%;
                height: 200px;
                border-radius: 3px 3px 0 0;
                background-color: #ff9393;
                justify-items: flex-start;

                > .close-btn-area {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 40px;

                    >  .close-btn-container {
                        margin-left: auto;
                    }
                }

                > .warning-text {
                    display: flex;
                    justify-content: center;
                    width: fit-content;
                    height: fit-content;
                    flex-wrap: wrap;
                    font-size: 18px;
                    font-weight: 500;
                    color: #fe3535;

                    > .warning-icon {
                        font-size: 50px;
                    }

                    > h1 {
                        flex: 0 1 100%;
                        font-size: 18px;
                        text-align: center;
                    }
                }

                > .blinker {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    border-radius: 3px 3px 0 0;
                    position: absolute;
                    top: 0;
                    left: 0;
                    animation: ${blinkAnimation} 200ms infinite;
                    background-color: #b9b9b9;
                }
            }

            > .modal-body {
                display: flex;
                flex: 0 1 100%;
                flex-wrap: wrap;
                justify-content: center;

                > h1, > h2, > h3 {
                    font-size: 15px;
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    text-align: center;
                }

                > h1 {
                    font-size: 18px;
                    padding: 15px 0;
                    font-weight: 500;
                }

                > h2 {
                    font-weight: 100;
                }

                > h3 {
                    text-decoration: underline;
                }

                > .modal-btn-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 30px;
                    flex: 0 1 100%;
                    height: 40px;
                    padding: 20px 0;
                }
            }
        }    
    }
`;

const DeleteModal: React.FC<{onDeleteSuccess: () => void}> = ({onDeleteSuccess}) => {
    return <DeleteModalStyled onDeleteSuccess={() => onDeleteSuccess()}/>
}

export default DeleteModal;
