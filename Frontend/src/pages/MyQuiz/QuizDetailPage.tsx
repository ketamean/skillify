import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

export default function QuizDetailPage() {
  const { quiz_id } = useParams();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/quizzes/${quiz_id}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch quiz stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [quiz_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-custom-white">
        <NavBar />
        <main className="container mx-auto px-[4%] pt-10 pb-20">
          <p>Loading quiz statistics...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-white">
      <NavBar />

      <main className="container mx-auto px-[4%] pt-10 pb-20">
        <h1 className="text-3xl font-bold text-deepteal mb-6">
          📈 Quiz Statistics
        </h1>

        <p className="mb-2 text-gray-700">
          🧑‍🎓 Total Attempts: {stats.totalAttempts}
        </p>
        <p className="mb-6 text-gray-700">
          📊 Average Score: {stats.averageScore}
        </p>

        <h2 className="text-2xl font-semibold text-deepteal mt-8 mb-4">
          📋 Question Stats
        </h2>
        {stats.questionStats.map((q: any, idx: number) => (
          <div key={idx} className="mb-6 border-b pb-4">
            <p className="font-medium text-gray-800 mb-1">
              {idx + 1}. {q.question}
            </p>
            <p className="text-green-600 mb-2">
              ✅ Correct Rate: {q.correctRate}
            </p>

            <div className="ml-4">
              {q.optionStats.map((opt: any, i: number) => (
                <div
                  key={i}
                  className={`flex justify-between text-sm mb-1 ${
                    opt.isCorrect
                      ? "text-green-700 font-semibold bg-green-100 px-2 py-1 rounded"
                      : "text-gray-700"
                  }`}
                >
                  <span>
                    <strong>{opt.option}.</strong> {opt.text}
                    {opt.isCorrect && <span className="ml-1">✔️</span>}
                  </span>
                  <span>{opt.selectedRate}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>

      <Footer />
    </div>
  );
}
