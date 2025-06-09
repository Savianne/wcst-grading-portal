"use client"
import dynamic from 'next/dynamic'
 
const NoSSRAddAccountForm = dynamic(() => import('./AddAccountForm'), { ssr: false });

export default NoSSRAddAccountForm;