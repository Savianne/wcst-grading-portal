"use client";
import { styled } from '@mui/material/styles';
import React from "react";
import Image from 'next/image';
import { IStyledFC } from '@/app/types/IStyledFC';
import { useUserInfo } from '@/app/context/UserInfoProvider';

const WelcomeTeacherFC: React.FC<IStyledFC> = ({className}) => {
    const data = useUserInfo()
    return(
        <div className={className}> 
        {
            data.user? <>
                <div className="img-container">
                    <Image src={"/circuit.png"} alt="logo" width={500} height={500} style={{width: "100%", height: 'auto'}}/>
                </div>
                <h1>Welcome</h1>
                <h2>Teacher {data.user?.first_name}</h2>
            </> : <h1>Loading...</h1>
        }
        </div>
    )
}

const WelcomeTeacher = styled(WelcomeTeacherFC)`
    && {
        position: relative;
        display: flex;
        flex: 0 1 100%;
        padding: 70px 50px;
        flex-direction: column;
        justify-content: center;
        height: fit-content;
        background-color: ${({theme}) => theme.palette.mode == "dark"? "#000101" : "#332c4e"};
        border-radius: 20px;
        margin-top: 5px;
        color: white;

        > h1 {
            font-size: 5vw;
            z-index: 1;
        }

        > h2 {
            font-size: 2.5vw;
            z-index: 1;
        }

        > .img-container {
            width: 300px;
            height: auto;
            position: absolute;
            left: 0;
            z-index: 0;
        }
    }
`;

export default WelcomeTeacher;