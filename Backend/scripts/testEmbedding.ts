import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);

async function testEmbedding() {
  const textToEmbed = "math";
  const response = await genAI.models.embedContent({
    model: "text-embedding-004",
    contents: textToEmbed,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });

  const { data, error } = await supabase.rpc("match_courses", {
    query_embedding: response.embeddings?.[0].values,
    match_threshold: 0.67,
    match_count: 10,
  });

  for (const course of data) {
    console.log(course.name);
  }
}

testEmbedding();
