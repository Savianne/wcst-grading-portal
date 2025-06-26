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
        term
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const exist = (await connection.query("SELECT id FROM attendace_date WHERE sheet_id = ? && date_string = ?", [sheetId, dateString]) as RowDataPacket[])[0][0];
        
        if(exist) return res.status(409).json({ status: "error", error: "Date already exists."});

        const insertId = (await connection.query<ResultSetHeader>("INSERT INTO attendace_date (sheet_id, date_string, term) VALUES (?, ?, ?)", [sheetId, dateString, term]))[0].insertId

        connection.release();
        
        res.status(200).json({ status: "success", id: insertId});
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Internal Server Error!"});
    }
    
}