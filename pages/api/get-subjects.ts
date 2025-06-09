import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { RowDataPacket } from "mysql2";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    // if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        
        const majorSubjects = (await connection.query(`SELECT * FROM major_subjects AS ms JOIN subject_info AS si ON ms.subject_info = si.id ORDER BY si.id DESC`) as RowDataPacket[])[0];
        const minorSubjects = (await connection.query(`SELECT * FROM minor_subjects AS ms JOIN subject_info AS si ON ms.subject_info = si.id ORDER BY si.id DESC`) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data: {
            majorSubjects,
            minorSubjects
        }});

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}