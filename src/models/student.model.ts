export enum TrainingCourse {
  SHIFT_DM_ECE = 'SHIFT(s) B2 - Data management',
  SHIFT_BUSINESS_INSEEC = 'SHIFT(s) B2 - New forms of responsible economy',
  SHIFT_DT_SDP = 'SHIFT(s) B2 - Design thinking',
  SHIFT_GEOPOL_HEIP = 'SHIFT(s) B2 - New geopolitical stakes',
}

export enum CertificateTemplate {
  SHIFT_DM_ECE = 'templates/cerfa_13824-04.pdf',
  SHIFT_BUSINESS_INSEEC = 'templates/cerfa_13824-04.pdf',
  SHIFT_DT_SDP = 'templates/cerfa_13824-04.pdf',
  SHIFT_GEOPOL_HEIP = 'templates/cerfa_13824-04.pdf',
}

export interface Student {
  email: string;
  firstName: string;
  lastName: string;
  trainingCourse: TrainingCourse;
  boostcampGroup: string;
  homeSchool: string;
  registrationSemesters: string;
  finalNotationS1: string;
  finalNotationS2: string;
  toBeCertified: string;
}
