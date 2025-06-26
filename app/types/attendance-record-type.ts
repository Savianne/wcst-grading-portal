type TAttendanceRecord = {
    id: string,
    sheetId: string,
    studentId: string,
    dateString: string,
    status: "absent"| "present" | "late" | "cutting-class"
}

export default TAttendanceRecord;