"use client"
import React from 'react';
import { debounce } from "lodash";
import axios, { CancelTokenSource } from 'axios';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import IMAGE_SERVER_URL from '@/IMAGE_SERVER_URL';
import { useSheetContex } from './Sheet';
import { useErrorAlert } from '@/app/context/PageErrorAlertProvider';
import { useSuccessAlert } from '@/app/context/PageSuccessAlertProvider';
import { IGradingSheetStudent } from './Sheet';
import { TStudentObtainedScore } from '@/app/types/TStudentObtainedScore';
import TclassStanding from '@/app/types/TClassStanding';
import isValidGrade from '@/app/helpers/utils/isValidGrade';
import getRemark from '@/app/helpers/utils/getRemarks';
import remarkColors from '@/app/helpers/utils/remarks-colors';

//MUI Components
import { 
    Box,
    Avatar,
    Chip,
    IconButton,
    Backdrop,
    CircularProgress
} from "@mui/material";

//MUI Icons
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import SquareIcon from '@mui/icons-material/Square';

const TableRow =  styled(Box)`
    display: flex;
    flex: 0 1 100%;
    height: 50.2px;
    padding: 10px;
    align-items: center;
    border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
    border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
`
interface IDataCell extends IStyledFC {
    itemHps: number,
    itemId: string,
    studentId: string,
    studentScore: TStudentObtainedScore | undefined
}

const DataCellFC: React.FC<IDataCell> = ({className, itemHps, studentId, itemId, studentScore}) => {
    const sheet = useSheetContex();
    const errorAlert = useErrorAlert();
    const successAlert = useSuccessAlert();
    const [rawScore, setRawScore] = React.useState(studentScore? studentScore.score : "INC");
    const [editValue, setEditValue] = React.useState(studentScore? studentScore.score : "INC")
    const [onEditState, setOnEditState] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const percentage = React.useMemo(() => {
        if(editValue == '') return "INC";
        if(isValidGrade(editValue)) {
            if(editValue.toUpperCase() !== "INC") {
                const baseGrade = +sheet.gradingSystem.componentsItemTransmutationScale.baseGrade;
                const transmulationRange = 100 - baseGrade;
                const percentage = ((+editValue / itemHps) * transmulationRange) + baseGrade;
                const round = Math.round(percentage * 100) / 100
                return String(round)
            } else {
                return editValue
            }
        } else {
            return ''
        }
    }, [editValue, sheet.gradingSystem]);

    const updateStudentObtainedScore = React.useCallback(async () => {
        if(rawScore !== editValue) {
            try {
                if(!isValidGrade(editValue)) throw "Invalid input";
                if(+editValue > itemHps) throw "Invalid input: the score cannot be greater than the item's maximum allowable score.";
                if(+editValue < 0) throw "Invalid input: the score cannot be less than 0";
    
                if(formError) setFormError(null);
    
                try {
                    setIsLoading(true)
                    const response = await fetch('/api/add-student-score', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({studentId, sheetId: sheet.gradingSheet.id, itemId, score: editValue == ""? "INC" : isNaN(+editValue)? "INC" : Math.trunc(+editValue)})
                    })

                    if(!response.ok) throw "Server Error";

                    const data = await response.json();

                    if(studentScore) {
                        const update = sheet.studentsScores.map(item => {
                            if(item.itemId == String(itemId) && item.studentId == studentId) {
                                return ({...item, score: editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue))})
                            } else {
                                return item
                            }
                        });

                        sheet.dataUpdate.studentsScores([...update]);
                    } else {
                        sheet.dataUpdate.studentsScores([...sheet.studentsScores, {id: data.id, itemId: String(itemId), studentId: studentId, score: editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue)), sheetId: sheet.gradingSheet.id}])
                    }
                
                    setRawScore(editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue)));
                    setEditValue(editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue)));
                    successAlert.setMessage("Update Success")
                    setOnEditState(false);
                }
                catch(err:any) {
                    errorAlert.setError(err);
                }
                finally {
                    setIsLoading(false)
                }
            } 
            catch(err:any) {
                setFormError(err)
                errorAlert.setError(err)
            }
        } else {
            setOnEditState(false)
        }

    }, [editValue, rawScore, sheet, studentId, itemId]);

    return(
        <div className={className}>
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className={onEditState? "container on-edit-state" : 'container'}>
                <form className="raw-score"  onDoubleClick={() => setOnEditState(true)} 
                onSubmit={(e) => {
                    e.preventDefault();
                    updateStudentObtainedScore()
                }}>
                    {
                        onEditState? <input className={formError? "input-error" : ""} autoFocus disabled={isLoading} onBlur={updateStudentObtainedScore} value={editValue} 
                        onChange={(e) => {
                           if(!(e.target.value == "") && !isNaN(+e.target.value)) {
                                setEditValue(String(Math.trunc(+e.target.value)));
                            } else {
                                setEditValue(e.target.value);
                            }
                        }} /> : rawScore
                    }
                </form>
                <div className="percentage" style={{backgroundColor: remarkColors[getRemark(percentage)], color: 'white'}}>
                    {percentage}
                </div>
            </div>
        </div>
    )
}


