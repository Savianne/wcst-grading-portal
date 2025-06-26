import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { styled, lighten, darken } from '@mui/system';
import { IGradingSheetStudent } from './Sheet';
import IMAGE_SERVER_URL from '@/IMAGE_SERVER_URL';

//MUI Components
import { 
   Chip,
   Avatar,
   Box
} from "@mui/material";

const GroupHeader = styled('div')(({ theme }) => ({
    position: 'sticky',
    top: '-8px',
    zIndex: 10,
    padding: '4px 10px',
    color: theme.palette.primary.main,
    backgroundColor: lighten(theme.palette.primary.light, 0.85),
    ...theme.applyStyles('dark', {
        backgroundColor: darken(theme.palette.primary.main, 0.8),
    }),
}));

const GroupItems = styled('ul')({
    display: 'flex',
    gap: '5px',
    flexDirection: 'column',
});

export interface IOptionType extends IGradingSheetStudent {
    firstLetter: string
}

export default function SelectStudentAutoComplete(props: {students: IGradingSheetStudent[], value: IGradingSheetStudent | null, onChange: (value: IGradingSheetStudent | null) => void}) {
    return (
        <Autocomplete
        fullWidth
        value={props.value}
        onChange={(event: any, newValue: IGradingSheetStudent | null) => {
          props.onChange(newValue);
        }}
        options={props.students.sort((a, b) => -b.first_name[0].toUpperCase().localeCompare(a.first_name[0].toUpperCase()))}
        groupBy={(option) => option.first_name[0].toUpperCase()}
        getOptionLabel={(option) => `${option.first_name} ${option.middle_name? option.middle_name[0].toUpperCase()+"." : ''} ${option.surname} ${option.suffix? option.suffix : ''}`}
        renderInput={(params) => <TextField {...params} label="Select Student" />}
        renderGroup={(params) => (
            <li key={params.key}>
            <GroupHeader>{params.group}</GroupHeader>
            <GroupItems>{params.children}</GroupItems>
            </li>
        )}
        renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return(
                <Box
                key={key}
                component="li"
                sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                {...optionProps}
                >
                    <Chip key={option.student_id}
                    sx={{width: 'fit-content'}} 
                    label={`${option.first_name} ${option.middle_name? option.middle_name[0].toUpperCase()+"." : ''} ${option.surname} ${option.suffix? option.suffix : ''}`}
                    avatar={<Avatar alt={option.first_name} src={`${IMAGE_SERVER_URL}/images/avatar/${option.image_path}`} />} />
                </Box>
            )
        }} />
    );
}
