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

        const sql = `
            SELECT 
                a.uid, 
                a.email, 
                a.user_name, 
                a.account_type, 
                bi.first_name, 
                bi.middle_name, 
                bi.surname, 
                bi.suffix, 
                bi.sex, 
                bi.date_of_birth,
                dp.image_path as picture,
                mn.mobile_number
            from accounts AS a
                JOIN basic_information AS bi ON a.uid = bi.uid
                JOIN mobile_number AS mn ON mn.uid = a.uid
                LEFT JOIN display_picture AS dp ON dp.uid = a.uid
            WHERE a.account_type = ?
        `;
        
        const data = (await connection.query(sql, ['teacher']) as RowDataPacket[])[0];

        connection.release();
        
        res.status(200).json({ status: "success", data: data});
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ status: "error", error: "Database connection error: " + err });
    }
    
}