import multer, { StorageEngine } from 'multer';

const multerStorage: StorageEngine = multer.memoryStorage();
const upload = multer({ storage: multerStorage });

export default upload;