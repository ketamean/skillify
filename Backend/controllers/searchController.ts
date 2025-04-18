import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import supabase from "../config/database/supabase";
config();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const searchCourses = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const searchQuery = req.body.query;
  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    const queryEmbeddingResponse = await genAI.models.embedContent({
      model: "text-embedding-004",
      contents: searchQuery,
      config: {
        taskType: "SEMANTIC_SIMILARITY",
      },
    });

    const { data, error } = await supabase.rpc("match_courses", {
      query_embedding: queryEmbeddingResponse.embeddings?.[0].values,
      similarity_threshold: 0.8,
      match_count: 20,
    });

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No courses found" });
    }

    const courses = data.map((course: any) => ({
      id: course.id,
      name: course.name,
      short_description: course.short_description,
      image_link: course.image_link,
      fee: course.fee,
    }));
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error embedding search query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
