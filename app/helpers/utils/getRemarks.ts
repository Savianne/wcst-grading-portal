function getRemark(transmutedGrade: string) {
  if (transmutedGrade === 'INC') return 'Incomplete';
  if (+transmutedGrade >= 95) return 'Excellent';
  if (+transmutedGrade >= 90) return 'Very Good';
  if (+transmutedGrade >= 85) return 'Good';
  if (+transmutedGrade >= 80) return 'Satisfactory';
  if (+transmutedGrade >= 75) return 'Fair';
  return 'Failed';
}

export default getRemark;