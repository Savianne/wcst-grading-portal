export default interface IGradingSystemConfig {
  terms: Terms
  components: Components
  componentsItemTransmutationScale: ComponentsItemTransmutationScale
  attendanceReversePenalty: string
  classStanding: ClassStanding
}

export interface Terms {
  prelim: string
  midterm: string
  prefinal: string
  final: string
}

export interface Components {
  averageQuiz: string
  assignmentsAndActivities: string
  classStanding: string
  termtest: string
}

export interface ComponentsItemTransmutationScale {
  baseGrade: string
}

export interface ClassStanding {
  attendance: string
  behaviour: string
  recitation: string
}
