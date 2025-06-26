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
            id,
            sheet_id AS sheetId,
            student_id AS studentId,
            item_type AS itemType,
            term,
            grade
        FROM students_class_standing WHERE sheet_id = ?
        `
        const studentsClassStanding = (await connection.query(sql, [sheetId]) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data: studentsClassStanding});

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}