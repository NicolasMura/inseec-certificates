export enum TrainingCourse {
  SHIFT_DM_ECE = 'SHIFT(s) B2 - Data management',
  SHIFT_BUSINESS_INSEEC = 'SHIFT(s) B2 - New forms of responsible economy',
  SHIFT_DT_SDP = 'SHIFT(s) B2 - Design thinking',
  SHIFT_GEOPOL_HEIP = 'SHIFT(s) B2 - New geopolitical stakes',
}

export enum CertificateTemplate {
  SHIFT_DM_ECE = 'templates/Certificats shifts ECE formulaire.pdf',
  SHIFT_BUSINESS_INSEEC = 'templates/Certificats shifts INSEEC formulaire.pdf',
  SHIFT_DT_SDP = 'templates/Certificats shifts SDPub Formulaire.pdf',
  SHIFT_GEOPOL_HEIP = 'templates/Certificats shifts HEIP formulaire.pdf',
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
