import { ReactElement, useRef } from "react";
import DOMPurify from 'dompurify'
import { CourseVideoSectionProps, CourseDetailsProps, VideoSection } from "./types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faPlay } from "@fortawesome/free-solid-svg-icons";

function HTMLInjector(props: {content: string}) {
    return (
        <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(props.content)}} />
    )
}

function CourseVideoSection(props: CourseVideoSectionProps) {
    const iconColor: string = "#002333"; // deepteal
    const linkColor: string = "#155775";
    return (
        <div className="w-full flex flex-col gap-y-4">
            <h3 className={`bg-[#ededed] py-2 px-4 flex gap-x-2 ${props.index === 0 ? 'rounded-t-xl' : ''}`}><span>{props.index + 1}.</span>{props.sectionName}</h3>
            <table className="w-full flex flex-col gap-y-4 px-4 pb-2 rounded-2xl">
                <tbody>
                    {props.videos?.map((video, index) => {
                        const anchorRef = useRef<HTMLAnchorElement>(null)
                        return (
                        <tr key={index} className={`w-full min-w-full flex flex-row gap-x-4 border-b-1 border-b-zinc-300 py-2 ${video.visibility? "cursor-pointer" : ""}`}
                            onClick={
                                video.visibility?
                                    () => {
                                        anchorRef.current?.click();
                                    }:
                                    () => null
                            }
                        >
                            <td className="w-6 h-full">
                                {
                                    video.visibility?
                                        <FontAwesomeIcon icon={faPlay} className={`text-[${iconColor}] w-full aspect-square`}/> :
                                        <FontAwesomeIcon icon={faLock} className={`text-[${iconColor}]`}/>
                                }
                            </td>
                            <td className="w-full">
                                {
                                    video.visibility?
                                        <a ref={anchorRef} className={`text-[${linkColor}]! underline!`} href={video.link} target="_blank">{video.name}</a>:
                                        <span className="text-black">{video.name}</span>
                                }
                            </td>
                            <td className="w-fit text-black">{video.duration}</td>
                        </tr>

                    )})}
                </tbody>
            </table>
        </div>
    )
}

export default function CourseDetails(props: CourseDetailsProps): ReactElement {
    // console.log(props)
    return (
        <div className="w-full h-full flex flex-col">
            {/* header */}
            <div className="bg-deepteal w-full h-full flex flex-col gap-y-8 pt-2 pb-8 px-0
                lg:py-12">
                <div className="flex flex-col gap-y-8 text-white w-full h-full px-0
                    lg:px-40 lg:flex-row lg:gap-x-8">
                    <div className="w-full h-full
                        lg:max-w-[350px] lg:flex-none">
                        <img className="w-full h-full" src={props.courseImageLink} title={props.courseName} alt={`${props.courseName}`} />
                    </div>
                    <div className="w-full h-full flex flex-col gap-y-4 px-6 lg:px-0">
                        <p className="font-bold text-4xl">{props.courseName}</p>
                        {
                            props.shortDescription?
                            <p className="font-medium text-xl">{String(props.shortDescription)}</p>
                            :
                            <></>
                        }
                        <div className="w-full h-full px-0 flex flex-col gap-y-1">
                            <div className="w-full flex flex-row gap-x-2">
                                {
                                    typeof props.numberOfEnrollments === 'number' && !isNaN(props.numberOfEnrollments)?
                                        <>
                                            <div className="w-6 h-6">
                                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="#ffffff" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
                                            </div>
                                            <div>
                                                <span>{props.numberOfEnrollments} student{props.numberOfEnrollments >= 2? "s" : ""}</span>
                                            </div>
                                        </> : <>{props.numberOfEnrollments}</>
                                }

                            </div>
                            <div>
                                Created by <a href={props.linkToInstructorPage}><span className="text-white underline hover:text-zinc-400!">{props.instructorName}</span></a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full px-4 lg:px-40">
                    <a type="button" className="bg-light-green hover:bg-vibrant-green! w-28 px-8 py-4 rounded-lg cursor-pointer"
                        href={props.isFree? "#" : "#"} target="_blank"
                    >
                        <span className="text-deepteal text-xl font-semibold">Enroll</span>
                    </a>
                </div>
            </div>


            {/* body */}
            <div className="text-black py-8 px-4 flex flex-col gap-y-8 text-justify
                lg:px-40">

                {/* related topics */}
                {
                    props.relatedTopics?
                        <div className="flex flex-col gap-y-4">
                            <h2>Related topics</h2>
                            <div className="flex flex-row gap-x-6">
                                {
                                    props.relatedTopics.map((topic) => (
                                        <a className="py-2 px-4 text-lg text-black! font-medium cursor-pointer border-1 border-zinc-500 rounded-lg hover:border-zinc-500! hover:bg-zinc-200"
                                            href={topic.link} target="_blank"
                                        >
                                            {topic.name}
                                        </a>
                                    ))
                                }
                            </div>
                        </div>
                        : <></>
                }

                {/* videos */}
                {
                    props.content?
                        <div className="flex flex-col gap-y-4">
                            <h2>Course content</h2>
                            {/* VideoSections container */}
                            <div className="flex flex-col border-collapse border border-deepteal rounded-xl">
                                    {props.content.map((section: VideoSection, index: number) => (
                                        <CourseVideoSection
                                            sectionName={section.sectionName}
                                            videos={section.videos}
                                            index={index}
                                        />
                                    ))}
                            </div>
                        </div>:
                        <></>
                }

                {/* course description created by Instructor */}
                {
                    props.courseDescriptionSections?
                        props.courseDescriptionSections.map((section) => (
                            <div className="w-full flex flex-col gap-y-4">
                                <h2>{section.header}</h2>
                                <p>
                                    {<HTMLInjector content={section.content}/>}
                                </p>
                            </div>
                        ))
                        : <></>
                }
                
            </div>
        </div>
    )
}
