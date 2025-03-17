import { Request, Response } from "express";
import supabase from "../config/database/supabase";

export const getCourseContent = async (req: Request, res: Response): Promise<void> => {
  const { course_id } = req.params;
  const { data, error } = await supabase.rpc("current_user_role");

  try {
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, name, short_description, created_at")
      .eq("id", course_id)
      .single();

    if (courseError || !course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const [sectionsData, videosData, documentsData, quizzesData, quizDetailsData] = await Promise.all([
      supabase.from("coursevideosections").select("id, name, order").eq("course_id", course_id).order("order", { ascending: true }),
      supabase.from("coursevideos").select("id, title, thumbnail_link, duration, section_id").eq("course_id", course_id),
      supabase.schema("private").from("coursedocuments").select("id, title, description, link").eq("course_id", course_id),
      supabase.schema("private").from("coursequizzes").select("id, title, duration, description").eq("course_id", course_id),
      supabase.schema("private").from("coursequizdetails").select("id, quiz_id, question, type, choices, provided_key")
    ]);
    

    if (sectionsData.error || videosData.error || documentsData.error || quizzesData.error || quizDetailsData.error) {
      res.status(500).json({ error: "Lỗi lấy dữ liệu từ Supabase" });
      return;
    }

    const sections = sectionsData.data || [];
    const videos = videosData.data || [];
    const documents = documentsData.data || [];
    const quizzes = quizzesData.data || [];
    const quizDetails = quizDetailsData.data || [];

    const formattedSections = sections.map((section) => ({
      id: section.id,
      title: section.name,
      order: section.order,
      videos: videos
        .filter((video) => video.section_id === section.id)
        .map((video) => ({
          title: video.title,
          link: video.thumbnail_link,
          duration: video.duration,
        })),
    }));

    const formattedQuizzes = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      duration: quiz.duration,
      description: quiz.description,
      questions: quizDetails
        .filter((q) => q.quiz_id === quiz.id)
        .map((q) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          choices: Array.isArray(q.choices) ? q.choices : JSON.parse(q.choices || "[]"),
          answer: q.provided_key,
        })),
    }));

    res.json({
      course_id: course.id,
      title: course.name,
      description: course.short_description,
      lastUpdated: course.created_at,
      rating: 5,
      students: 10000,
      skillLevel: "Beginner Level",
      languages: "English",
      captions: "Yes",
      lectures: 32,
      fullDescription: "Nội dung khóa học chi tiết...",
      sections: formattedSections,
      documents: documents,
      quizzes: formattedQuizzes,
    });

  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
