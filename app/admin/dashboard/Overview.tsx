"use client";
import { styled } from '@mui/material/styles';
import React from "react";
import { useRouter } from "next/navigation";
import { IStyledFC } from '@/app/types/IStyledFC';

//MUI Components
import { 
    Box,
    Paper,
    IconButton,
    Skeleton
} from '@mui/material';

//MUI Icons
import GroupIcon from '@mui/icons-material/Group';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface IOverviewData {
    totalAccounts: number
    teachersAccount: number
    studentsAccount: number
    courses: number
    subjects: number
}

const StaticticCard = styled(Paper)`
    && {
        display: flex;
        flex-wrap: wrap;
        border-radius: 5px;

        > .top {
            display: flex;
            flex: 0 1 100%;
            padding: 10px;
            border-radius: 5px 5px 0 0;
            color: white;
            height: fit-content;
            background-color: orange;

            > .data-area {
                display: flex;
                margin-left: auto;
                flex-direction: column;
                align-items: flex-end;
            }
        }

        > .bottom {
            display: flex;
            flex: 0 1 100%;
            padding: 20px 10px;
            align-items: center;
            justify-content: center;
        }
    }
`

const OverviewFC: React.FC<IStyledFC> = ({className}) => {
    const router = useRouter();
    const [overview, setOverview] = React.useState<null | IOverviewData>(null);
    const [isLoadingOverviewData, setIsLoadingOverviewData] = React.useState(true);

    React.useEffect(() => {
        setIsLoadingOverviewData(true)
        fetch('/api/get-overview')
        .then(response => {
            if(response.ok) return response.json()
        })
        .then(data => {
            setOverview({...data.data})
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            setTimeout(() => {
                setIsLoadingOverviewData(false)
            }, 1000)
        })
    }, [])
    return(
        <div className={className}> 
        {
            isLoadingOverviewData? <>
                <Skeleton variant="rounded" height={200} />
                <Skeleton variant="rounded" height={200} />
                <Skeleton variant="rounded" height={200} />
                <Skeleton variant="rounded" height={200} />
                <Skeleton variant="rounded" height={200} />
            </> : <>
                <StaticticCard>
                    <div className="top" style={{backgroundColor: 'rgb(163 6 128)'}}>
                        <GroupIcon sx={{fontSize: '80px'}}/>
                        <div className="data-area">
                            <h1>{overview?.totalAccounts}</h1>
                            <h5>All Accounts</h5>
                        </div>
                    </div>
                    <div className="bottom">
                        <p>View details</p>
                        <IconButton aria-label="delete" size="large" color='primary' sx={{marginLeft: 'auto'}}
                        onClick={() => {
                            router.push('./accounts')
                        }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                </StaticticCard>
                <StaticticCard>
                    <div className="top" style={{backgroundColor: '#080866'}}>
                        <GroupIcon sx={{fontSize: '80px'}}/>
                        <div className="data-area">
                            <h1>{overview?.teachersAccount}</h1>
                            <h5>Teachers</h5>
                        </div>
                    </div>
                    <div className="bottom">
                        <p>View details</p>
                        <IconButton aria-label="delete" size="large" color='primary' sx={{marginLeft: 'auto'}}
                        onClick={() => {
                            router.push('./accounts/teachers')
                        }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                </StaticticCard>
                <StaticticCard>
                    <div className="top" style={{backgroundColor: '#a42a03'}}>
                        <GroupIcon sx={{fontSize: '80px'}}/>
                        <div className="data-area">
                            <h1>{overview?.studentsAccount}</h1>
                            <h5>Students</h5>
                        </div>
                    </div>
                    <div className="bottom">
                        <p>View details</p>
                        <IconButton aria-label="delete" size="large" color='primary' sx={{marginLeft: 'auto'}}
                        onClick={() => {
                            router.push('./accounts/students')
                        }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                </StaticticCard>
                <StaticticCard>
                    <div className="top" style={{backgroundColor: '#6e6e13'}}>
                        <FolderIcon sx={{fontSize: '80px'}}/>
                        <div className="data-area">
                            <h1>{overview?.courses}</h1>
                            <h5>Courses</h5>
                        </div>
                    </div>
                    <div className="bottom">
                        <p>View details</p>
                        <IconButton aria-label="delete" size="large" color='primary' sx={{marginLeft: 'auto'}}
                        onClick={() => {
                            router.push('./courses')
                        }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                </StaticticCard>
                <StaticticCard>
                    <div className="top" style={{backgroundColor: '#336f5e'}}>
                        <FolderIcon sx={{fontSize: '80px'}}/>
                        <div className="data-area">
                            <h1>{overview?.subjects}</h1>
                            <h5>Subjects</h5>
                        </div>
                    </div>
                    <div className="bottom">
                        <p>View details</p>
                        <IconButton aria-label="delete" size="large" color='primary' sx={{marginLeft: 'auto'}}
                        onClick={() => {
                            router.push('./subjects')
                        }}>
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>
                </StaticticCard>
            </>
        }
        </div>
    )
}

const Overview = styled(OverviewFC)`
    display: grid;
    width: 100%;
    padding: 50px 0;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 10px;
`;

export default Overview;
