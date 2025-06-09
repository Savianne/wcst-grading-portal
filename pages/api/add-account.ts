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
        accountType,
        basicInfo: {
            firstName,
            middleName,
            lastName,
            surname,
            suffix,
            sex,
            dateOfBirth
        },
        contactInfo: {
            email,
            mobileNumber
        }
    } = req.body
    
    const promisePool = pool.promise();

    try {
        const connection = await promisePool.getConnection();

        try {

            await connection.beginTransaction();

            const uid = generateAccountUID();
            const userName = accountType == "teacher"? `TEACHER${uid}` : `STUDENTS${uid}`;
            const hashedDefaultPassword = hashSync(accountType == "teacher"? "WCST@Teacher" : "WCST@Student", 15);

            await connection.query("INSERT INTO accounts(uid, user_name, email, password, account_type) VALUES(?, ?, ?, ?, ?)", [uid, userName, email, hashedDefaultPassword, accountType]);
            await connection.query("INSERT INTO basic_information(uid, first_name, middle_name, sex, date_of_birth, surname, suffix) VALUES(?, ?, ?, ?, ?, ?, ?)", [uid, firstName, middleName, sex, dateOfBirth, surname, suffix? suffix : null])
            await connection.query("INSERT INTO mobile_number(mobile_number, uid) VALUES(?, ?)", [mobileNumber, uid])
            await connection.commit();

            res.status(200).json({ status: "success", data: {uid}});
            
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