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
        uid,
        email,
        mobile_number,
        first_name,
        middle_name,
        surname,
        suffix,
        sex,
        date_of_birth,
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        try {
            await connection.beginTransaction();

            //Update email column in accounts table
            await connection.query("UPDATE accounts SET email = ? WHERE uid = ?", [email, uid]);

            //Update (first_name, middle_name, surname, sex,  date_of_birth, suffix) column in basic_information table 
            await connection.query("UPDATE basic_information SET first_name = ?, middle_name = ?, surname = ?, sex = ?,  date_of_birth = ?, suffix = ? WHERE uid = ?", [first_name, middle_name, surname, sex, date_of_birth, suffix, uid]);

            //Update mobile_number column in mobile_number table
            await connection.query("UPDATE mobile_number  SET mobile_number  = ? WHERE uid = ?", [mobile_number, uid]);

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