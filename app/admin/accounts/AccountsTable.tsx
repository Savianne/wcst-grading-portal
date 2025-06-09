"use client";
import React from 'react';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import { TableData } from '@/app/types/table-data';
import { useRouter, usePathname } from "next/navigation";
import DeleteModal from '@/app/components/DeleteModal/DeleteModal';
import useDeleteModal from '@/app/components/DeleteModal/useDeleteModal';
import IMAGE_SERVER_URL from '@/IMAGE_SERVER_URL';

//MUI Components
import { 
    Button,
    Box,
    Avatar,
    MenuItem,
    ListItemIcon
} from "@mui/material";

//MUI Icons
import AddIcon from '@mui/icons-material/Add';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef
} from 'material-react-table';

const columns: Array<MRT_ColumnDef<TableData>> = [
    {
        accessorFn: (row) => `${row.picture}`, //access nested data with dot notation
        header: 'Picture',
        enableColumnActions: false,
        enableGlobalFilter: false,
        enableColumnFilter: false,
        enableSorting: false,
        id: 'picture',
        size: 20,
        Cell: ({ renderedCellValue, row }) => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <Avatar src={row.original.picture? `${IMAGE_SERVER_URL}/images/avatar/${row.original.picture}` : undefined} alt={row.original.first_name} />
            </Box>
        ),
    }, 
    {
        accessorKey: 'uid', //you should get type hints for all of your keys if you defined your TData type correctly
        header: 'Account Id',
        enableSorting: false, //you should get type hints for all possible column options that you can define here
    },
    {
        accessorKey: 'account_type',
        header: "Account Type"
    },
    {
        accessorFn: (originalRow) => (`${originalRow.first_name.toUpperCase()} ${originalRow.middle_name[0]. toUpperCase()}. ${originalRow.surname.toUpperCase()}`), //you should also get type hints for your accessorFn
        header: 'Full Name',
    },
    {
        accessorKey: "sex",
        header: "Sex"
    },
    {
        accessorFn: (originalRow) => (new Date(originalRow.date_of_birth).toLocaleDateString()),
        header: "Date of Birth"
    },
    {
        accessorKey: "email",
        header: "Email"
    },
    {
        accessorKey: 'mobile_number',
        header: "Mobile Number"
    }
];

const AccountsTableFC: React.FC<IStyledFC> = ({className}) => {
    const router = useRouter();
    const path = usePathname();
    const deleteRecordModal = useDeleteModal();
    const [data, setData] = React.useState<TableData[]>([])

    const table = useMaterialReactTable({
        columns,
        data,
        muiTablePaperProps: {
            sx: {
                width: '100%',
            },
        },
        renderTopToolbarCustomActions: () => (
            <Button variant="contained" endIcon={<AddIcon />} onClick={(e) => router.push(`${path}/add-account`)}>Add Record</Button>
        ),
        enableRowActions: true,
        renderRowActionMenuItems: ({ closeMenu, row }) => [
            <MenuItem
            key={0}
            onClick={() => {
                router.push(`/admin/accounts/${row.original.uid}`)
            }}
            sx={{ m: 0 }}
            >
            <ListItemIcon>
                <AccountCircleIcon />
            </ListItemIcon>
            View Profile
            </MenuItem>,
            <MenuItem
            key={1}
            onClick={() => {
                router.push(`/admin/accounts/${row.original.uid}`)
            }}
            sx={{ m: 0 }}
            >
            <ListItemIcon>
                <EditIcon />
            </ListItemIcon>
            Edit Profile
            </MenuItem>,
            <MenuItem
            key={2}
            onClick={() => {
                deleteRecordModal(`The Account ${row.original.first_name.toLocaleUpperCase()} ${row.original.middle_name.toLocaleUpperCase()}. ${row.original.surname.toLocaleUpperCase()}`, () => {
                    return new Promise<{success: boolean}>((res, rej) => {
                        setTimeout(() => {
                            res({success: true})
                        }, 2000)
                    })
                })

                closeMenu()
            }}
            sx={{ m: 0 }}
            >
            <ListItemIcon>
                <DeleteIcon />
            </ListItemIcon>
            Delete
            </MenuItem>
        ],
    });

    React.useEffect(() => {
        fetch("/api/get-accounts")
        .then(response => {
            if(response.ok) return response.json();
            throw new Error("Failed to fetch data")
        })
        .then(data => setData(data.data))
        .catch(err => alert("Failed to fetch"))
    }, [])
    return(
        <div className={className}>
            <DeleteModal onDeleteSuccess={() => alert("Delete Success")} />
            <MaterialReactTable 
            table={table}
            />
        </div>  
    )
}

const AccountsTable = styled(AccountsTableFC)`
    display: flex;
    flex: 0 1 100%;
    overflow: hidden;
    padding: 5px;
    height: fit-content;
`;

export default AccountsTable;