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
    Skeleton
} from "@mui/material";

//MUI Icons
import AddIcon from '@mui/icons-material/Add';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import TimelapseIcon from '@mui/icons-material/Timelapse';

const CourseItem = styled(Paper)`
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

const addCourseValidationScheme = object({
    courseTitle: string().required().min(10),
    courseDuration: number().required("Course Duration is a required field").min(1).max(10)
})

const CoursesPageContentFC: React.FC<IStyledFC> = ({className}) => {
    const [courses, setCourses] = React.useState<TCourseInfo[]>([]);
    const [addCourseFormValues, setAddCourseFormValues] = React.useState({
        courseTitle: '',
        courseDuration: ''
    })
    const [addCourseValidationError, setAddCourseValidationError] = React.useState<null | string>(null);
    const [submitionError, setSubmitionError] = React.useState<null | string>(null);
    const [submitionSuccess, setSubmitionSuccess] = React.useState(false);
    const [submittingForm, setSubmittingForm] = React.useState(false)
    const [loadingCourses, setLoadingCourses] = React.useState(true);

    React.useEffect(() => {
        setLoadingCourses(true)
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
        .finally(() => {
            setTimeout(() => {
                setLoadingCourses(false)
            }, 1000)
        })
    }, [])

    return(
        <div className={className}>
            <Paper className='paper' elevation={6}>
                <div className="content-head">
                    <div className="row">
                        <h2>Courses</h2>
                        <h5 style={{marginLeft: 'auto'}}>Total: {courses.length}</h5>
                    </div>
                    {
                        submitionError? <Alert sx={{flex: '0 1 100%'}} severity="error">{submitionError}.</Alert> : ""
                    }
                    {
                        addCourseValidationError? <Alert sx={{flex: '0 1 100%'}} severity="error">{addCourseValidationError}.</Alert> : ""
                    }
                    <div className="row">
                        <TextField
                        disabled={submittingForm}
                        required
                        label="Course Title"
                        id="filled-size-normal"
                        variant="outlined"
                        size='small'
                        value={addCourseFormValues.courseTitle}
                        onChange={(e) => setAddCourseFormValues({...addCourseFormValues, courseTitle: e.target.value})}
                        sx={{flex: 1, margin: '15px 0'}}
                        />
                        <TextField
                        disabled={submittingForm}
                        required
                        label="Course Duration (Years)"
                        type='number'
                        id="filled-size-normal"
                        variant="outlined"
                        size='small'
                        value={addCourseFormValues.courseDuration}
                        onChange={(e) => setAddCourseFormValues({...addCourseFormValues, courseDuration: e.target.value})}
                        sx={{flex: "0 1 250px", margin: '15px 0 15px 10px'}}
                        />
                        <Divider orientation='vertical' variant='middle' sx={{height: '40px', margin: '10px'}}/>
                        <Button variant="contained" size='large' endIcon={<AddIcon />}
                        loading={submittingForm}
                        onClick={async () => {
                            try {
                                await addCourseValidationScheme.validate(addCourseFormValues);

                                if(addCourseValidationError) setAddCourseValidationError(null);

                                try {
                                    setSubmittingForm(true)
                                    const response = await fetch('/api/add-course', {
                                        method: "POST",
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({...addCourseFormValues})
                                    }) 

                                    if(response.ok) {
                                        const responseData = await response.json();
                                        if(submitionError) setSubmitionError(null);

                                        setCourses([{id: responseData.data.insertID, course_title: addCourseFormValues.courseTitle, course_duration: addCourseFormValues.courseDuration},...courses]);
                                        setAddCourseFormValues({courseDuration: '', courseTitle: ''})
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
                                setAddCourseValidationError(err.errors? err.errors : 'Please check your input properly')
                            }
                        }}>Add Course</Button>
                    </div>
                </div>
                <div className="content-body">
                    {
                        loadingCourses? <>
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                            <Skeleton variant="rounded" width={"100%"} height={70} />
                        </> : <>
                        {
                            courses.length? <>
                                {
                                    courses.map(course => (
                                        <CourseItem key={course.id}>
                                            <div className="img-container">
                                                <Image src={"/circuit.png"} alt="logo" width={500} height={50} style={{width: "auto", height: '100%'}}/>
                                            </div>
                                            <h3>{course.course_title}</h3>
                                            <Chip
                                            label={`${course.course_duration} Year/s Course`}
                                            icon={<TimelapseIcon />}
                                            size='small'
                                            color='primary'
                                            />
                                        </CourseItem>
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
                New Course Added!
                </Alert>
            </Snackbar>
        </div>
    )
}

const CoursesPageContent = styled(CoursesPageContentFC)`
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
                margin-top: 10px;
                flex-wrap: wrap;
                gap: 10px;

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

export default CoursesPageContent;