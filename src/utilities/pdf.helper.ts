import { PDFArray, PDFDocument, PDFName, PDFNumber } from 'pdf-lib';
import { readFileSync, writeFileSync } from 'fs';
import fontkit from '@pdf-lib/fontkit';

export const populatePdf = (studentName: string, customFont: ArrayBuffer, destPath: string): Promise<void> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject): Promise<void> => {
    const pdfDoc = await PDFDocument.load(readFileSync(destPath));
    pdfDoc.registerFontkit(fontkit);
    const messageFont = await pdfDoc.embedFont(customFont);

    const form = pdfDoc.getForm();
    const nameField = form.getTextField('Prénom NOM');
    nameField.setText(studentName);
    nameField.enableReadOnly();

    form.updateFieldAppearances(messageFont);

    // Now make all the fields read-only
    const acroFields = getAcroFields(pdfDoc);
    acroFields.forEach(field => lockField(field));

    const pdfBytes = await pdfDoc.save();

    if(!pdfBytes) reject();

    writeFileSync(destPath, pdfBytes);

    resolve();
  });
}

export const getCustomFont = async (fontUrl: string): Promise<ArrayBuffer> => {
  const customFont = await fetch(fontUrl).then((res) => res.arrayBuffer());

  return customFont;
}

const getAcroForm = (pdfDoc: any) => {
  return pdfDoc.catalog.lookup(PDFName.of('AcroForm'));
};

const getAcroFields = (pdfDoc: any) => {
  const acroForm = getAcroForm(pdfDoc);
  if (!acroForm) return [];

  const fieldRefs = acroForm.lookupMaybe(PDFName.of('Fields'), PDFArray);
  if (!fieldRefs) return [];

  const fields = new Array(fieldRefs.size());
  for (let idx = 0, len = fieldRefs.size(); idx < len; idx++) {
    fields[idx] = fieldRefs.lookup(idx);
  }
  return fields;
};

const lockField = (acroField: any) => {
  acroField.set(PDFName.of('Ff'), PDFNumber.of(1 << 0 /* Read Only */));
};
