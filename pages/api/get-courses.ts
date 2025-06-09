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

    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        const sql = `SELECT * FROM courses ORDER BY id DESC`;
        
        const data = (await connection.query(sql) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data: data});

    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}