const DataCell = styled(DataCellFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        height: 50px;
        cursor: pointer;
        border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};

        > .container {
            display: flex;
            flex: 0 1 100%;
            height: 100%;

            > form, > div {
                display: flex;
                flex: 1;
                align-items: center;
                justify-content: center;
                font-size: 13px;
            }
    
            > .raw-score {
                border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
    
                > input {
                    display: flex;
                    width: 100%;
                    height: 90%;
                    padding: 0 5px;
                    align-items: center;
                    font-size: 20px;
                }
    
                > input, > input:active, > input:focus {
                    outline: 0;
                    border: 1px dashed ${({theme}) => theme.palette.grey[400]};
                }

                > .input-error {
                    border-color: red;
                }
            }
        }
    }

    && > .on-edit-state, && > .container:hover {
        background-color: #454a5a;
        transition: transform 300ms, box-shadow 300ms;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
        border: 0;
        transform: scale(1.1);
        transform: translateX(5px);
        color: white;
    }
`;

interface IClassStandingDataCell extends IStyledFC {
    student: IGradingSheetStudent,
    item: TclassStanding | undefined,
    itemType: 'behavior' | 'recitation'
}

const ClassStandingDataCellFC: React.FC<IClassStandingDataCell> = ({className, student, item, itemType}) => {
    const sheet = useSheetContex();
    const errorAlert = useErrorAlert();
    const successAlert = useSuccessAlert();
    const [rawScore, setRawScore] = React.useState(item? item.grade : "INC");
    const [editValue, setEditValue] = React.useState(item? item.grade : "INC")
    const [onEditState, setOnEditState] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);

    const handleUpdateClassStandingData = React.useCallback(async () => {
        if(rawScore !== editValue) {
            try {
                if(!isValidGrade(editValue)) throw "Invalid input";
                if(+editValue > 100) throw "Invalid input: the score cannot be greater than the item's maximum allowable score.";
                if(+editValue < 0) throw "Invalid input: the score cannot be less than 0";
    
                if(formError) setFormError(null);
                 
                try {
                    setIsLoading(true);
                    const response = await fetch('/api/add-student-class-standing-grade', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({studentId: student.student_id, itemType, sheetId: sheet.gradingSheet.id, term: sheet.term, grade: editValue == ""? "INC" : isNaN(+editValue)? "INC" : Math.trunc(+editValue)})
                    })

                    if(!response.ok) throw "Server Error";

                    const data = await response.json();

                    if(item) {
                        const update = sheet.classStandingGrades.map(item => {
                            if(item.term == sheet.term && item.studentId == student.student_id && item.itemType == itemType) {
                                return ({...item, grade: editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue))})
                            } else {
                                return item
                            }
                        });
                        
                        sheet.dataUpdate.classStandingGrades([...update]);

                    } else {
                        sheet.dataUpdate.classStandingGrades([...sheet.classStandingGrades, {id: data.id, itemType, studentId: student.student_id, grade: editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue)), sheetId: sheet.gradingSheet.id, term: sheet.term}])
                    }

                    setRawScore(editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue)))
                    setEditValue(editValue == ""? "INC" : isNaN(+editValue)? "INC" : String(Math.trunc(+editValue)))
                    successAlert.setMessage("Update Success")
                    setOnEditState(false);
                }
                catch(err) {
                    throw err
                }
                finally {
                    setIsLoading(false)
                }
            }
            catch(err) {
                if(typeof err == 'string') {
                    errorAlert.setError(err)
                    setFormError(err)
                } else {
                    errorAlert.setError("An error occurred while processing your request. Please try again shortly.")
                }
            }
        } else {
            setOnEditState(false);
        }
    }, [rawScore, editValue, student, sheet.classStandingGrades, item, sheet.term]);

    React.useEffect(() => {
        setRawScore(item? item.grade : "INC")
         setEditValue(item? item.grade : "INC")
    }, [item])
    return(
        <div className={className} onDoubleClick={() => setOnEditState(true)}>
            <form className={onEditState? "container on-edit-state" : 'container'} style={{backgroundColor: remarkColors[getRemark(rawScore)], color: 'white'}}
            onSubmit={(e) => {
                e.preventDefault();
                handleUpdateClassStandingData()
            }}>
                {
                    onEditState? <input className={formError? "input-error" : ""} autoFocus disabled={isLoading} onBlur={handleUpdateClassStandingData} value={editValue} 
                    onChange={(e) => {
                        if(!(e.target.value == "") && !isNaN(+e.target.value)) {
                            setEditValue(String(Math.trunc(+e.target.value)));
                        } else {
                            setEditValue(e.target.value);
                        }
                    }} /> : rawScore
                }
            </form>
        </div>
    )
};

const ClassStandingDataCell = styled(ClassStandingDataCellFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        height: 50px;
        cursor: pointer;
        border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
        
        > form {
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 1 100%;
            
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
    
            > .input-error {
                border-color: red;
            }
        }

        > .on-edit-state, > .container:hover {
            background-color: #454a5a;
            transition: transform 300ms, box-shadow 300ms;
            box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
            border: 0;
            transform: scale(1.1);
            transform: translateX(5px);
            color: white;
        }
    }
`;

