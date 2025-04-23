import multer, { StorageEngine } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import supabaseClient from '../config/database/supabaseClient';

// Configure multer's memory storage


const bucket_coursevideospublic = 'coursevideospublic'
const bucket_coursevideosprivate = 'coursevideosprivate'

const model = {
    uploadCourseVideo: async (courseId: number, videoLink: string) => {
    }
}

export default model