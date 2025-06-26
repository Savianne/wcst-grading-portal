function isValidGrade(input:string) {
    if (input.toUpperCase() === 'INC') return true;

    const num = Number(input);
    return !isNaN(num);
}

export default isValidGrade;