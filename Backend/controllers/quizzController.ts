import { Request, Response } from "express";
import supabase from "../config/database/supabase";

export const getQuizStats = async (req: Request, res: Response): Promise<void> => {
  const { quiz_id } = req.params;

  const { data: questions, error: questionError } = await supabase
    .schema("private")
    .from("coursequizdetails")
    .select("id, question, choices")
    .eq("quiz_id", quiz_id);

  const { data: attempts, error: attemptError } = await supabase
    .schema("private")
    .from("quiz_attempts")
    .select("id, score")
    .eq("quiz_id", quiz_id);

  if (questionError || attemptError || !questions || !attempts) {
    res.status(500).json({ error: "Failed to fetch quiz data" });
    return;
  }

  const attemptIds = attempts.map(a => a.id);

  const { data: answers, error: answerError } = await supabase
    .schema("private")
    .from("quiz_answers")
    .select("question_id, provided_key, is_correct")
    .in("attempt_id", attemptIds);

  if (answerError || !answers) {
    res.status(500).json({ error: "Failed to fetch quiz answers" });
    return;
  }

  const totalAttempts = attempts.length;
  const totalScore = attempts.reduce((sum, a) => sum + a.score, 0);
  const averageScore = totalAttempts ? (totalScore / totalAttempts).toFixed(2) : "0";

  const questionStats = questions.map((q: any) => {
    const relevantAnswers = answers.filter(a => a.question_id === q.id);
    const total = relevantAnswers.length;

    const correctCount = relevantAnswers.filter(a => a.is_correct).length;

    const optionCounts: Record<number, number> = {};
    relevantAnswers.forEach(a => {
      optionCounts[a.provided_key] = (optionCounts[a.provided_key] || 0) + 1;
    });

    const optionStats = (q.choices || []).map((text: string, idx: number) => {
      const count = optionCounts[idx] || 0;
      const percent = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
      return {
        option: String.fromCharCode(65 + idx), // A, B, C...
        text,
        selectedRate: `${percent}%`,
      };
    });

    return {
      question: q.question,
      correctRate: total > 0 ? ((correctCount / total) * 100).toFixed(1) + "%" : "0%",
      optionStats,
    };
  });

  res.status(200).json({
    totalAttempts,
    averageScore,
    questionStats,
  });
};

export const addQuizzAttemp = async (req: Request, res: Response): Promise<void> => {
  const { quiz_id } = req.params;
  const {
    user_id,
    started_at,
    submitted_at,
    score,
    answers,
  } = req.body;

  try {
    const { data: attemptData, error: attemptError } = await supabase
      .schema("private")
      .from("quiz_attempts")
      .insert([
        {
          quiz_id: quiz_id,
          user_id,
          started_at,
          submitted_at,
          score,
        },
      ])
      .select()
      .single(); 

    if (attemptError || !attemptData) {
      console.error("Lỗi khi tạo quiz_attempt:", attemptError);
      res.status(500).json({ error: "Failed to insert quiz attempt" });
      return;
    }

    const attempt_id = attemptData.id;

    const formattedAnswers = answers.map((a: any) => ({
      attempt_id,
      question_id: a.question_id,
      provided_key: a.provided_key,
      answer_text: a.answer_text,
      is_correct: a.is_correct,
    }));

    const { error: answersError } = await supabase
      .schema("private")
      .from("quiz_answers")
      .insert(formattedAnswers);

    if (answersError) {
      console.error("Lỗi khi lưu câu trả lời:", answersError);
      res.status(500).json({ error: "Failed to insert quiz answers" });
      return;
    }

    res.status(200).json({ message: "Quiz attempt and answers saved successfully." });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Server error" });
  }
};