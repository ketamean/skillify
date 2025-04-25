import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { Request, Response } from "express";
import supabase from "../config/database/supabase";
config();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const searchCourses = async (
  req: Request,
  res: Response
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
      match_threshold: 0.5,
      match_count: 20,
    });

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }

    const courses = data.map((course: any) => ({
      id: course.id,
      name: course.name,
      short_description: course.short_description,
      image_link: course.image_link,
      fee: course.fee,
      instructor_name:
        (course.first_name ?? "") + " " + (course.last_name ?? ""),
    }));
    return res.status(200).json(courses);
  } catch (error) {
    console.error("Error embedding search query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const searchCoursesByTopic = async (
  req: Request,
  res: Response
): Promise<any> => {
  const topicId = req.params.topicId;
  if (!topicId) {
    return res.status(400).json({ error: "Topic ID is required" });
  }
  try {
    const { data, error } = await supabase
      .from("courserelatedtopics")
      .select("course_id")
      .eq("topic_id", topicId);
    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select(
        `
          id,
          name,
          short_description,
          image_link,
          fee,
          instructors:instructor_id (first_name, last_name)`
      )
      .in(
        "id",
        data.map((item) => item.course_id)
      )
      .limit(20);
    if (courseError) {
      console.error("Error fetching course data:", courseError);
      return res.status(500).json({ error: "Internal server error" });
    }
    if (!courseData || courseData.length === 0) {
      return res.status(200).json([]);
    }
    return res.status(200).json(courseData);
  } catch (error) {}
};

export const searchCoursesByKeyword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const keyword = req.query.keyword as string;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword is required" });
  }

  try {
    // Search by keyword in course name and description using ilike for case-insensitive search
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        id,
        name,
        short_description,
        image_link,
        fee,
        instructor: instructor_id (
          first_name,
          last_name
        )
        `
      )
      .or(`name.ilike.%${keyword}%,short_description.ilike.%${keyword}%`)
      .eq("status", "Published"); // Only return published courses

    if (error) {
      console.error("Error searching courses by keyword:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!data || data.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error in keyword search:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getTopicNameById = async (
  req: Request,
  res: Response
): Promise<any> => {
  const topicId = req.params.topicId;

  if (!topicId) {
    return res.status(400).json({ error: "Topic ID is required" });
  }

  try {
    const { data, error } = await supabase
      .from("topics")
      .select("name")
      .eq("id", topicId)
      .single();

    if (error) {
      console.error("Error fetching topic name:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (!data) {
      return res.status(404).json({ error: "Topic not found" });
    }

    return res.status(200).json({ name: data.name });
  } catch (error) {
    console.error("Error getting topic name:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
