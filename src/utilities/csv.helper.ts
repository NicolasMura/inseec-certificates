import fs from 'fs';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { Student } from '../models/student.model';

export const readCSVFile = (pathLike: string | Buffer): Promise<Student[]> => {
  const headers = ['email', 'firstName', 'lastName', 'trainingCourse', 'boostcampGroup', 'homeSchool', 'registrationSemesters', 'finalNotationS1', 'finalNotationS2', 'toBeCertified'];
  const results: Student[] = [];

  return new Promise((resolve, reject) => {
    const stream = typeof pathLike === 'string' ? fs.createReadStream(pathLike, 'utf-8') : Readable.from(pathLike);
    stream
      .pipe(csv({
        headers,
        separator: ';',
        skipLines: 1
      }))
      .on('data', (data: Student) => {
        return results.push(data);
      })
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error))
  })
}

export default readCSVFile;
