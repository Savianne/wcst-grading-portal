"use client"
import { useContext } from "react";
import { DeleteModalContextProvider } from "../../context/DeleteModalContext";

function useDeleteModal() {
    const deleteModalContext = useContext(DeleteModalContextProvider);

    return deleteModalContext?.renderDeleteModal as (itemName: string, confirmBtnAction: () =>  Promise<{success: boolean}>) => void
}

export default useDeleteModal;