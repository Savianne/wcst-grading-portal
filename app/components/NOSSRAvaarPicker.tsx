"use client"
import dynamic from 'next/dynamic'
 
const NOSSRAvatarPicker = dynamic(() => import('../components/AvatarPicker'), { ssr: false });

export default NOSSRAvatarPicker;