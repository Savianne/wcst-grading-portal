import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateAccountUID } from "@/app/helpers/utils/generateUID";
import { hashSync } from "bcrypt-ts";
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        accountUID
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const totalAccounts = (await connection.query("SELECT COUNT(*) AS totalAccounts FROM accounts") as RowDataPacket[])[0][0].totalAccounts;
        const teachersAccount = (await connection.query("SELECT COUNT(*) AS teachersAccount FROM accounts WHERE account_type = ?", ['teacher']) as RowDataPacket[])[0][0].teachersAccount;
        const studentsAccount = (await connection.query("SELECT COUNT(*) AS studentsAccount FROM accounts WHERE account_type = ?", ['student']) as RowDataPacket[])[0][0].studentsAccount;
        const subjects = (await connection.query("SELECT COUNT(*) AS subjects FROM subject_info") as RowDataPacket[])[0][0].subjects;
        const courses = (await connection.query("SELECT COUNT(*) AS courses FROM courses") as RowDataPacket[])[0][0].courses;
        connection.release();
        
        res.status(200).json({ status: "success", data: {totalAccounts, teachersAccount, studentsAccount, courses, subjects}});
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}