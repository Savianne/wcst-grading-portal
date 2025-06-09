import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResultSetHeader } from 'mysql2';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);
    const {
        teacherId,
        schoolYear: {
            from,
            to,
        },
        course,
        subjectInfo,
        year,
        semester,
        schedule: {
            every,
            start,
            end
        }
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        try {

            await connection.beginTransaction();
            
            const insertId = (await connection.query<ResultSetHeader>("INSERT INTO grading_sheets (course_id, subject_info, school_year, teacher_id, year, semester) VALUES (?, ?, ?, ?, ?, ?)", [course, subjectInfo, `${from}-${to}`, teacherId, year, semester]))[0].insertId;
           
            await connection.query("INSERT INTO class_schedule (every, start, end, grading_sheet) VALUES(?, ?, ?, ?)", [every, start, end, insertId]);

            await connection.commit();

            res.status(200).json({ status: "success", data: {insertId}});
            
        } catch(err) {
            console.log(err)
            res.status(500).json({ status: "error", error: "Database connection error: " + err });
            connection.rollback()
        }
        finally {
            connection.release();
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}