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
        SELECT * FROM grading_sheet_students AS gss
        JOIN basic_information AS bi ON gss.student_id = bi.uid
        LEFT JOIN display_picture AS dp ON dp.uid = gss.student_id
        WHERE gss.grading_sheet_id = ?
        `
        const gradingSheets = (await connection.query(sql, [sheetId]) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data: gradingSheets});

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}