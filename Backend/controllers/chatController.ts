import { Request, Response } from "express";
import { config } from "dotenv";
import { GoogleGenAI } from "@google/genai";
import supabase from "../config/database/supabase";
interface ChatMessageInterface {
  role: string;
  text: string;
}

interface CourseInterface {
  name: string;
  short_description: string;
}

config();
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const sendMessage = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const userMessage = req.body.message;
  const chatHistory = req.body.history || [];

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required" });
  }

  const formatHistory = (history: ChatMessageInterface[]) => {
    return history.map((msg) => `${msg.role}: ${msg.text}`).join("\n");
  };

  const formattedHistory = formatHistory(chatHistory);

  try {
    console.log("Checking intent for ", userMessage);
    const intentCheckPrompt = `
      You are an AI assistant helping route user requests for an online course platform.
      Analyze the latest user message in the context of the full conversation history.
      Your goal is to determine if the user's request is specific enough to perform a course search OR if it's too vague and requires clarification.

      **Criteria for SEARCH:**
      - The user mentions specific course topics (e.g., "Python", "React", "data analysis", "graphic design").
      - The user specifies skills they want to learn (e.g., "learn SQL", "improve public speaking", "understand machine learning").
      - The user mentions software or tools (e.g., "courses on Photoshop", "learning Excel").
      - The user specifies a domain or field (e.g., "web development courses", "project management training").
      - The user asks about courses for a specific level (e.g., "beginner JavaScript", "advanced calculus").
      - The user is confirming or refining a topic discussed previously in the history (e.g., "Okay, show me the beginner ones", "What about React Native?").

      **Criteria for CLARIFY:**
      - The request is very general (e.g., "recommend a course", "I want to learn", "what do you have?").
      - The user expresses desire but without specific subject matter (e.g., "help me find something interesting", "teach me a new skill").
      - The user asks a question unrelated to finding courses.
      - The user's message is ambiguous or could refer to many different areas.

      **Conversation History:**
      ${formattedHistory}

      **Latest User Message:** ${userMessage}

      **Your Decision:** Based on the criteria and the conversation, is the latest message specific enough to SEARCH for courses, or does it require the user to CLARIFY?

      Respond ONLY with the single word "SEARCH" or the single word "CLARIFY".`;

    const intentCheckResponse = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: intentCheckPrompt,
    });
    console.log("LLM intent decision", intentCheckResponse.text);

    if (intentCheckResponse.text?.trim().toUpperCase() === "SEARCH") {
      const searchQueryGenPrompt = `You are an AI assistant that extracts the core search intent from a conversation for a course platform.
      Analyze the conversation history and the latest user message. Identify the main topic, skill, software, or subject the user is asking about *in their latest message, considering the context*.
      Synthesize this into a concise search query string (typically 3-10 words) that would be effective for a semantic vector search. Focus on the key nouns and concepts.

      **Examples:**
      - History: User asks about web dev, Bot asks front or back, User says "frontend" -> Output: "frontend web development courses"
      - History: User asks about Python, Bot lists options, User says "the data science one" -> Output: "Python data science courses"
      - History: User asks "Any courses on drawing?" -> Output: "drawing courses"
      - History: User asks "What about advanced topics in React?" -> Output: "advanced React topics"

      **Conversation History:**
      ${formattedHistory}

      **Latest User Message:** ${userMessage}

      Generate ONLY the concise search query string. Do not add explanations or conversational text.`;
      const searchQueryGenResponse = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: searchQueryGenPrompt,
      });
      const queryToEmbed = searchQueryGenResponse.text || userMessage;
      console.log("LLM vector search query", queryToEmbed);
      const queryEmbeddingResponse = await genAI.models.embedContent({
        model: "text-embedding-004",
        contents: queryToEmbed,
        config: {
          taskType: "SEMANTIC_SIMILARITY",
        },
      });

      const { data: relevantCourses, error } = await supabase.rpc(
        "match_courses",
        {
          query_embedding: queryEmbeddingResponse.embeddings?.[0].values,
          match_threshold: 0.67,
          match_count: 10,
        },
      );

      let context =
        "No relevant courses found in the database based on the search.";
      if (relevantCourses && relevantCourses.length > 0) {
        context =
          "Based on your request, here are some potentially relevant courses I found:\n" +
          relevantCourses
            .map(
              (course: CourseInterface) =>
                `- ${course.name || "Untitled Course"}: ${course.short_description ? course.short_description.substring(0, 150) + "..." : "No description."}`,
            )
            .join("\n");
      } else {
        console.log(
          "No relevant courses found in Supabase for the generated query embedding.",
        );
      }

      const finalAnswerPrompt = `You are a friendly course recommendation chatbot.
      Answer the user's latest query based on the conversation history and the provided course context retrieved via semantic search.
      Use *only* the course information provided in the 'Course Context' section if it's relevant to the user's request.
      If no relevant courses were found (context indicates 'No relevant courses found...'), politely inform the user you couldn't find specific matches for their request as described in the history and latest message. You can suggest they rephrase or ask about a different topic.
      Keep your response conversational and directly address the user's latest message within the context of the conversation.

      Conversation History:
      ${formattedHistory}

      Latest User Message: ${userMessage}

      Course Context Retrieved from Database:
      ${context}

      Chatbot Response:`;

      const finalAnswerResponse = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: finalAnswerPrompt,
      });
      console.log("LLM final answer", finalAnswerResponse.text);

      res.status(200).json({ reply: finalAnswerResponse.text });
    } else if (intentCheckResponse.text?.trim().toUpperCase() === "CLARIFY") {
      const clarificationPrompt = `The user's latest message was determined to be too vague for a course search.
      Based on the conversation history and their latest message, ask a concise and friendly question to help them specify what they're looking for.
      Examples: "What topics are you interested in?", "What specific skills are you hoping to learn?", "Do you have a particular software or subject area in mind?"

      Conversation History:
      ${formattedHistory}

      Latest User Message: ${userMessage}

      Generate ONLY the clarifying question.`;

      const clarificationResponse = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: clarificationPrompt,
      });
      res.status(200).json({ reply: clarificationResponse.text });
    }
  } catch (error) {
    console.error("Error processing message:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
};
