import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        sheetId,
        dateString,
        status,
        studentId
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const exist = (await connection.query("SELECT id FROM attendance_record WHERE sheet_id = ? && date_string = ? && student_id = ?", [sheetId, dateString, studentId]) as RowDataPacket[])[0][0];
        
        if(exist) {
            const id = await  connection.query("UPDATE attendance_record SET status = ? WHERE id = ?", [status, exist.id]);

            res.status(200).json({ status: "success", id});
        } else {
            const insertId = (await connection.query<ResultSetHeader>("INSERT INTO attendance_record (sheet_id, date_string, student_id, status) VALUES (?, ?, ?, ?)", [sheetId, dateString, studentId, status]))[0].insertId
    
            res.status(200).json({ status: "success", id: insertId});
        }

        connection.release();
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Internal Server Error!"});
    }
}
    