import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
);
async function generateEmbedding() {
  const { data, error } = await supabase
    .from("courses")
    .select("id, name, short_description")
    .is("embedding", null);
  if (error) {
    console.error("Error fetching data from Supabase:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("No courses found needing embeddings.");
    return;
  }

  for (const course of data) {
    try {
      console.log(`Embedding course ID: ${course.id} - ${course.name}`);

      const textToEmbed = `<span class="math-inline">\\n${course.name}\\n</span>${course.short_description}`;

      const response = await genAI.models.embedContent({
        model: "text-embedding-004",
        contents: textToEmbed,
        config: {
          taskType: "SEMANTIC_SIMILARITY",
        },
      });
      const result = response.embeddings[0].values;

      const error = await supabase
        .from("courses")
        .update({ embedding: result })
        .eq("id", course.id);

      if (error.error == null) {
        console.error(
          `Error updating embedding for course ID ${course.id}:`,
          error,
        );
      } else {
        console.log(`Successfully embedded course ID: ${course.id}`);
      }
    } catch (error) {
      console.error("Error processing course:", error);
    }
  }
}

async function simpleEmbed() {
  const textToEmbed = "Hello world";
  const response = await genAI.models.embedContent({
    model: "text-embedding-004",
    contents: textToEmbed,
    config: {
      taskType: "SEMANTIC_SIMILARITY",
    },
  });
  const data = response.embeddings;
  console.log("Embedding result:", data[0].values);
}

// simpleEmbed();

generateEmbedding();
