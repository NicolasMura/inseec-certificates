import { Request, Response, NextFunction } from 'express';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { populatePdf } from '../utilities/pdf.helper';
import { CertificateTemplate, Student, TrainingCourse } from '../models/student.model';

const destPath = 'certificates';

export const createPDFCertificatesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!existsSync(destPath)) {
    mkdirSync(destPath);
    console.log(`Folder '${destPath}' created successfully`);
  }

  for (const trainingCourse in TrainingCourse) {
    const path = `${destPath}/${trainingCourse}`;

    if (!existsSync(path)) {
      mkdirSync(path);
      console.log(`Folder '${path}' created successfully`);
    }
  }

  const students: Student[] = res.locals.students;
  const studentsChunks: Student[][] = [];
  const chunkSize = 250;

  for (let i = 0; i < students.length; i += chunkSize) {
    studentsChunks.push(students.slice(i, i + chunkSize));
  }

  for (let i = 0; i < studentsChunks.length; i++) {
    const promises: Promise<unknown>[] = [];

    for (const student of studentsChunks[i]) {
      let certificateTemplate;
      let certificateDestPath = `${destPath}/`;
      const studentName = `${student.firstName} ${student.lastName}`;

      switch (student.trainingCourse) {
        case TrainingCourse.SHIFT_DM_ECE:
          certificateTemplate = CertificateTemplate.SHIFT_DM_ECE;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_DM_ECE)];
          break;

        case TrainingCourse.SHIFT_BUSINESS_INSEEC:
          certificateTemplate = CertificateTemplate.SHIFT_BUSINESS_INSEEC;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_BUSINESS_INSEEC)];
          break;

        case TrainingCourse.SHIFT_DT_SDP:
          certificateTemplate = CertificateTemplate.SHIFT_DT_SDP;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_DT_SDP)];
          break;

        case TrainingCourse.SHIFT_GEOPOL_HEIP:
          certificateTemplate = CertificateTemplate.SHIFT_GEOPOL_HEIP;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_GEOPOL_HEIP)];
          break;

        default:
          break;
      }

      certificateDestPath += `/${student.email}.pdf`;

      copyFileSync(certificateTemplate as CertificateTemplate, certificateDestPath);
      const promise = populatePdf(studentName, certificateDestPath);
      promises.push(promise);
    }

    const log = i < studentsChunks.length - 1 ?
      `Generating certificates for students ${chunkSize * i + 1} to ${chunkSize * (1 + i)}`
      : `Generating certificates for students ${chunkSize * i + 1} to ${chunkSize * i + studentsChunks[i].length}`;
    console.log(log);

    await Promise.all(promises).catch();
  }

  console.log('Done !');
  next();
}

export default createPDFCertificatesMiddleware;
