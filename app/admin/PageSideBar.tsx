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
            <div className="link" onClick={(e) => router.push('/admin/dashboard')}>
                <div className="icon" style={{backgroundColor: path === "/admin/dashboard"? "white" : "#0F4E71"}}>
                    <svg style={{fill: path === "/admin/dashboard"? "#0F4E71" : "white"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M288 32C128.9 32 0 160.9 0 320c0 52.8 14.3 102.3 39.1 144.8 5.6 9.6 16.3 15.2 27.4 15.2h443c11.1 0 21.8-5.6 27.4-15.2C561.8 422.3 576 372.8 576 320c0-159.1-128.9-288-288-288zm0 64c14.7 0 26.6 10.1 30.3 23.7-1.1 2.3-2.6 4.2-3.5 6.7l-9.2 27.7c-5.1 3.5-11 6-17.6 6-17.7 0-32-14.3-32-32S270.3 96 288 96zM96 384c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm48-160c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm246.8-72.4l-61.3 184C343.1 347.3 352 364.5 352 384c0 11.7-3.4 22.6-8.9 32H232.9c-5.5-9.5-8.9-20.3-8.9-32 0-33.9 26.5-61.4 59.9-63.6l61.3-184c4.2-12.6 17.7-19.5 30.4-15.2 12.6 4.2 19.4 17.8 15.2 30.4zm14.7 57.2l15.5-46.6c3.5-1.3 7.1-2.2 11.1-2.2 17.7 0 32 14.3 32 32s-14.3 32-32 32c-11.4 0-20.9-6.3-26.6-15.2zM480 384c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>
                </div>
                <p>Dashboard</p>
            </div>
            <div className="link" onClick={(e) => router.push('/admin/accounts')}>
                <div className="icon" style={{backgroundColor: ["/admin/accounts", "/admin/accounts/add-account"].includes(path as string)? "white" : "#0F4E71"}}>
                    <svg style={{fill: ["/admin/accounts", "/admin/accounts/add-account"].includes(path as string)? "#0F4E71" : "white"}} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>
                </div>
                <p>accounts</p> 
            </div>
            <div className="link" onClick={(e) => router.push('/admin/courses')}>
                <div className="icon" style={{backgroundColor: ["/admin/courses", "/admin/courses/add-course"].includes(path as string)? "white" : "#0F4E71"}}>
                    {
                        ["/admin/courses", "/admin/courses/add-course"].includes(path as string)? 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style={{fill: '#0F4E71'}}><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"/></svg> 
                        : <svg style={{fill: ["/admin/courses", "/admin/courses/add-account"].includes(path as string)? "#0F4E71" : "white"}}viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>
                    }
                    
                </div>
                <p>Courses</p>
            </div>
            <div className="link" onClick={(e) => router.push('/admin/subjects')}>
                <div className="icon" style={{backgroundColor: ["/admin/subjects", "/admin/subjects/add-subject"].includes(path as string)? "white" : "#0F4E71"}}>
                    {
                        ["/admin/subjects"].includes(path as string)? 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style={{fill: '#0F4E71'}}><path d="M88.7 223.8L0 375.8 0 96C0 60.7 28.7 32 64 32l117.5 0c17 0 33.3 6.7 45.3 18.7l26.5 26.5c12 12 28.3 18.7 45.3 18.7L416 96c35.3 0 64 28.7 64 64l0 32-336 0c-22.8 0-43.8 12.1-55.3 31.8zm27.6 16.1C122.1 230 132.6 224 144 224l400 0c11.5 0 22 6.1 27.7 16.1s5.7 22.2-.1 32.1l-112 192C453.9 474 443.4 480 432 480L32 480c-11.5 0-22-6.1-27.7-16.1s-5.7-22.2 .1-32.1l112-192z"/></svg> 
                        : <svg style={{fill: ["/admin/subjects"].includes(path as string)? "#0F4E71" : "white"}}viewBox="0 0 512 512"><path d="M64 480H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H288c-10.1 0-19.6-4.7-25.6-12.8L243.2 57.6C231.1 41.5 212.1 32 192 32H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64z" /></svg>
                    }
                </div>
                <p>Subjects</p>
            </div>
            <div className="link" onClick={(e) => router.push('/admin/grading-system')}>
                <div className="icon" style={{backgroundColor: ["/admin/grading-system"].includes(path as string)? "white" : "#0F4E71"}}>
                    <svg style={{fill: path === "/admin/grading-system"? "#0F4E71" : "white"}} viewBox="0 0 512 512"><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg> 
                </div>
                <p>Grading System</p>
            </div>
            <div className="btn-logout" style={{width: isOpen? "250px" : '100px'}}>
                {
                    isOpen? <Button size="large" fullWidth style={{ color: "#0F4E71" }} startIcon={<LogoutIcon />} onClick={() => signOut()}>Logout</Button>
                    : <IconButton aria-label="logout" style={{color: "#0F4E71"}} onClick={() => signOut()}>
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
        /* background-color: white; */

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
                color: ${({theme}) => theme.palette.mode == "dark"? "white" : "#0F4E71"};
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