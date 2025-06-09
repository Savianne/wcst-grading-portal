import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResultSetHeader } from 'mysql2';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        sheetId,
        studentId
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const insertId = (await connection.query<ResultSetHeader>("INSERT INTO grading_sheet_students(student_id, grading_sheet_id) VALUES(?, ?)", [studentId, sheetId]))[0].insertId;
        connection.release();
        res.status(200).json({ status: "success", data: {id: insertId}});
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}