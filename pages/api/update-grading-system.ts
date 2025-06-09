import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateAccountUID } from "@/app/helpers/utils/generateUID";
import { hashSync } from "bcrypt-ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        update
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        await connection.query("UPDATE grading_system SET config = ? WHERE id = 1", [update]);
        connection.release();
        res.status(200).json({ status: "success"});
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}