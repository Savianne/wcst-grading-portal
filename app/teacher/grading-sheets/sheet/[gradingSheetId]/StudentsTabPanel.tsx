"use client"
import React from 'react';
import { debounce } from "lodash";
import axios, { CancelTokenSource } from 'axios';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import IMAGE_SERVER_URL from '@/IMAGE_SERVER_URL';
import { useErrorAlert } from '@/app/context/PageErrorAlertProvider';
import { useSuccessAlert } from '@/app/context/PageSuccessAlertProvider';

//MUI Components
import { 
    Avatar,
    Paper,
    Divider,
    Chip,
    Skeleton,
    InputBase,
    IconButton,
    CircularProgress,
} from "@mui/material";
//MUI Icons
import WcIcon from '@mui/icons-material/Wc';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import SearchIcon from '@mui/icons-material/Search';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import AddIcon from '@mui/icons-material/Add';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

const StudentCard = styled(Paper)`
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    flex-direction: column;
    gap: 10px;
`;

interface IGradingSheetStudent {
    id: string;
    student_id: string;
    grading_sheet_id: string;
    uid: string;
    first_name: string;
    middle_name: string;
    sex: string;
    date_of_birth: string;
    surname: string
    suffix: string | null;
    image_path: string | null;
}

interface ISearchResult {
    student_id: string;
    fullname: string;
    first_name: string;
    middle_name: string;
    sex: string;
    date_of_birth: string;
    surname: string;
    suffix: string | null;
    picture: string | null;
    is_member: number;
}


interface ISerchResultItem extends IStyledFC {
    resultData: ISearchResult,
    sheetId: string;
    onAddSuccess: (id: string) => void
}

const SearchresutItemFC: React.FC<ISerchResultItem> = ({className, resultData, sheetId, onAddSuccess}) => {
    const {setMessage} = useSuccessAlert();
    const {setError} = useErrorAlert();
    const handleAddStudent = async () => {
        try {
            const result = await fetch('/api/add-grading-sheet-student', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({sheetId, studentId: resultData.student_id})
            });

            if(result.ok) {
                setMessage("New Student Added to the grading sheet");
                const data = await result.json();
                onAddSuccess(data.data.id)
            } else {
                throw new Error();
            }
        }
        catch(err) {
            setError("Something went wrong on the server. Please try again later.")
        }

    }
    return(
        <Paper className={className}>
            <Avatar sx={{width: '30px', height: '30px'}} src={resultData.picture? `${IMAGE_SERVER_URL}/images/avatar/${resultData.picture}` : undefined}/>
            <h5>{resultData.fullname}</h5>
            {
                !resultData.is_member? <IconButton onClick={handleAddStudent} color="primary" aria-label="add-student" sx={{marginLeft: 'auto'}}>
                    <AddIcon />
                </IconButton> : <RadioButtonCheckedIcon sx={{marginLeft: 'auto', width: '20px'}} />
            }
        </Paper>
    )
}

const SearchItem = styled(SearchresutItemFC)`
    display: flex;
    flex: 0 1 100%;
    padding: 10px;
    border-radius: 0;
    align-items: center;
    gap: 10px;
    border-left: 2px solid #007afd;
`

interface IStudentsTabPanelFC extends IStyledFC {
    gradingSheetId: string
}

