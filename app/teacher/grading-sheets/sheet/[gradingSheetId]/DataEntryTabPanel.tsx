"use client"
import React from 'react';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import { string, number, object } from 'yup';
import { Theme, useTheme } from '@mui/material/styles';
import { TComponentItem } from '@/app/types/component-item-type';
import { IGradingSheetStudent, useSheetContex } from './Sheet';
import IMAGE_SERVER_URL from '@/IMAGE_SERVER_URL';
import { useErrorAlert } from '@/app/context/PageErrorAlertProvider';
import { useSuccessAlert } from '@/app/context/PageSuccessAlertProvider';
import SelectStudentAutoComplete from './SelectStudentAutoComplete';
import isValidGrade from '@/app/helpers/utils/isValidGrade';
import getRemark from '@/app/helpers/utils/getRemarks';
import remarkColors from '@/app/helpers/utils/remarks-colors';

//MUI Components
import { 
    Avatar,
    Paper,
    Chip,
    IconButton,
    Button,
    CircularProgress,
    FormControl,
    Select,
    InputLabel,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Alert,
    AlertTitle,
    Backdrop,
} from "@mui/material";

//MUI Icons
import ClearIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';


const AddItemDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const AddItemForm = styled(Box)`
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

interface IComponentItemFC extends IStyledFC {
    item: TComponentItem,
    isTermTest: string
}

const ComponentItemFC: React.FC<IComponentItemFC> = ({className, item}) => {
    const sheet = useSheetContex()
    const successAlert = useSuccessAlert();
    const errorAlert = useErrorAlert();
    const [onSubmit, setOnSubmit] = React.useState(false);
    const [descriptionOnEditState, setDescriptionOnEditState] = React.useState(false);
    const [hpsOnEditState, setHspOnEditState] = React.useState(false);
    const [showEdiBtn, setShowEditBtn] = React.useState(false);
    const [showEditHPSBtn, setShowEditHPSBtn] = React.useState(false);
    const [itemValues, setItemValues] = React.useState({
        hps: String(item.highest_posible_score),
        description: item.description
    });

    const [itemDefaultValues, setItemDefaultValues] = React.useState({
        hps: String(item.highest_posible_score),
        description: item.description
    });

    const handleHpsInputBlur = async () => {
        if(itemValues.hps !== itemDefaultValues.hps) {
            try {
                await number().required().min(5).max(200).validate(itemValues.hps);
                //Update the database
                try {
                    setOnSubmit(true);
                    const response = await fetch('/api/update-component-item-hps', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({itemId: item.id, hps: itemValues.hps})
                    })
    
                    if(!response.ok) throw new Error();
    
                    successAlert.setMessage("Update Success");

                    setItemDefaultValues({...itemDefaultValues, hps: itemValues.hps});

                    sheet.dataUpdate.componentItems([...sheet.componentItems.map(i => {
                        if(i.id == item.id) {
                            return ({
                                ...i, 
                                highest_posible_score: +itemValues.hps
                            })
                        } else {
                            return i
                        }
                    })])
                }
                catch(err) {
                    errorAlert.setError("Faild to update")
                    setItemValues({...itemValues, hps: itemDefaultValues.hps})
                }
            }
            catch(err:any) {
                errorAlert.setError(err.errors)
                setItemValues({...itemValues, hps: itemDefaultValues.hps})
            } 
            finally {
                setHspOnEditState(false);
                setShowEditHPSBtn(false);
                setTimeout(() => {
                    setOnSubmit(false)
                }, 1000)
            }
        } else  {
            setHspOnEditState(false);
            setShowEditHPSBtn(false);
        }
    }

    const handleDescriptionInputBlur = async () => {
        if(itemValues.description !== itemDefaultValues.description) {
            try {
                await string().required().min(5).max(50).validate(itemValues.description)
                //Update the database
                try {
                    setOnSubmit(true);
                    const response = await fetch('/api/update-component-item-description', {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({itemId: item.id, description: itemValues.description})
                    })
    
                    if(!response.ok) throw new Error();
    
                    successAlert.setMessage("Update Success")
                    setItemDefaultValues({...itemDefaultValues, description: itemValues.description})
                    sheet.dataUpdate.componentItems([...sheet.componentItems.map(i => {
                        if(i.id == item.id) {
                            return ({
                                ...i, 
                                    description: itemValues.description
                            })
                        } else {
                            return i
                        }
                    })])
                }
                catch(err) {
                    errorAlert.setError("Faild to update")
                    setItemValues({...itemValues, description: itemDefaultValues.description})
                }
            }
            catch(err:any) {
                errorAlert.setError(err.errors)
                setItemValues({...itemValues, description: itemDefaultValues.description})
            } 
            finally {
                setDescriptionOnEditState(false);
                setShowEditBtn(false);
                setTimeout(() => {
                    setOnSubmit(false)
                }, 1000)
            }
        } else  {
            setDescriptionOnEditState(false);
            setShowEditBtn(false);
        }
    }
    
    return(
        <Paper className={className} elevation={2}>
            <div className="top">
                <IconButton aria-label="delete" color="default" size='small'>
                    <ClearIcon fontSize="small" />
                </IconButton>
            </div>
            <div className="mid">
                <div className="score-group">
                    {
                        hpsOnEditState? 
                        <input type='number' className='score' value={itemValues.hps} onBlur={handleHpsInputBlur} min={5} max={200} autoFocus
                        onChange={(e) => {
                            setItemValues({...itemValues, hps: e.target.value})
                        }}
                        />
                        : <h1 onDoubleClick={() => setHspOnEditState(true)} onMouseEnter={() => setShowEditHPSBtn(true)} onMouseLeave={() => setShowEditHPSBtn(false)}>
                            {itemValues.hps}
                            {
                                showEditHPSBtn? <IconButton className="edit-btn" aria-label="delete" color="default" size='small'  onClick={() => setHspOnEditState(true)}>
                                    <EditIcon fontSize="small" />
                                </IconButton> : ''
                            }
                        </h1>
                    }
                    
                    <p>Points</p>
                </div>
                {
                    descriptionOnEditState? 
                    <textarea value={itemValues.description}  onBlur={handleDescriptionInputBlur} minLength={5} maxLength={50} autoFocus
                    onChange={(e) => setItemValues({...itemValues, description: e.target.value})} /> 
                    : <p className='description' onDoubleClick={() => setDescriptionOnEditState(true)} onMouseEnter={() => setShowEditBtn(true)} onMouseLeave={() => setShowEditBtn(false)}>
                        {itemValues.description} 
                        {
                            showEdiBtn? <IconButton className="edit-btn" aria-label="delete" color="default" size='small'  onClick={() => setDescriptionOnEditState(true)}>
                                <EditIcon fontSize="small" />
                            </IconButton> : ''
                        }
                    </p>
                }
                
            </div>
            <div className="bot">
                <Chip
                color="info"
                label={item.term}
                size="small"
                />
                <Chip
                color="info"
                label={item.component == "AA"? "Assignments & Activities" : item.component == "AQ"? "Average Quiz" : "Term Test"}
                size="small"
                />
                <Chip
                color="info"
                label={`Item ID: ${item.id}`}
                size="small"
                />
            </div>
            {
                onSubmit? <div className="loading">
                    <CircularProgress size="30px" />
                </div> : ""
            }
        </Paper>
    )
}

const ComponentItem = styled(ComponentItemFC)`
    && {
        display: flex;
        position: relative;
        width: 400px;
        flex-shrink: 0;
        height: 180px;
        flex-wrap: wrap;
        padding: 15px;
        background-color: ${p => p.isTermTest == "true"? p.theme.palette.mode == "dark"? "#8500ff" : "#dbb5ff" : "none"};

        > .top, > .mid, > .bot {
            display: flex;
            flex: 0 1 100%;
            justify-content: flex-end;
            height: fit-content;

            > .score-group {
                display: inline-block;
                width: fit-content;
                height: fit-content;
                margin-right: 15px;
                
                
                > h1, input {
                    display: flex;
                    align-items: center;
                    width: 4ch;
                    font-size: 50px;
                    font-weight: bold;
                }

                > h1 {
                    line-height: normal;
                    position: relative;
                
                    > .edit-btn {
                        position: absolute;
                        right: -5px;
                    }

                }
                
                > input, > input:active, > input:focus {
                    outline: 0;
                    border: 0;
                    border-bottom:  1px dashed gray;
                    background-color: transparent;
                }
            }

            > .description, > textarea {
                display: flex;
                flex: 0 1 100%;
                height: 70px;
                font-size: 15px;
                align-items: center;
                padding: 10px;
                
            }
            
            > .description {
                white-space: pre-wrap;
                word-wrap: break-word;
                position: relative;
                
                > .edit-btn {
                    position: absolute;
                    right: -5px;
                }
            }

            > textarea, > textarea:focus, > textarea:active {
                border: 1px dashed gray;
                outline: none;
                resize: none;
                 
            }
        }

        > .bot {
            gap: 5px;
        }
    }

    > #description_input:focus {
        border: 1px dashed gray;
    }

    > .loading {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
        background-color: #000000b0;
        position: absolute;
        top: 0;
        left: 0
    }
