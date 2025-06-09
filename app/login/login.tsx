"use client"
import React from "react";
import { styled } from '@mui/material/styles';
import Image from "next/image";
import { signIn } from "next-auth/react";
import { redirect, useSearchParams } from "next/navigation";
import { IStyledFC } from "../types/IStyledFC";

//MUI Components
import { 
    Paper,
    TextField,
    Button,
    Alert
} from "@mui/material";


const LoginFC:React.FC<IStyledFC> = ({className}) => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams?.get('callbackUrl')
    const [error, setError] = React.useState<null | string>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [loginType, setLoginType] = React.useState<"ADMIN" | "TEACHER" | "STUDENT">("ADMIN");
    const [password, setPassword] = React.useState("");
    const [username, setUserName] = React.useState("");


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setIsLoading(true);

        const res = await signIn("credentials", {
            redirect: false,
            username: username,
            password: password,
            loginType,
        });

        if (res?.error) {
            setError(res.error);
            setIsLoading(false);
        };

        if(res?.ok) redirect(callbackUrl? callbackUrl : '/');
        
    };

    return (
        <div className={className}>
            <div className="top-container" style={{color: loginType == "STUDENT"? "black" : "white", backgroundColor: loginType == "ADMIN"? "#0F4E71" : loginType == "STUDENT"? "#DCE70B" : "#B12224"}}>
                <h4>Login to</h4>
                <h4>Worldstar College of Science and Technology Grading Portal</h4>
                <p>
                    a secure platform for students to view their grades and for teachers to manage and submit academic records. 
                    Designed for efficiency and transparency, the portal supports WCST’s commitment to quality education.
                </p>
                <div className="img-container">
                    <Image src={"/students.png"} alt="logo" width={500} height={500} style={{width: "100%", height: 'auto'}}/>
                </div>
            </div>
            <div className="bottom-container">
                <div className="login-as-toogle">
                    <h4>Login as:</h4>
                    <div className="toogle-group">
                        <div className="toogle" onClick={() => setLoginType("ADMIN")} style={{color: loginType == "ADMIN"? "white" : "black", backgroundColor: loginType == "ADMIN"? "#0F4E71" : "#5de9ff55"}}>
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M610.5 373.3c2.6-14.1 2.6-28.5 0-42.6l25.8-14.9c3-1.7 4.3-5.2 3.3-8.5-6.7-21.6-18.2-41.2-33.2-57.4-2.3-2.5-6-3.1-9-1.4l-25.8 14.9c-10.9-9.3-23.4-16.5-36.9-21.3v-29.8c0-3.4-2.4-6.4-5.7-7.1-22.3-5-45-4.8-66.2 0-3.3 .7-5.7 3.7-5.7 7.1v29.8c-13.5 4.8-26 12-36.9 21.3l-25.8-14.9c-2.9-1.7-6.7-1.1-9 1.4-15 16.2-26.5 35.8-33.2 57.4-1 3.3 .4 6.8 3.3 8.5l25.8 14.9c-2.6 14.1-2.6 28.5 0 42.6l-25.8 14.9c-3 1.7-4.3 5.2-3.3 8.5 6.7 21.6 18.2 41.1 33.2 57.4 2.3 2.5 6 3.1 9 1.4l25.8-14.9c10.9 9.3 23.4 16.5 36.9 21.3v29.8c0 3.4 2.4 6.4 5.7 7.1 22.3 5 45 4.8 66.2 0 3.3-.7 5.7-3.7 5.7-7.1v-29.8c13.5-4.8 26-12 36.9-21.3l25.8 14.9c2.9 1.7 6.7 1.1 9-1.4 15-16.2 26.5-35.8 33.2-57.4 1-3.3-.4-6.8-3.3-8.5l-25.8-14.9zM496 400.5c-26.8 0-48.5-21.8-48.5-48.5s21.8-48.5 48.5-48.5 48.5 21.8 48.5 48.5-21.7 48.5-48.5 48.5zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm201.2 226.5c-2.3-1.2-4.6-2.6-6.8-3.9l-7.9 4.6c-6 3.4-12.8 5.3-19.6 5.3-10.9 0-21.4-4.6-28.9-12.6-18.3-19.8-32.3-43.9-40.2-69.6-5.5-17.7 1.9-36.4 17.9-45.7l7.9-4.6c-.1-2.6-.1-5.2 0-7.8l-7.9-4.6c-16-9.2-23.4-28-17.9-45.7 .9-2.9 2.2-5.8 3.2-8.7-3.8-.3-7.5-1.2-11.4-1.2h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c10.1 0 19.5-3.2 27.2-8.5-1.2-3.8-2-7.7-2-11.8v-9.2z"/></svg>
                            </div>
                            <h5>Admin</h5>
                        </div>
                        <div className="toogle" onClick={() => setLoginType("TEACHER")} style={{color: loginType == "TEACHER"? "white" : "black", backgroundColor: loginType == "TEACHER"? "#B12224" : "#5de9ff55"}}>
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>
                            </div>
                            <h5>Teacher</h5>
                        </div>
                        <div className="toogle" onClick={() => setLoginType("STUDENT")} style={{backgroundColor: loginType == "STUDENT"? "#DCE70B" : "#5de9ff55"}}>
                            <div className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"/></svg>
                            </div>
                            <h5>Student</h5>
                        </div>
                    </div>
                </div>
                <Paper component={'form'}
                onSubmit={handleSubmit}>
                    <div className="form-header">
                        <Image src={"/wcst-logo.png"} alt="logo" width={80} height={80}/>
                        <h4>{loginType == "ADMIN"? "Login as Admin" : loginType == "TEACHER"? "Login as Teacher" : "Login as Student"}</h4>
                        {
                            error? <Alert variant="filled" severity="error" style={{width: "100%"}}>
                               {error}
                            </Alert> : ""
                        }
                    </div>
                    <div className="input-fields-container">
                        <TextField
                        disabled={isLoading}
                        label="Email/Username"
                        id="filled-size-normal"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUserName(e.currentTarget.value)}
                        fullWidth
                        />
                        <TextField
                        disabled={isLoading}
                        label="Password"
                        type="password"
                        id="filled-size-normal"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        fullWidth
                        />
                        <Button loading={isLoading} loadingPosition="end" type="submit" variant="contained" size="large" fullWidth style={{color: loginType == "STUDENT"? "black" : "white", backgroundColor: loginType == "ADMIN"? "#0F4E71" : loginType == "STUDENT"? "#DCE70B" : "#B12224"}}>Login</Button>
                    </div>
                </Paper>
            </div>
        </div>
    );
}


