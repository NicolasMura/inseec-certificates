// 27356D
import { PDFDocument } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'fs';

export const populatePdf = (studentName: string, destPath: string): Promise<void> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject): Promise<void> => {
    const pdfDoc = await PDFDocument.load(readFileSync(destPath));

    if(!pdfDoc) reject();

    const form = pdfDoc.getForm();
    form.getTextField('Nom').setText(studentName);
    const pdfBytes = await pdfDoc.save();

    if(!pdfBytes) reject();

    writeFileSync(destPath, pdfBytes);

    resolve();
  });
}