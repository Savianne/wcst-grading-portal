"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { IStyledFC } from '@/app/types/IStyledFC';
import NestedTable from './SampleNestedTable';
import GradingSheetTable from './GradingSheetTable';

//Main-tab Panels
import StudentsTabPanel from './StudentsTabPanel';

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
    ListSubheader,
    Tab,
    Tabs,
    CircularProgress
} from "@mui/material";

type TGradingSheetInfo = {
    id: string;
    school_year: string;
    year: string;
    semester: string;
    course_title: string;
    subject_title: string;
    subject_code: string;
}

interface ISheet extends IStyledFC {
    sheetId: string
}

const SheetFC: React.FC<ISheet> = ({className, sheetId}) => {
    const [mainTab, setMainTab] = React.useState<"students" | "prelim" | "midterm" | "prefinal" | "final">("students");
    const [gradingSheet, setGradingSheet] = React.useState<TGradingSheetInfo | null>(null);
    const [loadingGradingSheet, setLoadingGradingSheet] = React.useState(false);

    const handleMainTabChange = (event: React.SyntheticEvent, newValue: typeof mainTab) => {
        setMainTab(newValue);
    };

    React.useEffect(() => {
        setLoadingGradingSheet(true)
        fetch('/api/get-grading-sheet', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setGradingSheet({...data.data});
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setTimeout(() => {
                setLoadingGradingSheet(false)
            }, 1000)
        })
    }, [])
    
    return(
        <div className={className}> 
            <div className='container'>
                {
                    loadingGradingSheet? <>
                    <Box sx={{display: "flex", flex: "0 1 100%", height: "400px", alignItems: 'center', justifyContent: "center"}}>
                        <CircularProgress /> <h3 style={{marginLeft: "10px"}}>Please wait while loading...</h3>
                    </Box>
                    </> : <>
                        <div className="row content-header">
                            <div className="sheet-info">
                                <div className="title">
                                    <h2>{gradingSheet?.subject_title} ({gradingSheet?.subject_code})</h2>
                                </div>
                                <div className="chips">
                                    <Chip
                                    color='info'
                                    label={gradingSheet?.course_title}
                                    size='small'
                                    />
                                    <Chip
                                    label={`SY ${gradingSheet?.school_year}`}
                                    size='small'
                                    />
                                    <Chip
                                    label={`Year Level: ${gradingSheet?.year}`}
                                    size='small'
                                    />
                                    <Chip
                                    label={`Semester: ${gradingSheet?.semester}`}
                                    size='small'
                                    />
                                </div>
        
                            </div>
                        </div>
                        <div className="content-body">
                            <div className="main-tab-area">
                                <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={mainTab}
                                onChange={handleMainTabChange}
                                aria-label="Vertical tabs example"
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                                >
                                    <Tab label="Students" value="students"/>
                                    <Tab label="Prelim" value="prelim"/>
                                    <Tab label="Midterm" value="midterm"/>
                                    <Tab label="Prefinal" value="prefinal"/>
                                    <Tab label="Final" value="final"/>
                                </Tabs>
                            </div>
                            <Paper className='main-tab-content' elevation={6}>
                                {
                                    mainTab == "students"? <>
                                        <StudentsTabPanel gradingSheetId={sheetId} />
                                    </> : ""
                                }
                                {
                                    mainTab == "prelim"? <>
                                       <GradingSheetTable />
                                    </> : ""
                                }
                            </Paper>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

const Sheet = styled(SheetFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        
        > .container {
            display: flex;
            flex: 0 1 100%;
            flex-wrap: wrap;
            margin: 5px;
            padding: 20px 0;

            > .row {
                display: flex;
                flex: 0 1 100%;
            }

            > .content-header > .sheet-info {
                display: flex;
                gap: 5px;
                flex-wrap: wrap;

                > .title {
                    flex: 0 1 100%;
                }

                > .chips {
                    display: flex;
                    gap: 5px;
                }
            }

            > .content-body {
                display: flex;
                flex: 0 1 100%;
                margin-top: 50px;

                > .main-tab-content {
                    display: flex;
                    flex: 0 1 100%;
                    padding: 20px;
                }
            }
        }
    }
`

export default Sheet;