`;


type TObtainedScoreInputContextType = {
    score: string,
    studentId: string,
    itemInfo: TComponentItem
}

const ObtainedScoreInputContex = React.createContext<TObtainedScoreInputContextType | undefined>(undefined);

const ObtainedScoreInputFC: React.FC<IStyledFC> = ({className}) => {
    const theme = useTheme();
    const sheet = useSheetContex();
    const successAlert = useSuccessAlert();
    const obtainedScoreContext = React.useContext(ObtainedScoreInputContex);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const [onEditState, setOnEditState] = React.useState(false);
    const [scoreValue, setScoreValue] = React.useState('');


    const updateStudentObtainedScore = React.useCallback(async () => {
        if(obtainedScoreContext) {
            try {
               if(!isValidGrade(scoreValue)) throw "Invalid input";
               if(+scoreValue > obtainedScoreContext.itemInfo.highest_posible_score) throw "Invalid input: the score cannot be greater than the item's maximum allowable score.";
               if(+scoreValue < 0) throw "Invalid input: the score cannot be less than 0";

               if(formError) setFormError(null);

               const findItem = sheet.studentsScores.find(item => item.itemId == String(obtainedScoreContext.itemInfo.id) && item.studentId == obtainedScoreContext.studentId);
                    
                if(findItem) {
                    if(!(findItem.score.toUpperCase() == scoreValue.toUpperCase())) {
                        try {
                            setIsLoading(true)
                            const response = await fetch('/api/add-student-score', {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({studentId: obtainedScoreContext.studentId, sheetId: sheet.gradingSheet.id, itemId: obtainedScoreContext.itemInfo.id, score: scoreValue == ""? "INC" : isNaN(+scoreValue)? "INC" : Math.trunc(+scoreValue)})
                            })

                            if(!response.ok) throw "Server Error";

                            const update = sheet.studentsScores.map(item => {
                                if(item.itemId == String(obtainedScoreContext.itemInfo.id) && item.studentId == obtainedScoreContext.studentId) {
                                    return ({...item, score: scoreValue == ""? "INC" : isNaN(+scoreValue)? "INC" : String(Math.trunc(+scoreValue))})
                                } else {
                                    return item
                                }
                            });
                        
                            successAlert.setMessage("Update Success");
                            sheet.dataUpdate.studentsScores([...update]);
                            setOnEditState(false);
                        }
                        catch(err:any) {
                            setFormError(err)
                        }
                        finally {
                            setIsLoading(false)
                        }
                    } else  {
                        setOnEditState(false);
                    }
                } else {
                    try {
                        setIsLoading(true)
                        const response = await fetch('/api/add-student-score', {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({studentId: obtainedScoreContext.studentId, sheetId: sheet.gradingSheet.id, itemId: obtainedScoreContext.itemInfo.id, score: scoreValue == ""? "INC" : isNaN(+scoreValue)? "INC" : Math.trunc(+scoreValue)})
                        })

                        if(!response.ok) throw "Server Error";

                        const data = await response.json()
                        successAlert.setMessage("Update Success")
                        sheet.dataUpdate.studentsScores([...sheet.studentsScores, {id: data.id, itemId: String(obtainedScoreContext.itemInfo.id), studentId: obtainedScoreContext.studentId, score: scoreValue == ""? "INC" : isNaN(+scoreValue)? "INC" : String(Math.trunc(+scoreValue)), sheetId: sheet.gradingSheet.id}])
                        setOnEditState(false);
                    }
                    catch(err:any) {
                        setFormError(err)
                    }
                    finally {
                        setIsLoading(false)
                    }
                }
            } 
            catch(err:any) {
                setFormError(err)
            }

        }
    }, [scoreValue, obtainedScoreContext]);

    React.useEffect(() => {
        if(obtainedScoreContext) {
            setScoreValue(obtainedScoreContext.score)
        }
    }, [obtainedScoreContext])
    return(
        <div className={className}> 
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="input-container">
                <h4>Score:</h4>
                {
                    onEditState? 
                    <input style={{borderColor: formError? 'red' : theme.palette.grey[500]}} disabled={isLoading} autoFocus value={scoreValue} placeholder='Empty input means INC'
                    onChange={(e) => {
                        if(!(e.target.value == "") && !isNaN(+e.target.value)) {
                            setScoreValue(String(Math.trunc(+e.target.value)));
                        } else {
                            setScoreValue(e.target.value);
                        }
                    }}/> : <p onDoubleClick={() =>setOnEditState(true)} >{obtainedScoreContext?.score}</p>
                }
                {
                    onEditState?
                    <>
                        {
                            isLoading? <div className="loading">
                                <CircularProgress size="20px" />
                            </div> : 
                            <Button variant="contained" onClick={updateStudentObtainedScore}>Submit</Button>
                        }
                    </>
                    : 
                    <IconButton className="edit-btn" aria-label="delete" color="default" size='small'  onClick={() =>setOnEditState(true)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                }
            </div>
            {
                formError? 
                <Alert severity="error" sx={{flex: '0 1 100%'}}>
                   {formError}
                </Alert> : ''
            }
            <Alert severity="info">
                <AlertTitle>Note</AlertTitle>
                If no grade is entered in the input field and the form is submitted, the system will automatically assign a grade of "INC" (Incomplete) to indicate missing or incomplete requirements.
            </Alert>
        </div>
    )
}

const ObtainedScoreInput = styled(ObtainedScoreInputFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        gap: 5px;
        flex-wrap: wrap;

        > .input-container {
            display: flex;
            flex: 0 1 100%;
            height: 60px;
            padding: 0 10px;
            border-radius: 5px;
            align-items: center;
            border: 1px solid ${({theme}) => theme.palette.grey[400]};
            margin-top: 5px;
        
            > p, > input {
                display: flex;
                flex: 1;
                height: 90%;
                padding: 0 10px;
                margin: 0 10px;
                align-items: center;
                font-size: 25px;
            }
        
            > input, > input:active, > input:focus {
                outline: 0;
                border: 1px dashed ${({theme}) => theme.palette.grey[400]};
            }
        
            > input::placeholder {
                font-size:15px;
            }
        
            > .loading {
                display: flex;
                align-items: center;
            }
        }
    }

`

