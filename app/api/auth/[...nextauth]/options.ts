import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "../../mysql/connectionPool";
import { RowDataPacket } from "mysql2";
import { compareSync } from "bcrypt-ts";


export const options: NextAuthOptions= {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {
                    label: "Username:",
                    type: "text",
                    placeholder: "Enter your Username"
                },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "Enter your Password"
                }
            },
            async authorize(credentials) {

                const { username, password, loginType } = credentials as { username: string, password: string, loginType: "ADMIN" | "TEACHER" | "STUDENT"};

                const promisePool = pool.promise();

                if(loginType == "ADMIN") {

                    const row = await promisePool.query('SELECT * FROM super_admin WHERE email = ? OR user_name = ?', [username, username]) as RowDataPacket[];
    
                    if(!row[0].length) throw new Error("User does not exist!");

                    const match = compareSync(password as string, row[0][0].password);
    
                    if(!match) throw new Error("Wrong password!");

                    return {id: new Date().getMilliseconds().toString(), name: row[0][0].username, email: row[0][0].email, accountType: loginType};
                } else {
                    const row = await promisePool.query('SELECT * FROM accounts WHERE email = ? OR user_name = ?', [username, username]) as RowDataPacket[];
    
                    if(!row[0].length) throw new Error("User does not exist!");;

                    const match = compareSync(credentials?.password as string, row[0][0].password);
    
                    if(!match) throw new Error("Wrong password!");
                    return {id: new Date().getMilliseconds().toString(), name: row[0][0].username, email: row[0][0].email, accountType: loginType};
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accountType = user.accountType;
            }
            return token;
            },
            async session({ session, token }) {
            if (session.user) {
                session.user.accountType = token.accountType;
            }
            return session;
        },
    },

    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

}

