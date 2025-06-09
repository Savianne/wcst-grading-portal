"use client"
import dynamic from 'next/dynamic'
 
const NOSSRAccountsTable = dynamic(() => import('./AccountsTable'), { ssr: false });

export default NOSSRAccountsTable;