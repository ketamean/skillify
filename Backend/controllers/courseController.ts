import { Request, Response } from "express";
import supabase from "../config/database/supabase";
import { ICourse, IVideo } from "../models/course";

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
  // const { data, error } = await supabase.rpc("current_user_role");
  const user_id = req.user.id// req.query.user_id as string;
  try {
    // check user's accessibility
    const { data: checkAccessibilityData, error: checkAccessibilityError } = await supabase.schema('public').rpc("isAccessibleToACourse", {
      courseid: Number(course_id),
      userid: user_id,
    })
    if (checkAccessibilityError) {
      console.error("Error checking course accessibility:", checkAccessibilityError);
      res.status(500).json({ error: "Error checking course accessibility" });
      return;
    }

    if (checkAccessibilityData as boolean === false) {
      res.status(403).json({ error: "You don't have access to this course" });
      return;
    }
    ///////////////////////////////////////
    ///////////////////////////////////////

    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, name, short_description, created_at, fee, instructor_id")
      .eq("id", course_id)
      .single();

    if (courseError || !course) {
      res.status(404).json({ error: "Course not found" });
      return;
    }

    const [sectionsData, videosData, documentsData, quizzesData, quizDetailsData] = await Promise.all([
      supabase.from("coursesections").select("id, name, order").eq("course_id", course_id).order("order", { ascending: true }),
      supabase.from("coursevideos").select("id, title, thumbnail_link, duration, section_id, description, is_public").eq("course_id", course_id),
      supabase.schema("private").from("coursedocuments").select("id, title, description, link").eq("course_id", course_id),
      supabase.schema("private").from("coursequizzes").select("id, title, duration, description").eq("course_id", course_id),
      supabase.schema("private").from("coursequizdetails").select("id, quiz_id, question, type, choices, provided_key")
    ]);

    if (sectionsData.error || videosData.error || documentsData.error || quizzesData.error || quizDetailsData.error) {
      res.status(500).json({ error: "Lỗi lấy dữ liệu từ Supabase" });
      return;
    }

    const sections = sectionsData.data || [];
    const videos = videosData.data || []; //{ is_public: boolean, id: number }[]
    const documents = documentsData.data || [];
    const quizzes = quizzesData.data || [];
    const quizDetails = quizDetailsData.data || [];
    const videoLinkMap: { 
      [key: number]: { 
        originalLink: string; 
        signedUrl?: string; 
      } 
    } = {};
    const videoIds: number[] = videos.map((video) => video.id);
    for (const video of videos) {
      let tablename = '';
      let schema = '';
      
      if (video.is_public) {
        schema = 'public';
        tablename = 'coursevideos_public';
      } else {
        schema = 'private';
        tablename = 'coursevideos_private';
      }
    
      const { data: videoLinks, error: videoLinkError } = await supabase
        .schema(schema)
        .from(tablename)
        .select("id, link")
        .eq("id", video.id);
    
      if (videoLinkError) {
        console.log(videoLinkError);
        res.status(500).json({ error: "Lỗi lấy link video" });
        return;
      }
    
      const rawUrl = videoLinks[0]?.link || "";
      videoLinkMap[video.id] = {
        originalLink: rawUrl,
      };
    
      if (!video.is_public) {
        const fileNameEncoded = rawUrl.substring(rawUrl.lastIndexOf("/") + 1);
        const fileName = decodeURIComponent(fileNameEncoded);
    
        const { data: signedUrlData, error: signedUrlError } = await supabase.storage
          .from("coursevideosprivate")
          .createSignedUrl(fileName, 3600);
    
        if (signedUrlError) {
          console.log(signedUrlError);
          res.status(500).json({ error: "Lỗi tạo signed URL cho video private" });
          return;
        }
    
        // Thêm signedUrl vào object
        videoLinkMap[video.id].signedUrl = signedUrlData?.signedUrl || "";
      }
    }
    // const videoLinkMap = Object.fromEntries(videoLinks.map(v => [v.id, v.link]));

    const formattedSections = sections.map((section) => ({
      id: section.id,
      title: section.name,
      order: section.order,
      videos: videos
        .filter((video) => video.section_id === section.id)
        .map((video) => ({
          id: video.id,
          title: video.title,
          link: videoLinkMap[video.id]?.originalLink || "",
          signedUrl: videoLinkMap[video.id]?.signedUrl || null,
          duration: video.duration,
          description: video.description,
          isPublic: video.is_public
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
      fee: course.fee,
      description: course.short_description,
      lastUpdated: course.created_at,
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

export const setCourseContent = async (req: Request, res: Response): Promise<void> => {
  const course: ICourse = req.body;
  try {
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // check whether current user is instructor of the course
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("instructor_id")
      .eq("id", course.course_id)
      .single()
    if (courseError) {
      throw {
        error: Error("Cannot get course"),
        code: 500
      }
    }
    if (!courseData) {
      throw {
        error: Error("Course does not exist"),
        code: 404
      }
    }
    const instructorId = courseData.instructor_id;
    if (instructorId !== req.user.id) {
      throw {
        error: Error("You are not the instructor of this course"),
        code: 403
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // validate data
    if (!course.course_id || !course.title || !course.short_description) {
      throw {
        error: Error("Missing required fields"),
        code: 400
      }
    }
    if (!course.sections || !Array.isArray(course.sections)) {
      throw {
        error: Error("Sections must be an array"),
        code: 400
      }
    }
    course.sections.forEach((section) => {
      if (!section.title || !section.videos || !Array.isArray(section.videos)) {
        throw {
          error: Error("Each section must have a title and an array of videos"),
          code: 400
        }
      }
      section.videos.forEach((video) => {
        if (!video.title || !video.duration) {
          throw {
            error: Error("Video title and duration are required"),
            code: 400
          }
        }
        if (!video.description || typeof video.description !== "string") {
          throw {
            error: Error("Video description must be a string"),
            code: 400
          }
        }
      })
    });
    if (!course.documents || !Array.isArray(course.documents)) {
      throw {
        error: Error("Documents must be an array"),
        code: 400
      }
    }
    course.documents.forEach((doc) => {
      if (!doc.title || typeof doc.title !== "string") {
        throw {
          error: Error("Document title is required"),
          code: 400
        }
      }
      if (!doc.description || typeof doc.description !== "string") {
        throw {
          error: Error("Document description is required"),
          code: 400
        }
      }
    });
    if (!course.quizzes || !Array.isArray(course.quizzes)) {
      throw {
        error: Error("Quizzes must be an array"),
        code: 400
      }
    }
    course.quizzes.forEach((quiz) => {
      if (!quiz.title || !quiz.questions || !Array.isArray(quiz.questions)) {
        throw {
          error: Error("Each quiz must have a title and an array of questions"),
          code: 400
        }
      }
      quiz.questions.forEach((question) => {
        if (!question.question || !question.choices || !Array.isArray(question.choices)) {
          throw {
            error: Error("Each question must have a question text and an array of choices"),
            code: 400
          }
        }
        if (typeof question.answer !== "number") {
          throw {
            error: Error("Question answer must be a number"),
            code: 400
          }
        }
      });
    });
    if (typeof course.fee !=='number' || course.fee < 0) {
      throw {
        error: Error("Fee must be a positive number"),
        code: 400
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // set course metadata
    const { error: courseUpdateError } = await supabase
      .from("courses")
      .update({
        name: course.title,
        short_description: course.short_description,
        fee: course.fee,
      })
      .eq("id", course.course_id);
    if (courseUpdateError) {
      console.log(courseUpdateError)
      throw {
        error: Error("Failed to update course metadata"),
        code: 500
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // delete old course descriptions list
    const { error: deleteCourseDescriptionListError } = await supabase
      .from("coursedescriptions")
      .delete()
      .eq("course_id", course.course_id);
    if (deleteCourseDescriptionListError) {
      throw {
        error: Error("Failed to delete old descriptions"),
        code: 500
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // set course descriptions list
    const { error: setCourseDescriptionListError } = await supabase
    .from("coursedescriptions")
    .insert(course.descriptions.map((des, index) => ({
      course_id: course.course_id,
      header: des.header,
      content: des.content,
      order: index
    })))
    if (setCourseDescriptionListError) {
      throw {
        error: Error("Failed to delete old descriptions"),
        code: 500
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // delete meterials by course_id: call function delete_materials_by_course_id
    const { error: deleteMaterialsError } = await supabase
      .rpc("delete_materials_by_courseid", { courseid: course.course_id })
    if (deleteMaterialsError) {
      console.log(deleteMaterialsError)
      throw {
        error: Error("Failed to delete old materials"),
        code: 500
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // set course quizzes
    for(const quiz of course.quizzes) {
      // set materials
      const { data: materialData, error: materialError } = await supabase
      .schema("private").from("coursematerials")
      .insert({
        type: "Quiz"
      })
      .select('id')
      .single()

      if (materialError || !materialData) {
        console.log(materialError)
        throw {
          error: Error("Failed to insert quiz materials"),
          code: 500
        }
      }

      // set quizzes
      const quiz_id = materialData.id;
      const { error: quizError } = await supabase
        .schema("private").from("coursequizzes")
        .insert({
          title: quiz.title,
          description: quiz.description,
          duration: quiz.duration,
          course_id: course.course_id,
          id: quiz_id,
        })
      if (quizError) {
        console.log(quizError)
        throw {
          error: Error("Failed to insert quiz"),
          code: 500
        }
      }

      // set quizdetails
      for (const question of quiz.questions) {
        const { error: questionError } = await supabase
          .schema("private").from("coursequizdetails")
          .insert({
            question: question.question,
            choices: question.choices,
            provided_key: question.answer,
            type: 'MultipleChoices',
            quiz_id: quiz_id,
          })
        if (questionError) {
          throw {
            error: Error("Failed to insert quiz question"),
            code: 500
          }
        }
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // delete old course sections (cascaded to `coursevideos` --> cascaded to `coursevideos_public` and `coursevideos_private`)
    const { error: deleteSectionsError } = await supabase
      .from("coursesections")
      .delete()
      .eq("course_id", course.course_id);
    if (deleteSectionsError) {
      throw {
        error: Error("Failed to delete old sections"),
        code: 500
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // set course sections
    for (let index = 0; index < course.sections.length; index++) {
      const section = course.sections[index];
      const { data: sectionData, error } = await supabase
        .from("coursesections")
        .insert({
          name: section.title,
          order: index,
          course_id: course.course_id,
        })
        .select('id')
        .single()

      if (error) {
        throw {
          error: Error("Failed to insert section"),
          code: 500
        }
      }
      const section_id = sectionData.id;
      
      // set section's videos
      for(const video of section.videos) {
        // insert material
        const { data: materialData, error: materialError } = await supabase
        .schema("private").from("coursematerials")
        .insert({
          type: "Video"
        })
        .select('id')
        .single()
        if (materialError || !materialData) {
          console.log(materialError)
          throw {
            error: Error("Failed to insert video materials"),
            code: 500
          }
        }
        const videoId = materialData.id;
        const { error: videoError } = await supabase
          .from("coursevideos")
          .insert({
            title: video.title,
            duration: video.duration ? video.duration : '',
            description: video.description,
            section_id,
            course_id: course.course_id,
            is_public: video.isPublic,
            id: videoId
          })

        if (videoError) {
          console.log(videoError)
          throw {
            error: Error("Failed to insert video"),
            code: 500
          }
        }
        if (video.isPublic) {
          const { error: publicError } = await supabase
          .from("coursevideos_public")
          .insert({
            id: videoId,
            link: video.link,
          });
          if (publicError) {
            throw {
              error: Error("Failed to insert public video"),
              code: 500
            }
          }
        } else {
          const { error: privateError } = await supabase
          .schema("private")
          .from("coursevideos_private")
          .insert({
            id: videoId,
            link: video.link,
          });
          if (privateError) {
            throw {
              error: Error("Failed to insert private video"),
              code: 500
            }
          }
        }
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    // set course documents
    for (const document of course.documents) {
      const { data: materialData, error: materialError } = await supabase
        .schema("private").from("coursematerials")
        .insert({
          type: "Document"
        })
        .select('id')
        .single()

      if (materialError || !materialData) {
        console.log(materialError)
        throw {
          error: Error("Failed to insert document materials"),
          code: 500
        }
      }

      const documentId = materialData.id;
      const {  error: documentError } = await supabase
        .schema("private").from("coursedocuments")
        .insert({
          title: document.title,
          description: document.description,
          link: document.link,
          course_id: course.course_id,
          id: documentId
        })
      if (documentError) {
        console.log(documentError)
        throw {
          error: Error("Failed to insert document"),
          code: 500
        }
      }
    }
    ////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////
    res.status(200).json({ message: "Course content updated successfully" });
    return;
  } catch (err) {
    const { error, code} = err as {error: Error, code: number}
    console.log("set course content", error)
    res.status(code).json({ error: error.message })
    return;
  }
}