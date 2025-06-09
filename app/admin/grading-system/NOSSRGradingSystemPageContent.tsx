"use client"
import dynamic from 'next/dynamic'
 
const NoSSRGradingSystemPageContent = dynamic(() => import('./GradingSystemPageContent'), { ssr: false });

export default NoSSRGradingSystemPageContent;