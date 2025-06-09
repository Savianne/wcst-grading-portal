import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateAccountUID } from "@/app/helpers/utils/generateUID";
import { hashSync } from "bcrypt-ts";
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        searchTerm,
        sheetId
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const sql = `
            SELECT 
                a.uid AS student_id,
                CONCAT_WS(' ', bi.first_name, bi.middle_name, bi.surname, bi.suffix) AS fullname,
                IF(gss.student_id IS NULL, FALSE, TRUE) AS is_member,
                bi.first_name, 
                bi.middle_name, 
                bi.surname, 
                bi.suffix, 
                bi.sex, 
                bi.date_of_birth,
                dp.image_path as picture
            from accounts AS a
                JOIN basic_information AS bi ON a.uid = bi.uid
                LEFT JOIN display_picture AS dp ON dp.uid = a.uid
                LEFT JOIN grading_sheet_students AS gss ON gss.student_id = a.uid AND gss.grading_sheet_id = ?
            WHERE a.account_type = 'student' AND CONCAT_WS(' ', bi.first_name, bi.middle_name, bi.surname, bi.suffix) LIKE ?
            LIMIT 10
        `;
        
        const data = (await connection.query(sql, [sheetId, `%${searchTerm}%`]) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data});
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}