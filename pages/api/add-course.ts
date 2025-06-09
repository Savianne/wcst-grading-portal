import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResultSetHeader } from 'mysql2';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        courseTitle,
        courseDuration
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        //Insert Recors into the table
        const insertID = (await connection.query<ResultSetHeader>("INSERT INTO courses(course_title, course_duration) VALUES(?, ?)", [courseTitle, courseDuration]))[0].insertId;

        connection.release();
        res.status(200).json({ status: "success", data: {insertID} });
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}