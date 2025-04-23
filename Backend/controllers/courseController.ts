import { Request, Response } from "express";
import supabase from "../config/database/supabase";

export const addMaterialComment = async (req: Request, res: Response): Promise<void> => {
  const { course_id, material_id } = req.params;
  const { content, user_id } = req.body;

  if (!content || !user_id) {
    res.status(400).json({ error: "Missing content or user_id" });
    return;
  }

  const { data: insertData, error: insertError } = await supabase
    .schema("private").from("coursematerialcomments")
    .insert([
      {
        course_material_id: Number(material_id),
        content,
        commenter: user_id,
      },
    ])
    .select()
    .single();

  if (insertError || !insertData) {
    res.status(500).json({ error: insertError?.message || "Failed to insert comment" });
    return;
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("first_name, last_name, avatar_image_link")
    .eq("id", user_id)
    .single();

  if (userError || !userData) {
    console.error("Failed to fetch user for comment:", userError);
    res.status(500).json({ error: "Comment inserted but failed to fetch user info" });
    return;
  }

  res.status(201).json({
    message: "Comment added",
    comment: {
      id: insertData.id,
      text: insertData.content,
      time: new Date(insertData.created_at).toLocaleString(),
      material_id: insertData.course_material_id,
      user: `${userData.first_name} ${userData.last_name ?? ""}`,
      avatar: userData.avatar_image_link || "",
    },
  });
};

export const getCourseContent = async (req: Request, res: Response): Promise<void> => {
  const { course_id } = req.params;
  const { data, error } = await supabase.rpc("current_user_role");
  const user_id = req.query.user_id as string;
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
      supabase.from("coursesections").select("id, name, order").eq("course_id", course_id).order("order", { ascending: true }),
      supabase.from("coursevideos").select("id, title, thumbnail_link, duration, section_id, description").eq("course_id", course_id),
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

    const videoIds = videos.map((v) => v.id);

    const { data: videoLinks, error: videoLinkError } = await supabase
      .from("coursevideos_public")
      .select("id, link")
      .in("id", videoIds);
    if (videoLinkError) {
      res.status(500).json({ error: "Lỗi lấy link video" });
      return;
    }

    const videoLinkMap = Object.fromEntries(videoLinks.map(v => [v.id, v.link]));

    const formattedSections = sections.map((section) => ({
      id: section.id,
      title: section.name,
      order: section.order,
      // description: section.description,
      videos: videos
        .filter((video) => video.section_id === section.id)
        .map((video) => ({
          id: video.id,
          title: video.title,
          link: videoLinkMap[video.id] || "",
          duration: video.duration,
          description: video.description,
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

    const { data: commentData, error: commentError } = await supabase
      .schema("private")
      .from("coursematerialcomments")
      .select("id, content, created_at, commenter, course_material_id")
      .in("course_material_id", videoIds)
      .order("created_at", { ascending: false });

    const userIds = [...new Set(commentData?.map(c => c.commenter))];

    const { data: userProfiles, error: userError } = await supabase
      .from("users")
      .select("id, first_name, last_name, avatar_image_link")
      .in("id", userIds);

    const formattedComments = commentData?.map(c => {
      const user = userProfiles?.find(u => u.id === c.commenter);
      return {
        id: c.id,
        text: c.content,
        time: new Date(c.created_at).toLocaleString(),
        material_id: c.course_material_id, // ← this maps directly to video.id
        user: user ? `${user.first_name} ${user.last_name}` : "Unknown User",
        avatar: user?.avatar_image_link || null,
      };
    }) || [];
      const quizIdsOfCourse = (quizzesData.data || []).map(q => q.id);

      const { data: quizAttempts } = await supabase
        .schema("private")
        .from("quiz_attempts")
        .select("quiz_id, score")
        .eq("user_id", user_id)
        .in("quiz_id", quizIdsOfCourse);

      const safeQuizAttempts = quizAttempts ?? [];

      const quizResults = safeQuizAttempts.map((attempt) => {
        const totalQuestions = quizDetails.filter((q) => q.quiz_id === attempt.quiz_id).length;
        return {
          quiz_id: attempt.quiz_id,
          score: `${attempt.score}/${totalQuestions}`
        };
      });

        

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
      comments: formattedComments,
      quizResults: quizResults 
    });

  } catch (error) {
    console.error("Lỗi API:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};


