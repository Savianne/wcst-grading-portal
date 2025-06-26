import pool from "@/app/api/mysql/connectionPool";
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(!(req.method === "POST")) return res.status(405).end(`Method ${req.method} Not Allowed`);

    const {
        itemId,
        description
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();
        await connection.query("UPDATE component_items SET description = ? WHERE id = ?", [description, itemId]);
        connection.release();
        res.status(200).json({ status: "success"});
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}