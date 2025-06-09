"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { IStyledFC } from '@/app/types/IStyledFC';
import { useUserInfo } from '@/app/context/UserInfoProvider';
import { useRouter, usePathname } from "next/navigation";
import dayjs, { Dayjs } from 'dayjs';
import * as yup from 'yup';

//MUI Components
import { 
    Button,
    Box,
    Avatar,
    MenuItem,
    ListItemIcon,
    Alert,
    Paper,
    TextField,
    Divider,
    Snackbar,
    Chip,
    FormControl,
    Select,
    InputLabel,
    Skeleton,
    ListSubheader
} from "@mui/material";

import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

//MUI Icons
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddGradingSheetForm = styled(Box)`
    && {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;

        > .row {
            display: flex;
            flex: 0 1 100%;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        }
    }
`

const GradingSheetItem = styled(Paper)`
    && {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        padding: 20px;
        border-radius: 8px;
        border-left: 5px solid #2196F3;
        overflow: hidden;
        flex-wrap: wrap;
        align-items: center;

        > .img-container {
            width: auto;
            height: 100%;
            position: absolute;
            left: 0;
        }

        > .title {
            display: flex;
            flex: 0 1 100%;
            
            > h4 {
                flex: 0 1 100%;
                z-index: 1;
                margin-right: 10px;
                margin-left: 10px;
            }
        }

        > .bottom-container {
            display: flex;
            flex: 0 1 100%;
            padding: 5px;
            flex-wrap: wrap;
            gap: 5px;
            z-index: 2;
            align-items: center;
        }
    }
`;

type TCourseInfo = {
    id: string;
    course_title: string,
    course_duration: string
}

type TSubjectInfo = {
    id: string;
    course_id: string;
    subject_title: string,
    subject_code: string,
    year: string,
    subject_info: string,
}

type TMinorSubjectInfo = {
    id: string;
    subject_title: string,
    subject_code: string,
    subject_info: string
}

type TGradingSheetInfo = {
    id: string;
    school_year: string;
    year: string;
    semester: string;
    course_title: string;
    subject_title: string;
    subject_code: string;
}

const addGradingSheetValidationSchema = yup.object({
    schoolYear: yup.object({
        from: yup.string().required('School year start is required'),
        to: yup.string().required('School year end is required'),
    }).required(),

    year: yup.string().required('Year is required'),
    course: yup.string().required('Course is required'),
    semester: yup.string().required('Semester is required'),
    subjectInfo: yup.string().required('Subject is required'),

    schedule: yup.object({
        every: yup.string().required('Schedule frequency is required'),
        start: yup.date()
        .required('Start time is required')
        .typeError('Start must be a valid date'),
        end: yup.date()
        .required('End time is required')
        .typeError('End must be a valid date'),
    }).required(),
});

const addGradingSheetDefaultFormValues = {
    schoolYear: {
        from: String(new Date().getFullYear()),
        to: String(new Date().getFullYear() + 1)
    },
    year: "",
    course: "",
    semester: "",
    subjectInfo: "",
    schedule: {
        every: "",
        start: dayjs(),
        end: dayjs()
    }
}

