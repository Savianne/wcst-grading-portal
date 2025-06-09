"use client";
import React from "react";
import { styled } from '@mui/material/styles';
import { useSession, signOut } from "next-auth/react";
import { useRouter, redirect } from 'next/navigation';

//MUI Components
import { 
    Button,
    Box,
    Avatar,
    MenuItem,
    ListItemIcon
} from "@mui/material";

const LoadingPage = styled(Box)`
    && {
        display: flex;
        flex: 0 1 100%;
        height: 100vh;
        background-color: #10142a;
        align-items: center;
        justify-content: center;
    
        > .loader {
            animation: rotate 1s infinite;
            height: 50px;
            width: 50px;
        }
    
        > .loader:before,
        > .loader:after {
            border-radius: 50%;
            content: "";
            display: block;
            height: 20px;
            width: 20px;
        }
        > .loader:before {
            animation: ball1 1s infinite;
            background-color: #ffd105;
            box-shadow: 30px 0 0 #001aff;
            margin-bottom: 10px;
        }
        > .loader:after {
            animation: ball2 1s infinite;
            background-color: #00ff73;
            box-shadow: 30px 0 0 #921c07;
        }
        
        @keyframes rotate {
            0% { transform: rotate(0deg) scale(0.8) }
            50% { transform: rotate(360deg) scale(1.2) }
            100% { transform: rotate(720deg) scale(0.8) }
        }
        
        @keyframes ball1 {
            0% {
                box-shadow: 30px 0 0 #001aff;
            }
            50% {
                box-shadow: 0 0 0 #ffd105;
                margin-bottom: 0;
                transform: translate(15px, 15px);
            }
            100% {
                box-shadow: 30px 0 0 #921c07;
                margin-bottom: 10px;
            }
        }
        
        @keyframes ball2 {
            0% {
                box-shadow: 30px 0 0 #ffbb00;
            }
            50% {
                box-shadow: 0 0 0 #300dfb;
                margin-top: -20px;
                transform: translate(15px, 15px);
            }
            100% {
                box-shadow: 30px 0 0 #921c07;
                margin-top: 0;
            }
        }
    }
  
`

export default function RouteUser() {
    const router = useRouter();
    const { data: session } = useSession({
        required: true,
        onUnauthenticated() {
             redirect('/login');
        }
    });

    React.useEffect(() => {
        if(session) {
            switch(session.user.accountType) {
                case "ADMIN":
                    setTimeout(() => {
                        redirect("/admin/dashboard");
                    }, 2000);
                    return;
                case "TEACHER":
                    setTimeout(() => {
                        redirect("/teacher/dashboard");
                    }, 2000);
                    return;
                case "STUDENT":
                    setTimeout(() => {
                        redirect("/student/dashboard");
                    }, 2000)
            }
        }
    })

    return(
        <LoadingPage>
            <div className="loader"></div>
        </LoadingPage>
    )
}