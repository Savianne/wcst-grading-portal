"use client"
import dynamic from 'next/dynamic'
 
const NOSSRTeachersAccountsTable = dynamic(() => import('./TeachersAccountsTable'), { ssr: false });

export default NOSSRTeachersAccountsTable;