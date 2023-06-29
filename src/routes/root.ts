import express from 'express';
import postRoot from '../controllers/root/post-root';
import uploadMiddleware from '../middleware/upload';
import CSVMiddleware from '../middleware/csv-middleware';
import createPDFCertificatesMiddleware from '../middleware/create-pdf-certificates';

const root = express.Router();

root.post('/generate-certificates', [uploadMiddleware, CSVMiddleware, createPDFCertificatesMiddleware], postRoot);

export default root;
