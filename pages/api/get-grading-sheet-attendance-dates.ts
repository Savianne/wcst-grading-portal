import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);
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
            date_string AS dateString,
            term
        FROM attendace_date WHERE sheet_id = ?
        `
        const sheetAttendanceDates = (await connection.query(sql, [sheetId]) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data: sheetAttendanceDates});

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Internal Server Error"});
    }
    
}