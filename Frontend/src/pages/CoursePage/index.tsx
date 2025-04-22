import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import CourseDetails from "../../components/CourseDetails";
import { CourseDetailsProps, RelatedTopic, CourseDescriptionSection, VideoSection } from "../../components/CourseDetails/types";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { useParams } from "react-router-dom";

interface CoursePageProps {
    
}

export default function CoursePage(props: CoursePageProps) {
    const {course_id} = useParams()
    const [courseData, setCourseData] = useState<CourseDetailsProps | null>(null);
    useEffect(() => {
        supabase
            .from('courses')
            .select(`
                name,
                short_description,
                image_link,
                users(
                    id,
                    first_name,
                    last_name
                )
            `)
            .eq('id', course_id as unknown as number)
            .then(
                (res) => {
                    if (res.error) {
                        console.log("1", res.error)
                        return;
                    }
                    console.log(res.data)
                    setCourseData((prev) => {
                        if (!res.data || res.data.length === 0) return prev;
                        const r: CourseDetailsProps = {
                            courseName: res.data[0].name,
                            courseImageLink: res.data[0].image_link,
                            shortDescription: res.data[0].short_description? res.data[0].short_description : "",
                            linkToInstructorPage: "/",// res.data[0].users.id ? `/user?id=${res.data[0].users.id}` : '#',
                            instructorName: `${res.data[0].users.first_name? res.data[0].users.first_name : ""} ${res.data[0].users.last_name? res.data[0].users.last_name : ""}`
                        }
                        return prev?
                            {
                                ...prev,
                                ...r
                            } : { ...r }
                    })
                }
            )

        supabase
            .from('courserelatedtopics')
            .select(`
                    topics(id, name)
                `)
            .eq('course_id', course_id as unknown as number)
            .then(
                (res) => {
                    if (res.error) {
                        console.log("2", res.error)
                        return;
                    }
                    setCourseData((prev) => {
                        if (!res.data || res.data.length === 0) return prev;
                        const r: CourseDetailsProps = {
                            relatedTopics: res.data.filter(el => el.topics.name).map((pair): RelatedTopic => ({
                                name: pair.topics.name,
                                link: pair.topics.id ? `/topics?id=${pair.topics.id}` : '#'
                            }))
                        }
                        return prev?
                            {
                                ...prev,
                                ...r
                            } : { ...r }
                    })
                }
            )

        supabase
            .from('coursedescriptions')
            .select(`
                header, content, order
            `)
            .eq('course_id', course_id as unknown as number)
            .order('order', {ascending: true})
            .then(
                (res) => {
                    if (res.error) {
                        console.error("3", res.error)
                        return;
                    }
                    console.log(res) 
                    setCourseData((prev) => {
                        if (!res.data || res.data.length === 0) return prev;
                        const r: CourseDetailsProps = {
                            courseDescriptionSections: res.data.map((pair): CourseDescriptionSection => ({...pair}))
                        }
                        return prev?
                            {
                                ...prev,
                                ...r
                            } : { ...r }
                    })
                }
            )

        supabase
            .from('learnerenrolments')
            .select('course_id', { count: 'exact', head: true })
            .eq('course_id', course_id as unknown as number)
            .then(
                (res) => {
                    if (res.error) {
                        console.log(res.error)
                        return;
                    }
                    setCourseData((prev) => {
                        if (!res || !res.count) return prev;
                        const r: CourseDetailsProps = {
                            numberOfEnrollments: res.count as number
                        }
                        return prev?
                            {
                                ...prev,
                                ...r
                            } : { ...r }
                    })
                }
            )
        
        supabase
            .rpc('get_sections_with_videos_by_course', { courseid: course_id as unknown as number })
            .then(
                (res) => {
                    if (res.error) {
                        console.log(res.error)
                        return;
                    }
                    setCourseData((prev) => {
                        if (!res.data || res.data.length === 0) return prev;
                        const r: CourseDetailsProps = {
                            content: res.data.map((section: VideoSection): VideoSection => {
                                return {
                                    sectionName: section.sectionName,
                                    videos: section.videos
                                }
                            })
                        }
                        return prev?
                            {
                                ...prev,
                                ...r
                            } : { ...r }
                    })
                }
            )
    }, [])
    return (
        <>
            <NavBar
                user={{
                fname: "Ariana", lname: "Grande",
                // avatarUrl: "https://static.vecteezy.com/system/resources/thumbnails/041/880/991/small_2x/ai-generated-pic-artistic-depiction-of-sunflowers-under-a-vast-cloudy-sky-photo.jpg"
                }}
            />
            <div className="h-full w-full">
                {
                    courseData?
                        <CourseDetails {...courseData}/> : <></>
                }
            </div>
            <Footer />
        </>
    )
}