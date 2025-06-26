"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import dayjs, { Dayjs } from 'dayjs';
import { IGradingSheetStudent, useSheetContex } from './Sheet';
import { useSuccessAlert } from '@/app/context/PageSuccessAlertProvider';
import { useErrorAlert } from '@/app/context/PageErrorAlertProvider';
import IMAGE_SERVER_URL from '@/IMAGE_SERVER_URL';
import TSheetAttendanceDate from '@/app/types/grading-sheet-attendance-date-types';

//MUI Components
import { 
    Avatar,
    Paper,
    Divider,
    Box,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Backdrop,
    CircularProgress,
    IconButton,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
} from "@mui/material";
import { DatePicker } from '@mui/x-date-pickers';

//MUI Icons
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

interface IDataCell extends IStyledFC {
    attendanceData: TSheetAttendanceDate,
    student: IGradingSheetStudent
}

const DataCellFC:React.FC<IDataCell> = ({className, attendanceData, student}) => {
    const sheet = useSheetContex();
    const errorAlert = useErrorAlert();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [onEditState, setOnEditState] = React.useState(false);
    const [showPen, setShowPen] = React.useState(false)
    const [status, setStatus] = React.useState<"absent"| "present" | "late" | "cutting-class" | "">('');
    const [statusDefaultValue, setStatusDefaultValue] = React.useState<"absent"| "present" | "late" | "cutting-class" | "">('');

    const handleSubmit = async () => {
        if(status && status !== statusDefaultValue) {
            try {
                setIsSubmitting(true);
                const response = await fetch('/api/add-attendance-record', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({studentId: student.student_id, sheetId: sheet.gradingSheet.id, dateString: attendanceData.dateString, status})
                });
                
                const data = await response.json();

                if(!response.ok) throw data.error

                if(statusDefaultValue) {
                    const update = sheet.attendanceRecords.map(item => {
                        if(item.dateString == attendanceData.dateString && item.studentId == student.student_id) {
                            return ({
                                ...item, status
                            })
                        } else {
                            return item
                        }
                    });

                    sheet.dataUpdate.attendanceRecords([...update]);
                } else {
                    sheet.dataUpdate.attendanceRecords([...sheet.attendanceRecords, {sheetId: sheet.gradingSheet.id, studentId: student.student_id, status, id: data.id, dateString: attendanceData.dateString}])
                }

                setOnEditState(false);

            }
            catch(err) {
                if(typeof err == "string") {
                    errorAlert.setError(err);
                } else {
                    errorAlert.setError("An error occurred while processing your request. Please try again shortly.")
                }
            }
            finally {
                setIsSubmitting(false)
            }
        } else {
            setStatus(statusDefaultValue)
            setOnEditState(false);
        }
    }

    React.useEffect(() => {
        const record = sheet.attendanceRecords.find(item => item.dateString == attendanceData.dateString && item.studentId == student.student_id);
        if(record) {
            setStatusDefaultValue(record.status);
            setStatus(record.status);
        }
    }, [sheet.attendanceRecords, attendanceData])
    return(
        <div className={className} onDoubleClick={() => setOnEditState(true)} onMouseEnter={() => setShowPen(true)} onMouseLeave={() => setShowPen(false)}> 
            <Backdrop
                sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
                open={isSubmitting}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {
                onEditState? 
                <FormControl sx={{ flex: 1 }} size='small'>
                    <Select
                    autoFocus
                    disabled={isSubmitting}
                    value={status}
                    displayEmpty
                    onChange={(e) => setStatus(e.target.value)}
                    onBlur={handleSubmit}
                    >
                        <MenuItem value={""}>Select Status</MenuItem>
                        <MenuItem value={"present"}>Present</MenuItem>
                        <MenuItem value={"absent"}>Absent</MenuItem>
                        <MenuItem value={"late"}>Late</MenuItem>
                        <MenuItem value={"cutting-class"}>Cutting Calss</MenuItem>
                    </Select>
                </FormControl>
                 : <>
                {
                    status == "absent"? <div className="data-cell absent">Absent</div> :
                    status == "present"? <div className="data-cell present">Present</div> :
                    status == "late"? <div className="data-cell late">Late</div> :
                    status == "cutting-class"? <div className="data-cell cutting-class">Cutting Class</div> : ''
                }
                {
                    showPen? 
                    <IconButton aria-label="Edit" size="small" sx={{position: 'absolute', right: '5px'}} onClick={() => setOnEditState(true)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton> : ''
                }
                </>
            }
            
        </div>
    )
}

