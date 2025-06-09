"use client"
import { styled } from '@mui/material/styles';
import React from "react";
import { IStyledFC } from '@/app/types/IStyledFC';
import IGradingSystemConfig from '@/app/types/grading-system-config';
import areObjectsMatching from '@/app/helpers/utils/areObjectMatching';
import * as yup from 'yup';

import { 
    Button,
    Box,
    Avatar,
    MenuItem,
    ListItemIcon,
    Paper,
    TextField,
    Divider,
    InputAdornment,
    Alert,
    Snackbar
} from "@mui/material";

//MUI Icons
import UpdateIcon from '@mui/icons-material/Update';

const gradingSystemConfigValidationSchema = yup.object({
    terms: yup.object({
        prelim: yup.number().required().moreThan(0, 'Prelim must be greater than 0'),
        midterm: yup.number().required().moreThan(0, 'Midterm must be greater than 0'),
        prefinal: yup.number().required().moreThan(0, 'Prefinal must be greater than 0'),
        final: yup.number().required().moreThan(0, 'Final must be greater than 0'),
    }).required(),

    components: yup.object({
        averageQuiz: yup.number().required().moreThan(0, 'Average quiz must be greater than 0'),
        assignmentsAndActivities: yup.number().required().moreThan(0, 'Assignments must be greater than 0'),
        classStanding: yup.number().required().moreThan(0, 'Class standing must be greater than 0'),
        termtest: yup.number().required().moreThan(0, 'Term test must be greater than 0'),
    }).required(),

    componentsItemTransmutationScale: yup.object({
        baseGrade: yup.number().required().moreThan(0, 'Base grade must be greater than 0'),
    }).required(),

    attendanceReversePenalty: yup.number().required().moreThan(0, 'Attendance penalty must be greater than 0'),

    classStanding: yup.object({
        attendance: yup.number().required().moreThan(0, 'Attendance score must be greater than 0'),
        behaviour: yup.number().required().moreThan(0, 'Behaviour score must be greater than 0'),
        recitation: yup.number().required().moreThan(0, 'Recitation score must be greater than 0'),
    }).required(),
});

