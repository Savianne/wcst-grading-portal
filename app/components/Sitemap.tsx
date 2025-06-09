"use client"
import React from "react";
import { styled } from '@mui/material/styles';
import { usePathname } from "next/navigation";
import { IStyledFC } from "../types/IStyledFC";
import { Paper } from "@mui/material";

const SitemapFC: React.FC<IStyledFC> = ({className}) => {
    const path = usePathname();
    return(
        <div className={className}> 
            <Paper className="paper" elevation={2}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M128 352H32c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32zm-24-80h192v48h48v-48h192v48h48v-57.6c0-21.2-17.2-38.4-38.4-38.4H344v-64h40c17.7 0 32-14.3 32-32V32c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h40v64H94.4C73.2 224 56 241.2 56 262.4V320h48v-48zm264 80h-96c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32zm240 0h-96c-17.7 0-32 14.3-32 32v96c0 17.7 14.3 32 32 32h96c17.7 0 32-14.3 32-32v-96c0-17.7-14.3-32-32-32z"/></svg>
                <p>{path}</p>
            </Paper>
        </div>
    )
}

const Sitemap = styled(SitemapFC)`
   && {
        display: flex;
        flex: 0 1 100%;
        margin: 10px 5px;
        height: fit-content;
        color: ${({theme}) => theme.palette.mode == "dark"? "#c6c5c5" : '#6d6d6d'};
        
        > .paper {
            display: flex;
            flex: 0 1 100%;
            height: 100%;
            padding: 20px;

            > svg {
                margin-right: 10px;
                width: 20px;
                height: 20px;
                fill: ${({theme}) => theme.palette.mode == "dark"? "#c6c5c5" : '#6d6d6d'};
            }
        }
   }
`;

export default Sitemap;