const DataCell = styled(DataCellFC)`
    && {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        height: 50px;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
        border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
        cursor: pointer;

        > .data-cell {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 1 100%;
            margin: 3px;
            height: calc(100% - 8px);
            border-radius: 5px;  
        }

        > .present {
            background-color: rgb(95 177 88 / 15%);
            color: rgb(96, 177, 88);
        }

        > .absent {
            background-color: rgb(255 105 97 / 15%);
            color: rgb(255, 105, 97);
        }

        > .late {
            background-color: rgb(154 91 255 / 15%);
            color: rgb(154, 91, 255);
        }

        > .cutting-class {
            background-color: rgb(225 193 7 / 15%);
            color: rgb(225 193 7);
        }

        > input {
            display: flex;
            width: 100%;
            height: 90%;
            padding: 0 5px;
            font-size: 20px;
        }

        > input, > input:active, > input:focus {
            outline: 0;
            border: 1px dashed ${({theme}) => theme.palette.grey[400]};
        }
    }
`

const AddNewDateDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddNewDateForm = styled(Box)`
    && {
        display: flex;
        width: 400px;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;

        > .row {
            display: flex;
            flex: 0 1 100%;
            align-items: center;
        }
    }
`

const AttendanceTabPanelFC:React.FC<IStyledFC> = ({className}) => {
    const sheet = useSheetContex();
    const successAlert = useSuccessAlert();
    const [addNewDateDialogError, setAddNewDialogError] = React.useState<string | null>(null);
    const [addNewDateDialogOpen, setAddNewDateDialogOpen] = React.useState(false);
    const [submittingForm, setSubmittingForm] = React.useState(false);
    const [addNewDateValue, setAddNewDateValue] = React.useState(dayjs());

    const handleClose = () => {
        setAddNewDateDialogOpen(false);
    };
    
    const handleAddDate = async () => {
        if(addNewDateValue) {
            const findExist = sheet.sheetAttendanceDatePerTerm.all.find(item => item.dateString == new Date(addNewDateValue.toISOString()).toDateString());

            if(!findExist) {
                try {
                    const response = await fetch("/api/add-grading-sheet-attendance-date", {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({sheetId: sheet.gradingSheet?.id, dateString: new Date(addNewDateValue.toISOString()).toDateString(), term: sheet.term})
                    });
    
                    const data = await response.json();
                    
                    if(!response.ok) throw data.error;

                    sheet.dataUpdate.sheetAttendanceDate([...sheet.sheetAttendanceDatePerTerm.all, {id: data.id, term: sheet.term, dateString: new Date(addNewDateValue.toISOString()).toDateString(), sheetId: sheet.gradingSheet.id}])
                    
                    if(addNewDateDialogError) setAddNewDialogError(null);
                    successAlert.setMessage("Added new Date");
                    setAddNewDateDialogOpen(false);
                    
                }
                catch (err) {  
                    if(typeof err == "string") {
                        setAddNewDialogError(err)
                    } else {
                        setAddNewDialogError("Something went wrong. Please try again in a moment.")
                    }
                }

            } else {
                setAddNewDialogError("Date already exists.");
            }

        }
    }

    return(
        <div className={className}> 
        {
            addNewDateDialogOpen? 
            <AddNewDateDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={addNewDateDialogOpen}>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Add Date</DialogTitle>
                <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={(theme) => ({
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: theme.palette.grey[500],
                })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <AddNewDateForm>
                        <div className="row">
                            <FormControl fullWidth size='small'>
                                <InputLabel id="term-label">Term</InputLabel>
                                <Select
                                    readOnly
                                    labelId="term-label"
                                    id="term"
                                    label="Term"
                                    sx={{ minWidth: 120 }}
                                    defaultValue={sheet.term}
                                >
                                    <MenuItem value="prelim">
                                        Prelim
                                    </MenuItem>
                                    <MenuItem value="midterm">
                                        Midterm
                                    </MenuItem>
                                    <MenuItem value="prefinal">
                                        Prefinal
                                    </MenuItem>
                                    <MenuItem value="final">
                                        Final
                                    </MenuItem>
                                </Select> 
                            </FormControl>
                        </div>
                        <div className="row">
                            <DatePicker label="Date" sx={{flex: 1, minWidth: '120px'}}
                            value={dayjs(addNewDateValue)} 
                            onChange={(val: Dayjs | null) => {
                                setAddNewDateValue(val as Dayjs)
                            }}/>
                        </div>
                        {
                            addNewDateDialogError? 
                            <div className="row">
                                <Alert sx={{flex: 1}} severity="error">{addNewDateDialogError}</Alert>
                            </div> : ""
                        }
                    </AddNewDateForm>
                </DialogContent>
                <DialogActions>
                    <Button loading={submittingForm} variant="contained" size='large' color='secondary' endIcon={<AddIcon />}
                    onClick={handleAddDate}>Add Date</Button>
                </DialogActions>
            </AddNewDateDialog> : ''
        }
            <div className="panel-head">
                <Alert sx={{flex: 1}} severity="info">A minimum of 5 attendance entries is required for grade computation. Otherwise, a base grade of {sheet.gradingSystem.componentsItemTransmutationScale.baseGrade} will be applied.</Alert>
                <Divider orientation='vertical' variant='middle' flexItem />
                <Chip clickable onClick={() => setAddNewDateDialogOpen(true)} icon={<AddIcon />} label={"Add Date"} color='secondary'/>
            </div>
            <div className="panel-body">
                <div className="table-content">
                    <div className="students-column">
                        <div className="table-head">
                            <h3>Learners Name</h3>
                        </div>
                        {
                            sheet.students.map(student => (
                                <div className="row" key={student.student_id}>
                                    <Chip
                                    avatar={<Avatar alt="Natacha" src={`${IMAGE_SERVER_URL}/images/avatar/${student.image_path}`} />}
                                    label={`${student.first_name} ${student.middle_name? student.middle_name[0].toUpperCase()+"." : ''} ${student.surname} ${student.suffix? student.suffix : ''}`}
                                    variant="outlined"
                                    />
                                </div>
                            ))
                        }
                    </div>
                    <div className="scrollable-columns">
                        {
                            sheet.sheetAttendanceDatePerTerm[sheet.term].length? 
                            <div className="column-group">
                                {
                                    sheet.sheetAttendanceDatePerTerm[sheet.term].map(item => (
                                        <div className="column" key={item.id}>
                                            <div className="column-head">
                                                <div className="data-cell">
                                                    <Chip label={item.dateString} />
                                                    <IconButton aria-label="delete" size="small">
                                                        <CloseIcon fontSize="inherit" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                            <div className="column-body">
                                                {
                                                    sheet.students.map(student => (
                                                        <DataCell key={student.student_id} student={student} attendanceData={item} />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div> : 
                            <div className="no-record">
                                <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                <h1>No Record found</h1>
                                <Chip clickable onClick={() => setAddNewDateDialogOpen(true)} icon={<AddIcon />} label={"Add Date"} color='secondary'/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
};

const AttendanceTabPanel = styled(AttendanceTabPanelFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        min-width: 0;
        

        > .panel-head {
            display: flex;
            flex: 0 1 100%;
            height: fit-content;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
            padding: 10px 0;
        }

        > .panel-body {
            display: flex;
            flex: 0 1 100%;
            flex-wrap: wrap;
            height: fit-content;
            min-width: 0;
            
            > h2 {
                padding: 20px 0;
            }

            > .table-content {
                display: flex;
                flex: 0 1 100%;
                min-width: 0;
                overflow-x: auto;
                height: fit-content;
                background-color: ${({theme}) => theme.palette.background.paper};
    
                > .students-column {
                    display: flex;
                    flex: 0 1 250px;
                    height: fit-content;
                    flex-wrap: wrap;
    
                    > .table-head {
                        display: flex;
                        height: 50px;
                        flex: 1;
                        align-items: center;
                        justify-content: center;
                        border: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
    
                        > h3 {
                            height: fit-content;
                            width: fit-content;
                        }

                    }

                    > .row {
                        display: flex;
                        flex: 0 1 100%;
                        height: 50px;
                        align-items: center;
                        border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                        border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                    }
                }

                 > .scrollable-columns {
                    display: flex;
                    flex: 0 1 100%;
                    height: fit-content;
                    border: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                    border-bottom: 0;
                    border-left: 0;
                    overflow: hidden;
                    overflow-x: auto;

                    > .column-group {
                        display: flex;
                        flex: 0 1 100%;

                        > .column {
                            display: flex;
                            flex: 0 1 170px;
                            flex-shrink: 0;
                            height: fit-content;
                            flex-wrap: wrap;

                            > .column-head {
                                display: flex;
                                flex: 0 1 100%;
                                height: 49px;
                                border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                                border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                                
                                > .data-cell {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    flex: 0 1 100%;
                                    margin: 3px;
                                    border-radius: 5px;
                                }
                            }

                            > .column-body {
                                display: flex;
                                flex: 0 1 100%;
                                flex-wrap: wrap;
                                height: fit-content;
                            }
                        }
                    }

                     > .no-record {
                        display: flex;
                        flex: 0 1 100%;
                        height: 300px;
                        align-items: center;
                        justify-content: center;
                        flex-direction: column;
                    }
                }
            }
        }
    }
`

export default AttendanceTabPanel;