const GradingSheetsPageContentFC: React.FC<IStyledFC> = ({className}) => {
     const router = useRouter();
    const userInfo = useUserInfo();
    const [addGradingSheetDialogOpen, setAddGradingSheetDialogOpen] = React.useState(false);
    const [submitionError, setSubmitionError] = React.useState<null | string>(null);
    const [submitionSuccess, setSubmitionSuccess] = React.useState(false);
    const [formValidationError, setFormValidationError] = React.useState<null | string>(null);
    const [submittingForm, setSubmittingForm] = React.useState(false);
    const [courses, setCourses] = React.useState<TCourseInfo[]>([]);
    const [years, setYears] = React.useState<string[] | null>(null);
    const [subjects, setSubjects] = React.useState<TSubjectInfo[]>([]);
    const [minorSubjects, setMinorSubjects] = React.useState<TMinorSubjectInfo[]>([]);
    const [addGradingSheetForm, setAddGradingSheetForm] = React.useState({...addGradingSheetDefaultFormValues});
    const [loadingGradingSheets, setLoadingGradingSheets] = React.useState(true);
    const [gradingSheets, setGradingSheets] = React.useState<TGradingSheetInfo[]>([]);

    const handleClose = () => {
        setAddGradingSheetDialogOpen(false);
    };

    React.useEffect(() => {
        fetch('/api/get-courses')
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setCourses([...data.data])
        })
        .catch(err => {
            console.log(err)
        })
    }, [])

    React.useEffect(() => {
        console.log(userInfo.user?.uid)
    }, [userInfo.user?.uid])

    React.useEffect(() => {
        if(addGradingSheetForm.course && courses) {
            const years:string[] = [];
            const courseDuration = +(courses.filter((e) => e.id == addGradingSheetForm.course)[0].course_duration);
            let i = 1;
            for(i; i <= courseDuration; i++) {
                years.push(String(i));
            }
            setYears([...years]);
            setAddGradingSheetForm({...addGradingSheetForm, subjectInfo: "", year: ""})
        }
    }, [addGradingSheetForm.course, courses])

    React.useEffect(() => {
            fetch('/api/get-subjects')
            .then(response => {
                if(response.ok) return response.json()
            })
            .then(data => {
                setSubjects([...data.data.majorSubjects]);
                setMinorSubjects([...data.data.minorSubjects]);
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    React.useEffect(() => {
            setLoadingGradingSheets(true)
            fetch('/api/get-grading-sheets', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({teacherId: userInfo.user?.uid})
            })
            .then(response => {
                if(response.ok) return response.json()
            })
            .then(data => {
                setGradingSheets([...data.data]);
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                setTimeout(() => {
                   setLoadingGradingSheets(false)
                }, 1000)
            })
    }, [userInfo.user?.uid])

    React.useEffect(() => {
        setAddGradingSheetForm({...addGradingSheetForm, subjectInfo: ''})
    }, [addGradingSheetForm.year])

    React.useEffect(() => {
        if(addGradingSheetForm.schoolYear.from) {
            setAddGradingSheetForm({...addGradingSheetForm, schoolYear: {...addGradingSheetForm.schoolYear, to: String(+addGradingSheetForm.schoolYear.from + 1)}})
        }
    }, [addGradingSheetForm.schoolYear.from]);

    React.useEffect(() => {
        console.log(addGradingSheetForm.schedule.start)
    }, [addGradingSheetForm.schedule.start])
    return(
        <div className={className}> 
            <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={addGradingSheetDialogOpen}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Create Grading Sheet</DialogTitle>
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
                    <AddGradingSheetForm>
                        {
                            submitionError? <Alert sx={{flex: '0 1 100%'}} severity="error">{submitionError}.</Alert> : ""
                        }
                        {
                            formValidationError? <Alert sx={{flex: '0 1 100%'}} severity="error">{formValidationError}.</Alert> : ""
                        }
                        <div className="row">
                            <h4>School year</h4>
                        </div>
                        <div className="row">
                            <TextField
                            disabled={submittingForm}
                            type='number'
                            required
                            label="From"
                            id="filled-size-normal"
                            variant="outlined"
                            size='small'
                            sx={{flex: 1, margin: '15px 0'}}
                            value={addGradingSheetForm.schoolYear.from}
                            onChange={(e) => setAddGradingSheetForm({...addGradingSheetForm, schoolYear: {...addGradingSheetForm.schoolYear, from: e.target.value}})} 
                            />
                            -
                            <TextField
                            disabled={submittingForm}
                            type='number'
                            required
                            label="To"
                            id="filled-size-normal"
                            variant="outlined"
                            size='small'
                            sx={{flex: 1, margin: '15px 0'}} 
                            value={addGradingSheetForm.schoolYear.to}
                            onChange={(e) => setAddGradingSheetForm({...addGradingSheetForm, schoolYear: {...addGradingSheetForm.schoolYear, to: e.target.value}})}
                            />
                        </div>
                        <Divider sx={{width: "100%"}}/>
                        <div className="row">
                            <h4>Course & Subject</h4>
                        </div>
                        <div className="row">
                            <FormControl sx={{ flex: "1", marginTop: "10px" }} size='small'>
                                <InputLabel id="course-label">Course: </InputLabel>
                                <Select
                                    disabled={submittingForm}
                                    labelId="course-label"
                                    id="course"
                                    label="Course:"
                                    sx={{ minWidth: 120 }}
                                    value={addGradingSheetForm.course}
                                    onChange={(e) =>  setAddGradingSheetForm({...addGradingSheetForm, course: e.target.value})}
                                >
                                        <MenuItem value="">
                                            <i>Please select a course</i>
                                        </MenuItem>
                                    {
                                        courses && courses.map(course => (
                                            <MenuItem key={course.id} value={course.id}>
                                                {course.course_title}
                                            </MenuItem>
                                        ))
                                    }
                                </Select> 
                            </FormControl>
                            <FormControl sx={{ maxWidth: 120, flex: 1, marginTop: "10px" }} size='small'>
                                <InputLabel id="course-label">Year: </InputLabel>
                                <Select
                                    disabled={submittingForm}
                                    labelId="course-label"
                                    id="course"
                                    label="Course:"
                                    value={addGradingSheetForm.year}
                                    onChange={(e) =>  setAddGradingSheetForm({...addGradingSheetForm, year: e.target.value})}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {   
                                        years?.map((year) => (
                                            <MenuItem key={year} value={year}>
                                                {year}
                                            </MenuItem>
                                        ))
                                    }
                                </Select> 
                            </FormControl>
                            <FormControl sx={{ maxWidth: 150, flex: 1, marginTop: "10px" }} size='small'>
                                <InputLabel id="course-label">Semester: </InputLabel>
                                <Select
                                    disabled={submittingForm}
                                    labelId="semester-label"
                                    id="semester"
                                    label="Semester:"
                                    value={addGradingSheetForm.semester}
                                    onChange={(e) =>  setAddGradingSheetForm({...addGradingSheetForm, semester: e.target.value})}
                                >
                                    <MenuItem value=""><em>Please Select</em></MenuItem>
                                    <MenuItem value="1">1</MenuItem>
                                    <MenuItem value="2">2</MenuItem>
                                </Select> 
                            </FormControl>
                        </div>
                        <div className="row">
                            <FormControl sx={{ minWidth: 300, flex: "0 1 100%", marginTop: "10px" }} size='small'>
                                <InputLabel id="course-label">Subject: </InputLabel>
                                <Select
                                    disabled={submittingForm}
                                    labelId="course-label"
                                    id="course"
                                    label="Course:"
                                    sx={{ minWidth: 120 }}
                                    value={addGradingSheetForm.subjectInfo}
                                    onChange={(e) =>  setAddGradingSheetForm({...addGradingSheetForm, subjectInfo: e.target.value})}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <ListSubheader>Major Subjects</ListSubheader>
                                    {
                                        subjects && addGradingSheetForm.course && addGradingSheetForm.year && subjects.filter(subject => subject.course_id == addGradingSheetForm.course && subject.year == addGradingSheetForm.year).map(subject => (
                                            <MenuItem key={subject.id} value={subject.subject_info}>{subject.subject_title} ({subject.subject_code})</MenuItem>
                                        ))
                                    }
                                    <ListSubheader>Minor Subjects</ListSubheader>
                                    {
                                        minorSubjects && minorSubjects.map(subject => (
                                            <MenuItem key={subject.id} value={subject.id}>{subject.subject_title} ({subject.subject_code})</MenuItem>
                                        ))
                                    }
                                </Select> 
                            </FormControl>
                        </div>
                        <Divider sx={{width: "100%"}}/>
                        <div className="row">
                            <h4>Schedule</h4>
                        </div>
                        <div className="row">
                            <FormControl sx={{ flex: "1", marginTop: "10px" }} size='small'>
                                <InputLabel id="day-sched-label">Every: </InputLabel>
                                <Select
                                    disabled={submittingForm}
                                    labelId="day-sched-label"
                                    id="day-sched"
                                    label="Every:"
                                    sx={{ minWidth: 120 }}
                                    value={addGradingSheetForm.schedule.every}
                                    onChange={(e) =>  setAddGradingSheetForm({...addGradingSheetForm, schedule: {...addGradingSheetForm.schedule, every: e.target.value}})}
                                >
                                    <MenuItem value=""><em>Please select</em></MenuItem>
                                    <MenuItem value="sunday">Sunday</MenuItem>
                                    <MenuItem value="monday">Monday</MenuItem>
                                    <MenuItem value="tuesday">Tuesday</MenuItem>
                                    <MenuItem value="wednesday">Wednesday</MenuItem>
                                    <MenuItem value="thursday">Thursday</MenuItem>
                                    <MenuItem value="friday">Friday</MenuItem>
                                    <MenuItem value="saturday">Saturday</MenuItem>
                                </Select> 
                            </FormControl>
                        </div>
                        <div className="row">
                            <MobileTimePicker sx={{flex: 1}}
                            value={dayjs(addGradingSheetForm.schedule.start)} 
                            onChange={(e) => setAddGradingSheetForm({...addGradingSheetForm, schedule: {...addGradingSheetForm.schedule, start: e as Dayjs}})}/>
                            <MobileTimePicker 
                            value={dayjs(addGradingSheetForm.schedule.end)} 
                            onChange={(e) => setAddGradingSheetForm({...addGradingSheetForm, schedule: {...addGradingSheetForm.schedule, end: e as Dayjs}})}/>
                        </div>
                    </AddGradingSheetForm>
                </DialogContent>
                <DialogActions>
                    <Button loading={submittingForm} variant="contained" size='large' endIcon={<AddIcon />} 
                    onClick={async () => {
                        try {
                            await addGradingSheetValidationSchema.validate({...addGradingSheetForm});
                            if(formValidationError) setFormValidationError(null);
                            try {
                                setSubmittingForm(true);
                                const response = await fetch('/api/add-grading-sheet', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({...addGradingSheetForm, schedule: { ...addGradingSheetForm.schedule, start: dayjs(addGradingSheetForm.schedule.start).format('HH:mm'), end: dayjs(addGradingSheetForm.schedule.end).format('HH:mm')}, teacherId: userInfo.user?.uid})
                                }) 

                                if(response.ok) {
                                    const responseData = await response.json();

                                    if(submitionError) setSubmitionError(null);
                                    
                                    setGradingSheets([{
                                        id: responseData.data.insertId ,
                                        school_year: `${addGradingSheetForm.schoolYear.from}-${addGradingSheetForm.schoolYear.to}`,
                                        year: addGradingSheetForm.year,
                                        semester: addGradingSheetForm.semester,
                                        course_title: courses.filter(course => course.id == addGradingSheetForm.course)[0].course_title,
                                        subject_title: [...subjects, ...minorSubjects].filter(subject => subject.subject_info == addGradingSheetForm.subjectInfo)[0].subject_title,
                                        subject_code: [...subjects, ...minorSubjects].filter(subject => subject.subject_info == addGradingSheetForm.subjectInfo)[0].subject_code
                                    }, ...gradingSheets])
                                    setAddGradingSheetForm({...addGradingSheetDefaultFormValues});
                                    setSubmitionSuccess(true);
                                    setAddGradingSheetDialogOpen(false)
                                    
                                } else {
                                    throw new Error("Server Error")
                                }
                            }
                            catch(err) {
                                console.log(err)
                                setSubmitionError("Failed to add course");
                            }
                            finally {
                                setSubmittingForm(false)
                            }
                        }
                        catch (err: any) {
                            setFormValidationError(err.errors? err.errors : 'Please check your input properly')
                        }
                    }}>Create</Button>
                </DialogActions>
            </BootstrapDialog>
            <Paper className='paper' elevation={6}>
                <div className="content-head">
                    <h2>Grading Sheets</h2>
                    <Button variant="contained" startIcon={<AddIcon />} sx={{marginLeft: 'auto'}} onClick={() => setAddGradingSheetDialogOpen(true)}>
                        Create Grading Sheet
                    </Button>
                    <h5 style={{marginLeft: '15px'}}>Total: {gradingSheets.length}</h5>
                </div>
                <div className="content-body">
                    {
                        loadingGradingSheets? <>
                            <Skeleton variant="rounded" width={"100%"} height={200} />
                            <Skeleton variant="rounded" width={"100%"} height={200} />
                            <Skeleton variant="rounded" width={"100%"} height={200} />
                            <Skeleton variant="rounded" width={"100%"} height={200} />
                            <Skeleton variant="rounded" width={"100%"} height={200} />
                        </> : <>
                            {
                                gradingSheets.length? <>
                                    {
                                        gradingSheets.map(gradingSheet => (
                                            <GradingSheetItem key={gradingSheet.id}>
                                                 <div className="img-container">
                                                    <Image src={"/circuit.png"} alt="logo" width={500} height={50} style={{width: "auto", height: '100%'}}/>
                                                </div>
                                                <div className="title">
                                                    <TextSnippetIcon />
                                                    <h4>{gradingSheet.subject_title} ({gradingSheet.subject_code})</h4>
                                                </div> 
                                                <div className="bottom-container">
                                                    <Chip
                                                    color='info'
                                                    label={gradingSheet.course_title}
                                                    size='small'
                                                    />
                                                    <Chip
                                                    label={`SY ${gradingSheet.school_year}`}
                                                    size='small'
                                                    />
                                                    <Chip
                                                    label={`Year Level: ${gradingSheet.year}`}
                                                    size='small'
                                                    />
                                                    <Chip
                                                    label={`Semester: ${gradingSheet.semester}`}
                                                    size='small'
                                                    />
                                                    <IconButton aria-label="delete" size="large" color='primary' sx={{marginLeft: 'auto'}}
                                                    onClick={() => {
                                                        router.push(`./grading-sheets/sheet/${gradingSheet.id}`)
                                                    }}>
                                                        <ArrowForwardIosIcon />
                                                    </IconButton>
                                                </div>
                                            </GradingSheetItem>
                                        ))
                                    }
                                </> : <div className="nodata">
                                    <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                    <h1>No data to Display</h1>
                                </div>
                            }
                        </>
                    }
                </div>
            </Paper>
            <Snackbar open={submitionSuccess} autoHideDuration={6000} onClose={() => setSubmitionSuccess(false)}>
                <Alert
                onClose={() => setSubmitionSuccess(false)}
                severity="success"
                variant="standard"
                sx={{ width: '100%' }}
                >
                Grading sheet crffeated successfully!
                </Alert>
            </Snackbar>
        </div>  
    )
}

const GradingSheetsPageContent = styled(GradingSheetsPageContentFC)`
    && {
        display: flex;
        flex: 0 1 100%;

        > .paper {
            display: flex;
            flex: 0 1 100%;
            height: 100%;
            flex-wrap: wrap;
            margin: 5px;
            padding: 20px;

            > .content-head {
                display: flex;
                flex: 0 1 100%;
                flex-wrap: wrap;
                padding-bottom: 10px;
                align-items: center;
                border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#565656" : "#cfcfcf"};
            }

            .content-body {
                /* display: flex; */
                flex: 0 1 100%;
                padding-top: 10px;
                flex-wrap: wrap;
                gap: 20px 50px;
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));

                > .nodata {
                    display: flex;
                    flex: 0 1 100%;
                    height: 80vh;
                    align-items: center;
                    justify-content: center;
                    background-color: ${({theme}) => theme.palette.mode == "dark"? "#565656" : "#e9e9e9"};
                    flex-direction: column;
                }
            }
        }
    }
`;

export default GradingSheetsPageContent;