type TClassStandingGradeInputContextType = {
    grade: string,
    studentId: string,
    itemType: "recitation" | "behavior"
}

const classStandingGradeInputContex = React.createContext<TClassStandingGradeInputContextType | undefined>(undefined);

const ClassStandinGradeInputFC: React.FC<IStyledFC> = ({className}) => {
    const theme = useTheme();
    const sheet = useSheetContex();
    const successAlert = useSuccessAlert();
    const classStandingGradeInput = React.useContext(classStandingGradeInputContex);
    const [isLoading, setIsLoading] = React.useState(false);
    const [formError, setFormError] = React.useState<string | null>(null);
    const [onEditState, setOnEditState] = React.useState(false);
    const [gradeValue, setGradeValue] = React.useState('');
        
    const updateStudentClassStandingGrade = React.useCallback(async () => {
        if(classStandingGradeInput) {
            try {
                if(!isValidGrade(gradeValue)) throw "Invalid input";
                if(+gradeValue > 100) throw "Invalid input: the score cannot be greater than the item's maximum allowable score.";
                if(+gradeValue < 0) throw "Invalid input: the score cannot be less than 0";
    
                if(formError) setFormError(null);
    
                const findItem = sheet.classStandingGrades.find(item => item.term == sheet.term && item.studentId == classStandingGradeInput.studentId && item.itemType == classStandingGradeInput.itemType);
                 
                if(findItem) {
                    if(!(findItem.grade.toUpperCase() == gradeValue.toUpperCase())) {
                        try {
                            setIsLoading(true)
                            const response = await fetch('/api/add-student-class-standing-grade', {
                                method: "POST",
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({studentId: classStandingGradeInput.studentId, itemType: classStandingGradeInput.itemType, sheetId: sheet.gradingSheet.id, term: sheet.term, grade: gradeValue == ""? "INC" : isNaN(+gradeValue)? "INC" : Math.trunc(+gradeValue)})
                            })

                            if(!response.ok) throw "Server Error";

                            const update = sheet.classStandingGrades.map(item => {
                                if(item.term == sheet.term && item.studentId == classStandingGradeInput.studentId && item.itemType == classStandingGradeInput.itemType) {
                                    return ({...item, grade: gradeValue == ""? "INC" : isNaN(+gradeValue)? "INC" : String(Math.trunc(+gradeValue))})
                                } else {
                                    return item
                                }
                            });
                        
                            successAlert.setMessage("Update Success")
                            sheet.dataUpdate.classStandingGrades([...update]);
                            setOnEditState(false);
                        }
                        catch(err:any) {
                            setFormError(err)
                        }
                        finally {
                            setIsLoading(false)
                        }
                    } else  {
                        setOnEditState(false);
                    }
                } else {
                    try {
                        setIsLoading(true)
                        const response = await fetch('/api/add-student-class-standing-grade', {
                            method: "POST",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({studentId: classStandingGradeInput.studentId, itemType: classStandingGradeInput.itemType, sheetId: sheet.gradingSheet.id, term: sheet.term, grade: gradeValue == ""? "INC" : isNaN(+gradeValue)? "INC" : Math.trunc(+gradeValue)})
                        })

                        if(!response.ok) throw "Server Error";

                        const data = await response.json()

                        successAlert.setMessage("Update Success")
                        sheet.dataUpdate.classStandingGrades([...sheet.classStandingGrades, {id: data.id, itemType: classStandingGradeInput.itemType, studentId: classStandingGradeInput.studentId, grade: gradeValue == ""? "INC" : isNaN(+gradeValue)? "INC" : String(Math.trunc(+gradeValue)), sheetId: sheet.gradingSheet.id, term: sheet.term}])
                        setOnEditState(false);
                    }
                    catch(err:any) {
                        setFormError(err)
                    }
                    finally {
                        setIsLoading(false)
                    }
                }

            }
            catch(err:any) {
                setFormError(err)
            }

        }
    }, [gradeValue, classStandingGradeInput, sheet.classStandingGrades, sheet.term]);

    React.useEffect(() => {
        if(classStandingGradeInput) {
            setGradeValue(classStandingGradeInput.grade)
        }
    }, [classStandingGradeInput])
    return(
        <div className={className}> 
            <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
            open={isLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <div className="input-container">
                <h4>Grade:</h4>
                {
                    onEditState? 
                    <input style={{borderColor: formError? 'red' : theme.palette.grey[500]}} disabled={isLoading} autoFocus value={gradeValue} placeholder='Empty input means INC'
                    onChange={(e) => {
                        if(!(e.target.value == "") && !isNaN(+e.target.value)) {
                            setGradeValue(String(Math.trunc(+e.target.value)));
                        } else {
                            setGradeValue(e.target.value);
                        }
                    }}/> : <p onDoubleClick={() =>setOnEditState(true)} >{classStandingGradeInput?.grade}</p>
                }
                {
                    onEditState?
                    <>
                        {
                            isLoading? <div className="loading">
                                <CircularProgress size="20px" />
                            </div> : 
                            <Button variant="contained" onClick={updateStudentClassStandingGrade}>Submit</Button>
                        }
                    </>
                    : 
                    <IconButton className="edit-btn" aria-label="delete" color="default" size='small'  onClick={() =>setOnEditState(true)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                }
            </div>
            {
                formError? 
                <Alert severity="error" sx={{flex: '0 1 100%'}}>
                   {formError}
                </Alert> : ''
            }
        </div>
    )
}

const ClassStandingGradeInput = styled(ClassStandinGradeInputFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        gap: 5px;
        flex-wrap: wrap;

        > .input-container {
            display: flex;
            flex: 0 1 100%;
            height: 60px;
            padding: 0 10px;
            border-radius: 5px;
            align-items: center;
            border: 1px solid ${({theme}) => theme.palette.grey[400]};
            margin-top: 5px;
        
            > p, > input {
                display: flex;
                flex: 1;
                height: 90%;
                padding: 0 10px;
                margin: 0 10px;
                align-items: center;
                font-size: 25px;
            }
        
            > input, > input:active, > input:focus {
                outline: 0;
                border: 1px dashed ${({theme}) => theme.palette.grey[400]};
            }
        
            > input::placeholder {
                font-size:15px;
            }
        
            > .loading {
                display: flex;
                align-items: center;
            }
        }
    }
`

const addItemFormValuesValidationScheme = object({
    term: string().required().oneOf(['prelim', 'midterm', 'prefinal', 'final']),
    component: string().required().oneOf(["AQ", "AA", "TT"]),
    description: string().required().min(10).max(30),
    hps: number().required().min(5).max(100),
});


const DataEntryTabPannelFC: React.FC<IStyledFC> = ({className}) => {
    const sheet = useSheetContex();
    const successAlert = useSuccessAlert();
    const errorAlert = useErrorAlert();
    const [addItemValidationError, setAddItemValidationError] = React.useState<null | string>(null);
    const [componentItemFilter, setComponenetItemFilter] = React.useState<"ALL" | "AQ" | "AA" | "TT">("ALL");
    const [submittingForm, setSubmittingForm] = React.useState(false);
    const [addItemDialogOpen, setAddItemDialogOpen] = React.useState(false);
    const [addItemFormValues, setAddItemFormValue] = React.useState({
        term: sheet.term,
        component: "",
        description: "",
        hps: ""
    });
    const [selectedStudent, setselectedStudent] = React.useState<IGradingSheetStudent | null>(null);
    const [componentItem, setComponentItem] = React.useState<"AQ" | "AA" | "TT" | "CS">("AQ");
    const [classStandingItemType, setClassStandingItemType] = React.useState("");
    const [itemId, setItemId] = React.useState('');

    const studentObtainedScore = React.useMemo(() => {
        const find = sheet.studentsScores.find(item => item.itemId == itemId && item.studentId == selectedStudent?.student_id);
        return find? find.score : 'INC';
    }, [selectedStudent, itemId, sheet.studentsScores]);

    const studentClassStandingGrade = React.useMemo(() => {
        const find = sheet.classStandingGrades.find(item => item.studentId == selectedStudent?.student_id && item.term == sheet.term && item.itemType == classStandingItemType);
        return find? find.grade : "INC";
    }, [selectedStudent, classStandingItemType, sheet.classStandingGrades, sheet.term])

    const studentGradePercentage = React.useCallback((score: string, hps: string) => {
        if(score.toUpperCase() == "INC") return "INC";

        const baseGrade = +sheet.gradingSystem.componentsItemTransmutationScale.baseGrade;
        const transmulationRange = 100 - baseGrade;
        const percentage = ((+score / +hps) * transmulationRange) + baseGrade;
        const round = Math.round(percentage * 100) / 100;

        return String(round);
    }, [studentObtainedScore, componentItem, sheet.gradingSystem.componentsItemTransmutationScale.baseGrade, sheet.term]);

    const handleClose = () => {
        setAddItemDialogOpen(false);
    };

    const  handleAddItem = async () => {
        try {
            await addItemFormValuesValidationScheme.validate({...addItemFormValues});
            if(addItemValidationError) setAddItemValidationError(null);
            setSubmittingForm(true);
            try {
                const response = await fetch("/api/add-component-item", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({...addItemFormValues, sheetId: sheet.gradingSheet?.id})
                });

                if(response.ok) {
                    const data = await response.json();
                    sheet.dataUpdate.componentItems([...sheet.componentItems, {
                        id: data.data.insertId,
                        component: addItemFormValues.component,
                        highest_posible_score: Number(addItemFormValues.hps),
                        description: addItemFormValues.description,
                        sheet_id: Number(sheet.gradingSheet.id),
                        term: sheet.term
                    }]);

                    setAddItemFormValue({
                        term: sheet.term,
                        component: "",
                        description: "",
                        hps: ""
                    });

                    successAlert.setMessage("New item added")
                } else {
                    throw new Error()
                }
            }
            catch (err) {
                errorAlert.setError('Error bes')
            }
            finally {
                setSubmittingForm(false);
            }
        }
        catch (err:any) {
            setAddItemValidationError(err.errors? err.errors : 'Please check your input properly')
        }
    }

    React.useEffect(() => {
        setAddItemFormValue({...addItemFormValues, term: sheet.term});
        setItemId('')
    }, [sheet.term])
    return(
        <div className={className}>
            <AddItemDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={addItemDialogOpen}
            >
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">Add Component Item</DialogTitle>
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
                    <AddItemForm>
                        {
                            addItemValidationError? <Alert sx={{flex: '0 1 100%'}} severity="error">{addItemValidationError}.</Alert> : ""
                        }
                        <div className="row">
                            <FormControl fullWidth size='small'>
                                <InputLabel id="term-label">Term</InputLabel>
                                <Select
                                    readOnly
                                    labelId="term-label"
                                    id="term"
                                    label="Term"
                                    sx={{ minWidth: 120 }}
                                    value={addItemFormValues.term}
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
                            <FormControl fullWidth size='small' required>
                                <InputLabel id="component-label">Component</InputLabel>
                                <Select
                                    required
                                    disabled={submittingForm}
                                    labelId="component-label"
                                    id="component"
                                    label="Component"
                                    sx={{ minWidth: 120 }}
                                    value={addItemFormValues.component}
                                    onChange={(e) => setAddItemFormValue({...addItemFormValues, component: e.target.value})}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="AQ">
                                        Average Quiz
                                    </MenuItem>
                                    <MenuItem value="AA">
                                        Assignments & Activities
                                    </MenuItem>
                                    {
                                        !sheet.componentsItemsPerTerm[sheet.term]["TT"].length? 
                                        <MenuItem value="TT">
                                            Term Test
                                        </MenuItem> : ''
                                    }
                                </Select> 
                            </FormControl>
                        </div>
                        <div className="row">
                            <TextField
                            disabled={submittingForm}
                            required
                            label="Descriptions"
                            id="filled-size-normal"
                            variant="outlined"
                            size='small'
                            multiline
                            fullWidth
                            value={addItemFormValues.description}
                            onChange={(e) => setAddItemFormValue({...addItemFormValues, description: e.target.value})}
                            />
                        </div>
                        <div className="row">
                            <TextField
                            disabled={submittingForm}
                            required
                            label="Highest posible score "
                            id="filled-size-normal"
                            variant="outlined"
                            size='small'
                            fullWidth
                            type='number'
                            value={addItemFormValues.hps}
                            onChange={(e) => setAddItemFormValue({...addItemFormValues, hps: e.target.value})}
                            />
                        </div>
                    </AddItemForm>
                </DialogContent>
                <DialogActions>
                    <Button loading={submittingForm} variant="contained" size='large' endIcon={<AddIcon />}
                    onClick={handleAddItem}>Add Item</Button>
                </DialogActions>
            </AddItemDialog>
            <div className="actions">
                <h3>Component Items</h3>
                <div className="filter-item-select">
                    <FilterAltIcon />
                    <Select
                    value={componentItemFilter}
                    size='small'
                    onChange={(e) => setComponenetItemFilter(e.target.value)}
                    >
                        <MenuItem value={"ALL"}>All Items</MenuItem>
                        <MenuItem value={'AQ'}>Average Quiz</MenuItem>
                        <MenuItem value={"AA"}>Assignments & Activities</MenuItem>
                        <MenuItem value={"TT"}>Term Test</MenuItem>
                    </Select>
                </div>
                <Button sx={{marginLeft: 'auto'}} size='small' variant="contained" endIcon={<AddIcon />} onClick={() => setAddItemDialogOpen(true)}>Add Item</Button>
            </div>
            {
                sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].length? <>
                    {
                        componentItemFilter == "ALL"? <div className="items">
                            {
                                sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].map((item) => <ComponentItem key={item.id} item={item} isTermTest={String(item.component == "TT")} />)
                            }
                        </div> : "" 
                    }
                    {
                        componentItemFilter == "AQ"? <>
                        {
                            sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].length?
                            <div className="items">
                                {
                                    sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].map(item => <ComponentItem key={item.id} item={item} isTermTest={String(item.component == "TT")} />)
                                }
                            </div> : 
                            <div className="nodata">
                                <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                <h1>No data to Display</h1>
                            </div>
                        }
                        </> : ""
                    }
                    {
                        componentItemFilter == "AA"? <>
                        {
                            sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].length?
                            <div className="items">
                                {
                                    sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].map(item => <ComponentItem key={item.id} item={item} isTermTest={String(item.component == "TT")} />)
                                }
                            </div> : 
                            <div className="nodata">
                                <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                <h1>No data to Display</h1>
                            </div>
                        }
                        </> : ""
                    }
                    {
                        componentItemFilter == "TT"? <>
                        {
                            sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].length? 
                            <div className="items">
                                {
                                    sheet.componentsItemsPerTerm[sheet.term][componentItemFilter].map(item => <ComponentItem key={item.id} item={item} isTermTest={String(item.component == "TT")} />)
                                }
                            </div> : 
                            <div className="nodata">
                                <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                <h1>No data to Display</h1>
                            </div>
                        }
                        </> : ""
                    }
                </> : 
                <div className="nodata">
                    <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                    <h1>No data to Display</h1>
                </div>
            }
            <div className="obtained-score-input-container">
                <h3>Student's Obtained Score Input</h3>
                <div className="form">
                    <div className="row">
                        <FormControl fullWidth>
                            <InputLabel id="term-label">Term</InputLabel>
                            <Select
                                readOnly
                                labelId="term-label"
                                id="term"
                                label="Term"
                                sx={{ minWidth: 120 }}
                                value={sheet.term}
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
                        <SelectStudentAutoComplete students={sheet.students} value={selectedStudent} onChange={(v) => setselectedStudent(v)} />
                    </div>
                    <div className="row">
                        <FormControl fullWidth required>
                            <InputLabel id="component-label">Component</InputLabel>
                            <Select
                            required
                            labelId="component-label"
                            id="component"
                            label="Component"
                            sx={{ minWidth: 120 }}
                            value={componentItem}
                            onChange={(e) => {
                                setComponentItem(e.target.value);
                                setItemId('')
                            }}
                            >
                                <MenuItem value="AQ">Average Quiz</MenuItem>
                                <MenuItem value="AA">Assignments & Activities</MenuItem>
                                <MenuItem value="TT">Term Test</MenuItem>
                                <MenuItem value="CS">Class Standing</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                    {
                        componentItem == "AA" || componentItem == "AQ" || componentItem == "TT"? <>
                            <div className="row">
                                <FormControl fullWidth required>
                                    <InputLabel id="component-item-label">Component Item</InputLabel>
                                    <Select
                                    required
                                    labelId="component-item-label"
                                    id="component-item"
                                    label="Component Item"
                                    sx={{ minWidth: 120 }}
                                    value={itemId}
                                    onChange={(e) => setItemId(e.target.value)}
                                    >
                                        <MenuItem value=""><em>No item Selected</em></MenuItem>
                                        {
                                            sheet.componentsItemsPerTerm[sheet.term][componentItem].map(item => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item.description}
                                                    <Chip
                                                    sx={{marginLeft: 'auto'}}
                                                    color="info"
                                                    label={`Item ID: ${item.id}`}
                                                    size="small"
                                                    />
                                                </MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                                {
                                    selectedStudent && itemId? <>
                                        <ObtainedScoreInputContex.Provider value={{
                                            score: studentObtainedScore,
                                            studentId: selectedStudent.student_id,
                                            itemInfo: sheet.componentsItemsPerTerm[sheet.term][componentItem].find(item => String(item.id) == itemId) as TComponentItem
                                        }}>
                                            <ObtainedScoreInput />
                                        </ObtainedScoreInputContex.Provider>
                                    </> : ''
                                }
                            </div>
                        </> : ""
                    }
                    {
                        componentItem == "CS"? <>
                            <div className="row">
                                <FormControl fullWidth required>
                                    <InputLabel id="item-type-label">Item Type</InputLabel>
                                    <Select
                                    required
                                    labelId="item-type-label"
                                    id="item-type"
                                    label="Item Type"
                                    sx={{ minWidth: 120 }}
                                    value={classStandingItemType}
                                    onChange={(e) => setClassStandingItemType(e.target.value)}
                                    >
                                        <MenuItem value=""><em>No item Type Selected</em></MenuItem>
                                        <MenuItem value="recitation">Recitation</MenuItem>
                                        <MenuItem value="behavior">Behavior</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>
                            {
                                selectedStudent && classStandingItemType? <>
                                    <classStandingGradeInputContex.Provider
                                    value={{
                                        studentId: selectedStudent.student_id,
                                        itemType: classStandingItemType as ('recitation' | "behavior"),
                                        grade: studentClassStandingGrade
                                    }}>
                                        <ClassStandingGradeInput />
                                    </classStandingGradeInputContex.Provider>
                                </> : ""
                            }
                        </> : ""
                    }
                </div>
                <Paper className="preview" elevation={6}>
                    {
                        (() => {
                            const student = sheet.students.find(item => item.student_id == selectedStudent?.student_id);
                            return(<>
                            {
                                student? <>
                                    <Avatar className='avatar' alt={student.first_name} src={`${IMAGE_SERVER_URL}/images/avatar/${student.image_path}`} /> 
                                    <h1>{`${student.first_name} ${student.middle_name? student.middle_name[0].toUpperCase()+"." : ''} ${student.surname} ${student.suffix? student.suffix : ''}`}</h1>
                                    {
                                        itemId && (componentItem == "AA" || componentItem == "AQ" || componentItem == "TT")? 
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td className='property'>Term: </td>
                                                    <td className='value'>{sheet.term.toUpperCase()}</td>
                                                </tr>
                                                <tr>
                                                    <td className='property'>Component: </td>
                                                    <td className='value'>{componentItem == "AQ"? "Average Quiz (AQ)" : componentItem == "AA"? "Assignments & Activities (AA)" : "Term TGest (TT)"}</td>
                                                </tr>
                                                <tr>
                                                    <td className='property'>Item: </td>
                                                    <td className='value'>
                                                        {
                                                            itemId? 
                                                            <>
                                                                {
                                                                    (() => {
                                                                        const findItem = sheet.componentsItemsPerTerm[sheet.term][componentItem].find(item => String(item.id) == itemId);
                                                                        return findItem? <>
                                                                            { findItem.description }
                                                                            <Chip
                                                                            sx={{marginLeft: '10px'}}
                                                                            color="info"
                                                                            label={`Item ID: ${findItem.id}`}
                                                                            size="small"
                                                                            />
                                                                        </> : ""
                                                                    })()
                                                                }
                                                            </> : ""
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className='property'>Student's Score: </td>
                                                    <td className='value'>{`${studentObtainedScore} / ${sheet.componentsItemsPerTerm[sheet.term][componentItem].find(item => String(item.id) == itemId)?.highest_posible_score}`}</td>
                                                </tr>
                                                <tr>
                                                    <td className='property'>Grade: </td>
                                                    <td className='value'>{studentGradePercentage(studentObtainedScore, String(sheet.componentsItemsPerTerm[sheet.term][componentItem].find(item => String(item.id) == itemId)?.highest_posible_score) )}</td>
                                                </tr>
                                                <tr>
                                                    <td className='property'>Remarks: </td>
                                                    <td className='value' style={{backgroundColor: remarkColors[getRemark(studentGradePercentage(studentObtainedScore, String(sheet.componentsItemsPerTerm[sheet.term][componentItem].find(item => String(item.id) == itemId)?.highest_posible_score) ))], color: 'white'}}>{getRemark(studentGradePercentage(studentObtainedScore, String(sheet.componentsItemsPerTerm[sheet.term][componentItem].find(item => String(item.id) == itemId)?.highest_posible_score) ))}</td>
                                                </tr>
                                            </tbody>
                                        </table> : ""
                                    }  
                                    {
                                       classStandingItemType && componentItem == "CS"? <>
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td className='property'>Term: </td>
                                                        <td className='value'>{sheet.term.toUpperCase()}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='property'>Item Type: </td>
                                                        <td className='value'>{classStandingItemType}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='property'>Grade: </td>
                                                        <td className='value'>{studentClassStandingGrade}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                       </> : "" 
                                    }
                                </> : <h3>No Student selected</h3>
                            }
                            </>
                            )
                        })()                        
                    }
                </Paper>
            </div>
        </div>
    )
};

const DataEntryTabPannel = styled(DataEntryTabPannelFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        min-width: 0;
        flex-wrap: wrap;

        > .actions {
            display: flex;
            flex: 0 1 100%;
            margin: 10px 0;
            align-items: center;

            > .filter-item-select {
                display: flex;
                align-items: center;
                margin: 0 20px;
                gap: 10px;
                width: fit-content;
            }
        }

        > .items-container {
            display: flex;
            flex: 0 1 100%;
            min-width: 0;
        }
        
        > .items {
            display: flex;
            width: fit-content;
            overflow-x: auto;
            padding: 5px 20px;
            margin-top: 20px;
            gap: 20px;

        
        }

        > .nodata {
            display: flex;
            flex: 0 1 100%;
            height: 300px;
            align-items: center;
            justify-content: center;
            background-color: ${({theme}) => theme.palette.mode == "dark"? "#565656" : "#e9e9e9"};
            flex-direction: column;
        }

        > .obtained-score-input-container {
            display: flex;
            flex: 0 1 100%;
            padding: 20px 0;
            height: fit-content;
            flex-wrap: wrap;
            overflow-x: auto;

            > h3 {
                flex: 0 1 100%;
            }

            > .form {
                display: flex;
                flex: 0 1 500px;
                height: fit-content;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 20px;

                > .row {
                    flex: 0 1 100%;
                }
            }

            > .preview {
                display: flex;
                flex: 1;
                flex-wrap: wrap;
                align-items: center;
                justify-content: center;
                height: fit-content;
                min-height: 300px;
                margin: 20px;
                padding: 20px;

                > .avatar {
                    width: 30%;
                    min-width: 150px;
                    height: auto;
                    aspect-ratio: 2/2;
                }

                > h1 {
                    flex: 0 1 100%;
                    text-align: center;
                    padding: 20px 0;
                }

                > table {
                    width: fit-content;
                    column-gap: 10px;
                    row-gap: 10px;
                    border-collapse: collapse;
                    width: 100%;

                    > tbody {
                        > tr {
    
                            > td {
                                padding: 10px;
                                border: 1px solid gray
                            }
    
                            > .property {
                                width: fit-content;
                                text-align: right;
                                font-weight: bold;
                            }
    
                            > .value {
                                text-align: right;
                            }
                        }
                    }

                }
            }
        }
    }
`;

export default DataEntryTabPannel;