const Login = styled(LoginFC)`
    && {
        display: flex;
        flex: 0 1 100%;
        height: fit-content;
        flex-wrap: wrap;
        padding: 20px;

        >  .top-container {
            position: relative;
            display: flex;
            flex: 0 1 100%;
            padding: 80px 50px;
            background-color: red;
            transition: 400ms background-color;
            border-radius: 30px 30px 0 0;
            flex-direction: column;
            gap: 15px;


            > h4, > p {
                max-width: 500px;
            }

            > .img-container {
                width: 300px;
                height: auto;
                position: absolute;
                bottom: -30%;
                left: 40%;

                @media screen and (max-width: 1345px) {
                    bottom: 0;
                    left: 75%;
                    width: 250px;
                }

                @media screen and (max-width: 775px) { 
                    position: static;
                    margin-bottom: -30%;
                    margin-right: 5%;
                    margin-left: auto;
                }
            }
        }

        > .bottom-container {
            display: flex;
            flex: 0 1 100%;
            height: fit-content;
            
            > .login-as-toogle {
                display: flex;
                width: fit-content;
                flex-direction: column;
                padding: 40px;

                >  .toogle-group {
                    display: flex;
                    width: fit-content;
                    gap: 10px;
                    margin-top: 20px;

                    > .toogle {
                        display: flex;
                        width: 150px;
                        aspect-ratio: 1/1;
                        align-items: center;
                        justify-content: center;
                        border-radius: 10px;
                        background-color: #5de9ff55;
                        border: 1px solid #cfcccc;
                        flex-direction: column;
                        gap: 10px;

                        > .icon {
                            display: flex;
                            width: 60px;
                            height: 60px;
                            border-radius: 50%;
                            align-items: center;
                            justify-content: center;
                            background-color: white;

                            > svg {
                                width: 30px;
                                height: 30px;
                            }
                        }
                    }

                }
                @media screen and (max-width: 600px) {
                    padding-left: 0;

                    > .toogle-group {
                        flex: 0 1 100%;

                        > .toogle {
                            flex: 0 0 100px;
                        }
                    }
                }
            }

            > form {
                display: flex;
                width: 100%;
                max-width: 400px;
                min-width: 300px;
                padding: 30px;
                margin-left: auto;
                flex-wrap: wrap;
                margin-right: 80px;
                margin-top: -200px;
                z-index: 5;

                > .form-header {
                    display: flex;
                    flex: 0 1 100%;
                    flex-direction: column;
                    align-items: center;
                    /* padding: 0 20px; */
                    gap: 20px;
                }

                > .input-fields-container {
                    display: flex;
                    flex: 0 1 100%;
                    flex-wrap: wrap;
                    gap: 30px;
                    margin-top: 30px;
                }

                @media screen and (max-width: 1345px) {
                    margin-top: -50px;
                }
            }

            @media screen and (max-width: 1065px) {
                flex-direction: column;
                align-items: center;

                > form {
                    margin: 0;
                }
            }
        }
    }

`;

export default Login;
