"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import { useRouter, usePathname } from "next/navigation";
import Image from 'next/image';
import { string, number, object } from 'yup';

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
} from "@mui/material";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

//MUI Icons
import AddIcon from '@mui/icons-material/Add';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddSubjectForm = styled(Box)`
    && {
        display: flex;
        flex: 0 1 100%;
        flex-wrap: wrap;
        align-items: center;

        > .row {
            display: flex;
            flex: 0 1 100%;
            align-items: center;
        }
    }
`

const SubjectItem = styled(Paper)`
    && {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        padding: 20px;
        border-radius: 8px;
        border-left: 5px solid #2196F3;
        overflow: hidden;
        align-items: center;

        > .img-container {
            width: auto;
            height: 90px;
            position: absolute;
            top: -9px;
            left: 0;
        }

        > h3 {
            z-index: 1;
            margin-right: 10px;
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
    year: string
}

type TMinorSubjectInfo = {
    id: string;
    subject_title: string,
    subject_code: string,
}

const addSubjectValidationScheme = object({
    course: string().required(),
    subjectTitle: string().required().min(5).max(30),
    subjectCode: string().required().min(2).max(20),
    year: string().required()
})

const addMinorSubjectValidationScheme = object({
    subjectTitle: string().required().min(5).max(30),
    subjectCode: string().required().min(2).max(20),
})

const SubjectsPageContentFC: React.FC<IStyledFC> = ({className}) => {
    const [courses, setCourses] = React.useState<TCourseInfo[]>([]);
    const [subjects, setSubjects] = React.useState<TSubjectInfo[]>([]);
    const [minorSubjects, setMinorSubjects] = React.useState<TMinorSubjectInfo[]>([]);
    const [category, setCategory] = React.useState("major");
    const [addSubjectFormValues, setAddSubjectFormValues] = React.useState({
        course: '',
        subjectTitle:'',
        subjectCode: '',
    });
    const [years, setYears] = React.useState<string[] | null>(null);
    const [year, setYear] = React.useState("");
    const [addSubjectValidationError, setAddSubjectValidationError] = React.useState<null | string>(null);
    const [submitionError, setSubmitionError] = React.useState<null | string>(null);
    const [submitionSuccess, setSubmitionSuccess] = React.useState(false);
    const [submittingForm, setSubmittingForm] = React.useState(false)
    const [loadingSubjects, setLoadingSubjects] = React.useState(true);
    const [tab, setTab] = React.useState("major");
    const [addSubjectDialogOpen, setAddSubjectDialogOpen] = React.useState(false);

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setTab(newValue);
    };

    const handleClose = () => {
        setAddSubjectDialogOpen(false);
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
        setLoadingSubjects(true)
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
        .finally(() => {
            setTimeout(() => {
               setLoadingSubjects(false)
            }, 1000)
        })
    }, [])

    React.useEffect(() => {
        if(addSubjectFormValues.course && courses) {
            const years:string[] = [];
            const courseDuration = +(courses.filter((e) => e.id == addSubjectFormValues.course)[0].course_duration);
            console.log(courseDuration)
            let i = 1;
            for(i; i <= courseDuration; i++) {
                years.push(String(i));
            }
            setYears([...years]);
            setYear('');
        }
    }, [addSubjectFormValues.course, courses])

    return(
        <div className={className}>
            <BootstrapDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={addSubjectDialogOpen}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Add Subject</DialogTitle>
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
                    <AddSubjectForm>
                        {
                            submitionError? <Alert sx={{flex: '0 1 100%'}} severity="error">{submitionError}.</Alert> : ""
                        }
                        {
                            addSubjectValidationError? <Alert sx={{flex: '0 1 100%'}} severity="error">{addSubjectValidationError}.</Alert> : ""
                        }
                        {
                            courses? <> 
                                <div className="row">
                                    <FormControl sx={{ minWidth: 120, flex: 1, marginTop: "10px" }} size='small'>
                                        <InputLabel id="course-label">Category: </InputLabel>
                                        <Select
                                            disabled={submittingForm}
                                            labelId="course-label"
                                            id="course"
                                            label="Course:"
                                            sx={{ minWidth: 120 }}
                                            value={category}
                                            onChange={(e) =>  setCategory(e.target.value)}
                                        >
                                            <MenuItem value="major">Major</MenuItem>
                                            <MenuItem value="minor">Minor</MenuItem>
                                        </Select> 
                                    </FormControl>
                                </div>
                                    {
                                        category == "major"? 
                                        <div className="row">
                                            <FormControl sx={{ minWidth: 120, flex: 1, marginTop: "10px" }} size='small'>
                                                <InputLabel id="course-label">Course: </InputLabel>
                                                <Select
                                                    disabled={submittingForm}
                                                    labelId="course-label"
                                                    id="course"
                                                    label="Course:"
                                                    sx={{ minWidth: 120 }}
                                                    value={addSubjectFormValues.course}
                                                    onChange={(e) => setAddSubjectFormValues({...addSubjectFormValues, course: e.target.value})}
                                                >
                                                    <MenuItem value="">
                                                        <em>None</em>
                                                    </MenuItem>
                                                    {courses.map((option) => (
                                                        <MenuItem key={option.id} value={option.id}>
                                                            {option.course_title}
                                                        </MenuItem>
                                                    ))}
                                                </Select> 
                                            </FormControl>
                                            <FormControl sx={{ minWidth: 200, marginTop: "10px", marginLeft: "10px"}} size='small' required>
                                                <InputLabel id="course-label">Year </InputLabel>
                                                <Select
                                                    required
                                                    disabled={submittingForm}
                                                    labelId="year-label"
                                                    id="year"
                                                    label="Year"
                                                    sx={{ minWidth: 120 }}
                                                    value={year}
                                                    onChange={(e) => setYear(e.target.value)}
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
                                        </div> : ''
                                    }
                                <div className="row">
                                    <TextField
                                    disabled={submittingForm}
                                    required
                                    label="Subject Title"
                                    id="filled-size-normal"
                                    variant="outlined"
                                    size='small'
                                    sx={{flex: 1, margin: '15px 0'}}
                                    value={addSubjectFormValues.subjectTitle}
                                    onChange={(e) => setAddSubjectFormValues({...addSubjectFormValues, subjectTitle: e.target.value})}
                                    />
                                    <TextField
                                    disabled={submittingForm}
                                    required
                                    label="Subject Code"
                                    type='string'
                                    id="filled-size-normal"
                                    variant="outlined"
                                    size='small'
                                    sx={{flex: "0 1 200px", margin: '15px 0 15px 10px'}}
                                    value={addSubjectFormValues.subjectCode}
                                    onChange={(e) => setAddSubjectFormValues({...addSubjectFormValues, subjectCode: e.target.value})}
                                    />                                    
                                </div>
                            </> : ''
                        }
                    </AddSubjectForm>
                </DialogContent>
                <DialogActions>
                    <Button loading={submittingForm} variant="contained" size='large' endIcon={<AddIcon />}
                    onClick={async () => {
                        try {
                            if(category == "major") await addSubjectValidationScheme.validate({...addSubjectFormValues, year});
                            if(category == "minor") await addMinorSubjectValidationScheme.validate({subjectTitle: addSubjectFormValues.subjectTitle, subjectCode: addSubjectFormValues.subjectCode});

                            if(addSubjectValidationError) setAddSubjectValidationError(null);

                            try {
                                setSubmittingForm(true);
                                const response = await fetch('/api/add-subject', {
                                    method: "POST",
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({...addSubjectFormValues, year, category})
                                }) 

                                if(response.ok) {
                                    const responseData = await response.json();

                                    if(submitionError) setSubmitionError(null);

                                    if(category == "major") {
                                        setSubjects([{id: responseData.data.insertID, subject_title: addSubjectFormValues.subjectTitle, subject_code: addSubjectFormValues.subjectCode, course_id: addSubjectFormValues.course, year},...subjects]);
                                    } else {
                                        setMinorSubjects([{id: responseData.data.insertID, subject_title: addSubjectFormValues.subjectTitle, subject_code: addSubjectFormValues.subjectCode},...minorSubjects]);
                                    }
                                    setAddSubjectFormValues({subjectTitle: '', subjectCode: '', course: ''});
                                    setYear('');
                                    setSubmitionSuccess(true);
                                    
                                } else {
                                    throw new Error("Server Error")
                                }
                            }
                            catch {
                                setSubmitionError("Failed to add course");
                            }
                            finally {
                                setSubmittingForm(false)
                            }
                        }
                        catch(err: any) {
                            setAddSubjectValidationError(err.errors? err.errors : 'Please check your input properly')
                        }
                    }}>Add Subject</Button>
                </DialogActions>
            </BootstrapDialog>
            <Paper className='paper' elevation={6}>
                <div className="content-head">
                    <div className="row">
                        <h2>Subjects</h2>
                        <Button variant="contained" startIcon={<AddIcon />} sx={{marginLeft: 'auto'}} onClick={() => setAddSubjectDialogOpen(true)}>
                            Add Subject
                        </Button>
                        <h5 style={{marginLeft: '15px'}}>Total: {subjects.length}</h5>
                    </div>
                </div>
                <div className="content-body">
                    <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                        <Tab label="Major Subjects" value={"major"}/>
                        <Tab label="Minor Subjects" value={"minor"} />
                    </Tabs>
                    {
                        loadingSubjects? <>
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                        </> : <>
                            {
                                tab == "major"? <>
                                    {
                                        subjects.length? <>
                                            {
                                                subjects.map(subject => (
                                                    <SubjectItem key={subject.id}>
                                                        <div className="img-container">
                                                            <Image src={"/circuit.png"} alt="logo" width={500} height={50} style={{width: "auto", height: '100%'}}/>
                                                        </div>
                                                        <h3>{subject.subject_title}</h3>
                                                        <Chip
                                                        label={`${subject.subject_code}`}
                                                        size='small'
                                                        color='primary'
                                                        />
                                                        <Chip
                                                        sx={{marginLeft: '5px'}}
                                                        label={`${courses.filter(c => c.id == subject.course_id)[0].course_title}`}
                                                        size='small'
                                                        />
                                                        <Chip
                                                        sx={{marginLeft: '5px'}}
                                                        label={`Year ${subject.year}`}
                                                        size='small'
                                                        />
                                                    </SubjectItem>
                                                ))
                                            }
                
                                        </> : <div className="nodata">
                                            <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                            <h1>No data to Display</h1>
                                        </div>
                                    }
                                </> : <>
                                    {
                                        minorSubjects.length? <>
                                            {
                                                minorSubjects.map(subject => (
                                                    <SubjectItem key={subject.id}>
                                                        <div className="img-container">
                                                            <Image src={"/circuit.png"} alt="logo" width={500} height={50} style={{width: "auto", height: '100%'}}/>
                                                        </div>
                                                        <h3>{subject.subject_title}</h3>
                                                        <Chip
                                                        label={`${subject.subject_code}`}
                                                        size='small'
                                                        color='primary'
                                                        />
                                                    </SubjectItem>
                                                ))
                                            }
                
                                        </> : <div className="nodata">
                                            <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                            <h1>No data to Display</h1>
                                        </div>
                                    }
                                </>
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
                New Subject Added!
                </Alert>
            </Snackbar>
        </div>
    )
}

const SubjectsPageContent = styled(SubjectsPageContentFC)`
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
                border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#565656" : "#cfcfcf"};

                > .row {
                    display: flex;
                    flex: 0 1 100%;
                    align-items: center;
                }
            }

            .content-body {
                display: flex;
                flex: 0 1 100%;
                padding-top: 10px;
                flex-wrap: wrap;
                gap: 10px;
                border-top: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#565656" : "#cfcfcf"};

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
`

export default SubjectsPageContent;