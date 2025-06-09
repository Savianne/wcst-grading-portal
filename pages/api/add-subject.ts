import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResultSetHeader } from 'mysql2';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        course,
        subjectTitle,
        subjectCode,
        year,
        category
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        // let insertID: string | null = null;

        const insertID = String((await connection.query<ResultSetHeader>("INSERT INTO subject_info(subject_title, subject_code) VALUES(?, ?)", [subjectTitle, subjectCode]))[0].insertId);

        if(category == "major") {
            await connection.query("INSERT INTO major_subjects(course_id, year, subject_info) VALUES(?, ?, ?)", [course, year, insertID]);

            //Insert Recors into the table
            // insertID = String((await connection.query<ResultSetHeader>("INSERT INTO major_subjects(course_id, subject_title, subject_code, year) VALUES(?, ?, ?, ?)", [course, subjectTitle, subjectCode, year]))[0].insertId);
        } else if(category == 'minor') {
             await connection.query("INSERT INTO minor_subjects(subject_info) VALUES(?)", [insertID]);
            //Insert Recors into the table
            // insertID = String((await connection.query<ResultSetHeader>("INSERT INTO minor_subjects(subject_title, subject_code) VALUES(?, ?)", [subjectTitle, subjectCode]))[0].insertId);
        }

        connection.release();
        res.status(200).json({ status: "success", data: {insertID} });
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}