const StudentsTabPanelFC: React.FC<IStudentsTabPanelFC> = ({className, gradingSheetId}) => {
    const {setError} = useErrorAlert();
    const { setMessage} = useSuccessAlert()
    const [tab, setTab] = React.useState<"all" | "male" | "female">("all");
    const [students, setStudents] = React.useState<IGradingSheetStudent[]>([]);
    const [searchResult, setSearchResult] = React.useState<ISearchResult[]>([]);
    const [loadingStudents, setLoadingStudents] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isSearching, setIsSearching] = React.useState(true);

    let cancelTokenSource: CancelTokenSource | null = null;

    const performSearch = async (searchTerm: string) => {
        if(searchTerm) {
            setIsSearching(true);

            if (cancelTokenSource) {
                const source = cancelTokenSource as CancelTokenSource;
                source.cancel("Operation cancelled by thr user");
            }

            cancelTokenSource = axios.CancelToken.source();

            try {
                const response = await axios({
                    url: "/api/search-grading-sheet-students",
                    method: "POST",
                    data: {
                        sheetId: gradingSheetId,
                        searchTerm
                    },
                    cancelToken: cancelTokenSource.token
                });

                const data = response.data;

                setSearchResult([...data.data])
            }
            catch(err) {
                setError("Something went wrong on the server. Please try again later. ")
                console.log(err)
            }
            finally {
                setIsSearching(false);
            }

        }
    }

    const debouncedSearch = React.useCallback(
        debounce((value: string) => {
            performSearch(value);
        }, 300),
        []
    );

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchTerm(value);
        debouncedSearch(value);
    }

    React.useEffect(() => {
        setLoadingStudents(true)
        fetch('/api/get-grading-sheet-students', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({sheetId: gradingSheetId})
        })
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setStudents([...data.data]);
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setTimeout(() => {
                setLoadingStudents(false)
            }, 1000)
        })
    }, [])

    return(
        <div className={className}> 
            <div className="panel-heading">
                <div className="chips-tab">
                    <Chip
                    clickable
                    icon={<WcIcon />}
                    label={`ALL: ${students.length}`}
                    variant={tab == "all"? "filled" : "outlined"}
                    color={tab == "all"? "primary" : "default"}
                    onClick={() => setTab("all")}
                    />
                    <Chip
                    clickable
                    icon={<ManIcon />}
                    label={`Male: ${students.filter(i => i.sex.toLowerCase() == "male").length}`}
                    variant={tab == "male"? "filled" : "outlined"}
                    color={tab == "male"? "primary" : "default"}
                    onClick={() => setTab("male")}
                    />
                    <Chip
                    clickable
                    icon={<WomanIcon />}
                    label={`Male: ${students.filter(i => i.sex.toLowerCase() == "female").length}`}
                    variant={tab == "female"? "filled" : "outlined"}
                    color={tab == "female"? "primary" : "default"}
                    onClick={() => setTab("female")}
                    />
                </div>
                <Divider orientation='vertical'/>
                <Paper
                component="form"
                className='search-bar'
                >
                     <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Search student to add" value={searchTerm} onChange={handleInputChange}/>
                     <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                        <SearchIcon />
                    </IconButton>
                </Paper>
            </div>
            {
                searchTerm? <div className="search-result">
                    <h4>Search Result: {isSearching? <CircularProgress  size="1px" /> : searchResult.length}</h4>
                    {
                        searchResult.map(result => (
                            <SearchItem key={result.student_id} resultData={result} onAddSuccess={(id) => {
                                setStudents([{
                                    id,
                                    student_id: result.student_id,
                                    grading_sheet_id: gradingSheetId,
                                    uid: result.student_id,
                                    first_name: result.middle_name,
                                    middle_name: result.middle_name,
                                    sex: result.sex,
                                    date_of_birth: result.date_of_birth,
                                    surname: result.surname,
                                    suffix: result.suffix,
                                    image_path: result.picture
                                }, ...students]);

                                setSearchResult([...searchResult.map(i => ({...i, is_member: i.student_id == result.student_id? 1 : i.is_member}))])
                            }} sheetId={gradingSheetId} />
                        ))
                    }
                </div> : ""
            }
            <div className="panel-body">
                {
                    loadingStudents? <>
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                        <Skeleton variant="rounded" width={"100%"} height={200} />
                    </> : <>
                        {
                            students.length? <>
                                {
                                    tab == "all"? <>
                                        {
                                            students.map(student => (
                                                <StudentCard key={student.student_id}>
                                                    <Avatar sx={{width: '100px', height: '100px'}} src={student.image_path? `${IMAGE_SERVER_URL}/images/avatar/${student.image_path}` : undefined} />
                                                    <h3>{student.first_name} {student.middle_name[0]}. {student.surname}</h3>
                                                </StudentCard>
                                            ))
                                        }
                                    </> : ''
                                }
                                {
                                    tab == "female"? <>
                                        {
                                            students.filter(student => student.sex.toLowerCase() == "female").length? <>
                                                {
                                                    students.filter(student => student.sex.toLowerCase() == "female").map(student => (
                                                        <StudentCard key={student.student_id}>
                                                            <Avatar sx={{width: '100px', height: '100px'}} src={student.image_path? `${IMAGE_SERVER_URL}/images/avatar/${student.image_path}` : undefined} />
                                                            <h3>{student.first_name} {student.middle_name[0]}. {student.surname}</h3>
                                                        </StudentCard>
                                                    ))
                                                }
                                            </> : <div className="nodata">
                                                <SentimentVeryDissatisfiedIcon sx={{fontSize: "100px"}}/>
                                                <h1>No data to Display</h1>
                                            </div>
                                        }
                                    </> : ""
                                }
                                {
                                    tab == "male"? <>
                                        {
                                            students.filter(student => student.sex.toLowerCase() == "male").length? <>
                                                {
                                                    students.filter(student => student.sex.toLowerCase() == "male").map(student => (
                                                        <StudentCard key={student.student_id}>
                                                            <Avatar sx={{width: '100px', height: '100px'}} src={student.image_path? `${IMAGE_SERVER_URL}/images/avatar/${student.image_path}` : undefined} />
                                                            <h3>{student.first_name} {student.middle_name[0]}. {student.surname}</h3>
                                                        </StudentCard>
                                                    ))
                                                }
                                            </> : <div className="nodata">
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
                    </>
                }
            </div>
        </div>
    )
}

const StudentsTabPanel = styled(StudentsTabPanelFC)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    flex-wrap: wrap;

    > .panel-heading {
        display: flex;
        flex: 0 1 100%;
        gap: 10px;
        align-items: center;

        > .chips-tab {
            display: flex;
            gap: 5px;
        }

        > .search-bar {
            display: flex;
            flex: 1;
            height: 40px;
        }
    }

    > .search-result {
        display: flex;
        flex-wrap: wrap;
        flex: 0 1 100%;
        align-items: center;
        gap: 5px;
    }

    > .panel-body {
        flex: 0 1 100%;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 10px;
        margin-top: 15px;


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
`;

export default StudentsTabPanel;