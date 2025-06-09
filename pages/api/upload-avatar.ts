import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateAccountUID } from "@/app/helpers/utils/generateUID";
import { hashSync } from "bcrypt-ts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        try {
            await connection.beginTransaction();

            
            await connection.commit();
            
            res.status(200).json({ status: "success"});
            
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