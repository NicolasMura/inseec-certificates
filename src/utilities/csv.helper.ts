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

export const createCSVFromJson = (json: Student[]): string => {
  // specify how you we to handle null values here
  const replacer = (key: string, value: string) => value ?? '';
  const header = Object.keys(json[0]) as (keyof Student)[];
  const csv = [
    header.join(';'), // header row first
    ...json.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(';'))
  ].join('\r\n').replace(/"/g, '');

  return csv;
}

export default readCSVFile;
