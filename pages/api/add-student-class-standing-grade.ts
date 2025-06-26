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
        sheetId,
        grade,
        itemType,
        term
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const exist = (await connection.query("SELECT id FROM students_class_standing WHERE sheet_id = ? && term = ? && student_id = ? && item_type = ?", [sheetId, term, studentId, itemType]) as RowDataPacket[])[0][0];
        
        if(exist) {
            await connection.query("UPDATE students_class_standing SET grade = ? WHERE sheet_id = ? && term = ? && student_id = ? && item_type = ?", [grade, sheetId, term, studentId, itemType]);

            res.status(200).json({ status: "success", id: exist.id});

        } else {
            const insertId = (await connection.query<ResultSetHeader>("INSERT INTO students_class_standing (student_id, sheet_id, grade, term, item_type) VALUES (?, ?, ?, ?, ?)", [studentId, sheetId, grade, term, itemType]))[0].insertId
            
            res.status(200).json({ status: "success", id: insertId});
        }

        connection.release();

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}