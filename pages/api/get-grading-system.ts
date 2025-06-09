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
        accountUID
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const gradingSystem = (await connection.query("SELECT * FROM grading_system WHERE id = 1") as RowDataPacket[])[0][0].config;
        
        connection.release();
        
        res.status(200).json({ status: "success", data: JSON.parse(gradingSystem)});
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}