"use client";
import { styled } from '@mui/material/styles';
import React from "react";
import { redirect, useRouter, usePathname } from "next/navigation";
import { signOut } from 'next-auth/react';
import { IStyledFC } from "../types/IStyledFC";
import { useSidebar } from "../context/SideBarProvider"

//MUI Components
import { 
    Button,
    IconButton,

} from "@mui/material";

//MUI Icons
import LogoutIcon from '@mui/icons-material/Logout';


const PageSideBarFC: React.FC<IStyledFC> = ({className}) => {
    const router = useRouter();
    const path = usePathname();

    const { isOpen } = useSidebar();
    return(
        <aside className={className} style={{width: isOpen? "250px" : '100px'}}>
            <div className="link" onClick={(e) => router.push('/teacher/dashboard')}>
                <div className="icon" style={{backgroundColor: path === "/teacher/dashboard"? "white" : "#332c4e"}}>
                    <svg style={{fill: path === "/teacher/dashboard"? "#332c4e" : "white"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32C128.9 32 0 160.9 0 320c0 52.8 14.3 102.3 39.1 144.8 5.6 9.6 16.3 15.2 27.4 15.2h443c11.1 0 21.8-5.6 27.4-15.2C561.8 422.3 576 372.8 576 320c0-159.1-128.9-288-288-288zm0 64c14.7 0 26.6 10.1 30.3 23.7-1.1 2.3-2.6 4.2-3.5 6.7l-9.2 27.7c-5.1 3.5-11 6-17.6 6-17.7 0-32-14.3-32-32S270.3 96 288 96zM96 384c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm48-160c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm246.8-72.4l-61.3 184C343.1 347.3 352 364.5 352 384c0 11.7-3.4 22.6-8.9 32H232.9c-5.5-9.5-8.9-20.3-8.9-32 0-33.9 26.5-61.4 59.9-63.6l61.3-184c4.2-12.6 17.7-19.5 30.4-15.2 12.6 4.2 19.4 17.8 15.2 30.4zm14.7 57.2l15.5-46.6c3.5-1.3 7.1-2.2 11.1-2.2 17.7 0 32 14.3 32 32s-14.3 32-32 32c-11.4 0-20.9-6.3-26.6-15.2zM480 384c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>
                </div>
                <p>Dashboard</p>
            </div>
            <div className="link" onClick={(e) => router.push('/teacher/grading-sheets')}>
                <div className="icon" style={{backgroundColor: path === "/teacher/grading-sheets"? "white" : "#332c4e"}}>
                    <svg style={{fill: path === "/teacher/grading-sheets"? "#332c4e" : "white"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm88 64l0 64-88 0 0-64 88 0zm56 0l88 0 0 64-88 0 0-64zm240 0l0 64-88 0 0-64 88 0zM64 224l88 0 0 64-88 0 0-64zm232 0l0 64-88 0 0-64 88 0zm64 0l88 0 0 64-88 0 0-64zM152 352l0 64-88 0 0-64 88 0zm56 0l88 0 0 64-88 0 0-64zm240 0l0 64-88 0 0-64 88 0z"/></svg>
                </div>
                <p>Grading Sheets</p>
            </div>
            
            <div className="btn-logout" style={{width: isOpen? "250px" : '100px'}}>
                {
                    isOpen? <Button size="large" fullWidth style={{ color: "#332c4e" }} startIcon={<LogoutIcon />} onClick={() => signOut()}>Logout</Button>
                    : <IconButton aria-label="logout" style={{color: "#332c4e"}} onClick={() => signOut()}>
                        <LogoutIcon />
                    </IconButton>}
            </div>
        </aside>
    )
};

const PageSideBar = styled(PageSideBarFC)`
    && {
        display: flex;
        height: calc(100vh - 100px);
        border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#343131" : "#cfcfcf"};
        position: fixed;
        flex-wrap: wrap;
        align-content: flex-start;
        top: 100px;
        overflow-x: hidden;
        left: 0;
        transition: 400ms width;

        > .link {
            display: flex;
            align-items: center;
            width: 250px;
            height: 70px;
            border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#343131" : "#cfcfcf"};
            margin-bottom: 1px;
            cursor: pointer;
            

            > .icon {
                display: flex;
                width: 100px;
                height: 70px;
                justify-content: center;
                align-items: center;
                background-color: #0F4E71;

                 > svg {
                    width: 40px;
                    height: 40px;
                    fill: white;
                    transition: 400ms fill;
                }
            }

            > p {
                display: flex;
                width: 130px;
                margin-left: 20px;
                height: fit-content;
                font-size: 18px;
                font-weight: bold;
                color: ${({theme}) => theme.palette.mode == "dark"? "white" : "#332c4e"};
            }
        }

        > .btn-logout {
            position: absolute;
            bottom: 20px;
            display: flex;
            justify-content: center;
            padding: 0 10px;
        }
    }
`

export default PageSideBar;