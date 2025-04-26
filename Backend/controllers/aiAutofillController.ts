import { Request, Response } from "express";
import { config } from "dotenv";
import { GoogleGenAI, createPartFromUri } from "@google/genai";
import supabase from "../config/database/supabase";

interface Info {
    title: string,
    description: string,
    link: string
}
config();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getAutofillDocument(req: Request, res: Response) {
    try {
        console.log("Start Document AI Autofill")
        const document: Info = req.body.document
        const bucketName = 'aiautofill';
        const { data: fileData, error: errorGetFile } = await supabase.storage.from(bucketName).download(document.link)
        if (!fileData || errorGetFile) {
            throw {
                error: 'Cannot get file',
                code: 404
            }
        }
        // console.log(1)
        const aiFile = await genAI.files.upload({
            file: fileData,
            config: {
                displayName: 'YourDoc'
            }
        })

        // console.log(2)

        let getFile = await genAI.files.get({ name: aiFile.name || '' });
        console.log("File processing")
        while (getFile.state === 'PROCESSING');
        console.log("File processing DONE")
        if (aiFile.state === 'FAILED') {
            throw {
                error: 'File processing failed.',
                code: 500
            }
        }
        // console.log(5)

        const content: any[] = [
            `
**Role:** You are an AI assistant specializing in document summarization and description generation IN LESS THAN 100 WORDS.

**Task:** Generate a comprehensive yet concise description for the document provided below.

**Context & Inputs:**
1.  **Document Content:** The full text of the document is provided below. This is the primary source of information.
2.  **Provided Title** (may be incomplete): "${document.title}"
3.  **Provided Description** (may be incomplete): "${document.description}"

**Instructions:**
1.  Thoroughly analyze the **Document Content**.
2.  Use the **Provided Title** and **Provided Description** as a potential context or a starting point *to the extent that they accurately reflect the Document Content*.
3.  Synthesize the key information, main purpose, or core topics from the Document Content into a single, coherent description.
4.  Ensure the final description accurately represents the document.
5.  **Strict Constraint:** The generated description **must be less than 100 words**.

**Output Format:**
Provide *only* the generated description text. Do ***NOT*** include any introductory phrases like "Here is the description:".
            `
        ];

        if (aiFile.uri && aiFile.mimeType) {
            const fileContent = createPartFromUri(aiFile.uri, aiFile.mimeType);
            content.push(fileContent);
        }
    
        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: content,
        });
        // console.log(6)

        res.status(200).json({ reply: response.text });
        return;
    } catch (err) {
        // const { error, code} = err as {error: Error, code: number}
        console.log("set course content", err)
        res.status(500).json({ error: err })
        return;
    }
}

export async function getAutofillVideo(req: Request, res: Response) {
    try {
        console.log("Start Video AI Autofill")
        const video: Info = req.body.video
        const bucketName = 'aiautofill';
        const { data: fileData, error: errorGetFile } = await supabase.storage.from(bucketName).download(video.link)
        if (!fileData || errorGetFile) {
            throw {
                error: 'Cannot get file',
                code: 404
            }
        }
        // console.log(1)
        const aiFile = await genAI.files.upload({
            file: fileData,
            config: {
                displayName: 'YourDoc'
            }
        })

        // console.log(2)

        let getFile = await genAI.files.get({ name: aiFile.name || '' });
        console.log("File processing")
        while (getFile.state === 'PROCESSING');
        console.log("File processing DONE")
        if (aiFile.state === 'FAILED') {
            throw {
                error: 'File processing failed.',
                code: 500
            }
        }
        // console.log(5)

        const content: any[] = [
            `
**Role:** You are an AI assistant specializing in video summarization and description generation IN LESS THAN 100 WORDS.

**Task:** Generate a comprehensive yet concise description for the video provided below.

**Context & Inputs:**
1.  **Video Content:** The full text of the video is provided below. This is the primary source of information.
2.  **Provided Title** (may be incomplete): "${video.title}"
3.  **Provided Description** (may be incomplete): "${video.description}"

**Instructions:**
1.  Thoroughly analyze the **Video Content**.
2.  Use the **Provided Title** and **Provided Description** as a potential context or a starting point *to the extent that they accurately reflect the Video Content*.
3.  Synthesize the key information, main purpose, or core topics from the Video Content into a single, coherent description.
4.  Ensure the final description accurately represents the video.
5.  **Strict Constraint:** The generated description **must be less than 100 words**.

**Output Format:**
Provide *only* the generated description text. Do ***NOT*** include any introductory phrases like "Here is the description:" or "It looks like...".
            `
        ];

        if (aiFile.uri && aiFile.mimeType) {
            const fileContent = createPartFromUri(aiFile.uri, aiFile.mimeType);
            content.push(fileContent);
        }
    
        const response = await genAI.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: content,
        });
        console.log(6)

        res.status(200).json({ reply: response.text });
        return;
    } catch (err) {
        // const { error, code} = err as {error: Error, code: number}
        console.log("set course content", err)
        res.status(500).json({ error: err })
        return;
    }
}