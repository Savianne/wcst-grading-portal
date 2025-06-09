"use client";
import { styled } from '@mui/material/styles';
import React from "react";
import { IStyledFC } from "../types/IStyledFC";
import { useSidebar } from "../context/SideBarProvider"
import Sitemap from '../components/Sitemap';

const PageContentContainerFC: React.FC<IStyledFC> = ({className, children}) => {
    const { isOpen } = useSidebar();
    return(
        <div className={className} style={{marginLeft: isOpen? "255px" : "105px"}}>
            <Sitemap />
            {children}
        </div>
    )
}

const PageContentContainer = styled(PageContentContainerFC)`
    display: flex;
    flex: 0 1 100%;
    flex-wrap: wrap;
    min-height: calc(100vh - 100px);
    margin-top: 105px;
    overflow: hidden;
    padding: 0 40px;
    align-content: flex-start;
    transition: 400ms margin-left;
`;

export default PageContentContainer