interface IAverageCellFC extends IStyledFC {
    scores: string[],
}

const AverageCellFC: React.FC<IAverageCellFC> = ({className, scores}) => {
    const sheet = useSheetContex();
    const average = React.useMemo(() => {
        if(scores.includes("INC")) return "INC";

        const trasnmulatedGrades = scores.map(score => {
            const [studentScore, itemHps] = score.split('/');

            const baseGrade = +sheet.gradingSystem.componentsItemTransmutationScale.baseGrade;
            const transmulationRange = 100 - baseGrade;
            const percentage = ((+studentScore / +itemHps) * transmulationRange) + baseGrade;
        
            return percentage;
        });

        const total = trasnmulatedGrades.reduce((sum, grade) => sum + grade, 0);
        const average = total / trasnmulatedGrades.length;
        return Math.round(average * 100) / 100;
    }, [scores]);


    return(
        <div className={className} style={{backgroundColor: remarkColors[getRemark(String(average))], color: 'white'}}> 
            { average }
        </div>
    )
};

const AverageCell = styled(AverageCellFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        align-items: center;
        justify-content: center;
        height: 50px;
        cursor: pointer;
        border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
    }

    &&:hover {
        background-color: #454a5a;
        transition: transform 300ms, box-shadow 300ms;
        box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px;
        border: 0;
        transform: scale(1.1);
        transform: translateX(5px);
        color: white;
    }
