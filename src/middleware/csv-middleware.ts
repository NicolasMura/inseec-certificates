import { Request, Response, NextFunction } from 'express';
import { readCSVFile } from '../utilities/csv.helper';
import { Student, TrainingCourse } from '../models/student.model';

const CSVMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const csvPathLike = req.file?.path || req.file?.buffer;
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
  const certifiedStudents = students.filter(student =>
    student.firstName &&
    student.lastName &&
    student.email &&
    Object.values(TrainingCourse).includes(student.trainingCourse)
  );
  console.log(`Founded ${certifiedStudents.length} students to process`);
  console.log(students.filter(student =>
    !student.firstName ||
    !student.lastName ||
    !student.email ||
    !Object.values(TrainingCourse).includes(student.trainingCourse)
  ));

  // @TODO Check email unicity

  return certifiedStudents;
}
