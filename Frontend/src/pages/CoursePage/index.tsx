import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
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
  const navigate = useNavigate()
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
    console.log(videoSections)
  }, [videoSections])

  async function fetchData () {
    //////////////////////////////////////////
    //////////////////////////////////////////
    // get course metadata and validity
    const { data: dataGetCourse, error: errorGetCourse } = await supabase.from("courses").select(`id, name, short_description, image_link, fee, instructor_id, users (first_name, last_name)`).eq("id", course_id as unknown as number).eq("status", "Published").single();

    if (errorGetCourse || !dataGetCourse) {
      alert('Cannot find course')
      navigate('/')
      return;
    }

    setLoading(false);
    
    setTitle(dataGetCourse.name);
    if (dataGetCourse.image_link) setImageLink(dataGetCourse.image_link);
    else setImageLink('https://placehold.co/300x200?text=Thumbnail')
    setShortDescription(
      dataGetCourse.short_description ? dataGetCourse.short_description : ""
    );
    setLinkToInstructorPage(`/instructor/${dataGetCourse.instructor_id}`);
    setInstructorName(
      `${
        dataGetCourse.users.first_name ? dataGetCourse.users.first_name : ""
      } ${dataGetCourse.users.last_name ? dataGetCourse.users.last_name : ""}`
    );
    setFee(dataGetCourse.fee);
    //////////////////////////////////////////
    //////////////////////////////////////////
    // get descriptions list
    const {data: descriptionList} = await supabase
    .from("coursedescriptions")
    .select(
      `
              header, content
          `
    )
    .eq("course_id", course_id as unknown as number)
    .order("order", { ascending: true })
    if (descriptionList) setDescriptions(descriptionList);
    //////////////////////////////////////////
    //////////////////////////////////////////
    // get number of enrolments
    const {count: nEnrolments} = await supabase
    .from("learnerenrolments")
    .select("course_id", { count: "exact", head: true })
    .eq("course_id", course_id as unknown as number)
    setNumberOfEnrolments(nEnrolments as number);
    //////////////////////////////////////////
    //////////////////////////////////////////
    // get sections and vids
    const { data: sections } = await supabase
      .rpc("get_sections_with_videos_by_course", {
        courseid: course_id as unknown as number,
      })

    if (sections) {
      console.log(sections)
      setVideoSections(sections.map((videoSection: VideoSection) => ({
        sectionName: videoSection.sectionName,
        videos: !videoSection.videos ? [] : videoSection.videos.map((video) => ({
          ...video,
          link: !video.link ? 'www.google.com' : supabase.storage.from('coursevideospublic').getPublicUrl(video.link).data.publicUrl
        }))
      })))
    }
  }

  useEffect(() => {
    fetchData()
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
    </>
  );
}
