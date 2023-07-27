import { Request, Response, NextFunction } from 'express';
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import colors from 'colors';
import { populatePdf, getCustomFont } from '../utilities/pdf.helper';
import { CertificateTemplate, Student, TrainingCourse } from '../models/student.model';

const destPath = 'certificates';

export const createPDFCertificatesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!existsSync(destPath)) {
    mkdirSync(destPath);
    console.log(`Folder '${destPath}' created successfully`);
  }

  for (const trainingCourse in TrainingCourse) {
    const trackPath = `${destPath}/${trainingCourse}`;
    // const trackPath = `${destPath}/${TrainingCourse[trainingCourse as unknown as (typeof TrainingCourse)]}`;

    if (!existsSync(trackPath)) {
      mkdirSync(trackPath);
      console.log(`Folder '${trackPath}' created successfully`);
    }
  }

  const students: Student[] = res.locals.students;
  const studentsChunks: Student[][] = [];
  const chunkSize = 100;

  for (let i = 0; i < students.length; i += chunkSize) {
    studentsChunks.push(students.slice(i, i + chunkSize));
  }

  // Get custom font
  const customFont = await getCustomFont('http://localhost:3000/assets/DIN2014-Light.ttf');

  for (let i = 0; i < studentsChunks.length; i++) {
    const promises: Promise<unknown>[] = [];

    for (const student of studentsChunks[i]) {
      let certificateTemplate = '';
      let certificateDestPath = `${destPath}/`;
      const studentName = `${student.firstName} ${student.lastName}`;

      switch (student.trainingCourse) {
        case TrainingCourse.SHIFT_DM_ECE:
          certificateTemplate = CertificateTemplate.SHIFT_DM_ECE;
          // certificateDestPath += TrainingCourse.SHIFT_DM_ECE;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_DM_ECE)];
          break;

        case TrainingCourse.SHIFT_BUSINESS_INSEEC:
          certificateTemplate = CertificateTemplate.SHIFT_BUSINESS_INSEEC;
          // certificateDestPath += TrainingCourse.SHIFT_BUSINESS_INSEEC;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_BUSINESS_INSEEC)];
          break;

        case TrainingCourse.SHIFT_DT_SDP:
          certificateTemplate = CertificateTemplate.SHIFT_DT_SDP;
          // certificateDestPath += TrainingCourse.SHIFT_DT_SDP;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_DT_SDP)];
          break;

        case TrainingCourse.SHIFT_GEOPOL_HEIP:
          certificateTemplate = CertificateTemplate.SHIFT_GEOPOL_HEIP;
          // certificateDestPath += TrainingCourse.SHIFT_GEOPOL_HEIP;
          certificateDestPath += Object.keys(TrainingCourse)[Object.values(TrainingCourse).indexOf(TrainingCourse.SHIFT_GEOPOL_HEIP)];
          break;

        default:
          console.error(colors.red('Invalid training course for student ' + student.email));
          break;
      }

      certificateDestPath += `/${student.boostcampGroup}`;

      if (!existsSync(certificateDestPath)) {
        // console.log(`Folder '${certificateDestPath}' created successfully`);
        mkdirSync(certificateDestPath);
      }

      certificateDestPath += `/SHIFTs-${student.email}-22-23.pdf`;

      if (!existsSync(certificateTemplate)) {
        console.error(colors.red(`Error - Missing template "${certificateTemplate}"`));
      }
      copyFileSync(certificateTemplate as CertificateTemplate, certificateDestPath);
      const promise = populatePdf(studentName, customFont, certificateDestPath);
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
