import { Request, Response, NextFunction } from 'express';
import { existsSync, mkdirSync } from 'fs';
import multer, { FileFilterCallback } from 'multer';

const uploadPath = 'upload';

/**
 * Upload file middleware
 */
// Config - Set storage
const storage = multer.memoryStorage();
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (!existsSync(uploadPath)){
//       mkdirSync(uploadPath);
//       console.log('Folder upload created successfully');
//     }
//     cb(null, `${uploadPath}/`);
//   },
//   filename: (req, file, cb) => {
//     console.log('storage - file');
//     console.log(file);
//     const ext = file.originalname.split('.').pop();
//     cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
//   }
// });
const multerFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const ext = file.originalname.split('.').pop();
  if (ext && ['csv', 'xlsx'].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Not a CSV or XLSX File!'));
  }
};

const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: multerFilter
  }).single('students');

  // Here call the upload middleware of multer
  upload(req, res, (err) => {
    if (!req.file) {
      console.error('Empty file!');
      res.statusMessage = 'Empty file!';
      res
        .status(400)
        .json(req.body);

      return;
    }

    if (err) {
      console.error('Request failed!');
      res.statusMessage = 'Request failed!';
      res
        .status(500)
        .json(req.body);

      return;
    }

    next();
  });
}

export default uploadMiddleware;
