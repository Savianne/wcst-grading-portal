"use client"
import dynamic from 'next/dynamic'
 
const NOSSRStudentsAccountsTable = dynamic(() => import('./StudentsAccountsTable'), { ssr: false });

export default NOSSRStudentsAccountsTable;