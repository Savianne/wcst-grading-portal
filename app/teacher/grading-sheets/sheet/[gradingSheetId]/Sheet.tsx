"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import Image from 'next/image';
import { IStyledFC } from '@/app/types/IStyledFC';
import { TComponentItem } from '@/app/types/component-item-type';
import NestedTable from './SampleNestedTable';
import { useErrorAlert } from '@/app/context/PageErrorAlertProvider';
import { TStudentObtainedScore } from '@/app/types/TStudentObtainedScore';
import IGradingSystemConfig from '@/app/types/grading-system-config';
import TclassStanding from '@/app/types/TClassStanding';
import TSheetAttendanceDate from '@/app/types/grading-sheet-attendance-date-types';
import TAttendanceRecord from '@/app/types/attendance-record-type';

//Main-tab Panels
import StudentsTabPanel from './StudentsTabPanel';
import TermsTabPannel from './TermsTabPanel';

//MUI Components
import { 
    Box,
    Paper,
    Chip,
    Tab,
    Tabs,
    CircularProgress
} from "@mui/material";

//MUI Icons
import TodayIcon from '@mui/icons-material/Today';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export interface IGradingSheetStudent {
    student_id: string;
    grading_sheet_id: string;
    first_name: string;
    middle_name: string;
    sex: string;
    date_of_birth: string;
    surname: string
    suffix: string | null;
    image_path: string | null;
}

type TGradingSheetInfo = {
    id: string;
    school_year: string;
    year: string;
    semester: string;
    course_title: string;
    subject_title: string;
    subject_code: string;
    every: string;
    start: string;
    end: string
}

interface ISheet extends IStyledFC {
    sheetId: string
}

type TTermItems = {
    ALL: TComponentItem[],
    AQ: TComponentItem[],
    AA: TComponentItem[],
    TT: TComponentItem[]
}

interface ISheetContext {
    students: IGradingSheetStudent[],
    gradingSystem: IGradingSystemConfig,
    gradingSheet: TGradingSheetInfo,
    term: "prelim" | "midterm" | "prefinal" | "final",
    studentsScores: TStudentObtainedScore[],
    componentItems: TComponentItem[],
    classStandingGrades: TclassStanding[],
    attendanceRecords: TAttendanceRecord[],
    sheetAttendanceDatePerTerm: {
        all: TSheetAttendanceDate[],
        prelim: TSheetAttendanceDate[],
        midterm: TSheetAttendanceDate[],
        prefinal: TSheetAttendanceDate[],
        final: TSheetAttendanceDate[]
    }
    componentsItemsPerTerm: {
        prelim: TTermItems,
        midterm: TTermItems,
        prefinal: TTermItems,
        final: TTermItems,
    },
    dataUpdate: {
        students: (data: IGradingSheetStudent[]) => void,
        gradingSheet: (data: TGradingSheetInfo) => void,
        componentItems: (data: TComponentItem[]) => void,
        studentsScores: (data: TStudentObtainedScore[]) => void,
        classStandingGrades: (data: TclassStanding[]) => void,
        sheetAttendanceDate: (data: TSheetAttendanceDate[]) => void,
        attendanceRecords: (data: TAttendanceRecord[]) => void
    },
    loadingState: {
        students: {
            isLoading: boolean,
            setIsLoading: (state: boolean) => void
        },
        gradingSheet: {
            isLoading: boolean,
            setIsLoading: (state: boolean) => void
        },
        componentItems: {
            isLoading: boolean,
            setIsLoading: (state: boolean) => void
        },
        studentsScores: {
            isLoading: boolean,
            setIsLoading: (state: boolean) => void
        },
        classStandingGrades: {
            isLoading: boolean,
            setIsLoading: (state: boolean) => void
        },
        attendanceDates: {
            isLoading: boolean,
            setIsLoading: (state: boolean) => void
        },
        attendanceRecords: {
            isLoading: boolean,
            setIsLoading: (state: boolean) => void
        }
    }
}
const SheetContex = React.createContext<ISheetContext | undefined>(undefined);

