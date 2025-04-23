import { Request, Response } from "express"
// import multer from "multer"
const controller = {
    uploadPublicVideos: (req: Request, res: Response) => {
        try {
            const files = req.files
            console.log(files)
            if (!files) throw new Error("No files uploaded")
            const courseId = req.query.courseId
            if (!courseId) throw new Error("No course id provided")
            // files.forEach(async (file: Express.Multer.File) => {
                
            // })
            res.status(200).json({ message: "Files uploaded successfully" })
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: "Internal Server Error" })
        }
    },
}

export default controller;