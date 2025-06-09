"use client"
import React from "react"
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import dayjs, { Dayjs } from 'dayjs';
import PhoneInput from "@/app/components/MobilePhoneInput";
import { object, string, number, date, mixed } from 'yup';
import AvatarPicker from "@/app/components/AvatarPicker";
import DeleteModal from "@/app/components/DeleteModal/DeleteModal";
import IMAGE_SERVER_URL from "@/IMAGE_SERVER_URL";
//Utils
import areObjectsMatching from "@/app/helpers/utils/areObjectMatching";

//Custom Hook
import useDeleteModal from "@/app/components/DeleteModal/useDeleteModal";

//MUI Components
import { 
    Button,
    Alert,
    Paper,
    Box,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Skeleton,
    Avatar,
} from "@mui/material";

import { DatePicker } from '@mui/x-date-pickers';

//MUI Icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

export interface IData {
  uid: string;
  email: string;
  mobile_number: string;
  user_name: string;
  account_type: string;
  first_name: string;
  middle_name: string;
  surname: string;
  suffix: null | string;
  sex: string;
  date_of_birth: any;
  picture: null | string;
}

const today = new Date();
const tenYearsAgo = new Date(
  today.getFullYear() - 10,
  today.getMonth(),
  today.getDate()
);


const updateAccountDataSheme = object({
    first_name: string().required("First-name is a required field"),
    middle_name: string().required("Middle-Name is required, put N/A if no middle-name"),
    surname: string().required("Surname is a required field"),
    suffix: string(),
    sex: mixed()
        .oneOf(['male', 'female'] as const)
        .defined(),
    date_of_birth: date().max(tenYearsAgo, 'Date must be at least 10 years before today')
        .typeError('Invalid date')
        .required('Date is required'),
    email: string()
        .email('Invalid email format')
        .required('Email is required'),
    mobile_number: string()
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
        .required('Phone number is required'),
});

