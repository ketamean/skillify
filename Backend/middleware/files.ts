import upload from '../config/files/multer';
import { Request, Response, NextFunction } from 'express';

const maxFiles = null; // null === infinity

export function ArrayFiles(req: Request, res: Response, next: NextFunction) {
    if (maxFiles !== null) {
        // upload.array('documents', maxFiles);
        // upload.array('videos', maxFiles);
        upload.array('files', maxFiles);
    } else {
        // upload.array('documents');
        // upload.array('videos');
        upload.array('files');
    }
    return next()
}