"use client"
import React, { ReactNode, createContext, useContext } from 'react';

interface IDeleteModal {
   
};

type TConfirmDeleteFunctionReturnPromise = Promise<{success: boolean}>;

export type TConfirmDeleteFunction = () => TConfirmDeleteFunctionReturnPromise;

interface IDeleteModalContext {
    modalState: "close" | "active" | "open" | "remove" | "inactive";
    itemName: string;
    closeDeleteModal: () => void;
    renderDeleteModal: (itemName: string, confirmBtnAction: TConfirmDeleteFunction) => void,
    confirmBtnAction: TConfirmDeleteFunction | null
}

export const DeleteModalContextProvider = createContext<IDeleteModalContext | undefined>(undefined);

const DeleteModalContext:React.FC<{children: ReactNode}> = ({children}) => {

    const [deleteModalState, updateDeleteModalState] = React.useState<"close" | "active" | "open" | "remove" | "inactive">("inactive");
    const [confirmBtnFunction, setConfirmBtnFunction] = React.useState<null |TConfirmDeleteFunction>(null);
    const [itemName, setItemName] = React.useState("");

    React.useEffect(() => {
        if(deleteModalState == "close") {
            setTimeout(() => {
                updateDeleteModalState("inactive");
                setConfirmBtnFunction(null);
                setItemName("");
            }, 100);
        }

        if(deleteModalState == "active") {
            setTimeout(() => {
                updateDeleteModalState("open");
            }, 10);
        }
    }, [deleteModalState]);

    return (
        <DeleteModalContextProvider.Provider value={{
            modalState: deleteModalState,
            itemName: itemName,
            confirmBtnAction: confirmBtnFunction,
            closeDeleteModal: () => updateDeleteModalState("close"),
            renderDeleteModal: (itemName, confirmBtnAction) => {
                setItemName(itemName);
                setConfirmBtnFunction(() => confirmBtnAction);
                updateDeleteModalState("active");
            }
        }}>
            { children }
        </DeleteModalContextProvider.Provider>
    )
}

export default DeleteModalContext;