interface IAccountPannel extends IStyledFC {
    uid: string
}
const AccountPanelFC: React.FC<IAccountPannel> = ({className, uid}) => {
    const deleteRecordModal = useDeleteModal();
    const [updatePictureModalOpen, setUpdatePictureModalOpen] = React.useState(false);
    const [defaultData, setDefaultData] = React.useState<IData | null>(null);
    const [updatedData, setUpdatedData] = React.useState<IData | null>(null);
    const [hasDataChanges, setHasDataChanges] = React.useState(false);
    const [onEditData, setOnEditData] = React.useState(false);
    const [updateDataError, setUpdateDataError] = React.useState(false);
    const [fetchError, setFetchError] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSendingDataUpdate, setIsSendingDataUpdate] = React.useState(false);
    const [updateDataValidationError, setUpdateDataValidationError] = React.useState<null | string>(null);
    const [updateSuccess, setUpdateSuccess] = React.useState(false);

    React.useEffect(() => {
        fetch('/api/get-account-detail', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({accountUID: uid})
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to fetch data");
            }
        })
        .then(data => {
            setDefaultData({...data.data})
            setUpdatedData({...data.data});
        })
        .catch(err => {
            console.log(err)
            setFetchError(true)
        })
        .finally(() => {
            setTimeout(() => {
                setIsLoading(false)
            }, 2000)
        })
    }, []);

    React.useEffect(() => {
        setHasDataChanges(!areObjectsMatching({...updatedData}, {...defaultData}))
    }, [updatedData, defaultData])

    return (
        <div className={className}> 
        {
            defaultData && updatedData && <AvatarPicker uid={updatedData.uid} onUploadSuccess={(imageName) => {
                setDefaultData({...defaultData, picture: imageName});
                setUpdatedData({...updatedData, picture: imageName});
            }} onClose={() => setUpdatePictureModalOpen(false)} isOpen={updatePictureModalOpen} />
        }
            <DeleteModal onDeleteSuccess={() => console.log('Delete Success')}/>
            <Paper className="paper" elevation={6}>
                {
                    !fetchError? <>
                        <div className="box">
                            <h1>Account Details</h1>
                            {
                                isLoading? <>
                                    <div className="row">
                                        <h4><Skeleton width={150}/></h4>
                                    </div>
                                    <div className="row">
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                    </div>
                                    <div className="row">
                                        <h4><Skeleton width={250}/></h4>
                                    </div>
                                    <div className="row">
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                    </div>
                                    <div className="row">
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                    </div>
                                    <div className="row">
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                    </div>
                                    <div className="row">
                                        <h4><Skeleton width={150}/></h4>
                                    </div>
                                    <div className="row">
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                        <Skeleton variant="rectangular" width={"100%"} height={60} />
                                    </div>
                                    <div className="row btn-container">
                                        <Skeleton variant="rectangular" width={200} height={50} />
                                        <Skeleton variant="rectangular" width={200} height={50} />
                                    </div>
                                </> : <>
                                    {
                                        updatedData? <>
                                            <div className="row">
                                                <h5>Account Type</h5>
                                            </div>
                                            <div className="row">
                                                <TextField disabled value={defaultData?.account_type == "teacher"? "Teacher's Account" : "Student's Account"} id="filled-basic" variant="outlined" fullWidth size="small"/>
                                            </div>
                                            <div className="row">
                                                <h5>Basic Information</h5>
                                            </div>
                                            <div className="row">
                                                <TextField disabled={!onEditData || isSendingDataUpdate} value={updatedData?.first_name} onChange={(e) => setUpdatedData({...updatedData, first_name: e.currentTarget.value})} id="filled-basic" label="First-name" variant="outlined" fullWidth size="small"/>
                                                <TextField disabled={!onEditData || isSendingDataUpdate} value={updatedData?.middle_name} onChange={(e) => setUpdatedData({...updatedData, middle_name: e.currentTarget.value})} id="filled-basic" label="Middle-name" variant="outlined" fullWidth size="small"/>
                                                <TextField disabled={!onEditData || isSendingDataUpdate} value={updatedData?.surname} onChange={(e) => setUpdatedData({...updatedData, surname: e.currentTarget.value})} id="filled-basic" label="Surname" variant="outlined" fullWidth size="small"/>
                                                {
                                                    defaultData?.suffix? <TextField disabled={!onEditData || isSendingDataUpdate} value={updatedData?.suffix} onChange={(e) => setUpdatedData({...updatedData, suffix: e.currentTarget.value})} id="filled-basic" label="Suffix" variant="outlined" fullWidth size="small"/> : ''
                                                }
                                            </div>
                                            <div className="row">
                                                <FormControl  disabled={!onEditData || isSendingDataUpdate} sx={{ flex: 1, minWidth: '120px'}} size="small" required>
                                                    <InputLabel id="sex-label">Sex</InputLabel>
                                                    <Select
                                                        labelId="sex-label"
                                                        id="sex"
                                                        label="Sex"
                                                        sx={{ minWidth: 120 }}
                                                        value={updatedData?.sex}
                                                        onChange={(e) => setUpdatedData({...updatedData, sex: e.target.value})}
                                                        
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
                                                value={dayjs(updatedData?.date_of_birth)} disabled={!onEditData || isSendingDataUpdate} onChange={(val: Dayjs | null) => setUpdatedData({...updatedData, date_of_birth: val as Dayjs})}/>
                                            </div>
                                            <div className="row">
                                                <h5>Contact Information</h5>
                                            </div>
                                            <div className="row">
                                                <TextField
                                                required
                                                label="Email"
                                                type='email'
                                                id="filled-size-normal"
                                                variant="outlined"
                                                sx={{flex: 1, minWidth: '250px'}}
                                                disabled={!onEditData || isSendingDataUpdate}
                                                value={updatedData?.email}
                                                onChange={(e) => setUpdatedData({...updatedData, email: e.target.value})}
                                                />
                                                <PhoneInput value={updatedData?.mobile_number as string} required disabled={!onEditData || isSendingDataUpdate} onChange={(val) => setUpdatedData({...updatedData, mobile_number: val})}/>
                                            </div>
                                            {
                                                updateSuccess? <Alert
                                                action={
                                                    <IconButton
                                                    aria-label="close"
                                                    color="inherit"
                                                    size="small"
                                                    onClick={() => {
                                                        setUpdateSuccess(false);
                                                    }}
                                                    >
                                                    <CloseIcon fontSize="inherit" />
                                                    </IconButton>
                                                }
                                                sx={{ flex: '0 1 100%' }}
                                                >
                                                Update success!
                                                </Alert> :  ""
                                            }
                                            {
                                                updateDataValidationError || updateDataError? <Alert variant="filled" severity="error" sx={{flex: '0 1 100%'}}>{updateDataValidationError? updateDataValidationError : "Failed to update account info!"}</Alert> : ""
                                            }
                                            <div className="row btn-container">
                                                {
                                                    onEditData? <>
                                                        <Button disabled={!hasDataChanges || isSendingDataUpdate} variant="contained" size="large" loading={isSendingDataUpdate} loadingPosition="end"  onClick={async () => {
                                                            setIsSendingDataUpdate(true);
                                                            try {
                                                                //validate datainput
                                                                await updateAccountDataSheme.validate({
                                                                    first_name: updatedData.first_name,
                                                                    middle_name: updatedData.middle_name,
                                                                    surname: updatedData.surname,
                                                                    suffix: updatedData.suffix,
                                                                    sex: updatedData.sex,
                                                                    email: updatedData.email,
                                                                    mobile_number: updatedData.mobile_number,
                                                                    date_of_birth: updatedData.date_of_birth
                                                                });

                                                                if(updateDataValidationError) setUpdateDataValidationError(null);

                                                                try {
                                                                    await fetch('/api/update-account', {
                                                                        method: "POST",
                                                                        headers: {
                                                                            'Content-Type': 'application/json',
                                                                        },
                                                                        body: JSON.stringify(updatedData)
                                                                    });

                                                                    if(updateDataError) setUpdateDataError(false);

                                                                    setDefaultData({...updatedData});
                                                                    setUpdateSuccess(true);
                                                                    setOnEditData(false);

                                                                }
                                                                catch(err) {
                                                                    setUpdateDataError(true);
                                                                } 
                                                                finally {
                                                                    setIsSendingDataUpdate(false)
                                                                }
                                                            } 
                                                            catch(err: any) {
                                                                setUpdateDataValidationError(err.errors? err.errors : 'Please check your input properly');
                                                            }
                                                            finally {
                                                                setIsSendingDataUpdate(false);
                                                            }
                                                            
                                                        }}>Submit Changes</Button>
                                                        <Button disabled={isSendingDataUpdate} variant="text" size="large" color="info" onClick={() => {
                                                            setUpdatedData({...defaultData} as IData);
                                                            setOnEditData(false);
                                                            setUpdateDataError(false);
                                                            setUpdateDataValidationError(null)
                                                        }}>Cancel</Button>
                                                    </> : <>
                                                        <Button variant="contained" startIcon={<DeleteIcon />} size="large" color="error" 
                                                        onClick={() => {
                                                            deleteRecordModal(`The Account ${defaultData?.first_name.toLocaleUpperCase()} ${defaultData?.middle_name.toLocaleUpperCase()}. ${defaultData?.surname.toLocaleUpperCase()}`, () => {
                                                                return new Promise<{success: boolean}>((res, rej) => {
                                                                    setTimeout(() => {
                                                                        res({success: true})
                                                                    }, 2000)
                                                                // doRequest({
                                                                //     method: "DELETE",
                                                                //     url: "/delete-resident-record",
                                                                //     data: { residentUID:  residentUID}
                                                                // })
                                                                //     .then(response => {
                                                                //         response.success? res(response) : rej(response);
                                                                //     })
                                                                //     .catch(err => rej({success: false}))
                                                                })
                                                            })
                                                        }}>Delete this account</Button>
                                                        <Button variant="contained" startIcon={<EditIcon />} size="large" color="success" onClick={() => setOnEditData(true)}>Edit this account</Button>
                                                    </>
                                                }
                                            </div>
                                        </> : ""
                                    }
                                </>
                            }
                        </div>
                        <div className="dp-container">
                            {
                                isLoading? <>
                                    <Skeleton variant="circular" width={200} height={200} />
                                    <Skeleton variant="rectangular" width={200} height={50} />
                                </> : <>
                                    {
                                        updatedData?.picture? <Avatar sx={{width: 200, height: 200}} src={`${IMAGE_SERVER_URL}/images/avatar/${updatedData?.picture}`} /> : <Avatar sx={{width: 200, height: 200}} />
                                    }
                                    <Button variant="text" size="medium" onClick={() => setUpdatePictureModalOpen(true)}>Change Picture</Button>
                                </>
                            }
                        </div>
                    </> : <>
                        <h1>Failed tro fetch</h1>
                    </>
                }
            </Paper>
        </div>
    )
}


const AccountPanel = styled(AccountPanelFC)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    margin: 5px;
    margin-top: 5px;

    && > .paper {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;

        > .box {
            display: flex;
            flex: 0 1 600px;
            margin: 80px 20px 80px 100px;
            flex-wrap: wrap;
            gap: 10px;

            > .row {
                display: flex;
                flex: 0 1 100%;
                gap: 10px;
            }

            > .btn-container {
                margin-top: 10px;
            }
        }

        > .dp-container {
            display: flex;
            flex: 1;
            flex-direction: column;
            align-items: center;
            margin-top: 100px;
            gap: 20px;
        }
    }
`;

export default AccountPanel;