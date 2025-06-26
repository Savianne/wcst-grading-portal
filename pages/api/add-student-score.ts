import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket, ResultSetHeader } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        studentId,
        itemId,
        sheetId,
        score
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const exist = (await connection.query("SELECT id FROM item_score WHERE item_id = ? && student_id = ?", [itemId, studentId]) as RowDataPacket[])[0][0];
        
        if(exist) {
            await connection.query("UPDATE item_score SET score = ? WHERE item_id = ? && student_id = ?", [score, itemId, studentId]);

            res.status(200).json({ status: "success", id: exist.id});

        } else {
            const insertId = (await connection.query<ResultSetHeader>("INSERT INTO item_score (item_id, student_id, sheet_id, score) VALUES (?, ?, ?, ?)", [itemId, studentId, sheetId, score]))[0].insertId

            res.status(200).json({ status: "success", id: insertId});
        }

        connection.release()
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}