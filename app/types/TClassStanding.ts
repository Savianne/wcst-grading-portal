type TclassStanding = {
    id: string,
    itemType: "recitation" | 'behavior',
    studentId: string,
    sheetId: string,
    term: "prelim" | 'midterm' | 'prefinal' | 'final',
    grade: string
}

export default TclassStanding;