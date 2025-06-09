"use client";
import { styled } from '@mui/material/styles';
import React from "react";
import { IStyledFC } from "../types/IStyledFC";
import SideBarToogle from "./SideBarToogle";
import Image from 'next/image';
import ThemeToggle from '../components/ThemeToogle';

//MUI Components
import { 
    Avatar,
    Divider

} from "@mui/material";


const PageHeaderFC: React.FC<IStyledFC> = ({className}) => {
    return(
        <header className={className}>
            <SideBarToogle />
            <div className="img-container">
                <Image src={"/wcst-logo.png"} alt="logo" width={500} height={500} style={{width: "100%", height: 'auto'}}/>
            </div>
            <Avatar
            sx={{ width: 56, height: 56, backgroundColor: "#1f9ae2", marginLeft: "auto" }}
            >A</Avatar>
            <Divider orientation="vertical" variant="middle" flexItem sx={{margin: '20px'}}/>
            <ThemeToggle />
        </header>
    )
}

const PageHeader = styled(PageHeaderFC)`
    && {
        display: flex;
        width: 99%;
        height: 100px;
        position: fixed;
        align-items: center;
        top: 0;
        left: 0;
        border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#343131" : "#cfcfcf"};
        background-color: ${({theme}) => theme.palette.mode == "dark"? "#121212" : "white"};
        z-index: 100;

        > .img-container {
            width: 75px;
            height: auto;
            margin-left: 20px;
        }
    }
`;

export default PageHeader;