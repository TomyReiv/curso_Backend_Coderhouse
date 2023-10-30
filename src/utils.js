import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

export const __dirname = path.dirname(__filename);

export default class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) =>{
        const folderPath = path.join(__dirname, '/public/img');
        cb(null, folderPath)
    },
    filename: (req, file, cb) =>{
        const filname = `${Date.now()}-${file.originalname}`;
        cb(null, filname);
    }
});

export const uploader = multer({storage});