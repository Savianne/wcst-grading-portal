"use client"
import React from 'react';
import { debounce } from "lodash";
import axios, { CancelTokenSource } from 'axios';
import { styled } from '@mui/material/styles';
import { IStyledFC } from '@/app/types/IStyledFC';
import { useSheetContex } from './Sheet';
import { TComponentItem } from '@/app/types/component-item-type';
import IMAGE_SERVER_URL from '@/IMAGE_SERVER_URL';
import { useErrorAlert } from '@/app/context/PageErrorAlertProvider';
import { useSuccessAlert } from '@/app/context/PageSuccessAlertProvider';
import { IGradingSheetStudent } from './Sheet';
import GradingSheetTable from './GradingSheetTable';
import DataEntryTabPannel from './DataEntryTabPanel';
import AttendanceTabPanel from './AttendanceTabPanel';

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
import InputIcon from '@mui/icons-material/Input';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FreeCancellationIcon from '@mui/icons-material/FreeCancellation';


const TermsTabPannelFC: React.FC<IStyledFC> = ({className}) => {
    const sheet = useSheetContex();
    const [tab, setTab] = React.useState<"data-entrty" | "attendance" | "view">("view");

    return(
        <div className={className}>
            <div className="panel-heading">
                <div className="chips">
                    <Chip
                    clickable
                    icon={<InputIcon />}
                    color='primary'
                    variant={tab == "data-entrty"? 'filled' : 'outlined'}
                    label="Data Entry"
                    size="medium"
                    onClick={() => setTab("data-entrty")}
                    />
                    <Chip
                    clickable
                    icon={<FreeCancellationIcon />}
                    color='primary'
                    variant={tab == "attendance"? 'filled' : 'outlined'}
                    label="Attendance"
                    size="medium"
                    onClick={() => setTab("attendance")}
                    />
                    <Chip
                    clickable
                    icon={<VisibilityIcon />}
                    color='primary'
                    variant={tab == "view"? 'filled' : 'outlined'}
                    label="View"
                    size="medium"
                    onClick={() => setTab("view")}
                    />
                </div>
            </div>
            <Divider orientation='horizontal' sx={{flex: '0 1 100%',height: 'fit-content', marginTop: '20px'}}/>
            <div className="panel-body">
                {
                    tab == "view"? <GradingSheetTable /> : ''
                }
                {
                    tab == "data-entrty"? <DataEntryTabPannel /> : ''
                }
                {
                    tab == "attendance"? <AttendanceTabPanel /> : ''
                }
            </div>
        </div>
    )
};

const TermsTabPannel = styled(TermsTabPannelFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        min-width: 0;
        flex-wrap: wrap;
        align-content: flex-start;

        > .panel-heading {
            display: flex;
            flex: 0 1 100%;
            height: fit-content;

            > .chips {
                display: flex;
                gap: 5px;
                height: fit-content;
            }
        }

        > .panel-body {
            display: flex;
            flex: 0 1 100%;
            min-width: 0;
        }
    }
`;

export default TermsTabPannel;