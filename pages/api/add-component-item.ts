import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { ResultSetHeader } from 'mysql2';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        term,
        component,
        description,
        hps,
        sheetId
    } = req.body

    console.log(req.body)
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        //Insert Recors into the table
        const insertId = (await connection.query<ResultSetHeader>("INSERT INTO component_items(description, highest_posible_score, sheet_id, term, component) VALUES(?, ?, ?, ?, ?)", [description, hps, sheetId, term, component]))[0].insertId;

        connection.release();
        res.status(200).json({ status: "success", data: {insertId} });
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}