const GradingSystemPageContentFC: React.FC<IStyledFC> = ({className}) => {

    const [gradingSystemConfig, setGradingSystemConfig] = React.useState<null | IGradingSystemConfig>(null);
    const [updatedGradingSystemConfig, setUpdatedGradingSystemConfig] = React.useState<null | IGradingSystemConfig>(null)
    const [updateConfig, setUpdateConfig] = React.useState(false);
    const [updateDataValidationError, setUpdateDataValidationError] = React.useState<null | string>(null);
    const [hasDataChanges, setHasDataChanges] = React.useState(false);
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [submitionSuccess, setSubmitionSuccess] = React.useState(false);
    const [submitionError, setSubmitionError] = React.useState<null | string>(null);

    React.useEffect(() => {
        fetch("/api/get-grading-system")
        .then(response => {
            if(response.ok) return response.json();
            throw new Error("Failed to fetch data")
        })
        .then(data => {
            setGradingSystemConfig(data.data);
            setUpdatedGradingSystemConfig(data.data);
        })
        .catch(err => alert("Failed to fetch"))
    }, []);

     React.useEffect(() => {
            setHasDataChanges(!areObjectsMatching({
                attendanceReversePenalty: gradingSystemConfig?.attendanceReversePenalty,
                ...gradingSystemConfig?.terms,
                ...gradingSystemConfig?.components,
                ...gradingSystemConfig?.classStanding,
                ...gradingSystemConfig?.componentsItemTransmutationScale
            }, {
                attendanceReversePenalty: updatedGradingSystemConfig?.attendanceReversePenalty,
                ...updatedGradingSystemConfig?.terms,
                ...updatedGradingSystemConfig?.components,
                ...updatedGradingSystemConfig?.classStanding,
                ...updatedGradingSystemConfig?.componentsItemTransmutationScale
            }))
        }, [updatedGradingSystemConfig, gradingSystemConfig])

    return(
        <div className={className}>  
            <Paper className='paper'>
                {
                    gradingSystemConfig && updatedGradingSystemConfig? <>
                    <div className="data-group-container">
                        <h1>Terms</h1>
                        <Divider orientation='horizontal' sx={{width: "100%", margin: '0 20px'}} />
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Prelim</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.terms.prelim} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, terms: {...updatedGradingSystemConfig.terms, prelim: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}
                                />
                            </div>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Midterm</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1, minWidth: '120px',}} value={updatedGradingSystemConfig.terms.midterm} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, terms: {...updatedGradingSystemConfig.terms, midterm: e.target.value}})
                                }} 
                                    slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Prefinal</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.terms.prefinal} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, terms: {...updatedGradingSystemConfig.terms, prefinal: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Final</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.terms.final} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, terms: {...updatedGradingSystemConfig.terms, final: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className="data-group-container">
                        <h1>Components</h1>
                        <Divider orientation='horizontal' sx={{width: "100%", margin: '0 20px'}} />
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Average Quiz</h3>
                            </div>
                            <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.components.averageQuiz} 
                            onChange={(e) => {
                                setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, components: {...updatedGradingSystemConfig.components, averageQuiz: e.target.value}})
                            }} 
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                },
                            }}/>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Assignments & Activities</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.components.assignmentsAndActivities} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, components: {...updatedGradingSystemConfig.components, assignmentsAndActivities: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Class Standing</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.components.classStanding} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, components: {...updatedGradingSystemConfig.components, classStanding: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Term Test</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.components.termtest} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, components: {...updatedGradingSystemConfig.components, termtest: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className="data-group-container">
                        <h1>Class Standing</h1>
                        <Divider orientation='horizontal' sx={{width: "100%", margin: '0 20px'}} />
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Attendance</h3>
                            </div>
                            <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.classStanding.attendance} 
                            onChange={(e) => {
                                setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, classStanding: {...updatedGradingSystemConfig.classStanding, attendance: e.target.value}})
                            }} 
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                },
                            }}/>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Behaviour</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.classStanding.behaviour} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, classStanding: {...updatedGradingSystemConfig.classStanding, behaviour: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Recitation</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.classStanding.recitation} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, classStanding: {...updatedGradingSystemConfig.classStanding, recitation: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className="data-group-container">
                        <h1>Transmulation Scale per component item</h1>
                        <Divider orientation='horizontal' sx={{width: "100%", margin: '0 20px'}} />
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Base Grade</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig?.componentsItemTransmutationScale.baseGrade} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, componentsItemTransmutationScale: {baseGrade: e.target.value}})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                    </div>
                    <div className="data-group-container">
                        <h1>Attendance Reverse penalty</h1>
                        <Divider orientation='horizontal' sx={{width: "100%", margin: '0 20px'}} />
                        <div className="data-group">
                            <div className="col col1">
                                <h3>Penalty / per Absent</h3>
                            </div>
                            <div className="col col2">
                                <TextField type='number' required disabled={ isUpdating || !updateConfig} id="filled-basic" variant="outlined" sx={{flex: 1,minWidth: '120px',}} value={updatedGradingSystemConfig.attendanceReversePenalty} 
                                onChange={(e) => {
                                    setUpdatedGradingSystemConfig({...updatedGradingSystemConfig, attendanceReversePenalty: e.target.value})
                                }} 
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    },
                                }}/>
                            </div>
                        </div>
                        <Divider orientation='horizontal' sx={{width: "100%", margin: '0 20px'}} />
                    </div>
                    {
                        submitionError? <Alert sx={{flex: '0 1 100%'}} severity="error">{submitionError}.</Alert> : ""
                    }
                    {
                        updateDataValidationError? <div className="data-group-container">
                            <Alert variant="filled" severity="error" sx={{flex: "0 1 100%"}}>{updateDataValidationError}</Alert>
                        </div>  : ''
                    }
                    {
                        updateConfig?  <div className="button-container">
                            <Button
                            disabled={!hasDataChanges}
                            loading={isUpdating}
                            startIcon={<UpdateIcon />} variant='contained' color='primary' size='large' 
                            onClick={async () =>{
                                try {
                                    setIsUpdating(true)
                                    await gradingSystemConfigValidationSchema.validate(updatedGradingSystemConfig);
                                    try {
                                        const response =  await fetch('/api/update-grading-system', {
                                            method: "POST",
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({update: JSON.stringify(updatedGradingSystemConfig)})
                                        });

                                        if(!response.ok) throw new Error(`Server error: ${response.status}`);
                                        if(submitionError) setSubmitionError(null);
                                        setGradingSystemConfig({...updatedGradingSystemConfig});
                                        setSubmitionSuccess(true);
                                    }
                                    catch(err) {
                                        setSubmitionError("Failed to update grading system");
                                    }
                                    finally {
                                        setIsUpdating(false)
                                    }

                                }
                                catch(err:any) {
                                    setUpdateDataValidationError(err.errors? err.errors : 'Please check your input properly');
                                }
                            }}>Submit Update</Button>
                            <Divider orientation='vertical' sx={{ margin: '0 10px'}} />
                            <Button color='primary' size='large' onClick={() => {
                                setUpdatedGradingSystemConfig({...gradingSystemConfig});
                                setUpdateConfig(false);
                                setUpdateDataValidationError(null)
                            }}>Cancel</Button>
                        </div> :  <div className="button-container">
                            <Button startIcon={<UpdateIcon />} variant='contained' color='primary' size='large' onClick={() => setUpdateConfig(true)}>Update</Button>
                        </div>
                    }
                    </> : ""
                }
            </Paper>
            <Snackbar open={submitionSuccess} autoHideDuration={6000} onClose={() => setSubmitionSuccess(false)}>
                <Alert
                onClose={() => setSubmitionSuccess(false)}
                severity="success"
                variant="standard"
                sx={{ width: '100%' }}
                >
                Update Success!
                </Alert>
            </Snackbar>
        </div>
    )
};

const GradingSystemContent = styled(GradingSystemPageContentFC)`
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
            justify-content: center;

            > .data-group-container {
                display: flex;
                flex: 0 1 800px;
                flex-wrap: wrap;
                justify-content: center;
                gap: 15px;
                margin-top: 70px;

                > h1 {
                    text-align: center;
                }

                > .data-group {
                    display: flex;
                    flex: 0 1 100%;
                    gap: 20px;
    
                    
                    > .col {
                        display: flex;
                        flex: 1;
                        align-items: center;
                        
                        > h3 {
                            text-align: center;
                        }
                    }
    
                    > .col1 {
                        justify-content: right;
                        flex: 0 0 150px;
                    }
    
                    > .col2 {
                        text-align: left;
                    }
                }
            }
       
            > .button-container {
                display: flex;
                flex: 0 1 100%;
                justify-content: center;
                padding: 40px 0;
            }
        }

    }
`;

export default GradingSystemContent;