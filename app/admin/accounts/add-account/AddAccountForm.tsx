"use client";
import React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import PhoneInput from '@/app/components/MobilePhoneInput';
import { object, string, number, date, mixed } from 'yup';
import { useRouter } from "next/navigation";

//MUI Components
import { 
    Button,
    Alert,
    Paper,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";

import { DatePicker } from '@mui/x-date-pickers';

//MUI Icons

const today = new Date();
const tenYearsAgo = new Date(
  today.getFullYear() - 10,
  today.getMonth(),
  today.getDate()
);

//Validation Scheme
const accountTypeScheme =  mixed()
        .oneOf(['teacher', 'student'] as const)
        .defined();

const basicInfoScheme = object({
    firstName: string().required("First-name is a required field"),
    middleName: string().required("Middle-Name is required, put N/A if no middle-name"),
    surname: string().required("Surname is a required field"),
    suffix: string(),
    sex: mixed()
        .oneOf(['male', 'female'] as const)
        .defined(),
    dateOfBirth: date().max(tenYearsAgo, 'Date must be at least 10 years before today')
        .typeError('Invalid date')
        .required('Date is required')
});

const contactScheme = object({
    email: string()
        .email('Invalid email format')
        .required('Email is required'),
    mobileNumber: string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
});

const AddAccountFormFC: React.FC<IStyledFC> = ({className}) => {
    const router = useRouter();
    const suffixOptions = ['Jr.', 'Sr.', 'II', 'III', 'IV'];
    const [formError, setFormError] = React.useState<null | string>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [accountType, setAccountType] = React.useState("");
    const [basicInfo, setBasicInfo] = React.useState<{
        firstName: string;
        middleName: string;
        surname: string;
        suffix: string;
        sex: string;
        dateOfBirth: Dayjs | null;
    }>({firstName: '', middleName: '', surname: '', suffix: '', sex: '', dateOfBirth: dayjs()});

    const [contactInfo, setContactInfo] = React.useState({email: '', mobileNumber: ''});

    return(
        <div className={className}>
            <Paper component={"form"} elevation={6}>
                <h1>Account Registration Form</h1>
                {
                    formError? <Alert variant="filled" severity="error" sx={{flex: 1}}>{formError}</Alert> : ''
                }
                <h4>Account Type</h4>
                <FormControl sx={{ minWidth: 120 }} fullWidth required>
                    <InputLabel id="acctype-label">Account Type</InputLabel>
                    <Select
                        labelId="acctype-label"
                        id="acctype"
                        label="Account Type"
                        value={accountType}
                        fullWidth
                        onChange={(e) => setAccountType(e.target.value)}
                        sx={{ minWidth: 120 }}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="teacher">
                            Teacher
                        </MenuItem>
                        <MenuItem value="student">
                            Student
                        </MenuItem>
                    </Select> 
                </FormControl>
                <h4>Basic Information</h4>
                <div className="row">
                    <TextField required id="filled-basic" label="First-name" variant="outlined" sx={{flex: 1, minWidth: '120px'}} value={basicInfo.firstName} onChange={(e) => setBasicInfo({...basicInfo, firstName: e.target.value})} />
                    <TextField required id="filled-basic" label="Middle-name" variant="outlined" sx={{flex: 1, minWidth: '120px'}} value={basicInfo.middleName} onChange={(e) => setBasicInfo({...basicInfo, middleName: e.target.value})} />
                    <TextField required id="filled-basic" label="Surname" variant="outlined" sx={{flex: 1, minWidth: '120px'}} value={basicInfo.surname} onChange={(e) => setBasicInfo({...basicInfo, surname: e.target.value})} />
                    <FormControl sx={{ minWidth: 120 }}>
                        <InputLabel id="suffix-label">Suffix</InputLabel>
                        <Select
                            labelId="suffix-label"
                            id="suffix"
                            label="Suffix"
                            value={basicInfo.suffix}
                            onChange={(e) => setBasicInfo({...basicInfo, suffix: e.target.value})}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {suffixOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                            ))}
                        </Select> 
                    </FormControl>
                </div>
                <div className="row">
                    <FormControl sx={{ flex: 1, minWidth: '120px'}} required>
                        <InputLabel id="sex-label">Sex</InputLabel>
                        <Select
                            labelId="sex-label"
                            id="sex"
                            label="Sex"
                            value={basicInfo.sex}
                            onChange={(e) => setBasicInfo({...basicInfo, sex: e.target.value})}
                            sx={{ minWidth: 120 }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                        </Select> 
                    </FormControl>
                </div>
                <div className="row">
                    <DatePicker label="Date of Birth" sx={{flex: 1, minWidth: '120px'}}
                    value={dayjs(basicInfo.dateOfBirth)} 
                    onChange={(val: Dayjs | null) => {
                        setBasicInfo({...basicInfo, dateOfBirth: val as Dayjs});
                    }}/>
                </div>
                <h4>Contact Information</h4>
                <div className="row">
                    <TextField
                    required
                    label="Email"
                    type='email'
                    id="filled-size-normal"
                    variant="outlined"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                    sx={{flex: 1}}
                    />
                    <PhoneInput value={contactInfo.mobileNumber} onChange={(v) => setContactInfo({...contactInfo, mobileNumber: v})} required />
                </div>
                <div className="row">
                    <Button loading={isLoading} loadingPosition="end" fullWidth sx={{marginTop: "20px"}} variant="contained" size="large" onClick={async () => {
                        setIsLoading(true);
                        try {
                            await accountTypeScheme.validate(accountType);
                            await basicInfoScheme.validate({...basicInfo});
                            await contactScheme.validate({...contactInfo});
                            
                            const data = {
                                accountType: accountType,
                                basicInfo: {...basicInfo},
                                contactInfo: {...contactInfo}
                            }

                            try {
                                const response = await fetch('/api/add-account', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(data)
                                }) 

                                if(response.ok) {
                                    const responseData = await response.json();
                                    
                                    router.push(`/admin/accounts/${responseData.data.uid}`)
                                } else {
                                    throw new Error("Server Error")
                                }
    
                            } catch(err) {
                                setFormError('Account creation failed. Possible reasons: duplicate email/phone number or slow internet. Please try again.');
                            } finally {
                                setIsLoading(false)
                            }
                        }
                        catch(e: any) {
                            setFormError(e.errors? e.errors : 'Please check your input properly');
                        } finally {
                            setIsLoading(false)
                        }
                    }}>Submit</Button>
                </div>
            </Paper>
        </div>
    )
};

const AddAccountForm = styled(AddAccountFormFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        margin: 5px;

        > form {
            display: flex;
            flex: 0 1 100%;
            flex-wrap: wrap;
            padding: 50px;
            gap: 10px;

            > h1 {
                text-align: center;
                flex: 0 1 100%;
                margin: 0 0 20px 0;
            }

            > h4 {
                flex: 0 1 100%;
            }
            
            > .row {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                flex: 0 1 100%;
                gap: 10px;
            }

        }
    }
`;

export default AddAccountForm;