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


const GradingSheetTableFC: React.FC<IStyledFC> = ({className}) => {
    const [tab, setTab] = React.useState<"AQ" | "AA" | "CS" | "TT">("AQ")
    return(
        <div className={className}> 
            <div className="panel-heading">
                <div className="chips-tab">
                    <Chip
                    clickable
                    label={`AVERAGE QUIZ`}
                    variant={tab == "AQ"? "filled" : "outlined"}
                    color={tab == "AQ"? "primary" : "default"}
                    onClick={() => setTab("AQ")}
                    />
                    <Chip
                    clickable
                    label={`ASSIGNMENT & ACTIVITIES`}
                    variant={tab == "AA"? "filled" : "outlined"}
                    color={tab == "AA"? "primary" : "default"}
                    onClick={() => setTab("AA")}
                    />
                    <Chip
                    clickable
                    label={`CLASS STANDING`}
                    variant={tab == "CS"? "filled" : "outlined"}
                    color={tab == "CS"? "primary" : "default"}
                    onClick={() => setTab("CS")}
                    />
                    <Chip
                    clickable
                    label={`TERM TEST`}
                    variant={tab == "TT"? "filled" : "outlined"}
                    color={tab == "TT"? "primary" : "default"}
                    onClick={() => setTab("TT")}
                    />
                </div>
            </div>
            <Divider sx={{width: '100%'}}/>
            {/* <h4>Component items (Quizzes)</h4>
            <div className="component-items-list">
                <Paper className="item" elevation={6}>
                    <h1>1</h1>
                    <Divider orientation='vertical' variant='middle'/>
                    <h4>20pts</h4>
                </Paper>
                <Paper className="item" elevation={6}>
                    <h1>2</h1>
                    <Divider orientation='vertical' variant='middle'/>
                    <h4>20pts</h4>
                </Paper>
                <Paper className="item" elevation={6}>
                    <h1>3</h1>
                    <Divider orientation='vertical' variant='middle'/>
                    <h4>20pts</h4>
                </Paper>
                <IconButton color="primary" aria-label="add item" sx={{width: "70px", height: "70px"}}>
                    <AddIcon />
                </IconButton>
            </div> */}

        </div>
    )
}

const GradingSheetTable = styled(GradingSheetTableFC)`
    display: flex;
    flex: 0 1 100%;
    height: fit-content;
    flex-wrap: wrap;

    > .panel-heading {
        display: flex;
        flex: 0 1 100%;
        gap: 10px;
        align-items: center;
        /* justify-content: center; */
        margin-bottom: 20px;

        > .chips-tab {
            display: flex;
            gap: 5px;
        }

    }

    > .component-items-list {
        display: flex;
        flex: 0 1 100%;
        padding: 10px 0;
        gap: 10px;

        > .item {
            display: flex;
            width: fit-content;
            padding: 10px;
            align-items: center;
            border-radius: 0 5px 5px 0;
            border-left: 4px solid #2cff07;
            /* border: 1px solid #dddddd; */

            > h1 {
                display: flex;
                width: 50px;
                align-items: center;
                justify-content: center;
            }

            > h4 {
                margin-left: 15px;
            }
        }
    }

`

export default GradingSheetTable;