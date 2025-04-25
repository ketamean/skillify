import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import CourseDetails from "../../components/CourseDetails";

export interface Video {
  name: string;
  duration: string;
  visibility: boolean;
  link?: string;
  coverImageLink?: string;
}

// parse md to html on server side
// fe: only sanitize

export interface VideoSection {
  sectionName: string;
  videos: Video[];
}

export default function CoursePage() {
  const [loading, setLoading] = useState(true);
  const { course_id } = useParams();

  const [title, setTitle] = useState("");
  const [imageLink, setImageLink] = useState(
    "https://www.vecteezy.com/free-vector/image-placeholder"
  );
  const [shortDescription, setShortDescription] = useState("");
  const [linkToInstructorPage, setLinkToInstructorPage] = useState("/");
  const [instructorName, setInstructorName] = useState("");
  const [relatedTopics, setRelatedTopics] = useState<
    { name: string; link: string }[]
  >([]);
  const [descriptions, setDescriptions] = useState<
    { header: string; content: string }[]
  >([]);
  const [numberOfEnrolments, setNumberOfEnrolments] = useState(0);
  const [videoSections, setVideoSections] = useState<VideoSection[]>([]);
  const [fee, setFee] = useState<number>(0);

  useEffect(() => {
    supabase
      .from("courses")
      .select(
        `
                id,
                name,
                short_description,
                image_link,
                fee,
                instructor_id,
                users (
                    first_name,
                    last_name
                )
            `
      )
      .eq("id", course_id as unknown as number)
      .eq('status', 'Published')
      .then((res) => {
        if (res.error) {
          console.log("1", res.error);
          return;
        }
        if (!res.data || res.data.length === 0) return;
        setLoading(false);
        const data = res.data;
        setTitle(data[0].name);
        setImageLink(data[0].image_link);
        setShortDescription(
          res.data[0].short_description ? res.data[0].short_description : ""
        );
        setLinkToInstructorPage(`/instructor/${res.data[0].instructor_id}`);
        setInstructorName(
          `${
            res.data[0].users.first_name ? res.data[0].users.first_name : ""
          } ${res.data[0].users.last_name ? res.data[0].users.last_name : ""}`
        );
        setFee(res.data[0].fee);
      });

    supabase
      .from("courserelatedtopics")
      .select(
        `
                    topics(id, name)
                `
      )
      .eq("course_id", course_id as unknown as number)
      .then((res) => {
        if (res.error) {
          console.log("2", res.error);
          return;
        }
        if (!res.data || res.data.length === 0) return;
        setLoading(false);

        setRelatedTopics(
          res.data
            .filter((el) => el.topics.name)
            .map((pair) => ({
              name: pair.topics.name,
              link: pair.topics.id ? `/topics?id=${pair.topics.id}` : "#",
            }))
        );
      });

    supabase
      .from("coursedescriptions")
      .select(
        `
                header, content
            `
      )
      .eq("course_id", course_id as unknown as number)
      .order("order", { ascending: true })
      .then((res) => {
        if (res.error) {
          console.error("3", res.error);
          return;
        }
        if (!res.data || res.data.length === 0) return;
        setLoading(false);
        setDescriptions(res.data);
      });

    supabase
      .from("learnerenrolments")
      .select("course_id", { count: "exact", head: true })
      .eq("course_id", course_id as unknown as number)
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        setLoading(false);
        setNumberOfEnrolments(res.count as number);
      });

    supabase
      .rpc("get_sections_with_videos_by_course", {
        courseid: course_id as unknown as number,
      })
      .then((res) => {
        if (res.error) {
          console.log(res.error);
          return;
        }
        if (!res.data || res.data.length === 0) return;
        setLoading(false);
        setVideoSections(res.data);
      });
  }, [course_id]);
  return (
    <>
      <NavBar />
      <div className="h-full w-full">
        {loading ? (
          <p className="text-center mt-10">Loading course...</p>
        ) : (
          <CourseDetails
            id={course_id as unknown as string}
            courseName={title}
            shortDescription={shortDescription}
            courseImageLink={imageLink}
            numberOfEnrollments={numberOfEnrolments}
            instructorName={instructorName}
            linkToInstructorPage={linkToInstructorPage}
            courseDescriptionSections={descriptions}
            relatedTopics={relatedTopics}
            content={videoSections}
            fee={fee}
          />
        )}
      </div>
      <Footer />
    </>
  );
}