// Custom hook for using context
export const useSheetContex = (): ISheetContext => {
  const context = React.useContext(SheetContex);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const SheetFC: React.FC<ISheet> = ({className, sheetId}) => {
    const errorAlert = useErrorAlert();
    const [mainTab, setMainTab] = React.useState<"students" | "prelim" | "midterm" | "prefinal" | "final">("students");
    const [gradingSystemConfig, setGradingSystemConfig] = React.useState<null | IGradingSystemConfig>(null);
    const [gradingSheet, setGradingSheet] = React.useState<TGradingSheetInfo | null>(null);
    const [loadingGradingSystem, setLoadingGradingSystem] = React.useState(true);
    const [loadingGradingSheet, setLoadingGradingSheet] = React.useState(true);
    const [loadingStudents, setLoadingStudents] = React.useState(true);
    const [loadingComponentItems, setLoadingComponentItems] = React.useState(true)
    const [loadingClassStandingGrades, setLoadingClassStandingGrades] = React.useState(true);
    const [loadingSheetScores, setLoadingSheetScores] = React.useState(true);
    const [loadingAttendanceDates, setLoadingAttendanceDates] = React.useState(true);
    const [loadingAttendanceRecords, setLoadingAttendanceRecords] = React.useState(true);
    const [students, setStudents] = React.useState<IGradingSheetStudent[]>([]);
    const [componentItems, setComponentItems] = React.useState<TComponentItem[]>([]);
    const [studentsScores, setStudentsScores] = React.useState<TStudentObtainedScore[]>([]);
    const [classStandingGrades, setClassStandingGrades] = React.useState<TclassStanding[]>([]);
    const [attendanceDates, setAttendanceDates] = React.useState<TSheetAttendanceDate[]>([]);
    const [attendanceRecords, setAttendanceRecords] = React.useState<TAttendanceRecord[]>([]);
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
            console.log(data.data)
            setGradingSheet({...data.data});
        })
        .catch(err => {
            errorAlert.setError("Faild to fetch data");
        })
        .finally(() => {
            setTimeout(() => {
                setLoadingGradingSheet(false)
            }, 1000)
        })
    }, []);

    React.useEffect(() => {
        setLoadingComponentItems(true);
        fetch('/api/get-component-items', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId: sheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setComponentItems([...data.data])
        })
        .catch(err => {
            errorAlert.setError("Faild to fetch data")
        })
        .finally(() => {
            setLoadingComponentItems(false)
        })
    }, [])
    
     React.useEffect(() => {
        setLoadingStudents(true)
        fetch('/api/get-grading-sheet-students', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId: sheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setStudents([...data.data]);
        })
        .catch(err => {
            errorAlert.setError("Faild to fetch data")
        })
        .finally(() => {
            setTimeout(() => {
                setLoadingStudents(false)
            }, 1000)
        })
    }, []);

    React.useEffect(() => {
        setLoadingSheetScores(true);
        fetch('/api/get-students-score', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId: sheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setStudentsScores([...data.data])
        })
        .catch(err => {
            errorAlert.setError("Faild to fetch data")
        })
        .finally(() => {
            setLoadingSheetScores(false)
        })
    }, [])

    React.useEffect(() => {
        setLoadingClassStandingGrades(true);
        fetch('/api/get-class-standing-grades', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId: sheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setClassStandingGrades([...data.data])
        })
        .catch(err => {
            errorAlert.setError("Faild to fetch data")
        })
        .finally(() => {
            setLoadingClassStandingGrades(false);
        })
    }, [])

    React.useEffect(() => {
        setLoadingAttendanceDates(true);
        fetch('/api/get-grading-sheet-attendance-dates', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId: sheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setAttendanceDates([...data.data])
        })
        .catch(err => {
            errorAlert.setError("Faild to fetch data")
        })
        .finally(() => {
            setLoadingAttendanceDates(false);
        })
    }, [])

     React.useEffect(() => {
        setLoadingAttendanceRecords(true);
        fetch('/api/get-attendance-records', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId: sheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setAttendanceRecords([...data.data])
        })
        .catch(err => {
            errorAlert.setError("Faild to fetch data")
        })
        .finally(() => {
            setLoadingAttendanceRecords(false);
        })
    }, [])

    React.useEffect(() => {
        setLoadingGradingSystem(true);
        fetch("/api/get-grading-system")
        .then(response => {
            if(response.ok) return response.json();
            throw new Error("Failed to fetch data")
        })
        .then(data => {
            setGradingSystemConfig(data.data);
        })
        .catch(err => errorAlert.setError("Faild to fetch data"))
        .finally(() => setLoadingGradingSystem(false))
    }, []);

    React.useEffect(() => {
        console.log(classStandingGrades)
    }, [classStandingGrades])

    return(
        <>
            {
                gradingSheet && gradingSystemConfig? 
                <SheetContex.Provider value={{
                    students: students.sort((a, b) => a.first_name.localeCompare(b.first_name, undefined, { sensitivity: 'base' })),
                    gradingSystem: gradingSystemConfig,
                    gradingSheet: gradingSheet,
                    term: mainTab !== "students"? mainTab : "prelim",
                    studentsScores,
                    componentItems,
                    classStandingGrades,
                    attendanceRecords,
                    sheetAttendanceDatePerTerm: {
                        all: attendanceDates,
                        prelim: attendanceDates.filter(item => item.term == "prelim"),
                        midterm: attendanceDates.filter(item => item.term == "midterm"),
                        prefinal: attendanceDates.filter(item => item.term == "prefinal"),
                        final: attendanceDates.filter(item => item.term == "final")
                    },
                    componentsItemsPerTerm: {
                        prelim: {
                            ALL: componentItems.filter(item => item.term == 'prelim').sort((a, b) => a.id - b.id),
                            AQ: componentItems.filter(item => item.term == 'prelim' && item.component == "AQ").sort((a, b) => a.id - b.id),
                            AA: componentItems.filter(item => item.term == 'prelim' && item.component == "AA").sort((a, b) => a.id - b.id),
                            TT: componentItems.filter(item => item.term == 'prelim' && item.component == "TT").sort((a, b) => a.id - b.id)
                        },
                        midterm: {
                            ALL: componentItems.filter(item => item.term == 'midterm').sort((a, b) => a.id - b.id),
                            AQ: componentItems.filter(item => item.term == 'midterm' && item.component == "AQ").sort((a, b) => a.id - b.id),
                            AA: componentItems.filter(item => item.term == 'midterm' && item.component == "AA").sort((a, b) => a.id - b.id),
                            TT: componentItems.filter(item => item.term == 'midterm' && item.component == "TT").sort((a, b) => a.id - b.id)
                        },
                        prefinal: {
                            ALL: componentItems.filter(item => item.term == 'prefinal').sort((a, b) => a.id - b.id),
                            AQ: componentItems.filter(item => item.term == 'prefinal' && item.component == "AQ").sort((a, b) => a.id - b.id),
                            AA: componentItems.filter(item => item.term == 'prefinal' && item.component == "AA").sort((a, b) => a.id - b.id),
                            TT: componentItems.filter(item => item.term == 'prefinal' && item.component == "TT").sort((a, b) => a.id - b.id)
                        },
                        final: {
                            ALL: componentItems.filter(item => item.term == 'final').sort((a, b) => a.id - b.id),
                            AQ: componentItems.filter(item => item.term == 'final' && item.component == "AQ").sort((a, b) => a.id - b.id),
                            AA: componentItems.filter(item => item.term == 'final' && item.component == "AA").sort((a, b) => a.id - b.id),
                            TT: componentItems.filter(item => item.term == 'final' && item.component == "TT").sort((a, b) => a.id - b.id)
                        }
                    },
                    dataUpdate: {
                        students: (data) => setStudents(data),
                        gradingSheet: (data) => setGradingSheet(data),
                        componentItems: (data) => setComponentItems(data),
                        studentsScores: (data) => setStudentsScores(data),
                        classStandingGrades: (data) => setClassStandingGrades(data),
                        sheetAttendanceDate: (data) => setAttendanceDates(data),
                        attendanceRecords: (data) => setAttendanceRecords(data) 
                    },
                    loadingState: {
                        students: {
                            isLoading: loadingStudents,
                            setIsLoading: (state) => setLoadingStudents(state)
                        },
                        gradingSheet: {
                            isLoading: loadingGradingSheet,
                            setIsLoading: (state) => setLoadingGradingSheet(state)
                        },
                        componentItems: {
                            isLoading: loadingComponentItems,
                            setIsLoading: (state) => setLoadingComponentItems(state)
                        },
                        studentsScores: {
                            isLoading: loadingSheetScores,
                            setIsLoading: (state) => setLoadingSheetScores(state)
                        },
                        classStandingGrades: {
                            isLoading: loadingClassStandingGrades,
                            setIsLoading: (state) => setLoadingClassStandingGrades(state)
                        },
                        attendanceDates: {
                            isLoading: loadingAttendanceDates,
                            setIsLoading: (state) => setLoadingAttendanceDates(state)
                        },
                        attendanceRecords: {
                            isLoading: loadingAttendanceRecords,
                            setIsLoading: (state) => setLoadingAttendanceRecords(state)
                        }
                    }
                }}>
                    <div className={className}> 
                        <div className='container'>
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
                                        <Chip
                                        icon={<TodayIcon />}
                                        label={`Every: ${gradingSheet?.every}`}
                                        size='small'
                                        />
                                        <Chip
                                        icon={<AccessTimeIcon />}
                                        label={`Start: ${gradingSheet?.start}`}
                                        size='small'
                                        />
                                        <Chip
                                        icon={<AccessTimeIcon />}
                                        label={`End: ${gradingSheet?.end}`}
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
                                            <StudentsTabPanel />
                                        </> : ""
                                    }
                                    {
                                        mainTab == "prelim" || mainTab == "midterm" || mainTab == "prefinal" || mainTab == "final"? <>
                                        <TermsTabPannel />
                                        </> : ""
                                    }
                                </Paper>
                            </div>
                        </div>
                    </div>
                </SheetContex.Provider> : 
                <>
                {
                    loadingGradingSheet? <>
                    <Box sx={{display: "flex", flex: "0 1 100%", height: "400px", alignItems: 'center', justifyContent: "center"}}>
                        <CircularProgress /> <h3 style={{marginLeft: "10px"}}>Please wait while loading...</h3>
                    </Box>
                    </> :""
                }
                </>
            }
        </>
    )
}

const Sheet = styled(SheetFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        min-width: 0;
        
        > .container {
            display: flex;
            flex: 0 1 100%;
            min-width: 0;
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
                min-width: 0;
                margin-top: 50px;

                > .main-tab-content {
                    display: flex;
                    flex: 0 1 100%;
                    min-width: 0;
                    padding: 20px;
                }
            }
        }
    }
`

export default Sheet;