`
const GradingSheetTableFC: React.FC<IStyledFC> = ({className}) => {
    const sheet = useSheetContex();
    const containerRef = React.useRef<HTMLDivElement | null>(null);

    const studentsGrade = React.useCallback((student: IGradingSheetStudent, term: "prelim" | 'midterm' | 'prefinal' | 'final', component: "AQ" | "AA" | "TT") => {
        const scores = sheet.componentsItemsPerTerm[term][component].map(item => {
            const itemsScores = sheet.studentsScores.filter(i => i.itemId == String(item.id) && i.studentId == student.student_id);

            return itemsScores.length && itemsScores[0].score !== "INC"?  `${itemsScores[0].score}/${item.highest_posible_score}` : "INC"
        })

        return scores
    }, [sheet.studentsScores]);

    return(
        <div className={className}  ref={containerRef}> 
            <div className="table-actions">
                <div className="remarks-colors">
                    {
                        Object.entries(remarkColors).map((i) => (
                            <Chip key={i[1]} icon={<SquareIcon sx={{fill: i[1]}} />} label={i[0]} variant="outlined" />
                        ))
                    }
                </div>
                <IconButton aria-label="view in full-screen" sx={{marginLeft: 'auto', width: '50px', height: '50px'}} onClick={() => containerRef.current?.requestFullscreen()}>
                    <FullscreenIcon />
                </IconButton>
            </div>
            <div className="table-content">
                <div className="students-column">
                    <div className="table-head">
                        <h3>Learners Name</h3>
                    </div>
                    {
                        sheet.students.map(student => (
                            <TableRow key={student.student_id}>
                                <Chip
                                avatar={<Avatar alt="Natacha" src={`${IMAGE_SERVER_URL}/images/avatar/${student.image_path}`} />}
                                label={`${student.first_name} ${student.middle_name? student.middle_name[0].toUpperCase()+"." : ''} ${student.surname} ${student.suffix? student.suffix : ''}`}
                                variant="outlined"
                                />
                            </TableRow>
                        ))
                    }
                    
                </div>
                <div className="scrollable-columns">
                    <div className="column-group">
                        <div className="column">
                            <div className="column-head">
                                <h3>Average Quiz</h3>
                                <div className="items-container">
                                    {
                                        sheet.componentsItemsPerTerm[sheet.term]['AQ'].map((item, i) => (
                                            <div className="item-group" key={item.id}>
                                                <div className="description">
                                                    <span>{i+1}</span>
                                                    <p>{item.description}</p>
                                                </div>
                                                <div className="score-percentage">
                                                    <div className="score">{item.highest_posible_score}</div>
                                                    <div className="percentage">%</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        sheet.componentsItemsPerTerm[sheet.term]['AQ'].length? 
                                        <div className="average">
                                            <h3>AVE.</h3>
                                        </div> : ''
                                    }
                                </div>
                            </div>
                            <div className="column-body">
                                {
                                    sheet.componentsItemsPerTerm[sheet.term]['AQ'].map(item => (
                                        <div className="rows-container" key={item.id}>
                                            {
                                                sheet.students.map(student => {
                                                    const find = sheet.studentsScores.find(i => i.itemId == String(item.id) && student.student_id == i.studentId)
                                                    return (<DataCell key={student.student_id} studentId={student.student_id} itemId={String(item.id)} studentScore={find} itemHps={item.highest_posible_score} />)
                                                })
                                            }
                                        </div>
                                    ))
                                }
                                {
                                    sheet.componentsItemsPerTerm[sheet.term]['AQ'].length? 
                                    <div className="average-col">
                                        {
                                            sheet.students.map(student => (
                                                <AverageCell key={student.student_id} scores={studentsGrade(student, sheet.term, "AQ")} />
                                            ))
                                        }
                                    </div> : ""
                                }
                            </div>
                        </div>
                        <div className="column">
                            <div className="column-head">
                                <h3>Assignments & Activities</h3>
                                <div className="items-container">
                                    {
                                        sheet.componentsItemsPerTerm[sheet.term]['AA'].map((item, i) => (
                                            <div className="item-group" key={item.id}>
                                                <div className="description">
                                                    <span>{i+1}</span>
                                                    <p>{item.description}</p>
                                                </div>
                                                <div className="score-percentage">
                                                    <div className="score">{item.highest_posible_score}</div>
                                                    <div className="percentage">%</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    {
                                        sheet.componentsItemsPerTerm[sheet.term]['AA'].length? 
                                        <div className="average">
                                            <h3>AVE.</h3>
                                        </div> : ''
                                    }
                                </div>
                            </div>
                            <div className="column-body">
                                {
                                    sheet.componentsItemsPerTerm[sheet.term]['AA'].map(item => (
                                        <div className="rows-container" key={item.id}>
                                            {
                                                sheet.students.map(student => {
                                                    const find = sheet.studentsScores.find(i => i.itemId == String(item.id) && student.student_id == i.studentId)
                                                    return (<DataCell key={student.student_id} studentId={student.student_id} itemId={String(item.id)} studentScore={find} itemHps={item.highest_posible_score} />)
                                                })
                                            }
                                        </div>
                                    ))
                                }
                                {
                                    sheet.componentsItemsPerTerm[sheet.term]['AA'].length? 
                                    <div className="average-col">
                                        {
                                            sheet.students.map(student => (
                                                <AverageCell key={student.student_id} scores={studentsGrade(student, sheet.term, "AA")} />
                                            ))
                                        }
                                    </div> : ""
                                }
                            </div>
                        </div>
                        <div className="column">
                            <div className="column-head">
                                <h3>Class Performance</h3>
                                <div className="items-container">
                                    <div className="item">Attendance</div>
                                    <div className="item">Behavior</div>
                                    <div className="item" style={{borderRight: '0'}}>Recitation</div>
                                </div>
                            </div>
                            <div className="column-body">
                                <div className="class-standing-rows-container">
                                     
                                </div>
                                <div className="class-standing-rows-container">
                                    {
                                        sheet.students.map(student => {
                                            const find = sheet.classStandingGrades.find(item => item.itemType == "behavior" && item.studentId == student.student_id && item.term == sheet.term);
                                            return (<ClassStandingDataCell itemType='behavior' student={student} key={student.student_id} item={find} />)
                                        })
                                    }
                                </div>
                                <div className="class-standing-rows-container" style={{borderRight: '0'}}>
                                    {
                                        sheet.students.map(student => {
                                            const find = sheet.classStandingGrades.find(item => item.itemType == "recitation" && item.studentId == student.student_id && item.term == sheet.term);
                                            return (<ClassStandingDataCell itemType='recitation' student={student} key={student.student_id} item={find} />)
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="column" style={{borderRight: 0}}>
                            <div className="column-head">
                                <h3 style={{width: 'fit-content', minWidth: '200px'}}>Term Test</h3>
                                <div className="items-container" >
                                    {
                                        sheet.componentsItemsPerTerm[sheet.term]['TT'].map((item, i) => (
                                            <div className="item-group" key={item.id} style={{borderRight: 0}}>
                                                <div className="description">
                                                    <span>{i+1}</span>
                                                    <p>{item.description}</p>
                                                </div>
                                                <div className="score-percentage">
                                                    <div className="score">{item.highest_posible_score}</div>
                                                    <div className="percentage">%</div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                             <div className="column-body">
                                {
                                    sheet.componentsItemsPerTerm[sheet.term]['TT'].map(item => (
                                        <div className="rows-container" key={item.id}>
                                            {
                                                sheet.students.map(student => {
                                                    const find = sheet.studentsScores.find(i => i.itemId == String(item.id) && student.student_id == i.studentId)
                                                    return (<DataCell key={student.student_id} studentId={student.student_id} itemId={String(item.id)} studentScore={find} itemHps={item.highest_posible_score} />)
                                                })
                                            }
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )   
}

const GradingSheetTable = styled(GradingSheetTableFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        min-width: 0;
        height: fit-content;
        flex-wrap: wrap;
        overflow-x: hidden;

        > .table-actions {
            display: flex;
            flex: 0 1 100%;
            height: 60px;
            align-items: center;
            background-color: ${({theme}) => theme.palette.background.paper};

            > .remarks-colors {
                display: flex;
                height: fit-content;
                flex: 1;
                gap: 5px;
            }
        }

        .table-content {
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
                    height: 100px;
                    flex: 1;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};

                    > h3 {
                        height: fit-content;
                        width: fit-content;
                    }
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
                        width: fit-content;
                        flex-wrap: wrap;
                        border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                        
                        
                        > .column-head {
                            display: flex;
                            height: 100px;
                            flex: 1;
                            justify-content: center;
                            flex-wrap: wrap;
    
                            > h3 {
                                flex: 0 1 100%;
                                text-align: center;
                                height: 30px;
                                font-weight: 400;
                                white-space: nowrap;
                                min-width: 300px;
                                border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                            }

                            > .items-container {
                                display: flex;
                                flex: 0 1 100%;
                                height: 68px;

                                > .item-group {
                                    display: flex;
                                    flex: 0 0 230px;
                                    height: 100%;
                                    flex-wrap: wrap;
                                    border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                                    border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};

                                    > .description {
                                        display: flex;
                                        flex: 0 1 100%;
                                        height: 45%;
                                        align-items: center;
                                        border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};

                                        > p {
                                            font-size: 11px;
                                            text-align: center;
                                            padding: 0 5px;
                                        }

                                        > span {
                                            display: flex;
                                            flex-grow: 0;
                                            width: 40px;
                                            height: 100%;
                                            font-size: 20px;
                                            font-weight: bold;
                                            align-items: center;
                                            justify-content: center;
                                            border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                                            
                                        }
                                    }

                                    > .score-percentage {
                                        display: flex;
                                        flex: 0 1 100%;
                                        height: 55%;

                                        > div {
                                            display: flex;
                                            flex: 1;
                                            align-items: center;
                                            justify-content: center;
                                        }

                                        > .score {
                                            border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};                                            
                                        }
                                    }
                                }

                                > .item {
                                    display: flex;
                                    width: 100px;
                                    align-items: center;
                                    justify-content: center;
                                    border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                                    border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                                }

                                > .average {
                                    display: flex;
                                    width: 70px;
                                    height: 100%;
                                    align-items: center;
                                    justify-content: center;
                                    margin-left: auto;
                                     border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                                }
                            }
                            
                        }

                        > .column-body {
                            display: flex;
                            flex: 0 1 100%;

                            > .rows-container {
                                display: flex;
                                flex: 0 0 230px;
                                height: fit-content;
                                flex-wrap: wrap;
                                border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                            }

                            > .class-standing-rows-container {
                                display: flex;
                                flex: 1;
                                flex-wrap: wrap;
                                height: fit-content;
                                border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#414141" : "#cfcfcf"};
                            }

                            > .average-col {
                                display: flex;
                                flex: 1;
                                width: 70px;
                                flex-wrap: wrap;
                            }
                        }
                    }

                    

                }
            }
        }

    }



`

export default GradingSheetTable;