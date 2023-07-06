import { Request, Response, NextFunction } from 'express';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { readCSVFile, createCSVFromJson } from '../utilities/csv.helper';
import { Student, TrainingCourse } from '../models/student.model';

const destPath = 'certificates';

const CSVMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!existsSync(destPath)) {
    mkdirSync(destPath);
    console.log(`Folder '${destPath}' created successfully`);
  }

  const csvPathLike = req.file?.path ?? req.file?.buffer;
  if (csvPathLike) {
    readCSVFile(csvPathLike)
      .then((students: Student[]) => {
        // Send data to next middleware
        res.locals.students = getFilteredStudents(students);
        next();
      })
      .catch((error) => {
        console.error('readCSVFile catch');
        console.error(error);
        next(error);
      });
  } else {
    console.error('csvPathLike not found...');
    next('csvPathLike not found...');
  }
}

export default CSVMiddleware;

const getFilteredStudents = (students: Student[]): Student[] => {
  // Students must have following infos: firstName / lastName / valid email / known trainingCourse
  const certifiedStudents = [...students]
    .sort(sortStudentsByName)
    .filter(validateStudent);
  console.log(`Warning - Filtering rules: only students with a first name, a last name, a valid email and a valid \
training course ("Track certifié - Parcours SHIFTS" column") are processed`);
  console.log(`Founded ${students.length} lines`);
  console.log(`Founded ${certifiedStudents.length} lines OK to process`);

  const notProcessedFolder = 'certificates/not-processed';
  const invalidFilePath = `${notProcessedFolder}/invalid.csv`;

  if (students.length !== certifiedStudents.length) {
    console.log(`Warning - ${students.length - certifiedStudents.length} lines have been ignored (see ${invalidFilePath} file)`);

    const notProcessedStudents = students.filter(invalidateStudent);

    if (!existsSync(notProcessedFolder)) {
      mkdirSync(notProcessedFolder);
      console.log(`Folder '${notProcessedFolder}' created successfully`);
    }

    writeFileSync(invalidFilePath, '');
    writeFileSync(invalidFilePath, createCSVFromJson(notProcessedStudents));
  } else {
    rmSync(invalidFilePath, { force: true });
  }

  // Find duplicates
  const uniqueCertifiedStudents = certifiedStudents.filter((student, index, array) =>
    array.findIndex(s =>
      s.email === student.email && s.trainingCourse === student.trainingCourse
    ) === index
  );
  const duplicatesStudents = certifiedStudents.filter(x => !uniqueCertifiedStudents.includes(x));
  // (wonderful explanation @ https://stackoverflow.com/questions/1187518/how-to-get-the-difference-between-two-arrays-in-javascript?page=1&tab=scoredesc#tab-top)

  const duplicatesFilePath = `${notProcessedFolder}/duplicates.csv`;

  if (duplicatesStudents.length > 0) {
    console.log(`Warning - ${duplicatesStudents.length} duplicates lines have been found (see ${duplicatesFilePath} file)`);

    if (!existsSync(notProcessedFolder)) {
      mkdirSync(notProcessedFolder);
      console.log(`Folder '${notProcessedFolder}' created successfully`);
    }

    writeFileSync(duplicatesFilePath, '');
    writeFileSync(duplicatesFilePath, createCSVFromJson(duplicatesStudents));
  } else {
    rmSync(duplicatesFilePath, { force: true });
  }

  // @TODO Check email unicity

  return uniqueCertifiedStudents;
}

const sortStudentsByName = (student1: Student, student2: Student): number => {
  if (student1.lastName < student2.lastName) {
    return -1;
  }
  if (student1.lastName > student2.lastName) {
    return 1;
  }
  return 0;
};

const validateStudent = (student: Student): boolean => {
  return (
    !!student.firstName &&
    !!student.lastName &&
    validateEmail(student.email) &&
    Object.values(TrainingCourse).includes(student.trainingCourse)
  );
}

const invalidateStudent = (student: Student): boolean => {
  return !validateStudent(student);
};

const validateEmail = (email: string): boolean => {
  return RegExp(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ).exec(email)
    ? true
    : false;
};
