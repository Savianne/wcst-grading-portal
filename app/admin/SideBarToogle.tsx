"use client"
import React from "react"
import { styled } from '@mui/material/styles';
import { IStyledFC } from "../types/IStyledFC"
import { useSidebar } from "../context/SideBarProvider"

const SideBarToogleFC: React.FC<IStyledFC> = ({className}) => {
    const { isOpen, toggleSidebar } = useSidebar();

    return(
        <div className={className} style={{backgroundColor: isOpen? 'white' : "#0F4E71"}} onClick={toggleSidebar}> 
            <svg style={{fill: isOpen? "#0F4E71" : 'white'}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M16 132h416c8.8 0 16-7.2 16-16V76c0-8.8-7.2-16-16-16H16C7.2 60 0 67.2 0 76v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16zm0 160h416c8.8 0 16-7.2 16-16v-40c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v40c0 8.8 7.2 16 16 16z"/></svg>
        </div>
    )
}

const SideBarToogle = styled(SideBarToogleFC)`
    && {
        display: flex;
        width: 100px;
        height: 100px;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: 400ms background-color;
        /* border-bottom: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#343131" : "#cfcfcf"}; */
        border-right: 1px solid ${({theme}) => theme.palette.mode == "dark"? "#343131" : "#cfcfcf"};

        > svg {
            width: 40px;
            height: 40px;
            transition: 400ms fill;
        }
    }

`;

export default SideBarToogle