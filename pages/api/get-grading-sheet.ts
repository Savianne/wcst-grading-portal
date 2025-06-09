import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);
    const promisePool = pool.promise();

    const {
        sheetId,
    } = req.body

    try {
        const connection = await promisePool.getConnection();
        
        const sql = `
        SELECT 
            gs.id,
            gs.school_year,
            gs.year,
            gs.semester,
            c.course_title,
            si.subject_title,
            si.subject_code
        FROM grading_sheets AS gs
        JOIN subject_info AS si ON gs.subject_info = si.id
        JOIN courses AS c ON gs.course_id = c.id
        WHERE gs.id = ? 
        ORDER BY gs.id DESC;
        `
        const gradingSheet = (await connection.query(sql, [sheetId]) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data: {...gradingSheet[0]}});

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}